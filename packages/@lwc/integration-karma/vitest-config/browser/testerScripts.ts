import { LWC_VERSION } from '@lwc/shared';
import {
    API_VERSION,
    DISABLE_STATIC_CONTENT_OPTIMIZATION,
    ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL,
    ENABLE_SYNTHETIC_SHADOW_IN_HYDRATION,
    FORCE_NATIVE_SHADOW_MODE_FOR_TEST,
    DISABLE_SYNTHETIC,
    NODE_ENV_FOR_TEST,
    DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE,
} from './shared/options';
import type { BrowserScript } from 'vitest/node';

const env: BrowserScript = {
    type: 'text/javascript',
    content: `
window.process = {
    env: {
        API_VERSION: ${JSON.stringify(API_VERSION)},
        DISABLE_STATIC_CONTENT_OPTIMIZATION: ${DISABLE_STATIC_CONTENT_OPTIMIZATION},
        ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL: ${ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL},
        ENABLE_SYNTHETIC_SHADOW_IN_HYDRATION: ${ENABLE_SYNTHETIC_SHADOW_IN_HYDRATION},
        FORCE_NATIVE_SHADOW_MODE_FOR_TEST: ${FORCE_NATIVE_SHADOW_MODE_FOR_TEST},
        LWC_VERSION: ${JSON.stringify(LWC_VERSION)},
        NATIVE_SHADOW: ${DISABLE_SYNTHETIC || FORCE_NATIVE_SHADOW_MODE_FOR_TEST},
        NODE_ENV: ${JSON.stringify(NODE_ENV_FOR_TEST || 'development')},
    }
};

window.lwcRuntimeFlags = {
    DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE: ${DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE}
};
`,
};

const syntheticShadow: BrowserScript = {
    type: 'text/javascript',
    src: '@lwc/synthetic-shadow',
};

const ariaReflection: BrowserScript = {
    type: 'text/javascript',
    src: '@lwc/aria-reflection',
};

const lwcEngine: BrowserScript = {
    type: 'text/javascript',
    src: '@lwc/engine-dom',
};

const wireService: BrowserScript = {
    type: 'text/javascript',
    src: '@lwc/wire-service',
};

const testUtils: BrowserScript = {
    type: 'module',
    src: 'test-utils',
};

export const test = [
    env,
    !DISABLE_SYNTHETIC ? syntheticShadow : undefined,
    ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL ? ariaReflection : undefined,
    lwcEngine,
    wireService,
    testUtils,
].filter((f) => f !== undefined) satisfies BrowserScript[];

export const hydration = [
    env,
    ENABLE_SYNTHETIC_SHADOW_IN_HYDRATION ? syntheticShadow : undefined,
    ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL ? ariaReflection : undefined,
    lwcEngine,
    wireService,
    testUtils,
].filter((f) => f !== undefined) satisfies BrowserScript[];
