import { a0 as createContentHighlighter, a1 as removeUndefined } from "./router-CiJ9azvI.js";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "react";
import "@radix-ui/react-direction";
import "next-themes";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "scroll-into-view-if-needed";
import "@orama/orama";
import "../server.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3-v2";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
import "./staticFunctionMiddleware-3EePvBPZ.js";
import "path";
import "lucide-react";
import "fumadocs-mdx/runtime/server";
import "node:fs/promises";
import "node:path";
import "fumadocs-mdx/runtime/browser";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-presence";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "@radix-ui/react-navigation-menu";
async function searchDocs(query, options) {
  const highlighter = createContentHighlighter(query);
  const list = [];
  const { index = "default", client, params: extraParams, tag } = options;
  if (index === "crawler") {
    const result2 = await client.search({
      datasources: [],
      ...extraParams,
      term: query,
      where: {
        category: tag ? {
          eq: tag.slice(0, 1).toUpperCase() + tag.slice(1)
        } : void 0,
        ...extraParams?.where
      },
      limit: 10
    });
    if (!result2) return list;
    for (const hit of result2.hits) {
      const doc = hit.document;
      list.push(
        {
          id: hit.id,
          type: "page",
          content: doc.title,
          contentWithHighlights: highlighter.highlight(doc.title),
          url: doc.path
        },
        {
          id: "page" + hit.id,
          type: "text",
          content: doc.content,
          contentWithHighlights: highlighter.highlight(doc.content),
          url: doc.path
        }
      );
    }
    return list;
  }
  const params = {
    datasources: [],
    ...extraParams,
    term: query,
    where: removeUndefined({
      tag,
      ...extraParams?.where
    }),
    groupBy: {
      properties: ["page_id"],
      max_results: 7,
      ...extraParams?.groupBy
    }
  };
  const result = await client.search(params);
  if (!result || !result.groups) return list;
  for (const item of result.groups) {
    let addedHead = false;
    for (const hit of item.result) {
      const doc = hit.document;
      if (!addedHead) {
        list.push({
          id: doc.page_id,
          type: "page",
          content: doc.title,
          breadcrumbs: doc.breadcrumbs,
          contentWithHighlights: highlighter.highlight(doc.title),
          url: doc.url
        });
        addedHead = true;
      }
      list.push({
        id: doc.id,
        content: doc.content,
        contentWithHighlights: highlighter.highlight(doc.content),
        type: doc.content === doc.section ? "heading" : "text",
        url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url
      });
    }
  }
  return list;
}
export {
  searchDocs
};
