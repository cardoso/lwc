import _implicitStylesheets from "./svg.css";
import _implicitScopedStylesheets from "./svg.scoped.css?scoped=true";
import {
  freezeTemplate,
  parseFragment,
  registerTemplate,
  sanitizeAttribute,
} from "lwc";
const $fragment1 = parseFragment`<svg viewBox="0 0 5 5" aria-hidden="true" class="slds-button__icon${0}"${2}><use${"a1:xlink:href"}${3}/></svg>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const { sp: api_static_part, st: api_static_fragment } = $api;
  return [
    api_static_fragment($fragment1, 1, [
      api_static_part(
        1,
        {
          attrs: {
            "xlink:href": sanitizeAttribute(
              "use",
              "http://www.w3.org/2000/svg",
              "xlink:href",
              "/x"
            ),
          },
        },
        null
      ),
    ]),
  ];
  /*!/*LWC compiler vX.X.X*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-3j142gdvja7";
tmpl.legacyStylesheetToken = "x-svg_svg";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
