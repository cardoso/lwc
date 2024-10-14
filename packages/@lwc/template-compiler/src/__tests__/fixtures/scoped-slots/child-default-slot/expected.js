import _implicitStylesheets from "./child-default-slot.css";
import _implicitScopedStylesheets from "./child-default-slot.scoped.css?scoped=true";
import { freezeTemplate, registerTemplate } from "lwc";
const stc0 = [];
function tmpl($api, $cmp, $slotset, $ctx) {
  const { s: api_slot } = $api;
  return [
    api_slot(
      "",
      {
        key: 0,
        slotData: $cmp.item,
      },
      stc0,
      $slotset
    ),
  ];
  /*!/*LWC compiler vX.X.X*/
}
export default registerTemplate(tmpl);
tmpl.slots = [""];
tmpl.renderMode = "light";
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-1fdico6s7m4";
tmpl.legacyStylesheetToken = "x-child-default-slot_child-default-slot";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
