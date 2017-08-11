/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */

import assert from "./assert";
import {
    assign,
    freeze,
    create,
    ArrayIndexOf,
    toString,
    ArrayPush,
    defineProperty,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getPrototypeOf,
    isString,
    isFunction,
    isObject,
    ArraySlice,
} from "./language";
import { GlobalHTMLProperties } from "./dom";
import { createWiredPropertyDescriptor } from "./decorators/wire";
import { createTrackedPropertyDescriptor } from "./decorators/track";
import { createPublicPropertyDescriptor, createPublicAccessorDescriptor, prepareForPropUpdate } from "./decorators/api";
import { Element } from "./html-element";
import { EmptyObject, getAttrNameFromPropName, getPropNameFromAttrName } from "./utils";
import { getReactiveProxy, isObservable } from "./reactive";

/*eslint-disable*/
import {
    ComponentClass
 } from './component';
 /*eslint-enable*/

export const ViewModelReflection = Symbol('internal');

let observableHTMLAttrs: HashTable<boolean>;

assert.block(function devModeCheck () {
    observableHTMLAttrs = getOwnPropertyNames(GlobalHTMLProperties).reduce((acc, key) => {
        const globalProperty = GlobalHTMLProperties[key];
        if (globalProperty && globalProperty.attribute) {
            acc[globalProperty.attribute] = true;
        }
        return acc;
    }, create(null));
});

const CtorToDefMap: WeakMap<any, ComponentDef> = new WeakMap();

const COMPUTED_GETTER_MASK = 1;
const COMPUTED_SETTER_MASK = 2;

function isElementComponent(Ctor: any, protoSet?: Array<any>): boolean {
    protoSet = protoSet || [];
    if (!Ctor || ArrayIndexOf.call(protoSet, Ctor) >= 0) {
        return false; // null, undefined, or circular prototype definition
    }
    const proto = getPrototypeOf(Ctor);
    if (proto === Element) {
        return true;
    }
    getComponentDef(proto); // ensuring that the prototype chain is already expanded
    ArrayPush.call(protoSet, Ctor);
    return isElementComponent(proto, protoSet);
}

function createComponentDef(Ctor: ComponentClass): ComponentDef {
    assert.isTrue(isElementComponent(Ctor), `${Ctor} is not a valid component, or does not extends Element from "engine". You probably forgot to add the extend clause on the class declaration.`);
    const name: string = Ctor.name;
    assert.isTrue(name && isString(name), `${toString(Ctor)} should have a "name" property with string value, but found ${name}.`);
    assert.isTrue(Ctor.constructor, `Missing ${name}.constructor, ${name} should have a "constructor" property.`);
    let props = getPublicPropertiesHash(Ctor);
    let methods = getPublicMethodsHash(Ctor);
    let observedAttrs = getObservedAttributesHash(Ctor);
    let wire = getWireHash(Ctor);
    let track = getTrackHash(Ctor);

    const proto = Ctor.prototype;
    for (let propName in props) {
        const propDef = props[propName];
        // initializing getters and setters for each public prop on the target prototype
        const descriptor = getOwnPropertyDescriptor(proto, propName);
        assert.invariant(!descriptor || (isFunction(descriptor.get) || isFunction(descriptor.set)), `Invalid ${name}.prototype.${propName} definition, it cannot be a prototype definition if it is a public property. Instead use the constructor to define it.`);
        const { config } = propDef;
        if (COMPUTED_SETTER_MASK & config || COMPUTED_GETTER_MASK & config) {
            assert.block(function devModeCheck() {
                const mustHaveGetter = COMPUTED_GETTER_MASK & config;
                const mustHaveSetter = COMPUTED_SETTER_MASK & config;
                if (mustHaveGetter) {
                    assert.isTrue(isObject(descriptor) && isFunction(descriptor.get), `Missing getter for property ${propName} decorated with @api in ${name}`);
                }
                if (mustHaveSetter) {
                    assert.isTrue(isObject(descriptor) && isFunction(descriptor.set), `Missing setter for property ${propName} decorated with @api in ${name}`);
                    assert.isTrue(mustHaveGetter, `Missing getter for property ${propName} decorated with @api in ${name}. You cannot have a setter without the corresponding getter.`);
                }
            });
            createPublicAccessorDescriptor(proto, propName, descriptor);
        } else {
            createPublicPropertyDescriptor(proto, propName, descriptor);
        }
    }
    if (wire) {
        for (let propName in wire) {
            if (wire[propName].method) {
                // for decorated methods we need to do nothing
                continue;
            }
            const descriptor = getOwnPropertyDescriptor(proto, propName);
            // TODO: maybe these conditions should be always applied.
            assert.block(function devModeCheck() {
                const { get, set, configurable, writable } = descriptor || EmptyObject;
                assert.isTrue(!get && !set, `Compiler Error: A decorator can only be applied to a public field.`);
                assert.isTrue(configurable !== false, `Compiler Error: A decorator can only be applied to a configurable property.`);
                assert.isTrue(writable !== false, `Compiler Error: A decorator can only be applied to a writable property.`);
            });
            // initializing getters and setters for each public prop on the target prototype
            createWiredPropertyDescriptor(proto, propName, descriptor);
        }
    }
    if (track) {
        for (let propName in track) {
            const descriptor = getOwnPropertyDescriptor(proto, propName);
            // TODO: maybe these conditions should be always applied.
            assert.block(function devModeCheck() {
                const { get, set, configurable, writable } = descriptor || EmptyObject;
                assert.isTrue(!get && !set, `Compiler Error: A decorator can only be applied to a public field.`);
                assert.isTrue(configurable !== false, `Compiler Error: A decorator can only be applied to a configurable property.`);
                assert.isTrue(writable !== false, `Compiler Error: A decorator can only be applied to a writable property.`);
            });
            // initializing getters and setters for each public prop on the target prototype
            createTrackedPropertyDescriptor(proto, propName, descriptor);
        }
    }

    const superProto = getPrototypeOf(Ctor);
    if (superProto !== Element) {
        const superDef = getComponentDef(superProto);
        props = assign(create(null), superDef.props, props);
        methods = assign(create(null), superDef.methods, methods);
        wire = (superDef.wire || wire) ? assign(create(null), superDef.wire, wire) : undefined;
    }

    const descriptors = createDescriptorMap(props, methods);

    const def: ComponentDef = {
        name,
        wire,
        track,
        props,
        methods,
        observedAttrs,
        descriptors,
    };

    assert.block(function devModeCheck() {
        getOwnPropertyNames(observedAttrs).forEach((observedAttributeName) => {
            const camelName = getPropNameFromAttrName(observedAttributeName);
            const propDef = props[camelName];

            if (propDef) { // User defined prop
                const { config } = propDef;
                if (COMPUTED_SETTER_MASK & config) { // Ensure user has not defined setter
                    assert.fail(`Invalid entry "${observedAttributeName}" in component ${name} observedAttributes. Use existing "${camelName}" setter to track changes.`);
                } else if (observedAttributeName !== getAttrNameFromPropName(camelName)) { // Ensure observed attribute is kebab case
                    assert.fail(`Invalid entry "${observedAttributeName}" in component ${name} observedAttributes. Did you mean "${getAttrNameFromPropName(camelName)}"?`);
                }
            } else if (!observableHTMLAttrs[camelName]) { // Check if observed attribute is observable HTML Attribute
                if (GlobalHTMLProperties[camelName] && GlobalHTMLProperties[camelName].attribute) { // Check for misspellings
                    assert.fail(`Invalid entry "${observedAttributeName}" in component ${name} observedAttributes. "${observedAttributeName}" is not a valid global HTML Attribute. Did you mean "${GlobalHTMLProperties[camelName].attribute}"? See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes`);
                } else { // Attribute is not valid observable HTML Attribute
                    assert.fail(`Invalid entry "${observedAttributeName}" in component ${name} observedAttributes. "${observedAttributeName}" is not a valid global HTML Attribute. See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes`);
                }
            }
        });

        freeze(Ctor.prototype);
        freeze(wire);
        freeze(props);
        freeze(methods);
        freeze(observedAttrs);
        for (let key in def) {
            defineProperty(def, key, {
                configurable: false,
                writable: false,
            });
        }
    });
    return def;
}

function createGetter(key: string) {
    return function (): any {
        const vm = this[ViewModelReflection];
        return vm.component[key];
    }
}

function createSetter(key: string) {
    return function (newValue: any): any {
        const vm = this[ViewModelReflection];
        // logic for setting new properties of the element directly from the DOM
        // will only be allowed for root elements created via createElement()
        if (!vm.vnode.isRoot) {
            assert.logError(`Invalid attempt to set property ${key} from ${vm} to ${newValue}. This property was decorated with @api, and can only be changed via the template.`);
            return;
        }
        const observable = isObservable(newValue);
        newValue = observable ? getReactiveProxy(newValue) : newValue;
        assert.block(function devModeCheck () {
            if (!observable && isObject(newValue)) {
                assert.logWarning(`Assigning a non-reactive value ${newValue} to member property ${key} of ${vm} is not common because mutations on that value cannot be observed.`);
            }
        });
        prepareForPropUpdate(vm);
        vm.component[key] = newValue;
    }
}

function createMethodCaller(key: string) {
    return function (): any {
        const vm = this[ViewModelReflection];
        return vm.component[key].apply(vm.component, ArraySlice.call(arguments));
    }
}

function createDescriptorMap(publicProps: HashTable<PropDef>, publicMethodsConfig: HashTable<number>): PropertyDescriptorMap {
    const descriptors: PropertyDescriptorMap = {};
    // expose getters and setters for each public props on the Element
    for (let key in publicProps) {
        descriptors[key] = {
            get: createGetter(key),
            set: createSetter(key),
        };
    }
    // expose public methods as props on the Element
    for (let key in publicMethodsConfig) {
        descriptors[key] = {
            value: createMethodCaller(key),
        };
    }
    return descriptors;
}

function getTrackHash(target: ComponentClass): HashTable<WireDef> | undefined {
    const track = target.track;
    if (!track || !getOwnPropertyNames(track).length) {
        return;
    }
    assert.block(function devModeCheck() {
        // TODO: check that anything in `track` is correctly defined in the prototype
    });
    return assign(create(null), track);
}

function getWireHash(target: ComponentClass): HashTable<WireDef> | undefined {
    const wire = target.wire;
    if (!wire || !getOwnPropertyNames(wire).length) {
        return;
    }

    assert.block(function devModeCheck() {
        // TODO: check that anything in `wire` is correctly defined in the prototype
    });
    return assign(create(null), wire);
}

function getPublicPropertiesHash(target: ComponentClass): HashTable<PropDef> {
    const props = target.publicProps;
    if (!props || !getOwnPropertyNames(props).length) {
        return EmptyObject;
    }
    return getOwnPropertyNames(props).reduce((propsHash: HashTable<PropDef>, propName: string): HashTable<PropDef> => {
        assert.block(function devModeCheck() {
            if (GlobalHTMLProperties[propName] && GlobalHTMLProperties[propName].attribute) {
                const { error, attribute, experimental } = GlobalHTMLProperties[propName];
                const msg = [];
                if (error) {
                    msg.push(error);
                } else if (experimental) {
                    msg.push(`"${propName}" is an experimental property that is not standardized or supported by all browsers. Property "${propName}" and attribute "${attribute}" are ignored.`);
                } else {
                    msg.push(`"${propName}" is a global HTML property. Instead access it via the reflective attribute "${attribute}" with one of these techniques:`);
                    msg.push(`  * Use \`this.getAttribute("${attribute}")\` to access the attribute value. This option is best suited for accessing the value in a getter during the rendering process.`);
                    msg.push(`  * Declare \`static observedAttributes = ["${attribute}"]\` and use \`attributeChangedCallback(attrName, oldValue, newValue)\` to get a notification each time the attribute changes. This option is best suited for reactive programming, eg. fetching new data each time the attribute is updated.`);
                }
                console.error(msg.join('\n'));
            }
        });

        propsHash[propName] = assign({ config: 0 }, props[propName]);
        return propsHash;
    }, create(null));
}

function getPublicMethodsHash(target: ComponentClass): HashTable<number> {
    const publicMethods = target.publicMethods;
    if (!publicMethods || !publicMethods.length) {
        return EmptyObject;
    }
    return publicMethods.reduce((methodsHash: HashTable<number>, methodName: string): HashTable<number> => {
        methodsHash[methodName] = 1;
        assert.block(function devModeCheck() {
            assert.isTrue(isFunction(target.prototype[methodName]), `Component "${target.name}" should have a method \`${methodName}\` instead of ${target.prototype[methodName]}.`);
            freeze(target.prototype[methodName]);
        });
        return methodsHash;
    }, create(null));
}

function getObservedAttributesHash(target: ComponentClass): HashTable<number> {
    const observedAttributes = target.observedAttributes;
    if (!observedAttributes || !observedAttributes.length) {
        return EmptyObject;
    }
    return observedAttributes.reduce((observedAttributes: HashTable<number>, attrName: string): HashTable<number> => {
        observedAttributes[attrName] = 1;
        return observedAttributes;
    }, create(null));
}

export function getComponentDef(Ctor: ComponentClass): ComponentDef {
    let def = CtorToDefMap.get(Ctor);
    if (def) {
        return def;
    }
    def = createComponentDef(Ctor);
    CtorToDefMap.set(Ctor, def);
    return def;
}
