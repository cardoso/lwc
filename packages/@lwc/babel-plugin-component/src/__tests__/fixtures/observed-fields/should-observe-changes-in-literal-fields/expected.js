import { registerDecorators as _registerDecorators, createElement, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./test.html";
class Test extends LightningElement {
  "a" = 0;
  1337 = 0;
  /*LWC compiler vX.X.X*/
}
_registerDecorators(Test, {
  fields: ["a", 1337]
});
const __lwc_component_class_internal = _registerComponent(Test, {
  tmpl: _tmpl,
  sel: "lwc-test",
  apiVersion: 9999999
});
export default __lwc_component_class_internal;