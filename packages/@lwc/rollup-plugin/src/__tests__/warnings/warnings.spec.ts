/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { rolldown } from 'rolldown';
import { APIVersion } from '@lwc/shared';
import lwc from '../../index';

describe('warnings', () => {
    it('should emit a warning for double </template> tags in older API versions', async () => {
        await expect(generateBundleWithWarnings()).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.html
          const $fragment1 = parseFragment\`<h1\${3}>Hello world</h1>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var test_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "fixtures-test_test";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.js
          var Test = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(Test, {
          	tmpl: test_default$1,
          	sel: "fixtures-test",
          	apiVersion: 58
          });
          var test_default = __lwc_component_class_internal;

          //#endregion
          export { test_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.js",
                  "fileName": "test.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "test",
                  "preliminaryFileName": "test.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "test.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [
              [
                "warn",
                {
                  "code": "PLUGIN_WARNING",
                  "frame": "</template>",
                  "hook": "transform",
                  "id": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.html",
                  "loc": {
                    "column": 1,
                    "file": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/warnings/fixtures/test/test.html",
                    "line": 4,
                  },
                  "message": "@lwc/rollup-plugin: LWC1148: Invalid HTML syntax: end-tag-without-matching-open-element. This will not be supported in future versions of LWC. For more information, please visit https://html.spec.whatwg.org/multipage/parsing.html#parse-error-end-tag-without-matching-open-element",
                  "plugin": "rollup-plugin-lwc-compiler",
                  "pluginCode": "LWC1148",
                },
                [Function],
              ],
            ],
          }
        `);
    });
});

async function generateBundleWithWarnings() {
    const warnings: any[] = [];

    try {
        const bundle = await rolldown({
            input: path.resolve(__dirname, 'fixtures/test/test.js'),
            plugins: [
                lwc({
                    apiVersion: APIVersion.V58_244_SUMMER_23,
                }),
            ],
            external: ['lwc'],
            shimMissingExports: true,
            onLog(...args) {
                warnings.push(args);
            },
        });

        try {
            const output = await bundle.generate({
                format: 'esm',
            });
            return { warnings, bundle, output };
        } catch (error) {
            return { warnings, error, bundle };
        }
    } catch (error) {
        return { warnings, error };
    }
}
