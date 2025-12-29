import { c as createServerRpc, a as createServerFn, n as notFound } from "./worker-entry-CaO_sJbc.js";
import { s as staticFunctionMiddleware, a as source } from "./staticFunctionMiddleware-vKLtSUic.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
import "path";
import "node:path";
const loader_createServerFn_handler = createServerRpc("3dffc64eabe29fc8f5f4021f5e1cdf4bfea9319ffba3a59848ead9dcd2fa0308", (opts, signal) => {
  return loader.__executeServer(opts, signal);
});
const loader = createServerFn({
  method: "GET"
}).inputValidator((slugs) => slugs).middleware([staticFunctionMiddleware]).handler(loader_createServerFn_handler, async ({
  data: slugs
}) => {
  const page = source.getPage(slugs);
  if (!page) throw notFound();
  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.pageTree)
  };
});
export {
  loader_createServerFn_handler
};
