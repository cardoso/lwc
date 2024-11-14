/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { rolldown } from 'rolldown';

import lwc, { type RollupLwcOptions } from '../../index';

async function runRollup(
    pathname: string,
    options: RollupLwcOptions = {},
    { external = [] as string[] } = {}
) {
    const warnings: any[] = [];

    try {
        const bundle = await rolldown({
            input: path.resolve(__dirname, 'fixtures', pathname),
            plugins: [lwc(options)],
            external: ['lwc', ...external],
            logLevel: 'debug',
            shimMissingExports: true,
            onLog(...log) {
                warnings.push(log);
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

describe('templateConfig', () => {
    it.concurrent('compile with preserveHtmlComments option', async ({ expect }) => {
        await expect(
            runRollup('test/test.js', {
                preserveHtmlComments: true,
            })
        ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css
          var default$2 = void 0;

          //#endregion
          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html
          const $fragment1 = parseFragment\`<div class="container\${0}"\${2}></div>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { co: api_comment, st: api_static_fragment } = $api;
          	return [api_comment(" Application container "), api_static_fragment($fragment1, 1)];
          }
          var test_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-15qa22ocglk";
          tmpl.legacyStylesheetToken = "fixtures-test_test";
          if (default$2) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$2);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js
          var Test = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(Test, {
          	tmpl: test_default$1,
          	sel: "fixtures-test",
          	apiVersion: 63
          });
          var test_default = __lwc_component_class_internal;

          //#endregion
          export { test_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js",
                  "fileName": "test.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css",
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js": {},
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
                  "source": "function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
            var shadowSelector = token ? ("[" + token + "]") : "";
            var hostSelector = token ? ("[" + token + "-host]") : "";
            var suffixToken = token ? ("-" + token) : "";
            return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "color: var(--my-color);}";
            /*LWC compiler v8.8.0*/
          }
          export default [stylesheet];
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

    it('should accept disableSyntheticShadowSupport config flag', async () => {
        await expect(
            runRollup('test/test.js', {
                disableSyntheticShadowSupport: true,
            })
        ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerTemplate } from "lwc";

          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css
          var default$2 = void 0;

          //#endregion
          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html
          const $fragment1 = parseFragment\`<div class="container\${0}"\${2}></div>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var test_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-15qa22ocglk";
          tmpl.legacyStylesheetToken = "fixtures-test_test";
          if (default$2) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$2);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js
          var Test = class extends LightningElement {};
          const __lwc_component_class_internal = _registerComponent(Test, {
          	tmpl: test_default$1,
          	sel: "fixtures-test",
          	apiVersion: 63
          });
          var test_default = __lwc_component_class_internal;

          //#endregion
          export { test_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js",
                  "fileName": "test.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css",
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.css": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/test/test.js": {},
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
                  "source": "function stylesheet() {
            var token;
            var useActualHostSelector = true;
            var useNativeDirPseudoclass = true;
            var shadowSelector = token ? ("[" + token + "]") : "";
            var hostSelector = token ? ("[" + token + "-host]") : "";
            var suffixToken = token ? ("-" + token) : "";
            return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "color: var(--my-color);}";
            /*LWC compiler v8.8.0*/
          }
          stylesheet.$nativeOnly$ = true;
          export default [stylesheet];
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

    it('should accept enableDynamicComponents config flag', async () => {
        await expect(
            runRollup('dynamicComponent/dynamicComponent.js', {
                enableDynamicComponents: true,
            })
        ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, registerComponent as _registerComponent, registerDecorators as _registerDecorators, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.html
          const stc0 = { key: 0 };
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { dc: api_dynamic_component } = $api;
          	return [api_dynamic_component($cmp.ctor, stc0)];
          }
          var dynamicComponent_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-qnmg4j4lfb";
          tmpl.legacyStylesheetToken = "fixtures-dynamicComponent_dynamicComponent";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.js
          const __lwc_component_class_internal = _registerComponent(_registerDecorators(class extends LightningElement {
          	constructor(...args) {
          		super(...args);
          		this.ctor = void 0;
          	}
          }, { fields: ["ctor"] }), {
          	tmpl: dynamicComponent_default$1,
          	sel: "fixtures-dynamic-component",
          	apiVersion: 63
          });
          var dynamicComponent_default = __lwc_component_class_internal;

          //#endregion
          export { dynamicComponent_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.js",
                  "fileName": "dynamicComponent.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicComponent/dynamicComponent.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "dynamicComponent",
                  "preliminaryFileName": "dynamicComponent.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "dynamicComponent.css",
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

    it('should accept experimentalDynamicDirective config flag', async () => {
        await expect(
            runRollup('experimentalDynamic/experimentalDynamic.js', {
                experimentalDynamicDirective: true,
            })
        ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, registerComponent as _registerComponent, registerDecorators as _registerDecorators, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.html
          const stc0 = { key: 0 };
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { ddc: api_deprecated_dynamic_component } = $api;
          	return [api_deprecated_dynamic_component("lwc-dynamic", $cmp.ctor, stc0)];
          }
          var experimentalDynamic_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-69aaspcao75";
          tmpl.legacyStylesheetToken = "fixtures-experimentalDynamic_experimentalDynamic";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.js
          const __lwc_component_class_internal = _registerComponent(_registerDecorators(class extends LightningElement {
          	constructor(...args) {
          		super(...args);
          		this.ctor = void 0;
          	}
          }, { fields: ["ctor"] }), {
          	tmpl: experimentalDynamic_default$1,
          	sel: "fixtures-experimental-dynamic",
          	apiVersion: 63
          });
          var experimentalDynamic_default = __lwc_component_class_internal;

          //#endregion
          export { experimentalDynamic_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.js",
                  "fileName": "experimentalDynamic.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "experimentalDynamic",
                  "preliminaryFileName": "experimentalDynamic.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "experimentalDynamic.css",
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
                  "frame": "<lwc-dynamic lwc:dynamic={ctor}></lwc-dynamic>",
                  "hook": "transform",
                  "id": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.html",
                  "loc": {
                    "column": 5,
                    "file": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/experimentalDynamic/experimentalDynamic.html",
                    "line": 2,
                  },
                  "message": "@lwc/rollup-plugin: LWC1187: The lwc:dynamic directive is deprecated and will be removed in a future release. Please use lwc:is instead.",
                  "plugin": "rollup-plugin-lwc-compiler",
                  "pluginCode": "LWC1187",
                },
                [Function],
              ],
            ],
          }
        `);
    });
});

describe('javaScriptConfig', () => {
    it.concurrent('should accept experimentalDynamicComponent config flag', async ({ expect }) => {
        const CUSTOM_LOADER = '@salesforce/loader';
        await expect(
            runRollup(
                'dynamicImportConfig/dynamicImportConfig.js',
                {
                    experimentalDynamicComponent: { loader: CUSTOM_LOADER, strictSpecifier: true },
                },
                {
                    external: [CUSTOM_LOADER],
                }
            )
        ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { load as _load } from "@salesforce/loader";
          import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerDecorators as _registerDecorators, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.html
          const $fragment1 = parseFragment\`<span\${3}>hello world</span>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var dynamicImportConfig_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-jsn28j28fv";
          tmpl.legacyStylesheetToken = "fixtures-dynamicImportConfig_dynamicImportConfig";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.js
          const __lwc_component_class_internal = _registerComponent(_registerDecorators(class extends LightningElement {
          	constructor(...args) {
          		super(...args);
          		this.lazyCtor = void 0;
          	}
          	async connectedCallback() {
          		const { default: ctor } = await _load("test");
          		this.lazyCtor = ctor;
          	}
          }, { fields: ["lazyCtor"] }), {
          	tmpl: dynamicImportConfig_default$1,
          	sel: "fixtures-dynamic-import-config",
          	apiVersion: 63
          });
          var dynamicImportConfig_default = __lwc_component_class_internal;

          //#endregion
          export { dynamicImportConfig_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.js",
                  "fileName": "dynamicImportConfig.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/dynamicImportConfig/dynamicImportConfig.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "dynamicImportConfig",
                  "preliminaryFileName": "dynamicImportConfig.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "dynamicImportConfig.css",
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
});

describe('lwsConfig', () => {
    it.concurrent(
        'should accept enableLightningWebSecurityTransforms config flag',
        async ({ expect }) => {
            await expect(
                runRollup('lightningWebSecurityTransforms/lightningWebSecurityTransforms.js', {
                    enableLightningWebSecurityTransforms: true,
                })
            ).resolves.toMatchInlineSnapshot(`
          {
            "bundle": RolldownBuild {},
            "output": {
              "output": [
                {
                  "code": "import { LightningElement, freezeTemplate, parseFragment, registerComponent as _registerComponent, registerDecorators as _registerDecorators, registerTemplate } from "lwc";

          //#region @lwc/resources/empty_css.css
          var default$1 = void 0;

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.html
          const $fragment1 = parseFragment\`<span\${3}>hello world</span>\`;
          function tmpl($api, $cmp, $slotset, $ctx) {
          	const { st: api_static_fragment } = $api;
          	return [api_static_fragment($fragment1, 1)];
          }
          var lightningWebSecurityTransforms_default$1 = registerTemplate(tmpl);
          tmpl.stylesheets = [];
          tmpl.stylesheetToken = "lwc-31qcfk49nrq";
          tmpl.legacyStylesheetToken = "fixtures-lightningWebSecurityTransforms_lightningWebSecurityTransforms";
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          if (default$1) tmpl.stylesheets.push.apply(tmpl.stylesheets, default$1);
          freezeTemplate(tmpl);

          //#endregion
          //#region packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.js
          function asyncGeneratorStep(n, t, e, r, o, a, c) {
          	try {
          		var i = n[a](c), u = i.value;
          	} catch (n$1) {
          		return void e(n$1);
          	}
          	i.done ? t(u) : Promise.resolve(u).then(r, o);
          }
          function _asyncToGenerator(n) {
          	return function() {
          		var t = this, e = arguments;
          		return new Promise(function(r, o) {
          			var a = n.apply(t, e);
          			function _next(n$1) {
          				asyncGeneratorStep(a, r, o, _next, _throw, "next", n$1);
          			}
          			function _throw(n$1) {
          				asyncGeneratorStep(a, r, o, _next, _throw, "throw", n$1);
          			}
          			_next(void 0);
          		});
          	};
          }
          function _wrapAsyncGenerator(e) {
          	return function() {
          		return new AsyncGenerator(e.apply(this, arguments));
          	};
          }
          function AsyncGenerator(e) {
          	var r, t;
          	function resume(r$1, t$1) {
          		try {
          			var n = e[r$1](t$1), o = n.value, u = o instanceof _OverloadYield;
          			Promise.resolve(u ? o.v : o).then(function(t$2) {
          				if (u) {
          					var i = "return" === r$1 ? "return" : "next";
          					if (!o.k || t$2.done) return resume(i, t$2);
          					t$2 = e[i](t$2).value;
          				}
          				settle(n.done ? "return" : "normal", t$2);
          			}, function(e$1) {
          				resume("throw", e$1);
          			});
          		} catch (e$1) {
          			settle("throw", e$1);
          		}
          	}
          	function settle(e$1, n) {
          		switch (e$1) {
          			case "return":
          				r.resolve({
          					value: n,
          					done: !0
          				});
          				break;
          			case "throw":
          				r.reject(n);
          				break;
          			default: r.resolve({
          				value: n,
          				done: !1
          			});
          		}
          		(r = r.next) ? resume(r.key, r.arg) : t = null;
          	}
          	this._invoke = function(e$1, n) {
          		return new Promise(function(o, u) {
          			var i = {
          				key: e$1,
          				arg: n,
          				resolve: o,
          				reject: u,
          				next: null
          			};
          			t ? t = t.next = i : (r = t = i, resume(e$1, n));
          		});
          	}, "function" != typeof e.return && (this.return = void 0);
          }
          AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
          	return this;
          }, AsyncGenerator.prototype.next = function(e) {
          	return this._invoke("next", e);
          }, AsyncGenerator.prototype.throw = function(e) {
          	return this._invoke("throw", e);
          }, AsyncGenerator.prototype.return = function(e) {
          	return this._invoke("return", e);
          };
          function _OverloadYield(e, d) {
          	this.v = e, this.k = d;
          }
          function _asyncIterator(r) {
          	var n, t, o, e = 2;
          	for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
          		if (t && null != (n = r[t])) return n.call(r);
          		if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
          		t = "@@asyncIterator", o = "@@iterator";
          	}
          	throw new TypeError("Object is not async iterable");
          }
          function AsyncFromSyncIterator(r) {
          	function AsyncFromSyncIteratorContinuation(r$1) {
          		if (Object(r$1) !== r$1) return Promise.reject(new TypeError(r$1 + " is not an object."));
          		var n = r$1.done;
          		return Promise.resolve(r$1.value).then(function(r$2) {
          			return {
          				value: r$2,
          				done: n
          			};
          		});
          	}
          	return AsyncFromSyncIterator = function(r$1) {
          		this.s = r$1, this.n = r$1.next;
          	}, AsyncFromSyncIterator.prototype = {
          		s: null,
          		n: null,
          		next: function() {
          			return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
          		},
          		return: function(r$1) {
          			var n = this.s.return;
          			return void 0 === n ? Promise.resolve({
          				value: r$1,
          				done: !0
          			}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
          		},
          		throw: function(r$1) {
          			var n = this.s.return;
          			return void 0 === n ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
          		}
          	}, new AsyncFromSyncIterator(r);
          }
          const __lwc_component_class_internal = _registerComponent(_registerDecorators(class extends LightningElement {
          	constructor(...args) {
          		super(...args);
          		this.test = (window === globalThis || window === document ? location : window.location).href;
          	}
          	foo() {
          		return _asyncToGenerator(function* () {
          			yield bar();
          		})();
          	}
          	bar() {
          		return _asyncToGenerator(function* () {
          			var _iteratorAbruptCompletion = false;
          			var _didIteratorError = false;
          			var _iteratorError;
          			try {
          				for (var _iterator = _asyncIterator(baz()), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
          					const num = _step.value;
          					break;
          				}
          			} catch (err) {
          				_didIteratorError = true;
          				_iteratorError = err;
          			} finally {
          				try {
          					if (_iteratorAbruptCompletion && _iterator.return != null) yield _iterator.return();
          				} finally {
          					if (_didIteratorError) throw _iteratorError;
          				}
          			}
          		})();
          	}
          	baz() {
          		return _wrapAsyncGenerator(function* () {
          			yield 1;
          			yield 2;
          		})();
          	}
          }, { fields: ["test"] }), {
          	tmpl: lightningWebSecurityTransforms_default$1,
          	sel: "fixtures-lightning-web-security-transforms",
          	apiVersion: 63
          });
          var lightningWebSecurityTransforms_default = __lwc_component_class_internal;

          //#endregion
          export { lightningWebSecurityTransforms_default as default };",
                  "dynamicImports": [],
                  "exports": [
                    "default",
                  ],
                  "facadeModuleId": "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.js",
                  "fileName": "lightningWebSecurityTransforms.js",
                  "imports": [],
                  "isDynamicEntry": false,
                  "isEntry": true,
                  "map": null,
                  "moduleIds": [
                    "@lwc/resources/empty_css.css",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.html",
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.js",
                  ],
                  "modules": {
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.html": {},
                    "/Users/cardoso/Documents/salesforce/lwc/packages/@lwc/rollup-plugin/src/__tests__/compilerConfig/fixtures/lightningWebSecurityTransforms/lightningWebSecurityTransforms.js": {},
                    "@lwc/resources/empty_css.css": {},
                  },
                  "name": "lightningWebSecurityTransforms",
                  "preliminaryFileName": "lightningWebSecurityTransforms.js",
                  "sourcemapFileName": null,
                  "type": "chunk",
                },
                {
                  "fileName": "lightningWebSecurityTransforms.css",
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
});
