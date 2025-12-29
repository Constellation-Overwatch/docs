import { r as reactExports, j as jsxRuntimeExports } from "./worker-entry-CaO_sJbc.js";
import { u as useI18n, a as useDocsSearch, b as useOnChange, S as SearchDialog, c as SearchDialogOverlay, d as SearchDialogContent, e as SearchDialogHeader, f as SearchDialogIcon, g as SearchDialogInput, h as SearchDialogClose, i as SearchDialogList, j as SearchDialogFooter, T as TagsList, k as TagsListItem } from "./router-C0K6BgM3.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
import "./staticFunctionMiddleware-vKLtSUic.js";
import "path";
import "node:path";
function DefaultSearchDialog({ defaultTag, tags = [], api, delayMs, type = "fetch", allowClear = false, links = [], footer, ...props }) {
  const { locale } = useI18n();
  const [tag, setTag] = reactExports.useState(defaultTag);
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
  const defaultItems = reactExports.useMemo(() => {
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
  return jsxRuntimeExports.jsxs(SearchDialog, { search, onSearchChange: setSearch, isLoading: query.isLoading, ...props, children: [jsxRuntimeExports.jsx(SearchDialogOverlay, {}), jsxRuntimeExports.jsxs(SearchDialogContent, { children: [jsxRuntimeExports.jsxs(SearchDialogHeader, { children: [jsxRuntimeExports.jsx(SearchDialogIcon, {}), jsxRuntimeExports.jsx(SearchDialogInput, {}), jsxRuntimeExports.jsx(SearchDialogClose, {})] }), jsxRuntimeExports.jsx(SearchDialogList, { items: query.data !== "empty" ? query.data : defaultItems })] }), jsxRuntimeExports.jsxs(SearchDialogFooter, { children: [tags.length > 0 && jsxRuntimeExports.jsx(TagsList, { tag, onTagChange: setTag, allowClear, children: tags.map((tag2) => jsxRuntimeExports.jsx(TagsListItem, { value: tag2.value, children: tag2.name }, tag2.value)) }), footer] })] });
}
export {
  DefaultSearchDialog as default
};
