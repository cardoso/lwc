import * as browser from './browser';
import env from './env';
import type { ViteUserConfig } from 'vitest/config';

export const test: ViteUserConfig['test'] = {
    silent: false,
    isolate: true,
    env,
    browser: browser.test,
};

export const hydration: ViteUserConfig['test'] = {
    ...test,
    isolate: false,
    browser: browser.hydration,
};
