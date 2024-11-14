/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import fs from 'node:fs';
import { describe, it } from 'vitest';
import { rolldown, Plugin } from 'rolldown';
import nodeResolve from '@rollup/plugin-node-resolve';

import lwc from '../../index';

const fixturesdir = path.resolve(__dirname, 'fixtures');

async function runRollup(pathname: string, { plugins = [] as Plugin[] } = {}) {
    const warnings: any[] = [];
    try {
        const bundle = await rolldown({
            input: path.resolve(fixturesdir, pathname),
            plugins: [lwc(), ...plugins],
            external: ['lwc', '@lwc/synthetic-shadow', '@lwc/wire-service'],
            shimMissingExports: true,
            onwarn(warning) {
                warnings.push(warning);
            },
        });

        try {
            const output = await bundle.generate({
                format: 'esm',
            });

            return {
                output,
                bundle,
                warnings,
            };
        } catch (error) {
            return {
                bundle,
                error,
                warnings,
            };
        }
    } catch (error) {
        return {
            error,
            warnings,
        };
    }
}

describe('resolver', () => {
    it.concurrent(
        'should be capable to resolve all the base LWC module imports',
        async ({ expect }) => {
            await expect(runRollup('lwc-modules/lwc-modules.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import "lwc";
          import "@lwc/synthetic-shadow";
          import "@lwc/wire-service";
          ",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-modules/lwc-modules.js",
                  "fileName": "lwc-modules.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-modules/lwc-modules.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-modules/lwc-modules.js": {},
                  },
                  "name": "lwc-modules",
                  "preliminaryFileName": "lwc-modules.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent('should use lwc.config.json to resolve LWC modules', async ({ expect }) => {
        await expect(runRollup('lwc-config-json/src/index.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "
          //#region rolldown:runtime
          var __defProp = Object.defineProperty;
          var __export = (target, all) => {
          	for (var name in all) __defProp(target, name, {
          		get: all[name],
          		enumerable: true
          	});
          };

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton
          const buttonVersion$1 = "button:v1";

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/src/modules/fancy/bar/bar.js
          const fancyBarVersion = "1.0.0 | " + buttonVersion$1;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton
          const buttonVersion = "button:v2";

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/modules/root/cmp/cmp.js
          var cmp_exports = {};
          __export(cmp_exports, {
          	buttonVersion: () => buttonVersion,
          	fancyBarVersion: () => fancyBarVersion,
          	foo: () => foo
          });
          const foo = "test";

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/index.js
          console.log(cmp_exports);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/index.js",
                  "fileName": "index.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "rolldown:runtime",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/src/modules/fancy/bar/bar.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/modules/root/cmp/cmp.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/index.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/node_modules/@ui/components/src/modules/ui/button/button.js?specifier=ui%2Fbutton": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/node_modules/fancy-components/src/modules/fancy/bar/bar.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/index.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/lwc-config-json/src/modules/root/cmp/cmp.js": {},
                    "rolldown:runtime": {},
                  },
                  "name": "index",
                  "preliminaryFileName": "index.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
              ],
            },
            "warnings": [],
          }
        `);
    });

    it.concurrent(
        'should properly resolve LWC module with implicit template',
        async ({ expect }) => {
            await expect(runRollup('implicit-html/implicit-html.js')).resolves
                .toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-html/implicit-html.js
          var ImplicitHTML = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(ImplicitHTML, {
          	tmpl: empty_html_default,
          	sel: "fixtures-implicit-html",
          	apiVersion: 63
          });
          var implicit_html_default = __lwc_component_class_internal;

          //#endregion
          export { implicit_html_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-html/implicit-html.js",
                  "fileName": "implicit-html.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_html.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-html/implicit-html.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-html/implicit-html.js": {},
                    "@lwc/resources/empty_html.js": {},
                  },
                  "name": "implicit-html",
                  "preliminaryFileName": "implicit-html.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        'should properly resolve LWC module with implicit stylesheet',
        async ({ expect }) => {
            await expect(runRollup('implicit-css/implicit-css.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.html
          const stc0 = [];
          function tmpl($api, $cmp, $slotset, $ctx) {
          	return stc0;
          }
          var implicit_css_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-5kjj8rl05ip";
          tmpl.legacyStylesheetToken = "fixtures-implicit-css_implicit-css";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.js
          var ImplicitCss = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(ImplicitCss, {
          	tmpl: implicit_css_default$1,
          	sel: "fixtures-implicit-css",
          	apiVersion: 63
          });
          var implicit_css_default = __lwc_component_class_internal;

          //#endregion
          export { implicit_css_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.js",
                  "fileName": "implicit-css.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/implicit-css/implicit-css.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "implicit-css",
                  "preliminaryFileName": "implicit-css.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "implicit-css.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        "should ignore module that can't be resolved by LWC module resolver",
        async ({ expect }) => {
            await expect(runRollup('unknown-module/unknown-module.js')).resolves
                .toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import "some/module";
          ",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/unknown-module/unknown-module.js",
                  "fileName": "unknown-module.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/unknown-module/unknown-module.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/unknown-module/unknown-module.js": {},
                  },
                  "name": "unknown-module",
                  "preliminaryFileName": "unknown-module.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
              ],
            },
            "warnings": [
              {
                "code": "UNRESOLVED_IMPORT",
                "message": "[33m[UNRESOLVED_IMPORT] Warning:[0m Could not resolve "some/module" in packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/unknown-module/unknown-module.js
             [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0mpackages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/unknown-module/unknown-module.js:1:8[38;5;246m][0m
             [38;5;246m│[0m
           [38;5;246m1 │[0m [38;5;249mi[0m[38;5;249mm[0m[38;5;249mp[0m[38;5;249mo[0m[38;5;249mr[0m[38;5;249mt[0m[38;5;249m [0m"some/module"[38;5;249m;[0m
           [38;5;240m  │[0m        ──────┬──────  
           [38;5;240m  │[0m              ╰──────── Module not found, treating it as an external dependency
          [38;5;246m───╯[0m
          ",
              },
            ],
          }
        `);
        }
    );

    it.concurrent(
        'should properly resolve modules with @rollup/rollup-node-resolve and third-party package',
        async ({ expect }) => {
            await expect(
                runRollup('third-party-import/src/main.js', {
                    plugins: [nodeResolve() as Plugin],
                })
            ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, createElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerDecorators as _registerDecorators, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.html
          const $fragment1 = parseFragment\`<pre\${3}>\${"t1"}</pre>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { d: api_dynamic_text, sp: api_static_part, st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1, [api_static_part(1, null, api_dynamic_text($cmp.hello))])];
          }
          var app_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-190pm5at4mo";
          tmpl.legacyStylesheetToken = "x-app_app";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/node_modules/fake-third-party-package/index.js
          function fake() {
          	return "woo hoo";
          }

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.js
          var App = class extends LightningElement {
          	constructor(...args) {
          		super(...args);
          		this.hello = fake();
          	}
          };
          _registerDecorators(App, { fields: ["hello"] });
          const __lwc_component_class_internal = _registerComponent(App, {
          	tmpl: app_default$1,
          	sel: "x-app",
          	apiVersion: 63
          });
          var app_default = __lwc_component_class_internal;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/main.js
          const container = document.getElementById("main");
          const element = createElement("x-app", { is: app_default });
          container.appendChild(element);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/main.js",
                  "fileName": "main.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/node_modules/fake-third-party-package/index.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/main.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/node_modules/fake-third-party-package/index.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/main.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/third-party-import/src/x/app/app.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "main",
                  "preliminaryFileName": "main.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "main.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent('should properly handle non-component class', async ({ expect }) => {
        await expect(runRollup('non-component-class/src/main.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, createElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.html
          const $fragment1 = parseFragment\`<h1\${3}>hello</h1>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var app_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-190pm5at4mo";
          tmpl.legacyStylesheetToken = "x-app_app";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.js
          var NotALightningElement = class {};
          var AlsoNotALightningElement = class {
          	constructor() {
          		this.foo = "bar";
          	}
          };
          var App = class extends LightningElement {
          	renderedCallback() {
          		console.log(NotALightningElement, AlsoNotALightningElement);
          	}
          };
          const __lwc_component_class_internal = _registerComponent(App, {
          	tmpl: app_default$1,
          	sel: "x-app",
          	apiVersion: 63
          });
          var app_default = __lwc_component_class_internal;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/main.js
          const container = document.getElementById("main");
          const element = createElement("x-app", { is: app_default });
          container.appendChild(element);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/main.js",
                  "fileName": "main.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/main.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/main.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/non-component-class/src/x/app/app.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "main",
                  "preliminaryFileName": "main.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "main.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
    });

    it.concurrent(
        'should properly resolve scoped styles with another plugin',
        async ({ expect }) => {
            await expect(
                runRollup('scoped-styles/src/main.js', {
                    plugins: [
                        {
                            name: 'resolve-scoped-styles',
                            resolveId(importee, importer) {
                                if (importee.endsWith('?scoped=true') && importer) {
                                    const importeeWithoutQuery = importee.replace(
                                        '?scoped=true',
                                        ''
                                    );
                                    const importerDir = path.dirname(importer);
                                    const fullImportee = path.resolve(importerDir, importee);
                                    const fullImporteeWithoutQuery = path.resolve(
                                        importerDir,
                                        importeeWithoutQuery
                                    );
                                    if (fs.existsSync(fullImporteeWithoutQuery)) {
                                        // mimics @rollup/plugin-node-resolve, which can resolve the ID with the query param
                                        return fullImportee;
                                    }
                                }
                            },
                        },
                    ],
                })
            ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, createElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.scoped.css?scoped=true
          function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
          	var shadowSelector = token ? "." + token : "";
          	var hostSelector = token ? "." + token + "-host" : "";
          	var suffixToken = token ? "-" + token : "";
          	return "div" + shadowSelector + " {color: blue;}";
          }
          stylesheet.$scoped$ = true;
          var app_scoped_default = [stylesheet];

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.html
          const $fragment1 = parseFragment\`<div\${3}></div>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var app_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-190pm5at4mo";
          tmpl.legacyStylesheetToken = "x-app_app";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (app_scoped_default) tmpl.stylesheets.push.apply(tmpl.stylesheets, app_scoped_default);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.js
          var App = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(App, {
          	tmpl: app_default$1,
          	sel: "x-app",
          	apiVersion: 63
          });
          var app_default = __lwc_component_class_internal;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/main.js
          const container = document.getElementById("main");
          const element = createElement("x-app", { is: app_default });
          container.appendChild(element);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/main.js",
                  "fileName": "main.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.scoped.css?scoped=true",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/main.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/main.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/scoped-styles/src/x/app/app.scoped.css?scoped=true": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "main",
                  "preliminaryFileName": "main.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "main.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        'should emit a warning when import stylesheet file is missing',
        async ({ expect }) => {
            await expect(runRollup('missing-css/missing-css.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, registerComponent as _registerComponent } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/stylesheet.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/missing-css.js
          var MissingCss = class extends LightningElement {};
          MissingCss.stylesheets = [default$1];
          const __lwc_component_class_internal = _registerComponent(MissingCss, {
          	tmpl: empty_html_default,
          	sel: "fixtures-missing-css",
          	apiVersion: 63
          });
          var missing_css_default = __lwc_component_class_internal;

          //#endregion
          export { missing_css_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/missing-css.js",
                  "fileName": "missing-css.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_html.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/stylesheet.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/missing-css.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/missing-css.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/stylesheet.css": {},
                    "@lwc/resources/empty_html.js": {},
                  },
                  "name": "missing-css",
                  "preliminaryFileName": "missing-css.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "missing-css.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [
              {
                "code": "PLUGIN_WARNING",
                "message": "The imported CSS file /Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/missing-css/stylesheet.css does not exist: Importing it as undefined. This behavior may be removed in a future version of LWC. Please avoid importing a CSS file that does not exist.",
                "plugin": "rollup-plugin-lwc-compiler",
              },
            ],
          }
        `);
        }
    );

    it.concurrent(
        'should resolve the namespace and name to the alias value',
        async ({ expect }) => {
            await expect(runRollup('namespace/src/index.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.html
          const $fragment1 = parseFragment\`<span\${3}>I am foo!</span>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var foo_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-1hl7358i549";
          tmpl.legacyStylesheetToken = "x-foo_foo";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.js?specifier=alias%2Fbar
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: foo_default$1,
          	sel: "alias-bar",
          	apiVersion: 63
          });
          var foo_default = __lwc_component_class_internal;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/index.js
          console.log(foo_default);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/index.js",
                  "fileName": "index.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.js?specifier=alias%2Fbar",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/index.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/index.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/foo/foo.js?specifier=alias%2Fbar": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "index",
                  "preliminaryFileName": "index.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "index.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        'should use directory to resolve the namespace and name for invalid alias specifier',
        async ({ expect }) => {
            await expect(runRollup('namespace/src/invalid.js')).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, LightningElement as LightningElement$1, LightningElement as LightningElement$2, freezeTemplate, freezeTemplate as freezeTemplate$1, freezeTemplate as freezeTemplate$2, parseFragment, parseFragment as parseFragment$1, parseFragment as parseFragment$2, registerComponent as _registerComponent, registerComponent as _registerComponent$1, registerComponent as _registerComponent$2, registerTemplate, registerTemplate as registerTemplate$1, registerTemplate as registerTemplate$2 } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.html
          const $fragment1$2 = parseFragment$2\`<span\${3}>I am zoo!</span>\`;
          function tmpl$2($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1$2, 1)];
          }
          var zoo_default$1 = registerTemplate$2(tmpl$2);
          tmpl$2.stylesheets = [];
          tmpl$2.stylesheetToken = "lwc-2k8s9lhq7e9";
          tmpl$2.legacyStylesheetToken = "x-zoo_zoo";
          if (default$1) tmpl$2.stylesheets.push.apply(tmpl$2.stylesheets, default$1);
          if (default$1) tmpl$2.stylesheets.push.apply(tmpl$2.stylesheets, default$1);
          freezeTemplate$2(tmpl$2);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.js
          const __lwc_component_class_internal$2 = _registerComponent$2(class extends LightningElement$2 {}, {
          	tmpl: zoo_default$1,
          	sel: "x-zoo",
          	apiVersion: 63
          });
          var zoo_default = __lwc_component_class_internal$2;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.html
          const $fragment1$1 = parseFragment$1\`<span\${3}>I am baz!</span>\`;
          function tmpl$1($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1$1, 1)];
          }
          var baz_default$1 = registerTemplate$1(tmpl$1);
          tmpl$1.stylesheets = [];
          tmpl$1.stylesheetToken = "lwc-5ddkuotdiv0";
          tmpl$1.legacyStylesheetToken = "x-baz_baz";
          if (default$1) tmpl$1.stylesheets.push.apply(tmpl$1.stylesheets, default$1);
          if (default$1) tmpl$1.stylesheets.push.apply(tmpl$1.stylesheets, default$1);
          freezeTemplate$1(tmpl$1);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.js
          const __lwc_component_class_internal$1 = _registerComponent$1(class extends LightningElement$1 {}, {
          	tmpl: baz_default$1,
          	sel: "x-baz",
          	apiVersion: 63
          });
          var baz_default = __lwc_component_class_internal$1;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.html
          const $fragment1 = parseFragment\`<span\${3}>I am quux!</span>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var quux_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-6bq3gd9av7s";
          tmpl.legacyStylesheetToken = "x-quux_quux";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.js
          const __lwc_component_class_internal = _registerComponent(class extends LightningElement {}, {
          	tmpl: quux_default$1,
          	sel: "x-quux",
          	apiVersion: 63
          });
          var quux_default = __lwc_component_class_internal;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/invalid.js
          console.log(zoo_default);
          console.log(baz_default);
          console.log(quux_default);

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/invalid.js",
                  "fileName": "invalid.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/invalid.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/invalid.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/baz/baz.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/quux/quux.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/namespace/src/modules/x/zoo/zoo.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "invalid",
                  "preliminaryFileName": "invalid.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "invalid.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        'should resolve inherited template for JavaScript component [#4233]',
        async ({ expect }) => {
            await expect(runRollup('inherited-templates/src/javascript.js')).resolves
                .toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, registerComponent as _registerComponent, registerComponent as _registerComponent$1, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_html.js
          var empty_html_default = void 0;

          //#endregion
          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.html
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { t: api_text } = $api;
          	return [api_text("all your base")];
          }
          var base_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-1t26s9d2o8l";
          tmpl.legacyStylesheetToken = "x-base_base";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.js
          const __lwc_component_class_internal$1 = _registerComponent$1(class extends LightningElement {}, {
          	tmpl: base_default$1,
          	sel: "x-base",
          	apiVersion: 63
          });
          var base_default = __lwc_component_class_internal$1;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/ext-js/ext-js.js
          const __lwc_component_class_internal = _registerComponent(class extends base_default {}, {
          	tmpl: empty_html_default,
          	sel: "x-ext-js",
          	apiVersion: 63
          });

          //#endregion",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/javascript.js",
                  "fileName": "javascript.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_html.js",
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/ext-js/ext-js.js",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/javascript.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/javascript.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/base/base.js": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/modules/x/ext-js/ext-js.js": {},
                    "@lwc/resources/empty_css.css": {},
                    "@lwc/resources/empty_html.js": {},
                  },
                  "name": "javascript",
                  "preliminaryFileName": "javascript.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "javascript.css",
                  "name": undefined,
                  "originalFileName": null,
                  "source": "export default undefined
          ",
                  "type": "asset",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );

    it.concurrent(
        'should resolve inherited template for TypeScript component [#4233]',
        async ({ expect }) => {
            await expect(runRollup('inherited-templates/src/typescript.ts')).resolves
                .toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "",
                  "dynamicImports": [],
                  "exports": [],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/typescript.ts",
                  "fileName": "typescript.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/typescript.ts",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/resolver/fixtures/inherited-templates/src/typescript.ts": {},
                  },
                  "name": "typescript",
                  "preliminaryFileName": "typescript.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
              ],
            },
            "warnings": [],
          }
        `);
        }
    );
});
