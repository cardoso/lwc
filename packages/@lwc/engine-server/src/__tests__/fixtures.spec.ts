/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/// <reference types="vite/client" />
import path from 'node:path';
import fs from 'node:fs/promises';
import { vi, test, beforeAll, describe } from 'vitest';
import { rollup, type InputOption, type RollupCache } from 'rollup';
import lwcRollupPlugin, { type RollupLwcOptions } from '@lwc/rollup-plugin';
import { formatHTML } from '@lwc/test-utils-lwc-internals';
import * as lwc from '../index';

vi.mock(import('@lwc/module-resolver'), async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        resolveModule(importee, importer, ..._) {
            const dirname = path.dirname(importer);
            return mod.resolveModule(importee, dirname, {
                modules: [
                    { npm: '@lwc/engine-dom' },
                    { npm: '@lwc/synthetic-shadow' },
                    { npm: '@lwc/wire-service' },
                    {
                        dir: dirname.includes('/modules/')
                            ? path.resolve(dirname, '../..')
                            : path.join(dirname, 'modules'),
                    },
                ],
                rootDir: dirname,
            });
        },
    };
});

type FixtureModule = {
    tagName: string;
    default: typeof lwc.LightningElement;
    features?: any[];
};

type FixtureConfig = {
    props?: { [key: string]: any };
};

lwc.setHooks({
    sanitizeHtmlContent(content: unknown) {
        return String(content);
    },
});

vi.mock('lwc', () => {
    return lwc;
});

let cache: RollupCache | undefined;

const fixtures = Object.keys(
    // @ts-expect-error import.meta
    import.meta.glob<string>('./fixtures/**/index.js', {
        query: '?url',
        eager: true,
        import: 'default',
    })
);

const configs =
    // @ts-expect-error import.meta
    import.meta.glob<FixtureConfig>('./fixtures/**/config.json', {
        eager: true,
        import: 'default',
    });

const input = Object.fromEntries(
    fixtures.map((f) => [f.replace('./', ''), path.resolve(__dirname, f)])
);

const config = {
    default: {},
    'enableStaticContentOptimization=false': { enableStaticContentOptimization: false },
} as const;

const cases = Object.entries(config);

describe.concurrent.each(cases)('%s', (suite, options) => {
    const dir = path.join(__dirname, `dist/${suite}`);
    beforeAll(async () => {
        const bundle = await bundleFixtures(input, options);
        await bundle.write({
            dir,
            format: 'esm',
            exports: 'named',
            generatedCode: 'es2015',
            entryFileNames: '[name]',
        });
        return async () => {
            await fs.rm(dir, { recursive: true, force: true });
        };
    });

    test.for(fixtures)('%s', { concurrent: true }, async (fixture, { expect }) => {
        const dirname = path.dirname(fixture);
        const mod: FixtureModule = await import(`${dir}/${fixture}`);
        const { expected, error } = renderFixture(mod, configs[`${dirname}/config.json`]);

        await Promise.all([
            expect(formatHTML(expected)).toMatchFileSnapshot(`${dirname}/expected.html`),
            expect(error).toMatchFileSnapshot(`${dirname}/error.txt`),
        ]);
    });
});

async function bundleFixtures(input: InputOption, options: RollupLwcOptions) {
    const loader = path.join(__dirname, './utils/custom-loader.js');

    const bundle = await rollup({
        input,
        external: ['lwc', 'vitest', loader],
        cache,
        plugins: [
            lwcRollupPlugin({
                rootDir: '.',
                enableDynamicComponents: true,
                experimentalDynamicComponent: {
                    loader,
                    strictSpecifier: false,
                },
                ...options,
            }),
        ],
        onwarn({ message, code }) {
            // TODO [#3331]: The existing lwc:dynamic fixture test will generate warnings that can be safely suppressed.
            const shouldIgnoreWarning =
                message.includes('LWC1187') ||
                // TODO [#4497]: stop warning on duplicate slots or disallow them entirely (LWC1137 is duplicate slots)
                message.includes('LWC1137') ||
                // IGNORED_SLOT_ATTRIBUTE_IN_CHILD is fine; it is used in some of these tests
                message.includes('LWC1201') ||
                message.includes('-h-t-m-l') ||
                code === 'CIRCULAR_DEPENDENCY';
            if (!shouldIgnoreWarning) {
                throw new Error(message);
            }
        },
    });

    if (bundle.cache) {
        cache = bundle.cache;
    }

    return bundle;
}

function renderFixture(mod: FixtureModule, config?: FixtureConfig) {
    const result = { error: '', expected: '' };

    mod.features?.forEach((f) => {
        lwc.setFeatureFlagForTest(f, true);
    });

    try {
        result.expected = lwc.renderComponent(mod.tagName, mod.default, config?.props);
    } catch (_error: any) {
        if (_error.name === 'AssertionError') {
            throw _error;
        } else {
            result.error = _error.message;
        }
    }

    mod.features?.forEach((f) => {
        lwc.setFeatureFlagForTest(f, false);
    });

    return result;
}
