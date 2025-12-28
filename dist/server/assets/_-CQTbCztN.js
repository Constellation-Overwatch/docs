import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useMemo, Fragment, useRef } from "react";
import { u as useTreeContext, a as useTreePath, B as Base, S as SidebarContent$1, m as mergeRefs, b as Sidebar$1, c as buttonVariants, d as SearchToggle, e as SidebarDrawerOverlay, f as SidebarDrawerContent, g as useFolderDepth, h as SidebarFolderContent$1, i as SidebarFolderLink$1, j as useFolder, k as SidebarFolderTrigger$1, l as SidebarSeparator$1, n as SidebarItem$1, r as resolveLinkItems, T as TreeContextProvider, L as LayoutContextProvider, o as LayoutBody, p as LayoutHeader, q as renderTitleNav, s as LayoutTabs, t as LargeSearchToggle, v as SidebarTabsDropdown, w as LanguageToggle, x as Languages, y as LinkItem, z as ThemeToggle, A as LanguageToggleText, C as Route, D as browserCollections, E as DocsPage, F as DocsTitle, G as DocsDescription, I as DocsBody, J as defaultMdxComponents } from "./router-CiJ9azvI.js";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { b as baseOptions } from "./layout.shared-DXmawwqm.js";
import { v as visit } from "./staticFunctionMiddleware-3EePvBPZ.js";
import { Rocket, Zap, DollarSign, Database } from "lucide-react";
import "@tanstack/react-router";
import "@radix-ui/react-direction";
import "next-themes";
import "@radix-ui/react-dialog";
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
import "fumadocs-mdx/runtime/browser";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-scroll-area";
import "@radix-ui/react-presence";
import "@radix-ui/react-popover";
import "@radix-ui/react-tabs";
import "@radix-ui/react-navigation-menu";
import "@icons-pack/react-simple-icons";
import "path";
import "fumadocs-mdx/runtime/server";
import "node:fs/promises";
import "node:path";
function createPageTreeRenderer({ SidebarFolder: SidebarFolder2, SidebarFolderContent: SidebarFolderContent2, SidebarFolderLink: SidebarFolderLink2, SidebarFolderTrigger: SidebarFolderTrigger2, SidebarSeparator: SidebarSeparator2, SidebarItem: SidebarItem2 }) {
  function PageTreeFolder({ item, children }) {
    const path = useTreePath();
    return jsxs(SidebarFolder2, { collapsible: item.collapsible, active: path.includes(item), defaultOpen: item.defaultOpen, children: [item.index ? jsxs(SidebarFolderLink2, { href: item.index.url, external: item.index.external, children: [item.icon, item.name] }) : jsxs(SidebarFolderTrigger2, { children: [item.icon, item.name] }), jsx(SidebarFolderContent2, { children })] });
  }
  return function SidebarPageTree2(components) {
    const { root } = useTreeContext();
    const { Separator, Item, Folder = PageTreeFolder } = components;
    return useMemo(() => {
      function renderSidebarList(items) {
        return items.map((item, i) => {
          if (item.type === "separator") {
            if (Separator)
              return jsx(Separator, { item }, i);
            return jsxs(SidebarSeparator2, { children: [item.icon, item.name] }, i);
          }
          if (item.type === "folder") {
            return jsx(Folder, { item, children: renderSidebarList(item.children) }, i);
          }
          if (Item)
            return jsx(Item, { item }, item.url);
          return jsx(SidebarItem2, { href: item.url, external: item.external, icon: item.icon, children: item.name }, item.url);
        });
      }
      return jsx(Fragment, { children: renderSidebarList(root.children) }, root.$id);
    }, [Folder, Item, Separator, root]);
  };
}
function createLinkItemRenderer({ SidebarFolder: SidebarFolder2, SidebarFolderContent: SidebarFolderContent2, SidebarFolderLink: SidebarFolderLink2, SidebarFolderTrigger: SidebarFolderTrigger2, SidebarItem: SidebarItem2 }) {
  return function SidebarLinkItem2({ item, ...props }) {
    if (item.type === "custom")
      return jsx("div", { ...props, children: item.children });
    if (item.type === "menu")
      return jsxs(SidebarFolder2, { ...props, children: [item.url ? jsxs(SidebarFolderLink2, { href: item.url, external: item.external, children: [item.icon, item.text] }) : jsxs(SidebarFolderTrigger2, { children: [item.icon, item.text] }), jsx(SidebarFolderContent2, { children: item.items.map((child, i) => jsx(SidebarLinkItem2, { item: child }, i)) })] });
    return jsx(SidebarItem2, { href: item.url, icon: item.icon, external: item.external, ...props, children: item.text });
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
  const ref = useRef(null);
  return jsx(SidebarContent$1, { children: ({ collapsed, hovered, ref: asideRef, ...rest }) => jsxs(Fragment$1, { children: [jsxs("div", { "data-sidebar-placeholder": "", className: "sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] pointer-events-none *:pointer-events-auto h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] md:layout:[--fd-sidebar-width:268px] max-md:hidden", children: [collapsed && jsx("div", { className: "absolute start-0 inset-y-0 w-4", ...rest }), jsx("aside", { id: "nd-sidebar", ref: mergeRefs(ref, refProp, asideRef), "data-collapsed": collapsed, "data-hovered": collapsed && hovered, className: twMerge("absolute flex flex-col w-full start-0 inset-y-0 items-end bg-fd-card text-sm border-e duration-250 *:w-(--fd-sidebar-width)", collapsed && [
    "inset-y-2 rounded-xl transition-transform border w-(--fd-sidebar-width)",
    hovered ? "shadow-lg translate-x-2 rtl:-translate-x-2" : "-translate-x-(--fd-sidebar-width) rtl:translate-x-full"
  ], ref.current && ref.current.getAttribute("data-collapsed") === "true" !== collapsed && "transition-[width,inset-block,translate,background-color]", className), ...props, ...rest, children })] }), jsxs("div", { "data-sidebar-panel": "", className: twMerge("fixed flex top-[calc(--spacing(4)+var(--fd-docs-row-3))] start-4 shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10", (!collapsed || hovered) && "pointer-events-none opacity-0"), children: [jsx(SidebarCollapseTrigger, { className: twMerge(buttonVariants({
    color: "ghost",
    size: "icon-sm",
    className: "rounded-lg"
  })), children: jsx(Sidebar$1, {}) }), jsx(SearchToggle, { className: "rounded-lg", hideIfDisabled: true })] })] }) });
}
function SidebarDrawer({ children, className, ...props }) {
  return jsxs(Fragment$1, { children: [jsx(SidebarDrawerOverlay, { className: "fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" }), jsx(SidebarDrawerContent, { className: twMerge("fixed text-[0.9375rem] flex flex-col shadow-lg border-s end-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out", className), ...props, children })] });
}
function SidebarSeparator({ className, style, children, ...props }) {
  const depth = useFolderDepth();
  return jsx(SidebarSeparator$1, { className: twMerge("[&_svg]:size-4 [&_svg]:shrink-0", className), style: {
    paddingInlineStart: getItemOffset(depth),
    ...style
  }, ...props, children });
}
function SidebarItem({ className, style, children, ...props }) {
  const depth = useFolderDepth();
  return jsx(SidebarItem$1, { className: twMerge(itemVariants({ variant: "link", highlight: depth >= 1 }), className), style: {
    paddingInlineStart: getItemOffset(depth),
    ...style
  }, ...props, children });
}
function SidebarFolderTrigger({ className, style, ...props }) {
  const { depth, collapsible } = useFolder();
  return jsx(SidebarFolderTrigger$1, { className: twMerge(itemVariants({ variant: collapsible ? "button" : null }), "w-full", className), style: {
    paddingInlineStart: getItemOffset(depth - 1),
    ...style
  }, ...props, children: props.children });
}
function SidebarFolderLink({ className, style, ...props }) {
  const depth = useFolderDepth();
  return jsx(SidebarFolderLink$1, { className: twMerge(itemVariants({ variant: "link", highlight: depth > 1 }), "w-full", className), style: {
    paddingInlineStart: getItemOffset(depth - 1),
    ...style
  }, ...props, children: props.children });
}
function SidebarFolderContent({ className, children, ...props }) {
  const depth = useFolderDepth();
  return jsx(SidebarFolderContent$1, { className: twMerge("relative", depth === 1 && "before:content-[''] before:absolute before:w-px before:inset-y-1 before:bg-fd-border before:start-2.5", className), ...props, children });
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
    icon: jsx("div", { className: "size-full [&_svg]:size-full max-md:p-1.5 max-md:rounded-md max-md:border max-md:bg-fd-secondary", children: node.icon })
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
  const tabs = useMemo(() => {
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
    const viewport = jsxs(SidebarViewport, { children: [links.filter((v) => v.type !== "icon").map((item, i, list) => jsx(SidebarLinkItem, { item, className: twMerge(i === list.length - 1 && "mb-4") }, i)), jsx(SidebarPageTree, { ...components })] });
    return jsxs(Fragment$1, { children: [jsxs(SidebarContent, { ...rest, children: [jsxs("div", { className: "flex flex-col gap-3 p-4 pb-2", children: [jsxs("div", { className: "flex", children: [renderTitleNav(nav, {
      className: "inline-flex text-[0.9375rem] items-center gap-2.5 font-medium me-auto"
    }), nav.children, collapsible && jsx(SidebarCollapseTrigger, { className: twMerge(buttonVariants({
      color: "ghost",
      size: "icon-sm",
      className: "mb-auto text-fd-muted-foreground"
    })), children: jsx(Sidebar$1, {}) })] }), searchToggle.enabled !== false && (searchToggle.components?.lg ?? jsx(LargeSearchToggle, { hideIfDisabled: true })), tabs.length > 0 && tabMode === "auto" && jsx(SidebarTabsDropdown, { options: tabs }), banner] }), viewport, (i18n || iconLinks.length > 0 || themeSwitch?.enabled !== false || footer) && jsxs("div", { className: "flex flex-col border-t p-4 pt-2 empty:hidden", children: [jsxs("div", { className: "flex text-fd-muted-foreground items-center empty:hidden", children: [i18n && jsx(LanguageToggle, { children: jsx(Languages, { className: "size-4.5" }) }), iconLinks.map((item, i) => jsx(LinkItem, { item, className: twMerge(buttonVariants({ size: "icon-sm", color: "ghost" })), "aria-label": item.label, children: item.icon }, i)), themeSwitch.enabled !== false && (themeSwitch.component ?? jsx(ThemeToggle, { className: "ms-auto p-0", mode: themeSwitch.mode }))] }), footer] })] }), jsxs(SidebarDrawer, { children: [jsxs("div", { className: "flex flex-col gap-3 p-4 pb-2", children: [jsxs("div", { className: "flex text-fd-muted-foreground items-center gap-1.5", children: [jsx("div", { className: "flex flex-1", children: iconLinks.map((item, i) => jsx(LinkItem, { item, className: twMerge(buttonVariants({
      size: "icon-sm",
      color: "ghost",
      className: "p-2"
    })), "aria-label": item.label, children: item.icon }, i)) }), i18n && jsxs(LanguageToggle, { children: [jsx(Languages, { className: "size-4.5" }), jsx(LanguageToggleText, {})] }), themeSwitch.enabled !== false && (themeSwitch.component ?? jsx(ThemeToggle, { className: "p-0", mode: themeSwitch.mode })), jsx(SidebarTrigger, { className: twMerge(buttonVariants({
      color: "ghost",
      size: "icon-sm",
      className: "p-2"
    })), children: jsx(Sidebar$1, {}) })] }), tabs.length > 0 && jsx(SidebarTabsDropdown, { options: tabs }), banner] }), viewport, jsx("div", { className: "flex flex-col border-t p-4 pt-2 empty:hidden", children: footer })] })] });
  }
  return jsx(TreeContextProvider, { tree, children: jsx(LayoutContextProvider, { navTransparentMode: transparentMode, children: jsx(Sidebar, { defaultOpenLevel, prefetch, children: jsxs(LayoutBody, { ...props.containerProps, children: [nav.enabled !== false && (nav.component ?? jsxs(LayoutHeader, { id: "nd-subnav", className: "[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80", children: [renderTitleNav(nav, {
    className: "inline-flex items-center gap-2.5 font-semibold"
  }), jsx("div", { className: "flex-1", children: nav.children }), searchToggle.enabled !== false && (searchToggle.components?.sm ?? jsx(SearchToggle, { className: "p-2", hideIfDisabled: true })), sidebarEnabled && jsx(SidebarTrigger, { className: twMerge(buttonVariants({
    color: "ghost",
    size: "icon-sm",
    className: "p-2"
  })), children: jsx(Sidebar$1, {}) })] })), sidebarEnabled && sidebar(), tabMode === "top" && tabs.length > 0 && jsx(LayoutTabs, { options: tabs, className: "z-10 bg-fd-background border-b px-6 pt-3 xl:px-8 max-md:hidden" }), children] }) }) }) });
}
function deserializePageTree(root) {
  function deserializeHTML(html) {
    return /* @__PURE__ */ jsx(
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
  return useMemo(() => {
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
    return /* @__PURE__ */ jsxs(DocsPage, { toc, children: [
      /* @__PURE__ */ jsx(DocsTitle, { children: frontmatter.title }),
      /* @__PURE__ */ jsx(DocsDescription, { children: frontmatter.description }),
      /* @__PURE__ */ jsx(DocsBody, { children: /* @__PURE__ */ jsx(MDX, { components: {
        ...defaultMdxComponents,
        Database,
        DollarSign,
        Zap,
        Rocket
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
  return /* @__PURE__ */ jsx(DocsLayout, { ...baseOptions(), tree: pageTree, children: /* @__PURE__ */ jsx(Content, {}) });
}
export {
  Page as component
};
