/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import * as testerScripts from './testerScripts';
import type { ViteUserConfig } from 'vitest/config';
import type { RemoteOptions } from 'webdriverio';

type TestConfig = Required<ViteUserConfig>['test'];
type BrowserConfig = Required<TestConfig>['browser'];

function getBrowser() {
    // process.argv contains --browser=name or --browser.name=name
    const args = process.argv.slice(2);
    const browserArg = args.find(
        (arg) => arg.startsWith('--browser=') || arg.startsWith('--browser.name=')
    );
    const browser = browserArg ? browserArg.split('=')[1] : undefined;
    return browser ?? process.env.BROWSER ?? 'chrome';
}

const name = getBrowser();

export const STANDARD_BROWSERS: Record<string, RemoteOptions['capabilities']> = {
    chrome: {
        //label: 'sl_chrome_latest',
        browserName: 'chrome',
        browserVersion: 'latest',
        'goog:chromeOptions': {
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions'],
        },
    },
    firefox: {
        //label: 'sl_firefox_latest',
        browserName: 'firefox',
        // browserVersion: 'latest',
        'moz:debuggerAddress': true, // See https://github.com/karma-runner/karma-sauce-launcher/issues/275#issuecomment-1318593354
    },
    safari: {
        //label: 'sl_safari_latest',
        browserName: 'safari',
    },
    edge: {
        //label: 'sl_edge_latest',
        browserName: 'microsoftedge',
        browserVersion: 'latest',
        'ms:edgeOptions': {
            args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-extensions'],
        },
    },
};

export const LEGACY_BROWSERS: WebdriverIO.Capabilities[] = [
    {
        //label: 'sl_chrome_compat',
        browserName: 'chrome',
        browserVersion: 'latest-2',
    },
    {
        //label: 'sl_safari_compat',
        browserName: 'safari',
        browserVersion: '14',
        platformName: 'macOS 11',
    },
];

export const test = {
    enabled: true,
    ui: false,
    screenshotFailures: false,
    headless: name !== 'safari',
    isolate: true,
    name,
    provider: 'webdriverio',
    providerOptions: {
        strictSSL: false,
        capabilities: {
            ...STANDARD_BROWSERS[name],
            acceptInsecureCerts: true,
            pageLoadStrategy: 'eager',
            // pageLoadStrategy: 'none',
        },
    },
    testerScripts: testerScripts.test,
} as BrowserConfig;

export const hydration = {
    ...test,
    isolate: false,
    testerScripts: testerScripts.hydration,
} as BrowserConfig;
