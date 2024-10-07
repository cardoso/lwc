/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { resolve, join } from 'node:path';

import karmaPluginLwc from '../../karma-plugins/lwc';
import karmaPluginEnv from '../../karma-plugins/env';
import karmaPluginTransformFramework from '../../karma-plugins/transform-framework';
import options from '../../shared/options';

const {
    GREP,
    COVERAGE,
    COVERAGE_DIR_FOR_OPTIONS,
    ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL,
    DISABLE_SYNTHETIC,
} = options;
import utils from '../utils';
const { createPattern } = utils;

export const BASE_DIR = resolve(__dirname, '../../../test');
const COVERAGE_DIR = resolve(__dirname, '../../../coverage');

const SYNTHETIC_SHADOW = require.resolve('@lwc/synthetic-shadow/dist/index.js');
const LWC_ENGINE = require.resolve('@lwc/engine-dom/dist/index.js');
const WIRE_SERVICE = require.resolve('@lwc/wire-service/dist/index.js');
const ARIA_REFLECTION = require.resolve('@lwc/aria-reflection/dist/index.js');

const TEST_UTILS = require.resolve('../../../helpers/test-utils');
const TEST_SETUP = require.resolve('../../../helpers/test-setup');

const ALL_FRAMEWORK_FILES = [SYNTHETIC_SHADOW, LWC_ENGINE, WIRE_SERVICE, ARIA_REFLECTION];

// Fix Node warning about >10 event listeners ("Possible EventEmitter memory leak detected").
// This is due to the fact that we are running so many simultaneous rollup commands
// on so many files. For every `*.spec.js` file, Rollup adds a listener at
// this line: https://github.com/rollup/rollup/blob/35cbfae/src/utils/hookActions.ts#L37
process.setMaxListeners(1000);

function getFiles() {
    const frameworkFiles = [];

    if (!DISABLE_SYNTHETIC) {
        frameworkFiles.push(createPattern(SYNTHETIC_SHADOW));
    }
    if (ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL) {
        frameworkFiles.push(createPattern(ARIA_REFLECTION));
    }
    frameworkFiles.push(createPattern(LWC_ENGINE));
    frameworkFiles.push(createPattern(WIRE_SERVICE));
    frameworkFiles.push(createPattern(TEST_SETUP));

    return [
        ...frameworkFiles,
        createPattern(TEST_UTILS),
        createPattern('**/*.spec.js', { watched: false }),
    ];
}

export type Config = {
    client: { args: any };
    preprocessors: { [x: string]: string[] };
    reporters: string[];
    plugins: string[];
    coverageReporter: { dir: string; reporters: { type: string }[] };
};

/**
 * More details here:
 * https://karma-runner.github.io/3.0/config/configuration-file.html
 * @param config
 */
export default (config: Config) => {
    Object.assign(config, {
        basePath: BASE_DIR,
        files: getFiles(),

        preprocessors: {
            // Transform all the spec files with the lwc karma plugin.
            '**/*.spec.js': ['lwc'],
            // Transform all framework files
            ...Object.fromEntries(
                ALL_FRAMEWORK_FILES.map((file) => [file, ['transform-framework']])
            ),
        },

        // Use the env plugin to inject the right environment variables into the app
        // Use jasmine as test framework for the suite.
        frameworks: ['env', 'jasmine'],

        // Specify what plugin should be registered by Karma.
        plugins: ['karma-jasmine', karmaPluginLwc, karmaPluginEnv, karmaPluginTransformFramework],

        // Leave the reporter empty on purpose. Extending configuration need to pick the right reporter they want
        // to use.
        reporters: [],

        // Since the karma start command doesn't allow arguments passing, so we need to pass the grep arg manually.
        // The grep flag is consumed at runtime by jasmine to filter what suite to run.
        client: {
            args: [...config.client.args, '--grep', GREP],
        },
    });

    // The code coverage is only enabled when the flag is passed since it makes debugging the engine code harder.
    if (COVERAGE) {
        // Indicate to Karma to instrument the code to gather code coverage.
        config.preprocessors[LWC_ENGINE].push('coverage');
        config.preprocessors[WIRE_SERVICE].push('coverage');
        config.preprocessors[SYNTHETIC_SHADOW].push('coverage');

        config.reporters.push('coverage');
        config.plugins.push('karma-coverage');

        config.coverageReporter = {
            dir: join(COVERAGE_DIR, COVERAGE_DIR_FOR_OPTIONS),
            reporters: [{ type: 'html' }, { type: 'json' }],
        };
    }

    return {};
};