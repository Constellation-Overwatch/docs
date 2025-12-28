import { useParams, useRouter as useRouter$1, useRouterState, Link as Link$2, createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, notFound, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import * as React from "react";
import { use, createContext, useMemo, useContext, useRef, useState, useEffectEvent, useEffect, lazy, forwardRef, createElement, Fragment, useCallback, useLayoutEffect } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider, useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { Dialog, DialogOverlay, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import scrollIntoView from "scroll-into-view-if-needed";
import { create as create$1, search, getByID, save, insertMultiple } from "@orama/orama";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "../server.js";
import { n as normalizeUrl, f as findPath, s as staticFunctionMiddleware, a as source, b as basename, e as extname } from "./staticFunctionMiddleware-3EePvBPZ.js";
import { browser } from "fumadocs-mdx/runtime/browser";
import * as Primitive from "@radix-ui/react-collapsible";
import * as Primitive$1 from "@radix-ui/react-scroll-area";
import { Presence } from "@radix-ui/react-presence";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as Primitive$2 from "@radix-ui/react-tabs";
import { Rocket, Zap, DollarSign, Database } from "lucide-react";
import * as Primitive$3 from "@radix-ui/react-navigation-menu";
const appCss = "/assets/app-DVCi9fNJ.css";
var notImplemented = () => {
  throw new Error(
    "You need to wrap your application inside `FrameworkProvider`."
  );
};
var FrameworkContext = createContext({
  useParams: notImplemented,
  useRouter: notImplemented,
  usePathname: notImplemented
});
function FrameworkProvider({
  Link: Link22,
  useRouter: useRouter2,
  useParams: useParams2,
  usePathname: usePathname2,
  Image: Image2,
  children
}) {
  const framework2 = useMemo(
    () => ({
      usePathname: usePathname2,
      useRouter: useRouter2,
      Link: Link22,
      Image: Image2,
      useParams: useParams2
    }),
    [Link22, usePathname2, useRouter2, useParams2, Image2]
  );
  return /* @__PURE__ */ jsx(FrameworkContext, { value: framework2, children });
}
function usePathname() {
  return use(FrameworkContext).usePathname();
}
function useRouter() {
  return use(FrameworkContext).useRouter();
}
function Image$1(props) {
  const { Image: Image2 } = use(FrameworkContext);
  if (!Image2) {
    const { src, alt, priority, ...rest } = props;
    return /* @__PURE__ */ jsx(
      "img",
      {
        alt,
        src,
        fetchPriority: priority ? "high" : "auto",
        ...rest
      }
    );
  }
  return /* @__PURE__ */ jsx(Image2, { ...props });
}
function Link$1(props) {
  const { Link: Link22 } = use(FrameworkContext);
  if (!Link22) {
    const { href, prefetch: _, ...rest } = props;
    return /* @__PURE__ */ jsx("a", { href, ...rest });
  }
  return /* @__PURE__ */ jsx(Link22, { ...props });
}
const defaultTranslations = {
  search: "Search",
  searchNoResult: "No results found",
  toc: "On this page",
  tocNoHeadings: "No Headings",
  lastUpdate: "Last updated on",
  chooseLanguage: "Choose a language",
  nextPage: "Next Page",
  previousPage: "Previous Page",
  chooseTheme: "Theme",
  editOnGithub: "Edit on GitHub"
};
const I18nContext = createContext({
  text: defaultTranslations
});
function I18nLabel(props) {
  const { text } = useI18n();
  return text[props.label];
}
function useI18n() {
  return useContext(I18nContext);
}
function I18nProvider({ locales = [], locale, onLocaleChange, children, translations }) {
  const router2 = useRouter();
  const pathname = usePathname();
  const onChange = (value) => {
    if (onLocaleChange) {
      return onLocaleChange(value);
    }
    const segments = pathname.split("/").filter((v) => v.length > 0);
    if (segments[0] !== locale) {
      segments.unshift(value);
    } else {
      segments[0] = value;
    }
    router2.push(`/${segments.join("/")}`);
  };
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  return jsx(I18nContext, { value: useMemo(() => ({
    locale,
    locales,
    text: {
      ...defaultTranslations,
      ...translations
    },
    onChange: (v) => onChangeRef.current(v)
  }), [locale, locales, translations]), children });
}
const SearchContext = createContext({
  enabled: false,
  hotKey: [],
  setOpenSearch: () => void 0
});
function useSearchContext() {
  return use(SearchContext);
}
function MetaOrControl() {
  const [key, setKey] = useState("⌘");
  useEffect(() => {
    const isWindows = window.navigator.userAgent.includes("Windows");
    if (isWindows)
      setKey("Ctrl");
  }, []);
  return key;
}
function SearchProvider({ SearchDialog: SearchDialog2, children, preload = true, options, hotKey = [
  {
    key: (e) => e.metaKey || e.ctrlKey,
    display: jsx(MetaOrControl, {})
  },
  {
    key: "k",
    display: "K"
  }
], links }) {
  const [isOpen, setIsOpen] = useState(preload ? false : void 0);
  const onKeyDown = useEffectEvent((e) => {
    if (hotKey.every((v) => typeof v.key === "string" ? e.key === v.key : v.key(e))) {
      setIsOpen((open) => !open);
      e.preventDefault();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hotKey]);
  return jsxs(SearchContext, { value: useMemo(() => ({
    enabled: true,
    hotKey,
    setOpenSearch: setIsOpen
  }), [hotKey]), children: [isOpen !== void 0 && jsx(SearchDialog2, {
    open: isOpen,
    onOpenChange: setIsOpen,
    // @ts-expect-error -- insert prop for official UIs
    links,
    ...options
  }), children] });
}
const DefaultSearchDialog$1 = lazy(() => import("./search-default-7l0mJxT_.js"));
function RootProvider$1({ children, dir = "ltr", theme = {}, search: search2, i18n }) {
  let body = children;
  if (search2?.enabled !== false)
    body = jsx(SearchProvider, { SearchDialog: DefaultSearchDialog$1, ...search2, children: body });
  if (theme?.enabled !== false)
    body = jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, ...theme, children: body });
  if (i18n) {
    body = jsx(I18nProvider, { ...i18n, children: body });
  }
  return jsx(DirectionProvider, { dir, children: body });
}
var framework = {
  Link({ href, prefetch = true, ...props }) {
    return /* @__PURE__ */ jsx(Link$2, { to: href, preload: prefetch ? "intent" : false, ...props, children: props.children });
  },
  usePathname() {
    const { isLoading, pathname } = useRouterState({
      select: (state) => ({
        isLoading: state.isLoading,
        pathname: state.location.pathname
      })
    });
    const activePathname = useRef(pathname);
    return useMemo(() => {
      if (isLoading) {
        return activePathname.current;
      }
      activePathname.current = pathname;
      return pathname;
    }, [isLoading, pathname]);
  },
  useRouter() {
    const router2 = useRouter$1();
    return useMemo(
      () => ({
        push(url) {
          void router2.navigate({
            href: url
          });
        },
        refresh() {
          void router2.invalidate();
        }
      }),
      [router2]
    );
  },
  useParams() {
    return useParams({ strict: false });
  }
};
function TanstackProvider({
  children,
  Link: CustomLink,
  Image: CustomImage
}) {
  return /* @__PURE__ */ jsx(
    FrameworkProvider,
    {
      ...framework,
      Link: CustomLink ?? framework.Link,
      Image: CustomImage ?? framework.Image,
      children
    }
  );
}
function RootProvider({ components, ...props }) {
  return jsx(TanstackProvider, { Link: components?.Link, Image: components?.Image, children: jsx(RootProvider$1, { ...props, children: props.children }) });
}
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(({ size = 24, color = "currentColor", children, ...props }, ref) => {
    return jsxs("svg", { ref, ...defaultAttributes, width: size, height: size, stroke: color, ...props, children: [iconNode.map(([tag, attr]) => createElement(tag, attr)), children] });
  });
  Component.displayName = iconName;
  return Component;
};
const ChevronDown = createLucideIcon("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Languages = createLucideIcon("languages", [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
]);
const Sidebar = createLucideIcon("panel-left", [
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }
  ],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
]);
const ChevronsUpDown = createLucideIcon("chevrons-up-down", [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
]);
const Search = createLucideIcon("search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const ExternalLink = createLucideIcon("external-link", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  [
    "path",
    {
      d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      key: "a6xqqp"
    }
  ]
]);
const Moon = createLucideIcon("moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
]);
const Sun = createLucideIcon("sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
]);
const Airplay = createLucideIcon("airplay", [
  [
    "path",
    {
      d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1",
      key: "ns4c3b"
    }
  ],
  ["path", { d: "m12 15 5 6H7Z", key: "14qnn2" }]
]);
createLucideIcon("menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
createLucideIcon("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
createLucideIcon("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const CircleCheck = createLucideIcon("circle-check", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const CircleX = createLucideIcon("circle-x", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
const Check = createLucideIcon("check", [
  ["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]
]);
const TriangleAlert = createLucideIcon("triangle-alert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const Info = createLucideIcon("info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
createLucideIcon("copy", [
  [
    "rect",
    {
      width: "14",
      height: "14",
      x: "8",
      y: "8",
      rx: "2",
      ry: "2",
      key: "17jyea"
    }
  ],
  [
    "path",
    {
      d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
      key: "zix9uf"
    }
  ]
]);
const Clipboard = createLucideIcon("clipboard", [
  [
    "rect",
    {
      width: "8",
      height: "4",
      x: "8",
      y: "2",
      rx: "1",
      ry: "1",
      key: "1"
    }
  ],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "2"
    }
  ]
]);
createLucideIcon("file-text", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7"
    }
  ],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
const Hash = createLucideIcon("hash", [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
]);
const Text = createLucideIcon("text", [
  ["path", { d: "M15 18H3", key: "olowqp" }],
  ["path", { d: "M17 6H3", key: "16j9eg" }],
  ["path", { d: "M21 12H3", key: "2avoz0" }]
]);
createLucideIcon("file", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7"
    }
  ],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
]);
createLucideIcon("folder", [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
]);
createLucideIcon("folder-open", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
createLucideIcon("star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
const Link = createLucideIcon("link", [
  [
    "path",
    {
      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
      key: "1cjeqo"
    }
  ],
  [
    "path",
    {
      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
      key: "19qd67"
    }
  ]
]);
createLucideIcon("square-pen", [
  [
    "path",
    {
      d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
      key: "1m0v6g"
    }
  ],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
]);
const ChevronRight = createLucideIcon("chevron-right", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const ChevronLeft = createLucideIcon("chevron-left", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
createLucideIcon("plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
createLucideIcon("trash-2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
createLucideIcon("chevron-up", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }]
]);
function isDifferent(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length !== a.length || a.some((v, i) => isDifferent(v, b[i]));
  }
  return a !== b;
}
function useOnChange(value, onChange, isUpdated = isDifferent) {
  const [prev, setPrev] = useState(value);
  if (isUpdated(prev, value)) {
    onChange(value, prev);
    setPrev(value);
  }
}
const variants = {
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80",
  outline: "border hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground",
  secondary: "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
};
const buttonVariants = cva("inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring", {
  variants: {
    variant: variants,
    // fumadocs use `color` instead of `variant`
    color: variants,
    size: {
      sm: "gap-1 px-2 py-1.5 text-xs",
      icon: "p-1.5 [&_svg]:size-5",
      "icon-sm": "p-1.5 [&_svg]:size-4.5",
      "icon-xs": "p-1 [&_svg]:size-4"
    }
  }
});
const Context = createContext(null);
const ListContext = createContext(null);
const TagsListContext = createContext(null);
function SearchDialog({ open, onOpenChange, search: search2, onSearchChange, isLoading = false, children }) {
  const [active, setActive] = useState(null);
  return jsx(Dialog, { open, onOpenChange, children: jsx(Context.Provider, { value: useMemo(() => ({
    open,
    onOpenChange,
    search: search2,
    onSearchChange,
    active,
    setActive,
    isLoading
  }), [active, isLoading, onOpenChange, onSearchChange, open, search2]), children }) });
}
function SearchDialogHeader(props) {
  return jsx("div", { ...props, className: twMerge("flex flex-row items-center gap-2 p-3", props.className) });
}
function SearchDialogInput(props) {
  const { text } = useI18n();
  const { search: search2, onSearchChange } = useSearch();
  return jsx("input", { ...props, value: search2, onChange: (e) => onSearchChange(e.target.value), placeholder: text.search, className: "w-0 flex-1 bg-transparent text-lg placeholder:text-fd-muted-foreground focus-visible:outline-none" });
}
function SearchDialogClose({ children = "ESC", className, ...props }) {
  const { onOpenChange } = useSearch();
  return jsx("button", { type: "button", onClick: () => onOpenChange(false), className: twMerge(buttonVariants({
    color: "outline",
    size: "sm",
    className: "font-mono text-fd-muted-foreground"
  }), className), ...props, children });
}
function SearchDialogFooter(props) {
  return jsx("div", { ...props, className: twMerge("bg-fd-secondary/50 p-3 empty:hidden", props.className) });
}
function SearchDialogOverlay(props) {
  return jsx(DialogOverlay, { ...props, className: twMerge("fixed inset-0 z-50 backdrop-blur-xs bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out", props.className) });
}
function SearchDialogContent({ children, ...props }) {
  const { text } = useI18n();
  return jsxs(DialogContent, { "aria-describedby": void 0, ...props, className: twMerge("fixed left-1/2 top-4 md:top-[calc(50%-250px)] z-50 w-[calc(100%-1rem)] max-w-screen-sm -translate-x-1/2 rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-2xl shadow-black/50 overflow-hidden data-[state=closed]:animate-fd-dialog-out data-[state=open]:animate-fd-dialog-in", "*:border-b *:has-[+:last-child[data-empty=true]]:border-b-0 *:data-[empty=true]:border-b-0 *:last:border-b-0", props.className), children: [jsx(DialogTitle, { className: "hidden", children: text.search }), children] });
}
function SearchDialogList({ items = null, Empty = () => jsx("div", { className: "py-12 text-center text-sm text-fd-muted-foreground", children: jsx(I18nLabel, { label: "searchNoResult" }) }), Item = (props2) => jsx(SearchDialogListItem, { ...props2 }), ...props }) {
  const ref = useRef(null);
  const [active, setActive] = useState(() => items && items.length > 0 ? items[0].id : null);
  const { onOpenChange } = useSearch();
  const router2 = useRouter();
  const onOpen = (item) => {
    if (item.type === "action") {
      item.onSelect();
    } else if (item.external) {
      window.open(item.url, "_blank")?.focus();
    } else {
      router2.push(item.url);
    }
    onOpenChange(false);
  };
  const onKey = useEffectEvent((e) => {
    if (!items || e.isComposing)
      return;
    if (e.key === "ArrowDown" || e.key == "ArrowUp") {
      let idx = items.findIndex((item) => item.id === active);
      if (idx === -1)
        idx = 0;
      else if (e.key === "ArrowDown")
        idx++;
      else
        idx--;
      setActive(items.at(idx % items.length)?.id ?? null);
      e.preventDefault();
    }
    if (e.key === "Enter") {
      const selected = items.find((item) => item.id === active);
      if (selected)
        onOpen(selected);
      e.preventDefault();
    }
  });
  useEffect(() => {
    const element = ref.current;
    if (!element)
      return;
    const observer = new ResizeObserver(() => {
      const viewport2 = element.firstElementChild;
      element.style.setProperty("--fd-animated-height", `${viewport2.clientHeight}px`);
    });
    const viewport = element.firstElementChild;
    if (viewport)
      observer.observe(viewport);
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  useOnChange(items, () => {
    if (items && items.length > 0) {
      setActive(items[0].id);
    }
  });
  return jsx("div", { ...props, ref, "data-empty": items === null, className: twMerge("overflow-hidden h-(--fd-animated-height) transition-[height]", props.className), children: jsx("div", { className: twMerge("w-full flex flex-col overflow-y-auto max-h-[460px] p-1", !items && "hidden"), children: jsxs(ListContext.Provider, { value: useMemo(() => ({
    active,
    setActive
  }), [active]), children: [items?.length === 0 && Empty(), items?.map((item) => jsx(Fragment, { children: Item({ item, onClick: () => onOpen(item) }) }, item.id))] }) }) });
}
function SearchDialogListItem({ item, className, children, renderHighlights: render = renderHighlights, ...props }) {
  const { active: activeId, setActive } = useSearchList();
  const active = item.id === activeId;
  if (item.type === "action") {
    children ?? (children = item.node);
  } else {
    children ?? (children = jsxs(Fragment$1, { children: [jsx("div", { className: "inline-flex items-center text-fd-muted-foreground text-xs empty:hidden", children: item.breadcrumbs?.map((item2, i) => jsxs(Fragment, { children: [i > 0 && jsx(ChevronRight, { className: "size-4" }), item2] }, i)) }), item.type !== "page" && jsx("div", { role: "none", className: "absolute start-3 inset-y-0 w-px bg-fd-border" }), jsxs("p", { className: twMerge("min-w-0 truncate", item.type !== "page" && "ps-4", item.type === "page" || item.type === "heading" ? "font-medium" : "text-fd-popover-foreground/80"), children: [item.type === "heading" && jsx(Hash, { className: "inline me-1 size-4 text-fd-muted-foreground" }), item.contentWithHighlights ? render(item.contentWithHighlights) : item.content] })] }));
  }
  return jsx("button", { type: "button", ref: useCallback((element) => {
    if (active && element) {
      scrollIntoView(element, {
        scrollMode: "if-needed",
        block: "nearest",
        boundary: element.parentElement
      });
    }
  }, [active]), "aria-selected": active, className: twMerge("relative select-none px-2.5 py-2 text-start text-sm rounded-lg", active && "bg-fd-accent text-fd-accent-foreground", className), onPointerMove: () => setActive(item.id), ...props, children });
}
function SearchDialogIcon(props) {
  const { isLoading } = useSearch();
  return jsx(Search, { ...props, className: twMerge("size-5 text-fd-muted-foreground", isLoading && "animate-pulse duration-400", props.className) });
}
const itemVariants$1 = cva("rounded-md border px-2 py-0.5 text-xs font-medium text-fd-muted-foreground transition-colors", {
  variants: {
    active: {
      true: "bg-fd-accent text-fd-accent-foreground"
    }
  }
});
function TagsList({ tag, onTagChange, allowClear = false, ...props }) {
  return jsx("div", { ...props, className: twMerge("flex items-center gap-1 flex-wrap", props.className), children: jsx(TagsListContext.Provider, { value: useMemo(() => ({
    value: tag,
    onValueChange: onTagChange,
    allowClear
  }), [allowClear, onTagChange, tag]), children: props.children }) });
}
function TagsListItem({ value, className, ...props }) {
  const { onValueChange, value: selectedValue, allowClear } = useTagsList();
  const selected = value === selectedValue;
  return jsx("button", { type: "button", "data-active": selected, className: twMerge(itemVariants$1({ active: selected, className })), onClick: () => {
    onValueChange(selected && allowClear ? void 0 : value);
  }, tabIndex: -1, ...props, children: props.children });
}
function renderHighlights(highlights) {
  return highlights.map((node, i) => {
    if (node.styles?.highlight) {
      return jsx("span", { className: "text-fd-primary underline", children: node.content }, i);
    }
    return jsx(Fragment, { children: node.content }, i);
  });
}
function useSearch() {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("Missing <SearchDialog />");
  return ctx;
}
function useTagsList() {
  const ctx = useContext(TagsListContext);
  if (!ctx)
    throw new Error("Missing <TagsList />");
  return ctx;
}
function useSearchList() {
  const ctx = useContext(ListContext);
  if (!ctx)
    throw new Error("Missing <SearchDialogList />");
  return ctx;
}
function useDebounce(value, delayMs = 1e3) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    if (delayMs === 0) return;
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    return () => clearTimeout(handler);
  }, [delayMs, value]);
  if (delayMs === 0) return value;
  return debouncedValue;
}
function isDeepEqual(a, b) {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length === a.length && a.every((v, i) => isDeepEqual(v, b[i]));
  }
  if (typeof a === "object" && a && typeof b === "object" && b) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return aKeys.length === bKeys.length && aKeys.every(
      (key) => Object.hasOwn(b, key) && isDeepEqual(a[key], b[key])
    );
  }
  return false;
}
function useDocsSearch(clientOptions, deps) {
  const { delayMs = 100, allowEmpty = false, ...client } = clientOptions;
  const [search2, setSearch] = useState("");
  const [results, setResults] = useState("empty");
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounce(search2, delayMs);
  const onStart = useRef(void 0);
  useOnChange(
    [clientOptions, debouncedValue],
    () => {
      if (onStart.current) {
        onStart.current();
        onStart.current = void 0;
      }
      setIsLoading(true);
      let interrupt = false;
      onStart.current = () => {
        interrupt = true;
      };
      async function run() {
        if (debouncedValue.length === 0 && !allowEmpty) return "empty";
        if (client.type === "fetch") {
          const { fetchDocs } = await import("./fetch-IBTWQCJR-BOD3N1Qp.js");
          return fetchDocs(debouncedValue, client);
        }
        if (client.type === "algolia") {
          const { searchDocs } = await import("./algolia-IZEDLPHE-CtJv-f2Z.js");
          return searchDocs(debouncedValue, client);
        }
        if (client.type === "orama-cloud") {
          const { searchDocs } = await import("./orama-cloud-UZAPMPFV-C5x9m3oi.js");
          return searchDocs(debouncedValue, client);
        }
        if (client.type === "static") {
          const { search: search22 } = await import("./static-A2YJ5TXV-B9MiJkX6.js");
          return search22(debouncedValue, client);
        }
        if (client.type === "mixedbread") {
          const { search: search22 } = await import("./mixedbread-2ZQZ32QK-D54Gd4R8.js");
          return search22(debouncedValue, client);
        }
        throw new Error("unknown search client");
      }
      void run().then((res) => {
        if (interrupt) return;
        setError(void 0);
        setResults(res);
      }).catch((err) => {
        setError(err);
      }).finally(() => {
        setIsLoading(false);
      });
    },
    (a, b) => !isDeepEqual(a, b)
  );
  return { search: search2, setSearch, query: { isLoading, data: results, error } };
}
function initOrama() {
  return create$1({
    schema: { _: "string" },
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: "english"
  });
}
function DefaultSearchDialog(props) {
  const { locale } = useI18n();
  const { search: search2, setSearch, query } = useDocsSearch({
    type: "static",
    initOrama,
    locale
  });
  return /* @__PURE__ */ jsxs(
    SearchDialog,
    {
      search: search2,
      onSearchChange: setSearch,
      isLoading: query.isLoading,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SearchDialogOverlay, {}),
        /* @__PURE__ */ jsxs(SearchDialogContent, { children: [
          /* @__PURE__ */ jsxs(SearchDialogHeader, { children: [
            /* @__PURE__ */ jsx(SearchDialogIcon, {}),
            /* @__PURE__ */ jsx(SearchDialogInput, {}),
            /* @__PURE__ */ jsx(SearchDialogClose, {})
          ] }),
          /* @__PURE__ */ jsx(SearchDialogList, { items: query.data !== "empty" ? query.data : null })
        ] })
      ]
    }
  );
}
const siteUrl = "https://constellation-overwatch.dev";
const siteName = "Constellation Overwatch";
const siteDescription = "Open Source C4 Data Fabric for Industrial Edge Computing. Tactical data stack for agentic drones, robots, sensors, and video streams.";
const ogImage = `${siteUrl}/images/og.png`;
const Route$3 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: siteName
      },
      {
        name: "description",
        content: siteDescription
      },
      // Open Graph
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:site_name",
        content: siteName
      },
      {
        property: "og:title",
        content: siteName
      },
      {
        property: "og:description",
        content: siteDescription
      },
      {
        property: "og:url",
        content: siteUrl
      },
      {
        property: "og:image",
        content: ogImage
      },
      {
        property: "og:image:width",
        content: "1200"
      },
      {
        property: "og:image:height",
        content: "630"
      },
      {
        property: "og:image:alt",
        content: "Constellation Overwatch - C4 Tactical Data Fabric for the Industrial Edge"
      },
      // Twitter Card
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:title",
        content: siteName
      },
      {
        name: "twitter:description",
        content: siteDescription
      },
      {
        name: "twitter:image",
        content: ogImage
      },
      {
        name: "twitter:image:alt",
        content: "Constellation Overwatch - C4 Tactical Data Fabric for the Industrial Edge"
      },
      // Additional SEO
      {
        name: "theme-color",
        content: "#1e293b"
      },
      {
        name: "robots",
        content: "index, follow"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/images/overwatch.svg" },
      { rel: "canonical", href: siteUrl }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsx(RootProvider, { search: { SearchDialog: DefaultSearchDialog }, children }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
let cachedVersionInfo = null;
let lastFetchTime = 0;
const CACHE_TTL = 36e5;
const getLatestVersion_createServerFn_handler = createSsrRpc("35bc1bf7ae688a6ff67750ed5d7e45480af8f39d65e4dadbef35dc285bbbf594");
const getLatestVersion = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(getLatestVersion_createServerFn_handler, async ({
  data
}) => {
  const now = Date.now();
  if (cachedVersionInfo && now - lastFetchTime < CACHE_TTL) {
    return cachedVersionInfo;
  }
  try {
    const response = await fetch("https://api.github.com/repos/Constellation-Overwatch/constellation-overwatch/releases/latest", {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "constellation-overwatch-web"
      }
    });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data2 = await response.json();
    cachedVersionInfo = {
      version: data2.tag_name || "v1.0.0",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    lastFetchTime = now;
    return cachedVersionInfo;
  } catch (error) {
    console.error("Failed to fetch latest version:", error);
    return cachedVersionInfo || {
      version: "v1.0.0",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});
const $$splitComponentImporter$1 = () => import("./index-DHhtNSl6.js");
const Route$2 = createFileRoute("/")({
  loader: () => getLatestVersion({
    data: void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const create = browser();
const browserCollections = {
  docs: create.doc("docs", /* @__PURE__ */ Object.assign({
    "./concepts/index.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.d),
    "./concepts/telemetry.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.g),
    "./index.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.h),
    "./integrations/aero-arc-relay.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.i),
    "./integrations/ffmpeg.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.j),
    "./integrations/index.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.k),
    "./integrations/vision.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.l),
    "./introduction/architecture.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.m),
    "./introduction/index.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.o),
    "./operations/deployment.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.p),
    "./operations/toolbelt.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.q),
    "./platform/api.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.r),
    "./platform/configuration.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.t),
    "./platform/installation.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.u),
    "./platform/quick-start.mdx": () => import("./staticFunctionMiddleware-3EePvBPZ.js").then((n) => n.w)
  }))
};
var Link2 = forwardRef(
  ({
    href = "#",
    // any protocol
    external = href.match(/^\w+:/) || // protocol relative URL
    href.startsWith("//"),
    prefetch,
    children,
    ...props
  }, ref) => {
    if (external) {
      return /* @__PURE__ */ jsx(
        "a",
        {
          ref,
          href,
          rel: "noreferrer noopener",
          target: "_blank",
          ...props,
          children
        }
      );
    }
    return /* @__PURE__ */ jsx(Link$1, { ref, href, prefetch, ...props, children });
  }
);
Link2.displayName = "Link";
function getBreadcrumbItemsFromPath(tree, path, options) {
  const {
    includePage = false,
    includeSeparator = false,
    includeRoot = false
  } = options;
  let items = [];
  for (let i = 0; i < path.length; i++) {
    const item = path[i];
    switch (item.type) {
      case "page":
        if (includePage)
          items.push({
            name: item.name,
            url: item.url
          });
        break;
      case "folder":
        if (item.root && !includeRoot) {
          items = [];
          break;
        }
        if (i === path.length - 1 || item.index !== path[i + 1]) {
          items.push({
            name: item.name,
            url: item.index?.url
          });
        }
        break;
      case "separator":
        if (item.name && includeSeparator)
          items.push({
            name: item.name
          });
        break;
    }
  }
  if (includeRoot) {
    items.unshift({
      name: tree.name,
      url: typeof includeRoot === "object" ? includeRoot.url : void 0
    });
  }
  return items;
}
function searchPath(nodes, url) {
  const normalizedUrl = normalizeUrl(url);
  return findPath(
    nodes,
    (node) => node.type === "page" && node.url === normalizedUrl
  );
}
const TreeContext = createContext(null);
const PathContext = createContext([]);
function TreeContextProvider({ tree: rawTree, children }) {
  const nextIdRef = useRef(0);
  const pathname = usePathname();
  const tree = useMemo(() => rawTree, [rawTree.$id ?? rawTree]);
  const path = useMemo(() => {
    return searchPath(tree.children, pathname) ?? (tree.fallback ? searchPath(tree.fallback.children, pathname) : null) ?? [];
  }, [tree, pathname]);
  const root = path.findLast((item) => item.type === "folder" && item.root) ?? tree;
  root.$id ?? (root.$id = String(nextIdRef.current++));
  return jsx(TreeContext, { value: useMemo(() => ({ root, full: tree }), [root, tree]), children: jsx(PathContext, { value: path, children }) });
}
function useTreePath() {
  return use(PathContext);
}
function useTreeContext() {
  const ctx = use(TreeContext);
  if (!ctx)
    throw new Error("You must wrap this component under <DocsLayout />");
  return ctx;
}
function normalize(urlOrPath) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith("/"))
    return urlOrPath.slice(0, -1);
  return urlOrPath;
}
function isActive(href, pathname, nested = true) {
  href = normalize(href);
  pathname = normalize(pathname);
  return href === pathname || nested && pathname.startsWith(`${href}/`);
}
const Collapsible = Primitive.Root;
const CollapsibleTrigger = Primitive.CollapsibleTrigger;
const CollapsibleContent = forwardRef(({ children, ...props }, ref) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return jsx(Primitive.CollapsibleContent, { ref, ...props, className: twMerge("overflow-hidden", mounted && "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down", props.className), children });
});
CollapsibleContent.displayName = Primitive.CollapsibleContent.displayName;
function mergeRefs$1(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var ActiveAnchorContext = createContext([]);
var ScrollContext = createContext({
  current: null
});
function useActiveAnchor() {
  return useContext(ActiveAnchorContext)[0];
}
function useActiveAnchors() {
  return useContext(ActiveAnchorContext);
}
function ScrollProvider({
  containerRef,
  children
}) {
  return /* @__PURE__ */ jsx(ScrollContext.Provider, { value: containerRef, children });
}
function AnchorProvider({
  toc,
  single = false,
  children
}) {
  const headings = useMemo(() => {
    return toc.map((item) => item.url.split("#")[1]);
  }, [toc]);
  return /* @__PURE__ */ jsx(ActiveAnchorContext.Provider, { value: useAnchorObserver(headings, single), children });
}
function TOCItem$2({
  ref,
  onActiveChange = () => null,
  ...props
}) {
  const containerRef = useContext(ScrollContext);
  const anchorRef = useRef(null);
  const activeOrder = useActiveAnchors().indexOf(props.href.slice(1));
  const isActive2 = activeOrder !== -1;
  const shouldScroll = activeOrder === 0;
  const onActiveChangeEvent = useEffectEvent(onActiveChange);
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const container = containerRef.current;
    if (container && anchor && shouldScroll)
      scrollIntoView(anchor, {
        behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "always",
        boundary: container
      });
  }, [containerRef, shouldScroll]);
  useEffect(() => {
    return () => onActiveChangeEvent(isActive2);
  }, [isActive2]);
  return /* @__PURE__ */ jsx("a", { ref: mergeRefs$1(anchorRef, ref), "data-active": isActive2, ...props, children: props.children });
}
function useAnchorObserver(watch, single) {
  const observerRef = useRef(null);
  const [activeAnchor, setActiveAnchor] = useState(() => []);
  const stateRef = useRef(null);
  const onChange = useEffectEvent((entries) => {
    stateRef.current ??= {
      visible: /* @__PURE__ */ new Set()
    };
    const state = stateRef.current;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        state.visible.add(entry.target.id);
      } else {
        state.visible.delete(entry.target.id);
      }
    }
    if (state.visible.size === 0) {
      const viewTop = entries.length > 0 ? entries[0]?.rootBounds?.top ?? 0 : 0;
      let fallback;
      let min = -1;
      for (const id of watch) {
        const element = document.getElementById(id);
        if (!element) continue;
        const d = Math.abs(viewTop - element.getBoundingClientRect().top);
        if (min === -1 || d < min) {
          fallback = element;
          min = d;
        }
      }
      setActiveAnchor(fallback ? [fallback.id] : []);
    } else {
      const items = watch.filter((item) => state.visible.has(item));
      setActiveAnchor(single ? items.slice(0, 1) : items);
    }
  });
  useEffect(() => {
    if (observerRef.current) return;
    observerRef.current = new IntersectionObserver(onChange, {
      rootMargin: "0px",
      threshold: 0.98
    });
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;
    const elements = watch.flatMap(
      (heading) => document.getElementById(heading) ?? []
    );
    for (const element of elements) observer.observe(element);
    return () => {
      for (const element of elements) observer.unobserve(element);
    };
  }, [watch]);
  return activeAnchor;
}
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
}
const TOCContext = createContext([]);
function useTOCItems() {
  return use(TOCContext);
}
function TOCProvider({ toc, children, ...props }) {
  return jsx(TOCContext, { value: toc, children: jsx(AnchorProvider, { toc, ...props, children }) });
}
function TOCScrollArea({ ref, className, ...props }) {
  const viewRef = useRef(null);
  return jsx("div", { ref: mergeRefs(viewRef, ref), className: twMerge("relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3", className), ...props, children: jsx(ScrollProvider, { containerRef: viewRef, children: props.children }) });
}
function TocThumb({ containerRef, ...props }) {
  const thumbRef = useRef(null);
  const active = useActiveAnchors();
  const onPrint = useEffectEvent(() => {
    if (!containerRef.current || !thumbRef.current)
      return;
    update(thumbRef.current, calc(containerRef.current, active));
  });
  useEffect(() => {
    if (!containerRef.current)
      return;
    const container = containerRef.current;
    const observer = new ResizeObserver(onPrint);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
  useOnChange(active, () => {
    if (containerRef.current && thumbRef.current) {
      update(thumbRef.current, calc(containerRef.current, active));
    }
  });
  return jsx("div", { ref: thumbRef, role: "none", ...props });
}
function calc(container, active) {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }
  let upper = Number.MAX_VALUE, lower = 0;
  for (const item of active) {
    const element = container.querySelector(`a[href="#${item}"]`);
    if (!element)
      continue;
    const styles = getComputedStyle(element);
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
    lower = Math.max(lower, element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom));
  }
  return [upper, lower - upper];
}
function update(element, info) {
  element.style.setProperty("--fd-top", `${info[0]}px`);
  element.style.setProperty("--fd-height", `${info[1]}px`);
}
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => jsxs(Primitive$1.Root, { ref, type: "scroll", className: twMerge("overflow-hidden", className), ...props, children: [children, jsx(Primitive$1.Corner, {}), jsx(ScrollBar, { orientation: "vertical" })] }));
ScrollArea.displayName = Primitive$1.Root.displayName;
const ScrollViewport = React.forwardRef(({ className, children, ...props }, ref) => jsx(Primitive$1.Viewport, { ref, className: twMerge("size-full rounded-[inherit]", className), ...props, children }));
ScrollViewport.displayName = Primitive$1.Viewport.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => jsx(Primitive$1.Scrollbar, { ref, orientation, className: twMerge("flex select-none data-[state=hidden]:animate-fd-fade-out", orientation === "vertical" && "h-full w-1.5", orientation === "horizontal" && "h-1.5 flex-col", className), ...props, children: jsx(Primitive$1.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-fd-border" }) }));
ScrollBar.displayName = Primitive$1.Scrollbar.displayName;
function useMediaQuery(query, disabled = false) {
  const [isMatch, setMatch] = useState(null);
  useEffect(() => {
    if (disabled) return;
    const mediaQueryList = window.matchMedia(query);
    const handleChange = () => {
      setMatch(mediaQueryList.matches);
    };
    handleChange();
    mediaQueryList.addEventListener("change", handleChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [disabled, query]);
  return isMatch;
}
const SidebarContext = createContext(null);
const FolderContext = createContext(null);
function SidebarProvider({ defaultOpenLevel = 0, prefetch = true, children }) {
  const closeOnRedirect = useRef(true);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const mode = useMediaQuery("(width < 768px)") ? "drawer" : "full";
  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }
    closeOnRedirect.current = true;
  });
  return jsx(SidebarContext, { value: useMemo(() => ({
    open,
    setOpen,
    collapsed,
    setCollapsed,
    closeOnRedirect,
    defaultOpenLevel,
    prefetch,
    mode
  }), [open, collapsed, defaultOpenLevel, prefetch, mode]), children });
}
function useSidebar() {
  const ctx = use(SidebarContext);
  if (!ctx)
    throw new Error("Missing SidebarContext, make sure you have wrapped the component in <DocsLayout /> and the context is available.");
  return ctx;
}
function useFolder() {
  return use(FolderContext);
}
function useFolderDepth() {
  return use(FolderContext)?.depth ?? 0;
}
function SidebarContent({ children }) {
  const { collapsed, mode } = useSidebar();
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(0);
  useOnChange(collapsed, () => {
    if (collapsed)
      setHover(false);
  });
  if (mode !== "full")
    return;
  function shouldIgnoreHover(e) {
    const element = ref.current;
    if (!element)
      return true;
    return !collapsed || e.pointerType === "touch" || element.getAnimations().length > 0;
  }
  return children({
    ref,
    collapsed,
    hovered: hover,
    onPointerEnter(e) {
      if (shouldIgnoreHover(e))
        return;
      window.clearTimeout(timerRef.current);
      setHover(true);
    },
    onPointerLeave(e) {
      if (shouldIgnoreHover(e))
        return;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        () => setHover(false),
        // if mouse is leaving the viewport, add a close delay
        Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100 ? 0 : 500
      );
    }
  });
}
function SidebarDrawerOverlay(props) {
  const { open, setOpen, mode } = useSidebar();
  if (mode !== "drawer")
    return;
  return jsx(Presence, { present: open, children: jsx("div", { "data-state": open ? "open" : "closed", onClick: () => setOpen(false), ...props }) });
}
function SidebarDrawerContent({ className, children, ...props }) {
  const { open, mode } = useSidebar();
  const state = open ? "open" : "closed";
  if (mode !== "drawer")
    return;
  return jsx(Presence, { present: open, children: ({ present }) => jsx("aside", { id: "nd-sidebar-mobile", "data-state": state, className: twMerge(!present && "invisible", className), ...props, children }) });
}
function SidebarViewport(props) {
  return jsx(ScrollArea, { ...props, className: twMerge("min-h-0 flex-1", props.className), children: jsx(ScrollViewport, { className: "p-4 overscroll-contain", style: {
    maskImage: "linear-gradient(to bottom, transparent, white 12px, white calc(100% - 12px), transparent)"
  }, children: props.children }) });
}
function SidebarSeparator(props) {
  const depth = useFolderDepth();
  return jsx("p", { ...props, className: twMerge("inline-flex items-center gap-2 mb-1.5 px-2 mt-6 empty:mb-0", depth === 0 && "first:mt-0", props.className), children: props.children });
}
function SidebarItem({ icon, children, ...props }) {
  const pathname = usePathname();
  const ref = useRef(null);
  const { prefetch } = useSidebar();
  const active = props.href !== void 0 && isActive(props.href, pathname, false);
  useAutoScroll(active, ref);
  return jsxs(Link2, { ref, "data-active": active, prefetch, ...props, children: [icon ?? (props.external ? jsx(ExternalLink, {}) : null), children] });
}
function SidebarFolder({ defaultOpen: defaultOpenProp, collapsible = true, active = false, children, ...props }) {
  const { defaultOpenLevel } = useSidebar();
  const depth = useFolderDepth() + 1;
  const defaultOpen = collapsible === false || active || (defaultOpenProp ?? defaultOpenLevel >= depth);
  const [open, setOpen] = useState(defaultOpen);
  useOnChange(defaultOpen, (v) => {
    if (v)
      setOpen(v);
  });
  return jsx(Collapsible, { open, onOpenChange: setOpen, disabled: !collapsible, ...props, children: jsx(FolderContext, { value: useMemo(() => ({ open, setOpen, depth, collapsible }), [collapsible, depth, open]), children }) });
}
function SidebarFolderTrigger({ children, ...props }) {
  const { open, collapsible } = use(FolderContext);
  if (collapsible) {
    return jsxs(CollapsibleTrigger, { ...props, children: [children, jsx(ChevronDown, { "data-icon": true, className: twMerge("ms-auto transition-transform", !open && "-rotate-90") })] });
  }
  return jsx("div", { ...props, children });
}
function SidebarFolderLink({ children, ...props }) {
  const ref = useRef(null);
  const { open, setOpen, collapsible } = use(FolderContext);
  const { prefetch } = useSidebar();
  const pathname = usePathname();
  const active = props.href !== void 0 && isActive(props.href, pathname, false);
  useAutoScroll(active, ref);
  return jsxs(Link2, { ref, "data-active": active, onClick: (e) => {
    if (!collapsible)
      return;
    if (e.target instanceof Element && e.target.matches("[data-icon], [data-icon] *")) {
      setOpen(!open);
      e.preventDefault();
    } else {
      setOpen(active ? !open : true);
    }
  }, prefetch, ...props, children: [children, collapsible && jsx(ChevronDown, { "data-icon": true, className: twMerge("ms-auto transition-transform", !open && "-rotate-90") })] });
}
function SidebarFolderContent(props) {
  return jsx(CollapsibleContent, { ...props, children: props.children });
}
function SidebarTrigger({ children, ...props }) {
  const { setOpen } = useSidebar();
  return jsx("button", { "aria-label": "Open Sidebar", onClick: () => setOpen((prev) => !prev), ...props, children });
}
function SidebarCollapseTrigger(props) {
  const { collapsed, setCollapsed } = useSidebar();
  return jsx("button", { type: "button", "aria-label": "Collapse Sidebar", "data-collapsed": collapsed, onClick: () => {
    setCollapsed((prev) => !prev);
  }, ...props, children: props.children });
}
function useAutoScroll(active, ref) {
  const { mode } = useSidebar();
  useEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, {
        boundary: document.getElementById(mode === "drawer" ? "nd-sidebar-mobile" : "nd-sidebar"),
        scrollMode: "if-needed"
      });
    }
  }, [active, mode, ref]);
}
const Base = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarViewport,
  useFolder,
  useFolderDepth,
  useSidebar
}, Symbol.toStringTag, { value: "Module" }));
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => jsx(PopoverPrimitive.Portal, { children: jsx(PopoverPrimitive.Content, { ref, align, sideOffset, side: "bottom", className: twMerge("z-50 origin-(--radix-popover-content-transform-origin) overflow-y-auto max-h-(--radix-popover-content-available-height) min-w-[240px] max-w-[98vw] rounded-xl border bg-fd-popover/60 backdrop-blur-lg p-2 text-sm text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[state=closed]:animate-fd-popover-out data-[state=open]:animate-fd-popover-in", className), ...props }) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
function SidebarTabsDropdown({ options, placeholder, ...props }) {
  const [open, setOpen] = useState(false);
  const { closeOnRedirect } = useSidebar();
  const pathname = usePathname();
  const selected = useMemo(() => {
    return options.findLast((item2) => isTabActive(item2, pathname));
  }, [options, pathname]);
  const onClick = () => {
    closeOnRedirect.current = false;
    setOpen(false);
  };
  const item = selected ? jsxs(Fragment$1, { children: [jsx("div", { className: "size-9 shrink-0 empty:hidden md:size-5", children: selected.icon }), jsxs("div", { children: [jsx("p", { className: "text-sm font-medium", children: selected.title }), jsx("p", { className: "text-sm text-fd-muted-foreground empty:hidden md:hidden", children: selected.description })] })] }) : placeholder;
  return jsxs(Popover, { open, onOpenChange: setOpen, children: [item && jsxs(PopoverTrigger, { ...props, className: twMerge("flex items-center gap-2 rounded-lg p-2 border bg-fd-secondary/50 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground", props.className), children: [item, jsx(ChevronsUpDown, { className: "shrink-0 ms-auto size-4 text-fd-muted-foreground" })] }), jsx(PopoverContent, { className: "flex flex-col gap-1 w-(--radix-popover-trigger-width) p-1 fd-scroll-container", children: options.map((item2) => {
    const isActive2 = selected && item2.url === selected.url;
    if (!isActive2 && item2.unlisted)
      return;
    return jsxs(Link2, { href: item2.url, onClick, ...item2.props, className: twMerge("flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground", item2.props?.className), children: [jsx("div", { className: "shrink-0 size-9 md:mb-auto md:size-5 empty:hidden", children: item2.icon }), jsxs("div", { children: [jsx("p", { className: "text-sm font-medium leading-none", children: item2.title }), jsx("p", { className: "text-[0.8125rem] text-fd-muted-foreground mt-1 empty:hidden", children: item2.description })] }), jsx(Check, { className: twMerge("shrink-0 ms-auto size-3.5 text-fd-primary", !isActive2 && "invisible") })] }, item2.url);
  }) })] });
}
function isTabActive(tab, pathname) {
  if (tab.urls)
    return tab.urls.has(normalize(pathname));
  return isActive(tab.url, pathname, true);
}
function useIsScrollTop({ enabled = true }) {
  const [isTop, setIsTop] = useState();
  useEffect(() => {
    if (!enabled)
      return;
    const listener = () => {
      setIsTop(window.scrollY < 10);
    };
    listener();
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [enabled]);
  return isTop;
}
const LayoutContext = createContext(null);
function LayoutContextProvider({ navTransparentMode = "none", children }) {
  const isTop = useIsScrollTop({ enabled: navTransparentMode === "top" }) ?? true;
  const isNavTransparent = navTransparentMode === "top" ? isTop : navTransparentMode === "always";
  return jsx(LayoutContext, { value: useMemo(() => ({
    isNavTransparent
  }), [isNavTransparent]), children });
}
function LayoutHeader(props) {
  const { isNavTransparent } = use(LayoutContext);
  return jsx("header", { "data-transparent": isNavTransparent, ...props, children: props.children });
}
function LayoutBody({ className, style, children, ...props }) {
  const { collapsed } = useSidebar();
  return jsx("div", { id: "nd-docs-layout", className: twMerge("grid transition-[grid-template-columns] overflow-x-clip min-h-(--fd-docs-height) auto-cols-auto auto-rows-auto [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px]", className), "data-sidebar-collapsed": collapsed, style: {
    gridTemplate: `"sidebar header toc"
        "sidebar toc-popover toc"
        "sidebar main toc" 1fr / minmax(var(--fd-sidebar-col), 1fr) minmax(0, calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-width) - var(--fd-toc-width))) minmax(min-content, 1fr)`,
    "--fd-docs-row-1": "var(--fd-banner-height, 0px)",
    "--fd-docs-row-2": "calc(var(--fd-docs-row-1) + var(--fd-header-height))",
    "--fd-docs-row-3": "calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))",
    "--fd-sidebar-col": collapsed ? "0px" : "var(--fd-sidebar-width)",
    ...style
  }, ...props, children });
}
function LayoutTabs({ options, ...props }) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return options.findLast((option) => isTabActive(option, pathname));
  }, [options, pathname]);
  return jsx("div", { ...props, className: twMerge("flex flex-row items-end gap-6 overflow-auto [grid-area:main]", props.className), children: options.map((option, i) => jsx(Link2, { href: option.url, className: twMerge("inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground", option.unlisted && selected !== option && "hidden", selected === option && "border-fd-primary text-fd-primary"), children: option.title }, i)) });
}
const footerCache = /* @__PURE__ */ new Map();
function useFooterItems() {
  const { root } = useTreeContext();
  const cached = footerCache.get(root.$id);
  if (cached)
    return cached;
  const list = [];
  function onNode(node) {
    if (node.type === "folder") {
      if (node.index)
        onNode(node.index);
      for (const child of node.children)
        onNode(child);
    } else if (node.type === "page" && !node.external) {
      list.push(node);
    }
  }
  for (const child of root.children)
    onNode(child);
  footerCache.set(root.$id, list);
  return list;
}
const TocPopoverContext = createContext(null);
function PageTOCPopover({ className, children, ...rest }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = use(LayoutContext);
  const onClick = useEffectEvent((e) => {
    if (!open)
      return;
    if (ref.current && !ref.current.contains(e.target))
      setOpen(false);
  });
  useEffect(() => {
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);
  return jsx(TocPopoverContext, { value: useMemo(() => ({
    open,
    setOpen
  }), [setOpen, open]), children: jsx(Collapsible, { open, onOpenChange: setOpen, "data-toc-popover": "", className: twMerge("sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]", className), ...rest, children: jsx("header", { ref, className: twMerge("border-b backdrop-blur-sm transition-colors", (!isNavTransparent || open) && "bg-fd-background/80", open && "shadow-lg"), children }) }) });
}
function PageTOCPopoverTrigger({ className, ...props }) {
  const { text } = useI18n();
  const { open } = use(TocPopoverContext);
  const items = useTOCItems();
  const active = useActiveAnchor();
  const selected = useMemo(() => items.findIndex((item) => active === item.url.slice(1)), [items, active]);
  const path = useTreePath().at(-1);
  const showItem = selected !== -1 && !open;
  return jsxs(CollapsibleTrigger, { className: twMerge("flex w-full h-10 items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6", className), "data-toc-popover-trigger": "", ...props, children: [jsx(ProgressCircle, { value: (selected + 1) / Math.max(1, items.length), max: 1, className: twMerge("shrink-0", open && "text-fd-primary") }), jsxs("span", { className: "grid flex-1 *:my-auto *:row-start-1 *:col-start-1", children: [jsx("span", { className: twMerge("truncate transition-[opacity,translate,color]", open && "text-fd-foreground", showItem && "opacity-0 -translate-y-full pointer-events-none"), children: path?.name ?? text.toc }), jsx("span", { className: twMerge("truncate transition-[opacity,translate]", !showItem && "opacity-0 translate-y-full pointer-events-none"), children: items[selected]?.title })] }), jsx(ChevronDown, { className: twMerge("shrink-0 transition-transform mx-0.5", open && "rotate-180") })] });
}
function clamp(input, min, max) {
  if (input < min)
    return min;
  if (input > max)
    return max;
  return input;
}
function ProgressCircle({ value, strokeWidth = 2, size = 24, min = 0, max = 100, ...restSvgProps }) {
  const normalizedValue = clamp(value, min, max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = normalizedValue / max * circumference;
  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: "none",
    strokeWidth
  };
  return jsxs("svg", { role: "progressbar", viewBox: `0 0 ${size} ${size}`, "aria-valuenow": normalizedValue, "aria-valuemin": min, "aria-valuemax": max, ...restSvgProps, children: [jsx("circle", { ...circleProps, className: "stroke-current/25" }), jsx("circle", { ...circleProps, stroke: "currentColor", strokeDasharray: circumference, strokeDashoffset: circumference - progress, strokeLinecap: "round", transform: `rotate(-90 ${size / 2} ${size / 2})`, className: "transition-all" })] });
}
function PageTOCPopoverContent(props) {
  return jsx(CollapsibleContent, { "data-toc-popover-content": "", ...props, className: twMerge("flex flex-col px-4 max-h-[50vh] md:px-6", props.className), children: props.children });
}
function PageFooter({ items, ...props }) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items)
      return items;
    const idx = footerList.findIndex((item) => isActive(item.url, pathname, false));
    if (idx === -1)
      return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1]
    };
  }, [footerList, items, pathname]);
  return jsxs("div", { ...props, className: twMerge("@container grid gap-4", previous && next ? "grid-cols-2" : "grid-cols-1", props.className), children: [previous ? jsx(FooterItem, { item: previous, index: 0 }) : null, next ? jsx(FooterItem, { item: next, index: 1 }) : null] });
}
function FooterItem({ item, index }) {
  const { text } = useI18n();
  const Icon = index === 0 ? ChevronLeft : ChevronRight;
  return jsxs(Link2, { href: item.url, className: twMerge("flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground @max-lg:col-span-full", index === 1 && "text-end"), children: [jsxs("div", { className: twMerge("inline-flex items-center gap-1.5 font-medium", index === 1 && "flex-row-reverse"), children: [jsx(Icon, { className: "-mx-1 size-4 shrink-0 rtl:rotate-180" }), jsx("p", { children: item.name })] }), jsx("p", { className: "text-fd-muted-foreground truncate", children: item.description ?? (index === 0 ? text.previousPage : text.nextPage) })] });
}
function PageBreadcrumb({ includeRoot, includeSeparator, includePage, ...props }) {
  const path = useTreePath();
  const { root } = useTreeContext();
  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includePage,
      includeSeparator,
      includeRoot
    });
  }, [includePage, includeRoot, includeSeparator, path, root]);
  if (items.length === 0)
    return null;
  return jsx("div", { ...props, className: twMerge("flex items-center gap-1.5 text-sm text-fd-muted-foreground", props.className), children: items.map((item, i) => {
    const className = twMerge("truncate", i === items.length - 1 && "text-fd-primary font-medium");
    return jsxs(Fragment, { children: [i !== 0 && jsx(ChevronRight, { className: "size-3.5 shrink-0" }), item.url ? jsx(Link2, { href: item.url, className: twMerge(className, "transition-opacity hover:opacity-80"), children: item.name }) : jsx("span", { className, children: item.name })] }, i);
  }) });
}
function TOCItems$1({ ref, className, ...props }) {
  const containerRef = useRef(null);
  const items = useTOCItems();
  const { text } = useI18n();
  if (items.length === 0)
    return jsx("div", { className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground", children: text.tocNoHeadings });
  return jsxs(Fragment$1, { children: [jsx(TocThumb, { containerRef, className: "absolute top-0 translate-y-(--fd-top) h-(--fd-height) w-px bg-fd-primary transition-[translate,height]" }), jsx("div", { ref: mergeRefs(ref, containerRef), className: twMerge("flex flex-col border-s border-fd-foreground/10", className), ...props, children: items.map((item) => jsx(TOCItem$1, { item }, item.url)) })] });
}
function TOCItem$1({ item }) {
  return jsx(TOCItem$2, { href: item.url, className: twMerge("prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary", item.depth <= 2 && "ps-3", item.depth === 3 && "ps-6", item.depth >= 4 && "ps-8"), children: item.title });
}
function TOCItems({ ref, className, ...props }) {
  const containerRef = useRef(null);
  const items = useTOCItems();
  const { text } = useI18n();
  const [svg, setSvg] = useState();
  useEffect(() => {
    if (!containerRef.current)
      return;
    const container = containerRef.current;
    function onResize() {
      if (container.clientHeight === 0)
        return;
      let w = 0, h = 0;
      const d = [];
      for (let i = 0; i < items.length; i++) {
        const element = container.querySelector(`a[href="#${items[i].url.slice(1)}"]`);
        if (!element)
          continue;
        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1, top = element.offsetTop + parseFloat(styles.paddingTop), bottom = element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom);
        w = Math.max(offset, w);
        h = Math.max(h, bottom);
        d.push(`${i === 0 ? "M" : "L"}${offset} ${top}`);
        d.push(`L${offset} ${bottom}`);
      }
      setSvg({
        path: d.join(" "),
        width: w + 1,
        height: h
      });
    }
    const observer = new ResizeObserver(onResize);
    onResize();
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [items]);
  if (items.length === 0)
    return jsx("div", { className: "rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground", children: text.tocNoHeadings });
  return jsxs(Fragment$1, { children: [svg && jsx("div", { className: "absolute start-0 top-0 rtl:-scale-x-100", style: {
    width: svg.width,
    height: svg.height,
    maskImage: `url("data:image/svg+xml,${// Inline SVG
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="1" fill="none" /></svg>`)}")`
  }, children: jsx(TocThumb, { containerRef, className: "translate-y-(--fd-top) h-(--fd-height) bg-fd-primary transition-[translate,height]" }) }), jsx("div", { ref: mergeRefs(containerRef, ref), className: twMerge("flex flex-col", className), ...props, children: items.map((item, i) => jsx(TOCItem, { item, upper: items[i - 1]?.depth, lower: items[i + 1]?.depth }, item.url)) })] });
}
function getItemOffset(depth) {
  if (depth <= 2)
    return 14;
  if (depth === 3)
    return 26;
  return 36;
}
function getLineOffset(depth) {
  return depth >= 3 ? 10 : 0;
}
function TOCItem({ item, upper = item.depth, lower = item.depth }) {
  const offset = getLineOffset(item.depth), upperOffset = getLineOffset(upper), lowerOffset = getLineOffset(lower);
  return jsxs(TOCItem$2, { href: item.url, style: {
    paddingInlineStart: getItemOffset(item.depth)
  }, className: "prose relative py-1.5 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary", children: [offset !== upperOffset && jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16", className: "absolute -top-1.5 start-0 size-4 rtl:-scale-x-100", children: jsx("line", { x1: upperOffset, y1: "0", x2: offset, y2: "12", className: "stroke-fd-foreground/10", strokeWidth: "1" }) }), jsx("div", { className: twMerge("absolute inset-y-0 w-px bg-fd-foreground/10", offset !== upperOffset && "top-1.5", offset !== lowerOffset && "bottom-1.5"), style: {
    insetInlineStart: offset
  } }), item.title] });
}
function DocsPage({ breadcrumb: { enabled: breadcrumbEnabled = true, component: breadcrumb, ...breadcrumbProps } = {}, footer = {}, full: full2 = false, tableOfContentPopover: { enabled: tocPopoverEnabled, component: tocPopover, ...tocPopoverOptions } = {}, tableOfContent: { enabled: tocEnabled, component: tocReplace, ...tocOptions } = {}, toc = [], children }) {
  tocEnabled ?? (tocEnabled = !full2 && (toc.length > 0 || tocOptions.footer !== void 0 || tocOptions.header !== void 0));
  tocPopoverEnabled ?? (tocPopoverEnabled = toc.length > 0 || tocPopoverOptions.header !== void 0 || tocPopoverOptions.footer !== void 0);
  let wrapper = (children2) => children2;
  if (tocEnabled || tocPopoverEnabled) {
    wrapper = (children2) => jsx(TOCProvider, { single: tocOptions.single, toc, children: children2 });
  }
  return wrapper(jsxs(Fragment$1, { children: [tocPopoverEnabled && (tocPopover ?? jsxs(PageTOCPopover, { children: [jsx(PageTOCPopoverTrigger, {}), jsxs(PageTOCPopoverContent, { children: [tocPopoverOptions.header, jsx(TOCScrollArea, { children: tocPopoverOptions.style === "clerk" ? jsx(TOCItems, {}) : jsx(TOCItems$1, {}) }), tocPopoverOptions.footer] })] })), jsxs("article", { id: "nd-page", "data-full": full2, className: twMerge("flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14", full2 ? "max-w-[1200px]" : "xl:layout:[--fd-toc-width:268px]"), children: [breadcrumbEnabled && (breadcrumb ?? jsx(PageBreadcrumb, { ...breadcrumbProps })), children, footer.enabled !== false && (footer.component ?? jsx(PageFooter, { items: footer.items }))] }), tocEnabled && (tocReplace ?? jsxs("div", { id: "nd-toc", className: "sticky top-(--fd-docs-row-1) h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] flex flex-col [grid-area:toc] w-(--fd-toc-width) pt-12 pe-4 pb-2 max-xl:hidden", children: [tocOptions.header, jsxs("h3", { id: "toc-title", className: "inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground", children: [jsx(Text, { className: "size-4" }), jsx(I18nLabel, { label: "toc" })] }), jsx(TOCScrollArea, { children: tocOptions.style === "clerk" ? jsx(TOCItems, {}) : jsx(TOCItems$1, {}) }), tocOptions.footer] }))] }));
}
function DocsBody({ children, className, ...props }) {
  return jsx("div", { ...props, className: twMerge("prose flex-1", className), children });
}
function DocsDescription({ children, className, ...props }) {
  if (children === void 0)
    return null;
  return jsx("p", { ...props, className: twMerge("mb-8 text-lg text-fd-muted-foreground", className), children });
}
function DocsTitle({ children, className, ...props }) {
  return jsx("h1", { ...props, className: twMerge("text-[1.75em] font-semibold", className), children });
}
function Cards(props) {
  return jsx("div", { ...props, className: twMerge("grid grid-cols-2 gap-3 @container", props.className), children: props.children });
}
function Card({ icon, title, description, ...props }) {
  const E = props.href ? Link2 : "div";
  return jsxs(E, { ...props, "data-card": true, className: twMerge("block rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full", props.href && "hover:bg-fd-accent/80", props.className), children: [icon ? jsx("div", { className: "not-prose mb-2 w-fit shadow-md rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground [&_svg]:size-4", children: icon }) : null, jsx("h3", { className: "not-prose mb-1 text-sm font-medium", children: title }), description ? jsx("p", { className: "my-0! text-sm text-fd-muted-foreground", children: description }) : null, jsx("div", { className: "text-sm text-fd-muted-foreground prose-no-margin empty:hidden", children: props.children })] });
}
const iconClass = "size-5 -me-0.5 fill-(--callout-color) text-fd-card";
function Callout({ children, title, ...props }) {
  return jsxs(CalloutContainer, { ...props, children: [title && jsx(CalloutTitle, { children: title }), jsx(CalloutDescription, { children })] });
}
function resolveAlias(type) {
  if (type === "warn")
    return "warning";
  if (type === "tip")
    return "info";
  return type;
}
function CalloutContainer({ type: inputType = "info", icon, children, className, style, ...props }) {
  const type = resolveAlias(inputType);
  return jsxs("div", { className: twMerge("flex gap-2 my-4 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md", className), style: {
    "--callout-color": `var(--color-fd-${type}, var(--color-fd-muted))`,
    ...style
  }, ...props, children: [jsx("div", { role: "none", className: "w-0.5 bg-(--callout-color)/50 rounded-sm" }), icon ?? {
    info: jsx(Info, { className: iconClass }),
    warning: jsx(TriangleAlert, { className: iconClass }),
    error: jsx(CircleX, { className: iconClass }),
    success: jsx(CircleCheck, { className: iconClass }),
    idea: jsx(Sun, { className: iconClass })
  }[type], jsx("div", { className: "flex flex-col gap-2 min-w-0 flex-1", children })] });
}
function CalloutTitle({ children, className, ...props }) {
  return jsx("p", { className: twMerge("font-medium my-0!", className), ...props, children });
}
function CalloutDescription({ children, className, ...props }) {
  return jsx("div", { className: twMerge("text-fd-muted-foreground prose-no-margin empty:hidden", className), ...props, children });
}
function Heading({ as, className, ...props }) {
  const As = as ?? "h1";
  if (!props.id)
    return jsx(As, { className, ...props });
  return jsxs(As, { className: twMerge("flex scroll-m-28 flex-row items-center gap-2", className), ...props, children: [jsx("a", { "data-card": "", href: `#${props.id}`, className: "peer", children: props.children }), jsx(Link, { "aria-hidden": true, className: "size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100" })] });
}
function useCopyButton(onCopy) {
  const [checked, setChecked] = useState(false);
  const callbackRef = useRef(onCopy);
  const timeoutRef = useRef(null);
  callbackRef.current = onCopy;
  const onClick = useCallback(() => {
    if (timeoutRef.current)
      window.clearTimeout(timeoutRef.current);
    const res = Promise.resolve(callbackRef.current());
    void res.then(() => {
      setChecked(true);
      timeoutRef.current = window.setTimeout(() => {
        setChecked(false);
      }, 1500);
    });
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current)
        window.clearTimeout(timeoutRef.current);
    };
  }, []);
  return [checked, onClick];
}
const listeners = /* @__PURE__ */ new Map();
const TabsContext$1 = createContext(null);
function useTabContext() {
  const ctx = use(TabsContext$1);
  if (!ctx)
    throw new Error("You must wrap your component in <Tabs>");
  return ctx;
}
const TabsList = Primitive$2.TabsList;
const TabsTrigger = Primitive$2.TabsTrigger;
function Tabs({ ref, groupId, persist = false, updateAnchor = false, defaultValue, value: _value, onValueChange: _onValueChange, ...props }) {
  const tabsRef = useRef(null);
  const valueToIdMap = useMemo(() => /* @__PURE__ */ new Map(), []);
  const [value, setValue] = _value === void 0 ? (
    // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
    useState(defaultValue)
  ) : (
    // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
    [_value, useEffectEvent((v) => _onValueChange?.(v))]
  );
  useLayoutEffect(() => {
    if (!groupId)
      return;
    let previous = sessionStorage.getItem(groupId);
    if (persist)
      previous ?? (previous = localStorage.getItem(groupId));
    if (previous)
      setValue(previous);
    const groupListeners = listeners.get(groupId) ?? /* @__PURE__ */ new Set();
    groupListeners.add(setValue);
    listeners.set(groupId, groupListeners);
    return () => {
      groupListeners.delete(setValue);
    };
  }, [groupId, persist, setValue]);
  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash)
      return;
    for (const [value2, id] of valueToIdMap.entries()) {
      if (id === hash) {
        setValue(value2);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [setValue, valueToIdMap]);
  return jsx(Primitive$2.Tabs, { ref: mergeRefs(ref, tabsRef), value, onValueChange: (v) => {
    if (updateAnchor) {
      const id = valueToIdMap.get(v);
      if (id) {
        window.history.replaceState(null, "", `#${id}`);
      }
    }
    if (groupId) {
      const groupListeners = listeners.get(groupId);
      if (groupListeners) {
        for (const listener of groupListeners)
          listener(v);
      }
      sessionStorage.setItem(groupId, v);
      if (persist)
        localStorage.setItem(groupId, v);
    } else {
      setValue(v);
    }
  }, ...props, children: jsx(TabsContext$1, { value: useMemo(() => ({ valueToIdMap }), [valueToIdMap]), children: props.children }) });
}
function TabsContent({ value, ...props }) {
  const { valueToIdMap } = useTabContext();
  if (props.id) {
    valueToIdMap.set(value, props.id);
  }
  return jsx(Primitive$2.TabsContent, { value, ...props, children: props.children });
}
const TabsContext = createContext(null);
function Pre(props) {
  return jsx("pre", { ...props, className: twMerge("min-w-full w-max *:flex *:flex-col", props.className), children: props.children });
}
function CodeBlock({ ref, title, allowCopy = true, keepBackground = false, icon, viewportProps = {}, children, Actions = (props2) => jsx("div", { ...props2, className: twMerge("empty:hidden", props2.className) }), ...props }) {
  const inTab = use(TabsContext) !== null;
  const areaRef = useRef(null);
  return jsxs("figure", { ref, dir: "ltr", ...props, tabIndex: -1, className: twMerge(inTab ? "bg-fd-secondary -mx-px -mb-px last:rounded-b-xl" : "my-4 bg-fd-card rounded-xl", keepBackground && "bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)", "shiki relative border shadow-sm not-prose overflow-hidden text-sm", props.className), children: [title ? jsxs("div", { className: "flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4", children: [typeof icon === "string" ? jsx("div", { className: "[&_svg]:size-3.5", dangerouslySetInnerHTML: {
    __html: icon
  } }) : icon, jsx("figcaption", { className: "flex-1 truncate", children: title }), Actions({
    className: "-me-2",
    children: allowCopy && jsx(CopyButton, { containerRef: areaRef })
  })] }) : Actions({
    className: "absolute top-2 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground",
    children: allowCopy && jsx(CopyButton, { containerRef: areaRef })
  }), jsx("div", { ref: areaRef, ...viewportProps, role: "region", tabIndex: 0, className: twMerge("text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring", viewportProps.className), style: {
    // space for toolbar
    "--padding-right": !title ? "calc(var(--spacing) * 8)" : void 0,
    counterSet: props["data-line-numbers"] ? `line ${Number(props["data-line-numbers-start"] ?? 1) - 1}` : void 0,
    ...viewportProps.style
  }, children })] });
}
function CopyButton({ className, containerRef, ...props }) {
  const [checked, onClick] = useCopyButton(() => {
    const pre = containerRef.current?.getElementsByTagName("pre").item(0);
    if (!pre)
      return;
    const clone = pre.cloneNode(true);
    clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
      node.replaceWith("\n");
    });
    void navigator.clipboard.writeText(clone.textContent ?? "");
  });
  return jsx("button", { type: "button", "data-checked": checked || void 0, className: twMerge(buttonVariants({
    className: "hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground",
    size: "icon-xs"
  }), className), "aria-label": checked ? "Copied Text" : "Copy Text", onClick, ...props, children: checked ? jsx(Check, {}) : jsx(Clipboard, {}) });
}
function CodeBlockTabs({ ref, ...props }) {
  const containerRef = useRef(null);
  const nested = use(TabsContext) !== null;
  return jsx(Tabs, { ref: mergeRefs(containerRef, ref), ...props, className: twMerge("bg-fd-card rounded-xl border", !nested && "my-4", props.className), children: jsx(TabsContext, { value: useMemo(() => ({
    containerRef,
    nested
  }), [nested]), children: props.children }) });
}
function CodeBlockTabsList(props) {
  return jsx(TabsList, { ...props, className: twMerge("flex flex-row px-2 overflow-x-auto text-fd-muted-foreground", props.className), children: props.children });
}
function CodeBlockTabsTrigger({ children, ...props }) {
  return jsxs(TabsTrigger, { ...props, className: twMerge("relative group inline-flex text-sm font-medium text-nowrap items-center transition-colors gap-2 px-2 py-1.5 hover:text-fd-accent-foreground data-[state=active]:text-fd-primary [&_svg]:size-3.5", props.className), children: [jsx("div", { className: "absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary" }), children] });
}
function CodeBlockTab(props) {
  return jsx(TabsContent, { ...props });
}
function Image(props) {
  return jsx(Image$1, { sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px", ...props, src: props.src, className: twMerge("rounded-lg", props.className) });
}
function Table(props) {
  return jsx("div", { className: "relative overflow-auto prose-no-margin my-6", children: jsx("table", { ...props }) });
}
const defaultMdxComponents = {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  pre: (props) => jsx(CodeBlock, { ...props, children: jsx(Pre, { children: props.children }) }),
  Card,
  Cards,
  a: Link2,
  img: Image,
  h1: (props) => jsx(Heading, { as: "h1", ...props }),
  h2: (props) => jsx(Heading, { as: "h2", ...props }),
  h3: (props) => jsx(Heading, { as: "h3", ...props }),
  h4: (props) => jsx(Heading, { as: "h4", ...props }),
  h5: (props) => jsx(Heading, { as: "h5", ...props }),
  h6: (props) => jsx(Heading, { as: "h6", ...props }),
  table: Table,
  Callout,
  CalloutContainer,
  CalloutTitle,
  CalloutDescription
};
const $$splitComponentImporter = () => import("./_-CQTbCztN.js");
const Route$1 = createFileRoute("/docs/$")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  loader: async ({
    params
  }) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await loader({
      data: slugs
    });
    await clientLoader.preload(data.path);
    return data;
  }
});
const loader_createServerFn_handler = createSsrRpc("3dffc64eabe29fc8f5f4021f5e1cdf4bfea9319ffba3a59848ead9dcd2fa0308");
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
function removeUndefined(value, deep = false) {
  const obj = value;
  for (const key in obj) {
    if (obj[key] === void 0) delete obj[key];
    if (!deep) continue;
    const entry = obj[key];
    if (typeof entry === "object" && entry !== null) {
      removeUndefined(entry, deep);
      continue;
    }
    if (Array.isArray(entry)) {
      for (const item of entry) removeUndefined(item, deep);
    }
  }
  return value;
}
function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildRegexFromQuery(q) {
  const trimmed = q.trim();
  if (trimmed.length === 0) return null;
  const terms = Array.from(
    new Set(
      trimmed.split(/\s+/).map((t) => t.trim()).filter(Boolean)
    )
  );
  if (terms.length === 0) return null;
  const escaped = terms.map(escapeRegExp).join("|");
  return new RegExp(`(${escaped})`, "gi");
}
function createContentHighlighter(query) {
  const regex = typeof query === "string" ? buildRegexFromQuery(query) : query;
  return {
    highlight(content) {
      if (!regex) return [{ type: "text", content }];
      const out = [];
      let i = 0;
      for (const match of content.matchAll(regex)) {
        if (i < match.index) {
          out.push({
            type: "text",
            content: content.substring(i, match.index)
          });
        }
        out.push({
          type: "text",
          content: match[0],
          styles: {
            highlight: true
          }
        });
        i = match.index + match[0].length;
      }
      if (i < content.length) {
        out.push({
          type: "text",
          content: content.substring(i)
        });
      }
      return out;
    }
  };
}
async function searchSimple(db, query, params = {}) {
  const highlighter = createContentHighlighter(query);
  const result = await search(db, {
    term: query,
    tolerance: 1,
    ...params,
    boost: {
      title: 2,
      ..."boost" in params ? params.boost : void 0
    }
  });
  return result.hits.map((hit) => ({
    type: "page",
    content: hit.document.title,
    breadcrumbs: hit.document.breadcrumbs,
    contentWithHighlights: highlighter.highlight(hit.document.title),
    id: hit.document.url,
    url: hit.document.url
  }));
}
async function searchAdvanced(db, query, tag = [], {
  mode = "fulltext",
  ...override
} = {}) {
  if (typeof tag === "string") tag = [tag];
  let params = {
    ...override,
    mode,
    where: removeUndefined({
      tags: tag.length > 0 ? {
        containsAll: tag
      } : void 0,
      ...override.where
    }),
    groupBy: {
      properties: ["page_id"],
      maxResult: 8,
      ...override.groupBy
    }
  };
  if (query.length > 0) {
    params = {
      ...params,
      term: query,
      properties: mode === "fulltext" ? ["content"] : ["content", "embeddings"]
    };
  }
  const highlighter = createContentHighlighter(query);
  const result = await search(db, params);
  const list = [];
  for (const item of result.groups ?? []) {
    const pageId = item.values[0];
    const page = getByID(db, pageId);
    if (!page) continue;
    list.push({
      id: pageId,
      type: "page",
      content: page.content,
      breadcrumbs: page.breadcrumbs,
      contentWithHighlights: highlighter.highlight(page.content),
      url: page.url
    });
    for (const hit of item.result) {
      if (hit.document.type === "page") continue;
      list.push({
        id: hit.document.id.toString(),
        content: hit.document.content,
        breadcrumbs: hit.document.breadcrumbs,
        contentWithHighlights: highlighter.highlight(hit.document.content),
        type: hit.document.type,
        url: hit.document.url
      });
    }
  }
  return list;
}
function createEndpoint(server2) {
  const { search: search2 } = server2;
  return {
    ...server2,
    async staticGET() {
      return Response.json(await server2.export());
    },
    async GET(request) {
      const url = new URL(request.url);
      const query = url.searchParams.get("query");
      if (!query) return Response.json([]);
      return Response.json(
        await search2(query, {
          tag: url.searchParams.get("tag")?.split(",") ?? void 0,
          locale: url.searchParams.get("locale") ?? void 0,
          mode: url.searchParams.get("mode") === "vector" ? "vector" : "full"
        })
      );
    }
  };
}
var advancedSchema = {
  content: "string",
  page_id: "string",
  type: "string",
  breadcrumbs: "string[]",
  tags: "enum[]",
  url: "string",
  embeddings: "vector[512]"
};
async function createDB({
  indexes,
  tokenizer,
  search: _,
  ...rest
}) {
  const items = typeof indexes === "function" ? await indexes() : indexes;
  const db = create$1({
    schema: advancedSchema,
    ...rest,
    components: {
      ...rest.components,
      tokenizer: tokenizer ?? rest.components?.tokenizer
    }
  });
  const mapTo = [];
  items.forEach((page) => {
    const pageTag = page.tag ?? [];
    const tags = Array.isArray(pageTag) ? pageTag : [pageTag];
    const data = page.structuredData;
    let id = 0;
    mapTo.push({
      id: page.id,
      page_id: page.id,
      type: "page",
      content: page.title,
      breadcrumbs: page.breadcrumbs,
      tags,
      url: page.url
    });
    const nextId = () => `${page.id}-${id++}`;
    if (page.description) {
      mapTo.push({
        id: nextId(),
        page_id: page.id,
        tags,
        type: "text",
        url: page.url,
        content: page.description
      });
    }
    for (const heading of data.headings) {
      mapTo.push({
        id: nextId(),
        page_id: page.id,
        type: "heading",
        tags,
        url: `${page.url}#${heading.id}`,
        content: heading.content
      });
    }
    for (const content of data.contents) {
      mapTo.push({
        id: nextId(),
        page_id: page.id,
        tags,
        type: "text",
        url: content.heading ? `${page.url}#${content.heading}` : page.url,
        content: content.content
      });
    }
  });
  await insertMultiple(db, mapTo);
  return db;
}
function defaultBuildIndex(source2) {
  function isBreadcrumbItem(item) {
    return typeof item === "string" && item.length > 0;
  }
  return async (page) => {
    let breadcrumbs;
    let structuredData;
    if ("structuredData" in page.data) {
      structuredData = page.data.structuredData;
    } else if ("load" in page.data && typeof page.data.load === "function") {
      structuredData = (await page.data.load()).structuredData;
    }
    if (!structuredData)
      throw new Error(
        "Cannot find structured data from page, please define the page to index function."
      );
    const pageTree = source2.getPageTree(page.locale);
    const path = findPath(
      pageTree.children,
      (node) => node.type === "page" && node.url === page.url
    );
    if (path) {
      breadcrumbs = [];
      path.pop();
      if (isBreadcrumbItem(pageTree.name)) {
        breadcrumbs.push(pageTree.name);
      }
      for (const segment of path) {
        if (!isBreadcrumbItem(segment.name)) continue;
        breadcrumbs.push(segment.name);
      }
    }
    return {
      title: page.data.title ?? basename(page.path, extname(page.path)),
      breadcrumbs,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData
    };
  };
}
function createFromSource(source2, options = {}) {
  const { buildIndex = defaultBuildIndex(source2) } = options;
  if (source2._i18n) {
    return createI18nSearchAPI("advanced", {
      ...options,
      i18n: source2._i18n,
      indexes: async () => {
        const indexes = source2.getLanguages().flatMap((entry) => {
          return entry.pages.map(async (page) => ({
            ...await buildIndex(page),
            locale: entry.language
          }));
        });
        return Promise.all(indexes);
      }
    });
  }
  return createSearchAPI("advanced", {
    ...options,
    indexes: async () => {
      const indexes = source2.getPages().map((page) => buildIndex(page));
      return Promise.all(indexes);
    }
  });
}
var STEMMERS = {
  arabic: "ar",
  armenian: "am",
  bulgarian: "bg",
  czech: "cz",
  danish: "dk",
  dutch: "nl",
  english: "en",
  finnish: "fi",
  french: "fr",
  german: "de",
  greek: "gr",
  hungarian: "hu",
  indian: "in",
  indonesian: "id",
  irish: "ie",
  italian: "it",
  lithuanian: "lt",
  nepali: "np",
  norwegian: "no",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "rs",
  slovenian: "ru",
  spanish: "es",
  swedish: "se",
  tamil: "ta",
  turkish: "tr",
  ukrainian: "uk",
  sanskrit: "sk"
};
async function getTokenizer(locale) {
  return {
    language: Object.keys(STEMMERS).find((lang) => STEMMERS[lang] === locale) ?? locale
  };
}
async function initAdvanced(options) {
  const map = /* @__PURE__ */ new Map();
  if (options.i18n.languages.length === 0) {
    return map;
  }
  const indexes = typeof options.indexes === "function" ? await options.indexes() : options.indexes;
  for (const locale of options.i18n.languages) {
    const localeIndexes = indexes.filter((index) => index.locale === locale);
    const mapped = options.localeMap?.[locale] ?? await getTokenizer(locale);
    map.set(
      locale,
      typeof mapped === "object" ? initAdvancedSearch({
        ...options,
        indexes: localeIndexes,
        ...mapped
      }) : initAdvancedSearch({
        ...options,
        language: mapped,
        indexes: localeIndexes
      })
    );
  }
  return map;
}
function createI18nSearchAPI(type, options) {
  const get = initAdvanced(options);
  return createEndpoint({
    async export() {
      const map = await get;
      const entries = Array.from(map.entries()).map(async ([k, v]) => [
        k,
        await v.export()
      ]);
      return {
        type: "i18n",
        data: Object.fromEntries(await Promise.all(entries))
      };
    },
    async search(query, searchOptions) {
      const map = await get;
      const locale = searchOptions?.locale ?? options.i18n.defaultLanguage;
      const handler = map.get(locale);
      if (handler) return handler.search(query, searchOptions);
      return [];
    }
  });
}
function createSearchAPI(type, options) {
  return createEndpoint(initAdvancedSearch(options));
}
function initAdvancedSearch(options) {
  const get = createDB(options);
  return {
    async export() {
      return {
        type: "advanced",
        ...save(await get)
      };
    },
    async search(query, searchOptions) {
      const db = await get;
      const mode = searchOptions?.mode;
      return searchAdvanced(db, query, searchOptions?.tag, {
        ...options.search,
        mode: mode === "vector" ? "vector" : "fulltext"
      }).catch((err) => {
        if (mode === "vector") {
          throw new Error(
            "failed to search, make sure you have installed `@orama/plugin-embeddings` according to their docs.",
            {
              cause: err
            }
          );
        }
        throw err;
      });
    }
  };
}
const server = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english"
});
const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: () => server.staticGET()
    }
  }
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const DocsSplatRoute = Route$1.update({
  id: "/docs/$",
  path: "/docs/$",
  getParentRoute: () => Route$3
});
const ApiSearchRoute = Route.update({
  id: "/api/search",
  path: "/api/search",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  ApiSearchRoute,
  DocsSplatRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function resolveLinkItems({ links = [], githubUrl }) {
  const result = [...links];
  if (githubUrl)
    result.push({
      type: "icon",
      url: githubUrl,
      text: "Github",
      label: "GitHub",
      icon: jsx("svg", { role: "img", viewBox: "0 0 24 24", fill: "currentColor", children: jsx("path", { d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" }) }),
      external: true
    });
  return result;
}
function renderTitleNav({ title, url = "/" }, props) {
  if (typeof title === "function")
    return title({ href: url, ...props });
  return jsx(Link2, { href: url, ...props, children: title });
}
function LinkItem({ ref, item, ...props }) {
  const pathname = usePathname();
  const activeType = item.active ?? "url";
  const active = activeType !== "none" && isActive(item.url, pathname, activeType === "nested-url");
  return jsx(Link2, { ref, href: item.url, external: item.external, ...props, "data-active": active, children: props.children });
}
const NavigationMenu = Primitive$3.Root;
const NavigationMenuList = Primitive$3.List;
const NavigationMenuItem = React.forwardRef(({ className, children, ...props }, ref) => jsx(Primitive$3.NavigationMenuItem, { ref, className: twMerge("list-none", className), ...props, children }));
NavigationMenuItem.displayName = Primitive$3.NavigationMenuItem.displayName;
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => jsx(Primitive$3.Trigger, { ref, className: twMerge("data-[state=open]:bg-fd-accent/50", className), ...props, children }));
NavigationMenuTrigger.displayName = Primitive$3.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => jsx(Primitive$3.Content, { ref, className: twMerge("absolute inset-x-0 top-0 overflow-auto fd-scroll-container max-h-[80svh] data-[motion=from-end]:animate-fd-enterFromRight data-[motion=from-start]:animate-fd-enterFromLeft data-[motion=to-end]:animate-fd-exitToRight data-[motion=to-start]:animate-fd-exitToLeft", className), ...props }));
NavigationMenuContent.displayName = Primitive$3.Content.displayName;
const NavigationMenuLink = Primitive$3.Link;
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => jsx("div", { ref, className: "flex w-full justify-center", children: jsx(Primitive$3.Viewport, { ...props, className: twMerge("relative h-(--radix-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden transition-[width,height] duration-300 data-[state=closed]:animate-fd-nav-menu-out data-[state=open]:animate-fd-nav-menu-in", className) }) }));
NavigationMenuViewport.displayName = Primitive$3.Viewport.displayName;
function SearchToggle({ hideIfDisabled, size = "icon-sm", color = "ghost", ...props }) {
  const { setOpenSearch, enabled } = useSearchContext();
  if (hideIfDisabled && !enabled)
    return null;
  return jsx("button", { type: "button", className: twMerge(buttonVariants({
    size,
    color
  }), props.className), "data-search": "", "aria-label": "Open Search", onClick: () => {
    setOpenSearch(true);
  }, children: jsx(Search, {}) });
}
function LargeSearchToggle({ hideIfDisabled, ...props }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();
  if (hideIfDisabled && !enabled)
    return null;
  return jsxs("button", { type: "button", "data-search-full": "", ...props, className: twMerge("inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground", props.className), onClick: () => {
    setOpenSearch(true);
  }, children: [jsx(Search, { className: "size-4" }), text.search, jsx("div", { className: "ms-auto inline-flex gap-0.5", children: hotKey.map((k, i) => jsx("kbd", { className: "rounded-md border bg-fd-background px-1.5", children: k.display }, i)) })] });
}
const itemVariants = cva("size-6.5 rounded-full p-1.5 text-fd-muted-foreground", {
  variants: {
    active: {
      true: "bg-fd-accent text-fd-accent-foreground",
      false: "text-fd-muted-foreground"
    }
  }
});
const full = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Airplay]
];
function ThemeToggle({ className, mode = "light-dark", ...props }) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const container = twMerge("inline-flex items-center rounded-full border p-1", className);
  if (mode === "light-dark") {
    const value2 = mounted ? resolvedTheme : null;
    return jsx("button", { className: container, "aria-label": `Toggle Theme`, onClick: () => setTheme(value2 === "light" ? "dark" : "light"), "data-theme-toggle": "", children: full.map(([key, Icon]) => {
      if (key === "system")
        return;
      return jsx(Icon, { fill: "currentColor", className: twMerge(itemVariants({ active: value2 === key })) }, key);
    }) });
  }
  const value = mounted ? theme : null;
  return jsx("div", { className: container, "data-theme-toggle": "", ...props, children: full.map(([key, Icon]) => jsx("button", { "aria-label": key, className: twMerge(itemVariants({ active: value === key })), onClick: () => setTheme(key), children: jsx(Icon, { className: "size-full", fill: "currentColor" }) }, key)) });
}
function LanguageToggle(props) {
  const context = useI18n();
  if (!context.locales)
    throw new Error("Missing `<I18nProvider />`");
  return jsxs(Popover, { children: [jsx(PopoverTrigger, { "aria-label": context.text.chooseLanguage, ...props, className: twMerge(buttonVariants({
    color: "ghost",
    className: "gap-1.5 p-1.5"
  }), props.className), children: props.children }), jsxs(PopoverContent, { className: "flex flex-col overflow-x-hidden p-0", children: [jsx("p", { className: "mb-1 p-2 text-xs font-medium text-fd-muted-foreground", children: context.text.chooseLanguage }), context.locales.map((item) => jsx("button", { type: "button", className: twMerge("p-2 text-start text-sm", item.locale === context.locale ? "bg-fd-primary/10 font-medium text-fd-primary" : "hover:bg-fd-accent hover:text-fd-accent-foreground"), onClick: () => {
    context.onChange?.(item.locale);
  }, children: item.name }, item.locale))] })] });
}
function LanguageToggleText(props) {
  const context = useI18n();
  const text = context.locales?.find((item) => item.locale === context.locale)?.name;
  return jsx("span", { ...props, children: text });
}
const navItemVariants = cva("[&_svg]:size-4", {
  variants: {
    variant: {
      main: "inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary",
      button: buttonVariants({
        color: "secondary",
        className: "gap-1.5"
      }),
      icon: buttonVariants({
        color: "ghost",
        size: "icon"
      })
    }
  },
  defaultVariants: {
    variant: "main"
  }
});
function Header({ nav = {}, i18n = false, links, githubUrl, themeSwitch = {}, searchToggle = {} }) {
  const { navItems, menuItems } = useMemo(() => {
    const navItems2 = [];
    const menuItems2 = [];
    for (const item of resolveLinkItems({ links, githubUrl })) {
      switch (item.on ?? "all") {
        case "menu":
          menuItems2.push(item);
          break;
        case "nav":
          navItems2.push(item);
          break;
        default:
          navItems2.push(item);
          menuItems2.push(item);
      }
    }
    return { navItems: navItems2, menuItems: menuItems2 };
  }, [links, githubUrl]);
  return jsxs(HeaderNavigationMenu, { transparentMode: nav.transparentMode, children: [renderTitleNav(nav, {
    className: "inline-flex items-center gap-2.5 font-semibold"
  }), nav.children, jsx("ul", { className: "flex flex-row items-center gap-2 px-6 max-sm:hidden", children: navItems.filter((item) => !isSecondary(item)).map((item, i) => jsx(NavigationMenuLinkItem, { item, className: "text-sm" }, i)) }), jsxs("div", { className: "flex flex-row items-center justify-end gap-1.5 flex-1 max-lg:hidden", children: [searchToggle.enabled !== false && (searchToggle.components?.lg ?? jsx(LargeSearchToggle, { className: "w-full rounded-full ps-2.5 max-w-[240px]", hideIfDisabled: true })), themeSwitch.enabled !== false && (themeSwitch.component ?? jsx(ThemeToggle, { mode: themeSwitch?.mode })), i18n && jsx(LanguageToggle, { children: jsx(Languages, { className: "size-5" }) }), jsx("ul", { className: "flex flex-row gap-2 items-center empty:hidden", children: navItems.filter(isSecondary).map((item, i) => jsx(NavigationMenuLinkItem, { className: twMerge(item.type === "icon" && "-mx-1 first:ms-0 last:me-0"), item }, i)) })] }), jsxs("ul", { className: "flex flex-row items-center ms-auto -me-1.5 lg:hidden", children: [searchToggle.enabled !== false && (searchToggle.components?.sm ?? jsx(SearchToggle, { className: "p-2", hideIfDisabled: true })), jsxs(NavigationMenuItem, { children: [jsx(NavigationMenuTrigger, { "aria-label": "Toggle Menu", className: twMerge(buttonVariants({
    size: "icon",
    color: "ghost",
    className: "group [&_svg]:size-5.5"
  })), onPointerMove: nav.enableHoverToOpen ? void 0 : (e) => e.preventDefault(), children: jsx(ChevronDown, { className: "transition-transform duration-300 group-data-[state=open]:rotate-180" }) }), jsxs(NavigationMenuContent, { className: "flex flex-col p-4 sm:flex-row sm:items-center sm:justify-end", children: [menuItems.filter((item) => !isSecondary(item)).map((item, i) => jsx(MobileNavigationMenuLinkItem, { item, className: "sm:hidden" }, i)), jsxs("div", { className: "-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-2", children: [menuItems.filter(isSecondary).map((item, i) => jsx(MobileNavigationMenuLinkItem, { item, className: twMerge(item.type === "icon" && "-mx-1 first:ms-0") }, i)), jsx("div", { role: "separator", className: "flex-1" }), i18n && jsxs(LanguageToggle, { children: [jsx(Languages, { className: "size-5" }), jsx(LanguageToggleText, {}), jsx(ChevronDown, { className: "size-3 text-fd-muted-foreground" })] }), themeSwitch.enabled !== false && (themeSwitch.component ?? jsx(ThemeToggle, { mode: themeSwitch?.mode }))] })] })] })] })] });
}
function isSecondary(item) {
  if ("secondary" in item && item.secondary != null)
    return item.secondary;
  return item.type === "icon";
}
function HeaderNavigationMenu({ transparentMode = "none", ...props }) {
  const [value, setValue] = useState("");
  const isTop = useIsScrollTop({ enabled: transparentMode === "top" }) ?? true;
  const isTransparent = transparentMode === "top" ? isTop : transparentMode === "always";
  return jsx(NavigationMenu, { value, onValueChange: setValue, asChild: true, children: jsx("header", { id: "nd-nav", ...props, className: twMerge("sticky h-14 top-0 z-40", props.className), children: jsxs("div", { className: twMerge("backdrop-blur-lg border-b transition-colors *:mx-auto *:max-w-(--fd-layout-width)", value.length > 0 && "max-lg:shadow-lg max-lg:rounded-b-2xl", (!isTransparent || value.length > 0) && "bg-fd-background/80"), children: [jsx(NavigationMenuList, { className: "flex h-14 w-full items-center px-4", asChild: true, children: jsx("nav", { children: props.children }) }), jsx(NavigationMenuViewport, {})] }) }) });
}
function NavigationMenuLinkItem({ item, ...props }) {
  if (item.type === "custom")
    return jsx("div", { ...props, children: item.children });
  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom") {
        return jsx(Fragment, { children: child.children }, j);
      }
      const { banner = child.icon ? jsx("div", { className: "w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4", children: child.icon }) : null, ...rest } = child.menu ?? {};
      return jsx(NavigationMenuLink, { asChild: true, children: jsx(Link2, { href: child.url, external: child.external, ...rest, className: twMerge("flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground", rest.className), children: rest.children ?? jsxs(Fragment$1, { children: [banner, jsx("p", { className: "text-base font-medium", children: child.text }), jsx("p", { className: "text-sm text-fd-muted-foreground empty:hidden", children: child.description })] }) }) }, `${j}-${child.url}`);
    });
    return jsxs(NavigationMenuItem, { ...props, children: [jsx(NavigationMenuTrigger, { className: twMerge(navItemVariants(), "rounded-md"), children: item.url ? jsx(Link2, { href: item.url, external: item.external, children: item.text }) : item.text }), jsx(NavigationMenuContent, { className: "grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3", children })] });
  }
  return jsx(NavigationMenuItem, { ...props, children: jsx(NavigationMenuLink, { asChild: true, children: jsx(LinkItem, { item, "aria-label": item.type === "icon" ? item.label : void 0, className: twMerge(navItemVariants({ variant: item.type })), children: item.type === "icon" ? item.icon : item.text }) }) });
}
function MobileNavigationMenuLinkItem({ item, ...props }) {
  if (item.type === "custom")
    return jsx("div", { className: twMerge("grid", props.className), children: item.children });
  if (item.type === "menu") {
    const header = jsxs(Fragment$1, { children: [item.icon, item.text] });
    return jsxs("div", { className: twMerge("mb-4 flex flex-col", props.className), children: [jsx("p", { className: "mb-1 text-sm text-fd-muted-foreground", children: item.url ? jsx(NavigationMenuLink, { asChild: true, children: jsx(Link2, { href: item.url, external: item.external, children: header }) }) : header }), item.items.map((child, i) => jsx(MobileNavigationMenuLinkItem, { item: child }, i))] });
  }
  return jsx(NavigationMenuLink, { asChild: true, children: jsxs(LinkItem, { item, className: twMerge({
    main: "inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4",
    icon: buttonVariants({
      size: "icon",
      color: "ghost"
    }),
    button: buttonVariants({
      color: "secondary",
      className: "gap-1.5 [&_svg]:size-4"
    })
  }[item.type ?? "main"], props.className), "aria-label": item.type === "icon" ? item.label : void 0, children: [item.icon, item.type === "icon" ? void 0 : item.text] }) });
}
function HomeLayout(props) {
  const { nav = {}, links, githubUrl, i18n, themeSwitch = {}, searchToggle, ...rest } = props;
  return jsxs("main", { id: "nd-home-layout", ...rest, className: twMerge("flex flex-1 flex-col [--fd-layout-width:1400px]", rest.className), children: [nav.enabled !== false && (nav.component ?? jsx(Header, { links, nav, themeSwitch, searchToggle, i18n, githubUrl })), props.children] });
}
function NotFound() {
  return /* @__PURE__ */ jsx(
    HomeLayout,
    {
      nav: {
        title: "Tanstack Start"
      },
      className: "text-center py-32 justify-center",
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-fd-muted-foreground", children: "404" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: "Page Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-fd-muted-foreground max-w-md", children: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable." }),
        /* @__PURE__ */ jsx(
          Link$2,
          {
            to: "/",
            className: "mt-4 px-4 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity",
            children: "Back to Home"
          }
        )
      ] })
    }
  );
}
function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound
  });
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  TagsListItem as $,
  LanguageToggleText as A,
  Base as B,
  Route$1 as C,
  browserCollections as D,
  DocsPage as E,
  DocsTitle as F,
  DocsDescription as G,
  HomeLayout as H,
  DocsBody as I,
  defaultMdxComponents as J,
  useI18n as K,
  LayoutContextProvider as L,
  useDocsSearch as M,
  useOnChange as N,
  SearchDialog as O,
  SearchDialogOverlay as P,
  SearchDialogContent as Q,
  Route$2 as R,
  SidebarContent as S,
  TreeContextProvider as T,
  SearchDialogHeader as U,
  SearchDialogIcon as V,
  SearchDialogInput as W,
  SearchDialogClose as X,
  SearchDialogList as Y,
  SearchDialogFooter as Z,
  TagsList as _,
  useTreePath as a,
  createContentHighlighter as a0,
  removeUndefined as a1,
  searchSimple as a2,
  searchAdvanced as a3,
  router as a4,
  Sidebar as b,
  buttonVariants as c,
  SearchToggle as d,
  SidebarDrawerOverlay as e,
  SidebarDrawerContent as f,
  useFolderDepth as g,
  SidebarFolderContent as h,
  SidebarFolderLink as i,
  useFolder as j,
  SidebarFolderTrigger as k,
  SidebarSeparator as l,
  mergeRefs as m,
  SidebarItem as n,
  LayoutBody as o,
  LayoutHeader as p,
  renderTitleNav as q,
  resolveLinkItems as r,
  LayoutTabs as s,
  LargeSearchToggle as t,
  useTreeContext as u,
  SidebarTabsDropdown as v,
  LanguageToggle as w,
  Languages as x,
  LinkItem as y,
  ThemeToggle as z
};
