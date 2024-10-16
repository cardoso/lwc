import { createElement } from 'lwc';
import { ariaProperties, ariaAttributes, ENABLE_ELEMENT_INTERNALS_AND_FACE } from 'test-utils';

import ElementInternal from 'ei/component';

let elm;
beforeEach(() => {
    elm = createElement('ei-component', { is: ElementInternal });
    document.body.appendChild(elm);
});

afterEach(() => {
    document.body.removeChild(elm);
});

describe.runIf(
    ENABLE_ELEMENT_INTERNALS_AND_FACE &&
        process.env.NATIVE_SHADOW &&
        typeof ElementInternals !== 'undefined'
)('ElementInternals', () => {
    it('should be associated to the correct element', () => {
        // Ensure external and internal views of shadowRoot are the same
        expect(elm.internals.shadowRoot).toBe(elm.template);
        expect(elm.internals.shadowRoot).toBe(elm.shadowRoot);
    });

    // Firefox does not support ARIAMixin inside ElementInternals.
    // Check to see if ARIAMixin value is defined on ElementInternals before
    // testing accessibility.
    // #TODO[3693]: Firefox is shipping ARIAMixin support in the nightly distribution, remove this check
    // once support has officially been released.
    describe.runIf(
        Object.prototype.hasOwnProperty.call(window.ElementInternals.prototype, 'ariaAtomic')
    )('accessibility', () => {
        it('should be able to set ARIAMixin properties on ElementInternals', () => {
            elm.setAllAriaProps('foo');
            // Verify ElementInternals proxy setter and getter
            for (const ariaProp of ariaProperties) {
                expect(elm.internals[ariaProp]).toEqual('foo');
            }
        });

        it('should not reflect to aria-* attributes', () => {
            elm.setAllAriaProps('foo');
            for (const attr of ariaAttributes) {
                expect(elm.getAttribute(attr)).not.toEqual('foo');
            }
        });

        it('aria-* attributes do not reflect to internals', () => {
            for (const attr of ariaAttributes) {
                elm.setAttribute(attr, 'bar');
            }
            for (const prop of ariaProperties) {
                expect(elm.internals[prop]).toBeFalsy();
            }
        });
    });
});
