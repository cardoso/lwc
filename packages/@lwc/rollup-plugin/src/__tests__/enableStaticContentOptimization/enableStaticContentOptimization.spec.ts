/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { describe, it } from 'vitest';
import { rolldown } from 'rolldown';
import lwc, { RollupLwcOptions } from '../../index';

describe('enableStaticContentOptimization:', () => {
    async function runRollup(pathname: string, options: RollupLwcOptions) {
        const warnings: any[] = [];

        try {
            const bundle = await rolldown({
                input: path.resolve(__dirname, pathname),
                plugins: [lwc(options)],
                external: ['lwc'],
                shimMissingExports: true,
                onwarn(warning) {
                    warnings.push(warning);
                },
            });

            try {
                const output = await bundle.generate({
                    format: 'esm',
                });

                await bundle.close();

                return {
                    warnings,
                    bundle,
                    output,
                };
            } catch (error) {
                return {
                    warnings,
                    bundle,
                    error,
                };
            }
        } catch (error) {
            return {
                warnings,
                error,
            };
        }
    }

    const configs = [
        {
            name: 'undefined',
            opts: { enableStaticContentOptimization: undefined },
        },
        { name: 'false', opts: { enableStaticContentOptimization: false } },
        { name: 'true', opts: { enableStaticContentOptimization: true } },
        { name: 'unspecified', opts: {}, expected: true },
    ];

    it.concurrent.for(configs)('$name', async ({ opts }, { expect }) => {
        await expect(runRollup('fixtures/basic/basic.js', opts)).resolves.toMatchSnapshot();
    });
});
