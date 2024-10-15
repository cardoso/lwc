import _implicitStylesheets from "./parenthesis.css";
import _implicitScopedStylesheets from "./parenthesis.scoped.css?scoped=true";
import { freezeTemplate, parseFragment, registerTemplate } from "lwc";
const $fragment1 = parseFragment`<div${3}>${"t1"}</div>`;
const $fragment2 = parseFragment`<div${3}>${"t1"}</div>`;
const $fragment3 = parseFragment`<div${3}>${"t1"}</div>`;
const $fragment4 = parseFragment`<div${3}>${"t1"}</div>`;
const $fragment5 = parseFragment`<div${3}>${"t1"}</div>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    d: api_dynamic_text,
    sp: api_static_part,
    st: api_static_fragment,
  } = $api;
  return [
    api_static_fragment($fragment1, 1, [
      api_static_part(1, null, api_dynamic_text($cmp.foo)),
    ]),
    api_static_fragment($fragment2, 3, [
      api_static_part(1, null, api_dynamic_text($cmp.foo)),
    ]),
    api_static_fragment($fragment3, 5, [
      api_static_part(1, null, api_dynamic_text($cmp.foo.bar)),
    ]),
    api_static_fragment($fragment4, 7, [
      api_static_part(1, null, api_dynamic_text($cmp.foo.bar)),
    ]),
    api_static_fragment($fragment5, 9, [
      api_static_part(1, null, api_dynamic_text($cmp.foo.bar)),
    ]),
  ];
  /*@preserve LWC compiler vX.X.X*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6uuifvb6qqe";
tmpl.legacyStylesheetToken = "x-parenthesis_parenthesis";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
