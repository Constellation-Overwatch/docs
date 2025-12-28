import { a as createServerRpc, c as createServerFn } from "../server.js";
import { notFound } from "@tanstack/react-router";
import { s as staticFunctionMiddleware, a as source } from "./staticFunctionMiddleware-3EePvBPZ.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "path";
import "lucide-react";
import "react";
import "fumadocs-mdx/runtime/server";
import "node:fs/promises";
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
