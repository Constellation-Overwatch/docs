import { jsxs, jsx } from "react/jsx-runtime";
import { K as useI18n, M as useDocsSearch, N as useOnChange, O as SearchDialog, P as SearchDialogOverlay, Q as SearchDialogContent, U as SearchDialogHeader, V as SearchDialogIcon, W as SearchDialogInput, X as SearchDialogClose, Y as SearchDialogList, Z as SearchDialogFooter, _ as TagsList, $ as TagsListItem } from "./router-CiJ9azvI.js";
import { useState, useMemo } from "react";
import "@tanstack/react-router";
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
function DefaultSearchDialog({ defaultTag, tags = [], api, delayMs, type = "fetch", allowClear = false, links = [], footer, ...props }) {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);
  const { search, setSearch, query } = useDocsSearch(type === "fetch" ? {
    type: "fetch",
    api,
    locale,
    tag,
    delayMs
  } : {
    type: "static",
    from: api,
    locale,
    tag,
    delayMs
  });
  const defaultItems = useMemo(() => {
    if (links.length === 0)
      return null;
    return links.map(([name, link]) => ({
      type: "page",
      id: name,
      content: name,
      url: link
    }));
  }, [links]);
  useOnChange(defaultTag, (v) => {
    setTag(v);
  });
  return jsxs(SearchDialog, { search, onSearchChange: setSearch, isLoading: query.isLoading, ...props, children: [jsx(SearchDialogOverlay, {}), jsxs(SearchDialogContent, { children: [jsxs(SearchDialogHeader, { children: [jsx(SearchDialogIcon, {}), jsx(SearchDialogInput, {}), jsx(SearchDialogClose, {})] }), jsx(SearchDialogList, { items: query.data !== "empty" ? query.data : defaultItems })] }), jsxs(SearchDialogFooter, { children: [tags.length > 0 && jsx(TagsList, { tag, onTagChange: setTag, allowClear, children: tags.map((tag2) => jsx(TagsListItem, { value: tag2.value, children: tag2.name }, tag2.value)) }), footer] })] });
}
export {
  DefaultSearchDialog as default
};
