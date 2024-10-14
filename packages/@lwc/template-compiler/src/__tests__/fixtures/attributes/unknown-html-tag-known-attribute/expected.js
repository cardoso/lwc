import _implicitStylesheets from "./unknown-html-tag-known-attribute.css";
import _implicitScopedStylesheets from "./unknown-html-tag-known-attribute.scoped.css?scoped=true";
import { freezeTemplate, parseFragment, registerTemplate } from "lwc";
const $fragment1 = parseFragment`<somefancytag min="4"${3}></somefancytag>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const { st: api_static_fragment } = $api;
  return [api_static_fragment($fragment1, 1)];
  /*!/*LWC compiler vX.X.X*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-5vl7nbrekm";
tmpl.legacyStylesheetToken =
  "x-unknown-html-tag-known-attribute_unknown-html-tag-known-attribute";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
