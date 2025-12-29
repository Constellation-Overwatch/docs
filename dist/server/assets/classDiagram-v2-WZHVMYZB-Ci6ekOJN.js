import { s as styles_default, c as classRenderer_v3_unified_default, a as classDiagram_default, C as ClassDB } from "./chunk-B4BG7PRW-DCL7IVuU.js";
import { _ as __name } from "./mermaid.core-CYQiQoE6.js";
import "./chunk-FMBD7UC4-B9sh-Gqq.js";
import "./chunk-55IACEB6-ByqI4IFS.js";
import "./chunk-QN33PNHL-D8OqhSUK.js";
import "./worker-entry-CaO_sJbc.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
var diagram = {
  parser: classDiagram_default,
  get db() {
    return new ClassDB();
  },
  renderer: classRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
