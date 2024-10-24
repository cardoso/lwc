/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import * as glob from 'glob';
import type { Config as StyleCompilerConfig } from '@lwc/style-compiler';
import type { PathLike } from 'node:fs';
const { globSync } = glob;

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
    }
    return isOnly ? 'only' : isSkip ? 'skip' : undefined;
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
async function getFixtureConfig<T extends TestFixtureConfig>(
    dirname: string
): Promise<T | undefined> {
    const filepath = path.join(dirname, 'config.json');
    let contents: string;
    try {
        contents = await fs.readFile(filepath, 'utf8');
    } catch (err) {
        if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
            return undefined;
        }
        throw err;
    }
    return JSON.parse(contents);
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
    config: { pattern: string; root: string },
    testFn: (options: {
        src: string;
        filename: string;
        dirname: string;
        config?: T;
    }) => TestFixtureOutput | Promise<TestFixtureOutput>
): Promise<void> {
    if (typeof config !== 'object' || config === null) {
        throw new TypeError(`Expected first argument to be an object`);
    }

    if (typeof testFn !== 'function') {
        throw new TypeError(`Expected second argument to be a function`);
    }

    const { pattern, root } = config;
    if (!pattern || !root) {
        throw new TypeError(`Expected a "root" and a "pattern" config to be specified`);
    }

    const matches = globSync(pattern, {
        cwd: root,
        absolute: true,
    });

    for (const filename of matches) {
        const dirname = path.dirname(filename);
        const [src, fixtureConfig, tester] = await Promise.all([
            fs.readFile(filename, 'utf-8'),
            getFixtureConfig<T>(dirname),
            getTestFunc(dirname),
        ]);
        const description = fixtureConfig?.description ?? path.relative(root, filename);

        (tester === 'only' ? test.only : test)(description, async ({ skip, expect }) => {
            if (tester === 'skip') {
                skip();
                return;
            }

            const outputs = await testFn({
                src,
                filename,
                dirname,
                config: fixtureConfig,
            });

            if (typeof outputs !== 'object' || outputs === null) {
                throw new TypeError(
                    'Expected test function to returns a object with fixtures outputs'
                );
            }

            await Promise.all(
                Object.entries(outputs).map(([outputName, content]) => {
                    const outputPath = path.resolve(dirname, outputName);
                    if (content === undefined) {
                        return expect(exists(outputPath)).resolves.toBe(false);
                    }
                    return expect(content).toMatchFileSnapshot(outputPath);
                })
            );
        });
    }
}
