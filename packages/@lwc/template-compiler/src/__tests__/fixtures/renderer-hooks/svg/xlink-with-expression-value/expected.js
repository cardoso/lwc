import _implicitStylesheets from "./xlink-with-expression-value.css";
import _implicitScopedStylesheets from "./xlink-with-expression-value.scoped.css?scoped=true";
import { freezeTemplate, registerTemplate, renderer } from "lwc";
const stc0 = {
  classMap: {
    "slds-icon": true,
  },
  attrs: {
    "aria-hidden": "true",
    title: "when needed",
  },
  key: 0,
  svg: true,
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const { fid: api_scoped_frag_id, h: api_element } = $api;
  return [
    api_element("svg", stc0, [
      api_element("use", {
        attrs: {
          "xlink:href": api_scoped_frag_id($cmp.getXLink),
        },
        key: 1,
        svg: true,
        renderer: renderer,
      }),
    ]),
  ];
  /*!/*LWC compiler vX.X.X*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-1n01u8vu8d9";
tmpl.legacyStylesheetToken =
  "x-xlink-with-expression-value_xlink-with-expression-value";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
