import assert from "../assert";
import { isArray, isUndefined, isObject, create, getOwnPropertyDescriptor, defineProperty } from "../language";
import { getReactiveProxy, isObservable } from "../reactive";
import { isRendering, vmBeingRendered } from "../invoker";
import { subscribeToSetHook, notifyListeners } from "../watcher";
import { ViewModelReflection } from "../def";
import { isBeingConstructed } from "../component";

// TODO: how to allow symbols as property keys?
export function createTrackedPropertyDescriptor(proto: object, key: string, descriptor: PropertyDescriptor) {
    let value: HashTable<any>;
    defineProperty(proto, key, {
        get(): HashTable<any> {
            const vm: VM = this[ViewModelReflection];
            assert.vm(vm);
            if (isRendering) {
                // this is needed because the proxy used by template is not sufficient
                // for public props accessed from within a getter in the component.
                subscribeToSetHook(vmBeingRendered, this, key);
            }
            return value;
        },
        set(newValue: any) {
            const vm = this[ViewModelReflection];
            assert.vm(vm);
            assert.invariant(!isRendering, `${vmBeingRendered}.render() method has side effects on the state of ${vm}.${key}`);
            const observable = isObservable(newValue);
            newValue = observable ? getReactiveProxy(newValue) : newValue;
            if (newValue !== value) {
                assert.block(function devModeCheck() {
                    if (!observable && (isObject(newValue) || isArray(newValue))) {
                        assert.logWarning(`Property "${key}" of ${vm} is set to a non-trackable object, which means changes into that object cannot be observed.`);
                    }
                });
                value = newValue;
                if (vm.idx > 0) {
                    // perf optimization to skip this step if not in the DOM
                    notifyListeners(this, key);
                }
            }
        },
        enumerable: descriptor ? descriptor.enumerable : true,
        configurable: false,
    });
}
