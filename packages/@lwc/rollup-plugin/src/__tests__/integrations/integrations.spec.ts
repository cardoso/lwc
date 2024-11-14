/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { describe, it } from 'vitest';
import { rolldown } from 'rolldown';

import lwc from '../../index';

describe('integration', () => {
    describe('typescript', () => {
        it.concurrent(`resolves and transform .ts files`, async ({ expect }) => {
            await expect(generateEsmBundle()).resolves.toMatchInlineSnapshot(`
              {
                "bundle": RolldownBuild {},
                "output": {
                  "output": [
                    {
                      "code": "import { LightningElement, freezeTemplate, registerComponent as _registerComponent, registerTemplate } from "lwc";

              //#region packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.css
              var default$2 = void 0;

              //#endregion
              //#region @lwc/resources/empty_css.css
              var default$1 = void 0;

              //#endregion
              //#region packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.html
              const stc0 = [];
              function tmpl($api, $cmp, $slotset, $ctx) {
              	return stc0;
              }
              var typescript_default$1 = registerTemplate(tmpl);
              tmpl.stylesheets = [];
              tmpl.stylesheetToken = "lwc-15n46vaufc3";
              tmpl.legacyStylesheetToken = "fixtures-typescript_typescript";
              if (default$2) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$2);
              if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
              freezeTemplate(tmpl);

              //#endregion
              //#region packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.ts
              var TypeScript = class extends LightningElement {};
              const __lwc_component_class_internal = _registerComponent(TypeScript, {
              	tmpl: typescript_default$1,
              	sel: "fixtures-typescript",
              	apiVersion: 63
              });
              var typescript_default = __lwc_component_class_internal;

              //#endregion
              export { typescript_default as default };",
                      "dynamicImports": [],
                      "exports": [
                        "default",
                      ],
                      "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.ts",
                      "fileName": "typescript.js",
                      "imports": [],
                      "isDynamicEntry": false,
                      "isEntry": true,
                      "map": null,
                      "moduleIds": [
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.css",
                        "@lwc/resources/empty_css.css",
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.html",
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.ts",
                      ],
                      "modules": {
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.css": {},
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.html": {},
                        "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/integrations/fixtures/typescript/typescript.ts": {},
                        "@lwc/resources/empty_css.css": {},
                      },
                      "name": "typescript",
                      "preliminaryFileName": "typescript.js",
                      "sourcemapFileName": null,
                      "type": "chunk",
                    },
                    {
                      "fileName": "typescript.css",
                      "name": undefined,
                      "originalFileName": null,
                      "source": "export default undefined
              export default undefined
              ",
                      "type": "asset",
                    },
                  ],
                },
                "warnings": [],
              }
            `);
        });
    });
});

async function generateEsmBundle() {
    const warnings: any[] = [];
    try {
        const bundle = await rolldown({
            input: path.resolve(__dirname, 'fixtures/typescript/typescript.ts'),
            plugins: [lwc()],
            external: ['lwc'],
            shimMissingExports: true,
            onwarn(...warning) {
                warnings.push(warning);
            },
        });
        try {
            const output = await bundle.generate();
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
