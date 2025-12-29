import { r as reactExports, j as jsxRuntimeExports } from "./worker-entry-CaO_sJbc.js";
import { p as useTreeContext, q as useTreePath, B as Base, t as SidebarContent$1, v as twMerge, w as mergeRefs, x as Sidebar$1, y as buttonVariants, z as SearchToggle, A as SidebarDrawerOverlay, C as SidebarDrawerContent, D as useFolderDepth, E as SidebarFolderContent$1, F as SidebarFolderLink$1, G as cva, I as useFolder, J as SidebarFolderTrigger$1, K as SidebarSeparator$1, M as SidebarItem$1, N as resolveLinkItems, O as TreeContextProvider, P as LayoutContextProvider, Q as LayoutBody, U as LayoutHeader, V as renderTitleNav, W as LayoutTabs, X as LargeSearchToggle, Y as SidebarTabsDropdown, Z as LanguageToggle, _ as Languages, $ as LinkItem, a0 as ThemeToggle, a1 as LanguageToggleText, a2 as Route, a3 as browserCollections, a4 as DocsPage, a5 as DocsTitle, a6 as DocsDescription, a7 as DocsBody, a8 as Mermaid, a9 as defaultMdxComponents } from "./router-C0K6BgM3.js";
import { b as baseOptions } from "./layout.shared-CvZbSMCY.js";
import { v as visit, R as Rocket, Z as Zap, D as DollarSign, c as Database } from "./staticFunctionMiddleware-vKLtSUic.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
import "path";
import "node:path";
function createPageTreeRenderer({ SidebarFolder: SidebarFolder2, SidebarFolderContent: SidebarFolderContent2, SidebarFolderLink: SidebarFolderLink2, SidebarFolderTrigger: SidebarFolderTrigger2, SidebarSeparator: SidebarSeparator2, SidebarItem: SidebarItem2 }) {
  function PageTreeFolder({ item, children }) {
    const path = useTreePath();
    return jsxRuntimeExports.jsxs(SidebarFolder2, { collapsible: item.collapsible, active: path.includes(item), defaultOpen: item.defaultOpen, children: [item.index ? jsxRuntimeExports.jsxs(SidebarFolderLink2, { href: item.index.url, external: item.index.external, children: [item.icon, item.name] }) : jsxRuntimeExports.jsxs(SidebarFolderTrigger2, { children: [item.icon, item.name] }), jsxRuntimeExports.jsx(SidebarFolderContent2, { children })] });
  }
  return function SidebarPageTree2(components) {
    const { root } = useTreeContext();
    const { Separator, Item, Folder = PageTreeFolder } = components;
    return reactExports.useMemo(() => {
      function renderSidebarList(items) {
        return items.map((item, i) => {
          if (item.type === "separator") {
            if (Separator)
              return jsxRuntimeExports.jsx(Separator, { item }, i);
            return jsxRuntimeExports.jsxs(SidebarSeparator2, { children: [item.icon, item.name] }, i);
          }
          if (item.type === "folder") {
            return jsxRuntimeExports.jsx(Folder, { item, children: renderSidebarList(item.children) }, i);
          }
          if (Item)
            return jsxRuntimeExports.jsx(Item, { item }, item.url);
          return jsxRuntimeExports.jsx(SidebarItem2, { href: item.url, external: item.external, icon: item.icon, children: item.name }, item.url);
        });
      }
      return jsxRuntimeExports.jsx(reactExports.Fragment, { children: renderSidebarList(root.children) }, root.$id);
    }, [Folder, Item, Separator, root]);
  };
}
function createLinkItemRenderer({ SidebarFolder: SidebarFolder2, SidebarFolderContent: SidebarFolderContent2, SidebarFolderLink: SidebarFolderLink2, SidebarFolderTrigger: SidebarFolderTrigger2, SidebarItem: SidebarItem2 }) {
  return function SidebarLinkItem2({ item, ...props }) {
    if (item.type === "custom")
      return jsxRuntimeExports.jsx("div", { ...props, children: item.children });
    if (item.type === "menu")
      return jsxRuntimeExports.jsxs(SidebarFolder2, { ...props, children: [item.url ? jsxRuntimeExports.jsxs(SidebarFolderLink2, { href: item.url, external: item.external, children: [item.icon, item.text] }) : jsxRuntimeExports.jsxs(SidebarFolderTrigger2, { children: [item.icon, item.text] }), jsxRuntimeExports.jsx(SidebarFolderContent2, { children: item.items.map((child, i) => jsxRuntimeExports.jsx(SidebarLinkItem2, { item: child }, i)) })] });
    return jsxRuntimeExports.jsx(SidebarItem2, { href: item.url, icon: item.icon, external: item.external, ...props, children: item.text });
  };
}
const itemVariants = cva("relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0", {
  variants: {
    variant: {
      link: "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors",
      button: "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none"
    },
    highlight: {
      true: "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:start-2.5"
    }
  }
});
function getItemOffset(depth) {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}
const { SidebarProvider: Sidebar, SidebarFolder, SidebarCollapseTrigger, SidebarViewport, SidebarTrigger } = Base;
function SidebarContent({ ref: refProp, className, children, ...props }) {
  const ref = reactExports.useRef(null);
  return jsxRuntimeExports.jsx(SidebarContent$1, { children: ({ collapsed, hovered, ref: asideRef, ...rest }) => jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsxs("div", { "data-sidebar-placeholder": "", className: "sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:268px] max-md:hidden", children: [collapsed && jsxRuntimeExports.jsx("div", { className: "absolute start-0 inset-y-0 w-4", ...rest }), jsxRuntimeExports.jsx("aside", { id: "nd-sidebar", ref: mergeRefs(ref, refProp, asideRef), "data-collapsed": collapsed, "data-hovered": collapsed && hovered, className: twMerge("absolute flex flex-col w-full start-0 inset-y-0 items-end bg-fd-card text-sm border-e duration-250 *:w-(--fd-sidebar-width)", collapsed && [
    "inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)",
    hovered ? "shadow-lg translate-x-2 rtl:-translate-x-2" : "-translate-x-(--fd-sidebar-width) rtl:translate-x-full"
  ], ref.current && ref.current.getAttribute("data-collapsed") === "true" !== collapsed && "transition-[width,inset-block,translate,background-color]", className), ...props, ...rest, children })] }), jsxRuntimeExports.jsxs("div", { "data-sidebar-panel": "", className: twMerge("fixed flex top-[calc(--spacing(4)+var(--fd-docs-row-3))] start-4 shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10", (!collapsed || hovered) && "pointer-events-none opacity-0"), children: [jsxRuntimeExports.jsx(SidebarCollapseTrigger, { className: twMerge(buttonVariants({
    color: "ghost",
    size: "icon-sm",
    className: "rounded-lg"
  })), children: jsxRuntimeExports.jsx(Sidebar$1, {}) }), jsxRuntimeExports.jsx(SearchToggle, { className: "rounded-lg", hideIfDisabled: true })] })] }) });
}
function SidebarDrawer({ children, className, ...props }) {
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsx(SidebarDrawerOverlay, { className: "fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" }), jsxRuntimeExports.jsx(SidebarDrawerContent, { className: twMerge("fixed text-[0.9375rem] flex flex-col shadow-lg border-s end-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out", className), ...props, children })] });
}
function SidebarSeparator({ className, style, children, ...props }) {
  const depth = useFolderDepth();
  return jsxRuntimeExports.jsx(SidebarSeparator$1, { className: twMerge("[&_svg]:size-4 [&_svg]:shrink-0", className), style: {
    paddingInlineStart: getItemOffset(depth),
    ...style
  }, ...props, children });
}
function SidebarItem({ className, style, children, ...props }) {
  const depth = useFolderDepth();
  return jsxRuntimeExports.jsx(SidebarItem$1, { className: twMerge(itemVariants({ variant: "link", highlight: depth >= 1 }), className), style: {
    paddingInlineStart: getItemOffset(depth),
    ...style
  }, ...props, children });
}
function SidebarFolderTrigger({ className, style, ...props }) {
  const { depth, collapsible } = useFolder();
  return jsxRuntimeExports.jsx(SidebarFolderTrigger$1, { className: twMerge(itemVariants({ variant: collapsible ? "button" : null }), "w-full", className), style: {
    paddingInlineStart: getItemOffset(depth - 1),
    ...style
  }, ...props, children: props.children });
}
function SidebarFolderLink({ className, style, ...props }) {
  const depth = useFolderDepth();
  return jsxRuntimeExports.jsx(SidebarFolderLink$1, { className: twMerge(itemVariants({ variant: "link", highlight: depth > 1 }), "w-full", className), style: {
    paddingInlineStart: getItemOffset(depth - 1),
    ...style
  }, ...props, children: props.children });
}
function SidebarFolderContent({ className, children, ...props }) {
  const depth = useFolderDepth();
  return jsxRuntimeExports.jsx(SidebarFolderContent$1, { className: twMerge("relative", depth === 1 && "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5", className), ...props, children });
}
const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator
});
const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem
});
const defaultTransform = (option, node) => {
  if (!node.icon)
    return option;
  return {
    ...option,
    icon: jsxRuntimeExports.jsx("div", { className: "size-full [&_svg]:size-full max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary", children: node.icon })
  };
};
function getSidebarTabs(tree, { transform = defaultTransform } = {}) {
  const results = [];
  function scanOptions(node, unlisted) {
    if ("root" in node && node.root) {
      const urls = getFolderUrls(node);
      if (urls.size > 0) {
        const option = {
          url: urls.values().next().value ?? "",
          title: node.name,
          icon: node.icon,
          unlisted,
          description: node.description,
          urls
        };
        const mapped = transform ? transform(option, node) : option;
        if (mapped)
          results.push(mapped);
      }
    }
    for (const child of node.children) {
      if (child.type === "folder")
        scanOptions(child, unlisted);
    }
  }
  scanOptions(tree);
  if (tree.fallback)
    scanOptions(tree.fallback, true);
  return results;
}
function getFolderUrls(folder, output = /* @__PURE__ */ new Set()) {
  if (folder.index)
    output.add(folder.index.url);
  for (const child of folder.children) {
    if (child.type === "page" && !child.external)
      output.add(child.url);
    if (child.type === "folder")
      getFolderUrls(child, output);
  }
  return output;
}
function DocsLayout({ nav: { transparentMode, ...nav } = {}, sidebar: { tabs: sidebarTabs, enabled: sidebarEnabled = true, defaultOpenLevel, prefetch, ...sidebarProps } = {}, searchToggle = {}, themeSwitch = {}, tabMode = "auto", i18n = false, children, tree, ...props }) {
  const tabs = reactExports.useMemo(() => {
    if (Array.isArray(sidebarTabs)) {
      return sidebarTabs;
    }
    if (typeof sidebarTabs === "object") {
      return getSidebarTabs(tree, sidebarTabs);
    }
    if (sidebarTabs !== false) {
      return getSidebarTabs(tree);
    }
    return [];
  }, [tree, sidebarTabs]);
  const links = resolveLinkItems(props);
  function sidebar() {
    const { footer, banner, collapsible = true, component, components, ...rest } = sidebarProps;
    if (component)
      return component;
    const iconLinks = links.filter((item) => item.type === "icon");
    const viewport = jsxRuntimeExports.jsxs(SidebarViewport, { children: [links.filter((v) => v.type !== "icon").map((item, i, list) => jsxRuntimeExports.jsx(SidebarLinkItem, { item, className: twMerge(i === list.length - 1 && "mb-4") }, i)), jsxRuntimeExports.jsx(SidebarPageTree, { ...components })] });
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [jsxRuntimeExports.jsxs(SidebarContent, { ...rest, children: [jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-4 pb-2", children: [jsxRuntimeExports.jsxs("div", { className: "flex", children: [renderTitleNav(nav, {
      className: "inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto"
    }), nav.children, collapsible && jsxRuntimeExports.jsx(SidebarCollapseTrigger, { className: twMerge(buttonVariants({
      color: "ghost",
      size: "icon-sm",
      className: "mb-auto text-fd-muted-foreground"
    })), children: jsxRuntimeExports.jsx(Sidebar$1, {}) })] }), searchToggle.enabled !== false && (searchToggle.components?.lg ?? jsxRuntimeExports.jsx(LargeSearchToggle, { hideIfDisabled: true })), tabs.length > 0 && tabMode === "auto" && jsxRuntimeExports.jsx(SidebarTabsDropdown, { options: tabs }), banner] }), viewport, (i18n || iconLinks.length > 0 || themeSwitch?.enabled !== false || footer) && jsxRuntimeExports.jsxs("div", { className: "flex flex-col border-t p-4 pt-2 empty:hidden", children: [jsxRuntimeExports.jsxs("div", { className: "flex text-fd-muted-foreground items-center empty:hidden", children: [i18n && jsxRuntimeExports.jsx(LanguageToggle, { children: jsxRuntimeExports.jsx(Languages, { className: "size-4.5" }) }), iconLinks.map((item, i) => jsxRuntimeExports.jsx(LinkItem, { item, className: twMerge(buttonVariants({ size: "icon-sm", color: "ghost" })), "aria-label": item.label, children: item.icon }, i)), themeSwitch.enabled !== false && (themeSwitch.component ?? jsxRuntimeExports.jsx(ThemeToggle, { className: "ms-auto p-0", mode: themeSwitch.mode }))] }), footer] })] }), jsxRuntimeExports.jsxs(SidebarDrawer, { children: [jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-4 pb-2", children: [jsxRuntimeExports.jsxs("div", { className: "flex text-fd-muted-foreground items-center gap-1.5", children: [jsxRuntimeExports.jsx("div", { className: "flex flex-1", children: iconLinks.map((item, i) => jsxRuntimeExports.jsx(LinkItem, { item, className: twMerge(buttonVariants({
      size: "icon-sm",
      color: "ghost",
      className: "p-2"
    })), "aria-label": item.label, children: item.icon }, i)) }), i18n && jsxRuntimeExports.jsxs(LanguageToggle, { children: [jsxRuntimeExports.jsx(Languages, { className: "size-4.5" }), jsxRuntimeExports.jsx(LanguageToggleText, {})] }), themeSwitch.enabled !== false && (themeSwitch.component ?? jsxRuntimeExports.jsx(ThemeToggle, { className: "p-0", mode: themeSwitch.mode })), jsxRuntimeExports.jsx(SidebarTrigger, { className: twMerge(buttonVariants({
      color: "ghost",
      size: "icon-sm",
      className: "p-2"
    })), children: jsxRuntimeExports.jsx(Sidebar$1, {}) })] }), tabs.length > 0 && jsxRuntimeExports.jsx(SidebarTabsDropdown, { options: tabs }), banner] }), viewport, jsxRuntimeExports.jsx("div", { className: "flex flex-col border-t p-4 pt-2 empty:hidden", children: footer })] })] });
  }
  return jsxRuntimeExports.jsx(TreeContextProvider, { tree, children: jsxRuntimeExports.jsx(LayoutContextProvider, { navTransparentMode: transparentMode, children: jsxRuntimeExports.jsx(Sidebar, { defaultOpenLevel, prefetch, children: jsxRuntimeExports.jsxs(LayoutBody, { ...props.containerProps, children: [nav.enabled !== false && (nav.component ?? jsxRuntimeExports.jsxs(LayoutHeader, { id: "nd-subnav", className: "[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80", children: [renderTitleNav(nav, {
    className: "inline-flex items-center gap-2.5 font-semibold"
  }), jsxRuntimeExports.jsx("div", { className: "flex-1", children: nav.children }), searchToggle.enabled !== false && (searchToggle.components?.sm ?? jsxRuntimeExports.jsx(SearchToggle, { className: "p-2", hideIfDisabled: true })), sidebarEnabled && jsxRuntimeExports.jsx(SidebarTrigger, { className: twMerge(buttonVariants({
    color: "ghost",
    size: "icon-sm",
    className: "p-2"
  })), children: jsxRuntimeExports.jsx(Sidebar$1, {}) })] })), sidebarEnabled && sidebar(), tabMode === "top" && tabs.length > 0 && jsxRuntimeExports.jsx(LayoutTabs, { options: tabs, className: "z-10 bg-fd-background border-b px-6 pt-3 xl:px-8 max-md:hidden" }), children] }) }) }) });
}
function deserializePageTree(root) {
  function deserializeHTML(html) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        dangerouslySetInnerHTML: {
          __html: html
        }
      }
    );
  }
  visit(root, (item) => {
    if ("icon" in item && typeof item.icon === "string") {
      item.icon = deserializeHTML(item.icon);
    }
    if (typeof item.name === "string") {
      item.name = deserializeHTML(item.name);
    }
  });
  return root;
}
function useFumadocsLoader(serialized) {
  const { pageTree } = serialized;
  return reactExports.useMemo(() => {
    return {
      pageTree: pageTree ? deserializePageTree(pageTree) : void 0
    };
  }, [pageTree]);
}
const clientLoader = browserCollections.docs.createClientLoader({
  component({
    toc,
    frontmatter,
    default: MDX
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(DocsPage, { toc, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DocsTitle, { children: frontmatter.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DocsDescription, { children: frontmatter.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DocsBody, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MDX, { components: {
        ...defaultMdxComponents,
        Database,
        DollarSign,
        Zap,
        Rocket,
        Mermaid
      } }) })
    ] });
  }
});
function Page() {
  const data = Route.useLoaderData();
  const Content = clientLoader.getComponent(data.path);
  const {
    pageTree
  } = useFumadocsLoader(data);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DocsLayout, { ...baseOptions(), tree: pageTree, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Content, {}) });
}
export {
  Page as component
};
