// @ts-check

import path from 'node:path';
import { defineConfig, configDefaults } from 'vitest/config';

import plugins from './vitest-plugins';
import {
    API_VERSION,
    DISABLE_STATIC_CONTENT_OPTIMIZATION,
    ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL,
    NODE_ENV_FOR_TEST,
} from './vitest-plugins/shared/options';

import { browser } from './vitest-config';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
    plugins: plugins('test'),
    test: {
        name: 'lwc-karma:test',
        dir: 'test',
        include: ['**/*.spec.{js,ts}'],
        exclude: [...configDefaults.exclude, '**/__screenshots__/**'],
        globals: true,
        passWithNoTests: true,
        silent: true,
        expandSnapshotDiff: false,
        setupFiles: ['./vitest-setup/index.ts'],
        env: {
            NODE_ENV: 'development',
            NODE_ENV_FOR_TEST: NODE_ENV_FOR_TEST,
            // @ts-expect-error global polyfill is not typed
            ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL: ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL,
            // @ts-expect-error global polyfill is not typed
            DISABLE_STATIC_CONTENT_OPTIMIZATION: DISABLE_STATIC_CONTENT_OPTIMIZATION,
            // @ts-expect-error global polyfill is not typed
            API_VERSION: API_VERSION,
        },
        alias: [
            {
                find: 'test-utils',
                replacement: path.resolve(__dirname, 'vitest-helpers/test-utils.ts'),
            },
        ],
        browser,
    },
});
