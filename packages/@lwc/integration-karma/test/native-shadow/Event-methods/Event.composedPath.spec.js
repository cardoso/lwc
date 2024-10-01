import { createElement } from 'lwc';
import Synthetic from 'x/synthetic';

import { expectComposedPath } from 'test-utils';

describe('[W-9846457] event access when using native shadow dom', () => {
    let nativeParent;
    let nativeChild;
    const noop = () => {};

    beforeEach(() => {
        nativeParent = document.createElement('x-native-parent');
        nativeParent.attachShadow({ mode: 'open' });
        nativeChild = document.createElement('x-native-child');
        nativeChild.attachShadow({ mode: 'open' });

        nativeParent.shadowRoot.appendChild(nativeChild);
        document.body.appendChild(nativeParent);

        // Internally computes composed path and adds to cache
        document.addEventListener('test', noop, true);
    });

    afterEach(() => {
        nativeParent = null;
        nativeChild = null;
        document.removeEventListener('test', noop, true);
    });

    it('should handle composed bubbling events (nested child)', async () => {
        const event = new CustomEvent('test', { composed: true, bubbles: true });

        const composedPath = await expectComposedPath(event, nativeChild, nativeChild.shadowRoot);

        expect(composedPath).toEqual([
            nativeChild.shadowRoot,
            nativeChild,
            nativeParent.shadowRoot,
            nativeParent,
            document.body,
            document.documentElement,
            document,
            window,
        ]);
    });

    it('should handle composed bubbling events (root parent)', async () => {
        const event = new CustomEvent('test', { composed: true, bubbles: true });

        const composedPath = await expectComposedPath(event, nativeParent, nativeChild.shadowRoot);

        expect(composedPath).toEqual([
            nativeChild.shadowRoot,
            nativeChild,
            nativeParent.shadowRoot,
            nativeParent,
            document.body,
            document.documentElement,
            document,
            window,
        ]);
    });

    it('should handle composed bubbling events (native element)', async () => {
        const div = document.createElement('div');
        const span = document.createElement('span');

        const shadowRoot = div.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(span);
        document.body.appendChild(div);

        const event = new CustomEvent('test', { bubbles: true, composed: true });

        const composedPath = await expectComposedPath(event, div, span);

        expect(composedPath).toEqual([
            span,
            div.shadowRoot,
            div,
            document.body,
            document.documentElement,
            document,
            window,
        ]);
    });

    it('should handle composed bubbling events (synthetic above native)', async () => {
        const synthetic = createElement('x-synthetic', { is: Synthetic });
        const div = document.createElement('div');

        div.attachShadow({ mode: 'open' });
        synthetic.shadowRoot.appendChild(div);
        document.body.appendChild(synthetic);

        let expected;
        if (process.env.NATIVE_SHADOW) {
            expected = [
                div.shadowRoot,
                div,
                synthetic.shadowRoot,
                synthetic,
                document.body,
                document.documentElement,
                document,
                window,
            ];
        } else {
            // The synthetic shadow root is transparent to the native composedPath() because
            // it's not actually rendered in the DOM. This is not an issue because LWC doesn't
            // yet support native web components.
            expected = [
                div.shadowRoot,
                div,
                /* synthetic.shadowRoot, */
                synthetic,
                document.body,
                document.documentElement,
                document,
                window,
            ];
        }

        const event = new CustomEvent('test', { bubbles: true, composed: true });

        const composedPath = await expectComposedPath(event, synthetic, div.shadowRoot);

        expect(composedPath).toEqual(expected);
    });

    it('should handle composed bubbling events (native above synthetic)', async () => {
        const synthetic = createElement('x-synthetic', { is: Synthetic });
        const native = document.createElement('div');

        native.attachShadow({ mode: 'open' });

        const doAppend = () => native.shadowRoot.appendChild(synthetic);
        if (!lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE) {
            doAppend();
        } else {
            // Expected warning, since we are working with disconnected nodes
            expect(doAppend).toLogWarningDev(
                /fired a `connectedCallback` and rendered, but was not connected to the DOM/
            );
        }

        document.body.appendChild(native);

        const event = new CustomEvent('test', { bubbles: true, composed: true });

        const composedPath = await new Promise((resolve) => {
            synthetic.addEventListener(event.type, (event) => {
                resolve(event.composedPath());
            });

            synthetic.shadowRoot.dispatchEvent(event);
        });

        expect(composedPath).toEqual([
            synthetic.shadowRoot,
            synthetic,
            native.shadowRoot,
            native,
            document.body,
            document.documentElement,
            document,
            window,
        ]);
    });
});

describe('Event.composedPath() method', () => {
    describe('dispatched on shadow root', () => {
        it('{bubbles: true, composed: true}', async () => {
            const native = document.createElement('x-native-name-unique-to-this-test-1');
            native.attachShadow({ mode: 'open' });
            document.body.appendChild(native);

            const event = new CustomEvent('test', { bubbles: true, composed: true });

            const composedPath = await new Promise((resolve) => {
                native.shadowRoot.addEventListener(event.type, (event) => {
                    resolve(event.composedPath());
                });

                native.shadowRoot.dispatchEvent(event);
            });

            expect(composedPath).toEqual([
                native.shadowRoot,
                native,
                document.body,
                document.documentElement,
                document,
                window,
            ]);
        });
    });
    describe('dispatched on shadowed element', () => {
        it('{bubbles: true, composed: true}', async () => {
            const native = document.createElement('x-native-name-unique-to-this-test-2');
            const span = document.createElement('span');
            const sr = native.attachShadow({ mode: 'open' });
            sr.appendChild(span);
            document.body.appendChild(native);

            const event = new CustomEvent('test', { bubbles: true, composed: true });

            const composedPath = await new Promise((resolve) => {
                native.shadowRoot.addEventListener(event.type, (event) => {
                    resolve(event.composedPath());
                });
                span.dispatchEvent(event);
            });

            expect(composedPath).toEqual([
                span,
                native.shadowRoot,
                native,
                document.body,
                document.documentElement,
                document,
                window,
            ]);
        });
    });
});
