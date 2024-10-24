/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import { test } from 'vitest';
import type { Config as StyleCompilerConfig } from '@lwc/style-compiler';
import type { PathLike } from 'node:fs';

type TestFixtureOutput = { [filename: string]: unknown };

// Like `fs.existsSync` but async
async function exists(path: PathLike): Promise<boolean> {
    try {
        await fs.access(path);
        return true;
    } catch (_err) {
        return false;
    }
}

const TEST_SKIP = 0;
const TEST_ONLY = 1;
const TEST_NORMAL = 2;

/**
 * Facilitates the use of vitest's `test.only`/`test.skip` in fixture files.
 * @param dirname fixture directory to check for "directive" files
 * @returns `test.only` if `.only` exists, `test.skip` if `.skip` exists, otherwise `test`
 * @throws if you have both `.only` and `.skip` in the directory
 * @example getTestFunc('/fixtures/some-test')
 */
async function getTestFunc(dirname: string) {
    const [isOnly, isSkip] = await Promise.all([
        exists(path.join(dirname, '.only')),
        exists(path.join(dirname, '.skip')),
    ]);
    if (isOnly && isSkip) {
        const relpath = path.relative(process.cwd(), dirname);
        throw new Error(`Cannot have both .only and .skip in ${relpath}`);
    } else if (isOnly) {
        return TEST_ONLY;
    } else if (isSkip) {
        return TEST_SKIP;
    } else {
        return TEST_NORMAL;
    }
}

export interface TestFixtureConfig extends StyleCompilerConfig {
    /** Human-readable test description. A proxy for `test(description, ...)`. */
    description?: string;
    /** Component name. */
    name?: string;
    /** Component namespace. */
    namespace?: string;
    /** Props to provide to the top-level component. */
    props?: Record<string, string | string[]>;
    /** Output files used by ssr-compiler, when the output needs to differ fron engine-server */
    ssrFiles?: {
        error?: string;
        expected?: string;
    };
}

/** Loads the the contents of the `config.json` in the provided directory, if present. */
async function getFixtureConfig<T extends TestFixtureConfig>(dirname: string): Promise<T> {
    const filepath = path.join(dirname, 'config.json');

    if (!(await exists(filepath))) {
        return {} as T;
    }

    const { default: config } = await import(filepath, { with: { type: 'json' } });

    return config;
}

async function globFixtures<T extends TestFixtureConfig>(pattern: string | string[], root: string) {
    const iter = await glob(pattern, {
        cwd: root,
        absolute: true,
    });

    return Promise.all(
        iter.map(async (filename) => {
            const dirname = path.dirname(filename);
            const [src, fixtureConfig, tester] = await Promise.all([
                fs.readFile(filename, 'utf-8'),
                getFixtureConfig<T>(dirname),
                getTestFunc(dirname),
            ]);

            const description = fixtureConfig?.description ?? path.relative(root, filename);

            return {
                src,
                filename,
                dirname,
                fixtureConfig,
                description,
                tester,
            };
        })
    );
}

/**
 * Test a fixture directory against a set of snapshot files. This method generates a test for each
 * file matching the `config.pattern` glob. The `testFn` fixture is invoked for each test and is
 * expected to return an object representing the fixture outputs. The key represents the output
 * file name and the value, its associated content. An `undefined` or `null` value represents a
 * non existing file.
 * @param config The config object
 * @param config.pattern The glob pattern to locate each individual fixture.
 * @param config.root The directory from where the pattern is executed.
 * @param testFn The test function executed for each fixture.
 * @throws On invalid input or output
 * @example
 * testFixtureDir(
 *   { root: 'fixtures', pattern: '**\/actual.js' },
 *   ({src}) => {
 *     let result, error
 *     try { result = transform(src) } catch (e) { error = e }
 *     return { 'expected.js': result, 'error.txt': error }
 *   }
 * )
 */
export async function testFixtureDir<T extends TestFixtureConfig>(
    config: {
        pattern: string;
        root: string;
    },
    testFn: (config: {
        src: string;
        config: T;
        filename: string;
        dirname: string;
    }) => TestFixtureOutput | Promise<TestFixtureOutput>
) {
    if (typeof config !== 'object' || config === null) {
        throw new TypeError(`Expected first argument to be an object`);
    }

    const { pattern, root } = config;

    if (!pattern || !root) {
        throw new TypeError(`Expected a "root" and a "pattern" config to be specified`);
    }

    const fixtures = await globFixtures<T>(pattern, root);
    const hasOnly = fixtures.some(({ tester }) => tester === TEST_ONLY);

    test.concurrent.for(fixtures)(
        '$description',
        async ({ src, filename, dirname, fixtureConfig, tester }, { skip, expect }) => {
            if (tester === TEST_SKIP || (hasOnly && tester !== TEST_ONLY)) {
                skip();
            }

            const outputs = await testFn({ src, config: fixtureConfig, filename, dirname });

            if (typeof outputs !== 'object' || outputs === null) {
                throw new TypeError(
                    'Expected test function to returns a object with fixtures outputs'
                );
            }

            await Promise.all(
                Object.entries(outputs).map(async ([outputName, content]) => {
                    const outputPath = path.resolve(dirname, outputName);
                    if (content === undefined) {
                        await expect(exists(outputPath)).resolves.toBe(false);
                    } else {
                        await expect(content).toMatchFileSnapshot(outputPath);
                    }
                })
            );
        }
    );
}
