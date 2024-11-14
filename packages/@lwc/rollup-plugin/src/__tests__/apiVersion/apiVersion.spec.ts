/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { rolldown } from 'rolldown';
import { APIVersion, HIGHEST_API_VERSION, LOWEST_API_VERSION } from '@lwc/shared';

import lwc, { RollupLwcOptions } from '../../index';

describe('API versioning', () => {
    async function runRollup(
        pathname: string,
        options: RollupLwcOptions
    ): Promise<{ code: string; warnings: any[] }> {
        const warnings: any[] = [];
        const bundle = await rolldown({
            input: path.resolve(__dirname, pathname),
            plugins: [lwc(options)],
            external: ['lwc'],
            shimMissingExports: true,
            onwarn(warning) {
                warnings.push(warning);
            },
        });

        const { output } = await bundle.generate({
            format: 'esm',
        });

        return {
            code: output[0].code,
            warnings,
        };
    }

    it('uses highest API version by default', async () => {
        const { code, warnings } = await runRollup('fixtures/basic/basic.js', {});
        expect(code).toMatchInlineSnapshot(`
          "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/apiVersion/fixtures/basic/basic.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: empty_html_default,
          	sel: "fixtures-basic",
          	apiVersion: ${HIGHEST_API_VERSION}
          });
          var basic_default = __lwc_component_class_internal;

          //#endregion
          export { basic_default as default };"
        `);
        expect(warnings).toEqual([]);
    });

    it('passes the apiVersion config on to the compiled JS component', async () => {
        const { code, warnings } = await runRollup('fixtures/basic/basic.js', {
            apiVersion: APIVersion.V58_244_SUMMER_23,
        });
        expect(code).toMatchInlineSnapshot(`
          "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/apiVersion/fixtures/basic/basic.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: empty_html_default,
          	sel: "fixtures-basic",
          	apiVersion: ${APIVersion.V58_244_SUMMER_23}
          });
          var basic_default = __lwc_component_class_internal;

          //#endregion
          export { basic_default as default };"
        `);
        expect(warnings).toEqual([]);
    });

    it('handles apiVersion lower than lower bound', async () => {
        const { code, warnings } = await runRollup('fixtures/basic/basic.js', {
            // @ts-expect-error Explicitly testing JS behavior that violates TS types
            apiVersion: 0,
        });
        expect(code).toMatchInlineSnapshot(`
          "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/apiVersion/fixtures/basic/basic.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: empty_html_default,
          	sel: "fixtures-basic",
          	apiVersion: ${LOWEST_API_VERSION}
          });
          var basic_default = __lwc_component_class_internal;

          //#endregion
          export { basic_default as default };"
        `);
        expect(warnings).toHaveLength(0);
    });

    it('handles apiVersion higher than high bound', async () => {
        const { code, warnings } = await runRollup('fixtures/basic/basic.js', {
            apiVersion: Number.MAX_SAFE_INTEGER,
        });
        expect(code).toMatchInlineSnapshot(`
          "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/apiVersion/fixtures/basic/basic.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: empty_html_default,
          	sel: "fixtures-basic",
          	apiVersion: ${HIGHEST_API_VERSION}
          });
          var basic_default = __lwc_component_class_internal;

          //#endregion
          export { basic_default as default };"
        `);
        expect(warnings).toHaveLength(0);
    });

    it('if within bounds, finds the lowest known version matching the specification', async () => {
        const { code, warnings } = await runRollup('fixtures/basic/basic.js', {
            // @ts-expect-error Explicitly testing JS behavior that violates TS types
            apiVersion: 58.5,
        });
        expect(code).toMatchInlineSnapshot(`
          "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/apiVersion/fixtures/basic/basic.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: empty_html_default,
          	sel: "fixtures-basic",
          	apiVersion: 58
          });
          var basic_default = __lwc_component_class_internal;

          //#endregion
          export { basic_default as default };"
        `);
        expect(warnings).toHaveLength(0);
    });
});
