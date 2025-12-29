import { s as styles_default, b as stateRenderer_v3_unified_default, a as stateDiagram_default, S as StateDB } from "./chunk-DI55MBZ5-BRSqGvb7.js";
import { _ as __name } from "./mermaid.core-CYQiQoE6.js";
import "./chunk-55IACEB6-ByqI4IFS.js";
import "./chunk-QN33PNHL-D8OqhSUK.js";
import "./worker-entry-CaO_sJbc.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
var diagram = {
  parser: stateDiagram_default,
  get db() {
    return new StateDB(2);
  },
  renderer: stateRenderer_v3_unified_default,
  styles: styles_default,
  init: /* @__PURE__ */ __name((cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }, "init")
};
export {
  diagram
};
