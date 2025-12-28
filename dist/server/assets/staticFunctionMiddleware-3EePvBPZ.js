import path from "path";
import { icons } from "lucide-react";
import { createElement } from "react";
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { server } from "fumadocs-mdx/runtime/server";
import fs from "node:fs/promises";
import path$1 from "node:path";
import { b as getDefaultSerovalPlugins } from "../server.js";
import { fromJSON, toJSONAsync } from "seroval";
const createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { middleware })
      );
    },
    inputValidator: (inputValidator) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { inputValidator })
      );
    },
    client: (client) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { client })
      );
    },
    server: (server2) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { server: server2 })
      );
    }
  };
};
function iconPlugin(resolveIcon) {
  function replaceIcon(node) {
    if (node.icon === void 0 || typeof node.icon === "string")
      node.icon = resolveIcon(node.icon);
    return node;
  }
  return {
    name: "fumadocs:icon",
    transformPageTree: {
      file: replaceIcon,
      folder: replaceIcon,
      separator: replaceIcon
    }
  };
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }),
  mod
));
var path_exports = {};
__export(path_exports, {
  basename: () => basename,
  dirname: () => dirname,
  extname: () => extname,
  joinPath: () => joinPath,
  slash: () => slash,
  splitPath: () => splitPath
});
function basename(path2, ext) {
  const idx = path2.lastIndexOf("/");
  return path2.substring(
    idx === -1 ? 0 : idx + 1,
    ext ? path2.length - ext.length : path2.length
  );
}
function extname(path2) {
  const dotIdx = path2.lastIndexOf(".");
  if (dotIdx !== -1) {
    return path2.substring(dotIdx);
  }
  return "";
}
function dirname(path2) {
  return path2.split("/").slice(0, -1).join("/");
}
function splitPath(path2) {
  return path2.split("/").filter((p) => p.length > 0);
}
function joinPath(...paths) {
  const out = [];
  const parsed = paths.flatMap(splitPath);
  for (const seg of parsed) {
    switch (seg) {
      case "..":
        out.pop();
        break;
      case ".":
        break;
      default:
        out.push(seg);
    }
  }
  return out.join("/");
}
function slash(path2) {
  const isExtendedLengthPath = path2.startsWith("\\\\?\\");
  if (isExtendedLengthPath) {
    return path2;
  }
  return path2.replaceAll("\\", "/");
}
function normalizeUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!url.startsWith("/")) url = "/" + url;
  if (url.length > 1 && url.endsWith("/")) url = url.slice(0, -1);
  return url;
}
function findPath(nodes, matcher, options = {}) {
  const { includeSeparator = true } = options;
  function run(nodes2) {
    let separator2;
    for (const node of nodes2) {
      if (matcher(node)) {
        const items = [];
        if (separator2) items.push(separator2);
        items.push(node);
        return items;
      }
      if (node.type === "separator" && includeSeparator) {
        separator2 = node;
        continue;
      }
      if (node.type === "folder") {
        const items = node.index && matcher(node.index) ? [node.index] : run(node.children);
        if (items) {
          items.unshift(node);
          if (separator2) items.unshift(separator2);
          return items;
        }
      }
    }
  }
  return run(nodes) ?? null;
}
var VisitBreak = /* @__PURE__ */ Symbol("VisitBreak");
function visit(root, visitor) {
  function onNode(node, parent) {
    const result = visitor(node, parent);
    switch (result) {
      case "skip":
        return node;
      case "break":
        throw VisitBreak;
      default:
        if (result) node = result;
    }
    if ("index" in node && node.index) {
      node.index = onNode(node.index, node);
    }
    if ("fallback" in node && node.fallback) {
      node.fallback = onNode(node.fallback, node);
    }
    if ("children" in node) {
      for (let i = 0; i < node.children.length; i++) {
        node.children[i] = onNode(node.children[i], node);
      }
    }
    return node;
  }
  try {
    return onNode(root);
  } catch (e) {
    if (e === VisitBreak) return root;
    throw e;
  }
}
var FileSystem = class {
  constructor(inherit) {
    this.files = /* @__PURE__ */ new Map();
    this.folders = /* @__PURE__ */ new Map();
    if (inherit) {
      for (const [k, v] of inherit.folders) {
        this.folders.set(k, v);
      }
      for (const [k, v] of inherit.files) {
        this.files.set(k, v);
      }
    } else {
      this.folders.set("", []);
    }
  }
  read(path2) {
    return this.files.get(path2);
  }
  /**
   * get the direct children of folder (in virtual file path)
   */
  readDir(path2) {
    return this.folders.get(path2);
  }
  write(path2, file) {
    if (!this.files.has(path2)) {
      const dir = dirname(path2);
      this.makeDir(dir);
      this.readDir(dir)?.push(path2);
    }
    this.files.set(path2, file);
  }
  /**
   * Delete files at specified path.
   *
   * @param path - the target path.
   * @param [recursive=false] - if set to `true`, it will also delete directories.
   */
  delete(path2, recursive = false) {
    if (this.files.delete(path2)) return true;
    if (recursive) {
      const folder = this.folders.get(path2);
      if (!folder) return false;
      this.folders.delete(path2);
      for (const child of folder) {
        this.delete(child);
      }
      return true;
    }
    return false;
  }
  getFiles() {
    return Array.from(this.files.keys());
  }
  makeDir(path2) {
    const segments = splitPath(path2);
    for (let i = 0; i < segments.length; i++) {
      const segment = segments.slice(0, i + 1).join("/");
      if (this.folders.has(segment)) continue;
      this.folders.set(segment, []);
      this.folders.get(dirname(segment)).push(segment);
    }
  }
};
function isLocaleValid(locale) {
  return locale.length > 0 && !/\d+/.test(locale);
}
var parsers = {
  dir(path2) {
    const [locale, ...segs] = path2.split("/");
    if (locale && segs.length > 0 && isLocaleValid(locale))
      return [segs.join("/"), locale];
    return [path2];
  },
  dot(path2) {
    const dir = dirname(path2);
    const base = basename(path2);
    const parts = base.split(".");
    if (parts.length < 3) return [path2];
    const [locale] = parts.splice(parts.length - 2, 1);
    if (!isLocaleValid(locale)) return [path2];
    return [joinPath(dir, parts.join(".")), locale];
  },
  none(path2) {
    return [path2];
  }
};
function buildContentStorage(loaderConfig, defaultLanguage) {
  const {
    source: source2,
    plugins = [],
    i18n = {
      defaultLanguage,
      parser: "none",
      languages: [defaultLanguage]
    }
  } = loaderConfig;
  const parser = parsers[i18n.parser ?? "dot"];
  const storages = {};
  const normalized = /* @__PURE__ */ new Map();
  for (const inputFile of source2.files) {
    let file;
    if (inputFile.type === "page") {
      file = {
        format: "page",
        path: normalizePath(inputFile.path),
        // will be generated by the slugs plugin if unspecified
        slugs: inputFile.slugs,
        data: inputFile.data,
        absolutePath: inputFile.absolutePath
      };
    } else {
      file = {
        format: "meta",
        path: normalizePath(inputFile.path),
        absolutePath: inputFile.absolutePath,
        data: inputFile.data
      };
    }
    const [pathWithoutLocale, locale = i18n.defaultLanguage] = parser(
      file.path
    );
    const list = normalized.get(locale) ?? [];
    list.push({
      pathWithoutLocale,
      file
    });
    normalized.set(locale, list);
  }
  const fallbackLang = i18n.fallbackLanguage !== null ? i18n.fallbackLanguage ?? i18n.defaultLanguage : null;
  function scan(lang) {
    if (storages[lang]) return;
    let storage;
    if (fallbackLang && fallbackLang !== lang) {
      scan(fallbackLang);
      storage = new FileSystem(storages[fallbackLang]);
    } else {
      storage = new FileSystem();
    }
    for (const { pathWithoutLocale, file } of normalized.get(lang) ?? []) {
      storage.write(pathWithoutLocale, file);
    }
    const context = {
      storage
    };
    for (const plugin of plugins) {
      plugin.transformStorage?.(context);
    }
    storages[lang] = storage;
  }
  for (const lang of i18n.languages) scan(lang);
  return storages;
}
function normalizePath(path2) {
  const segments = splitPath(slash(path2));
  if (segments[0] === "." || segments[0] === "..")
    throw new Error("It must not start with './' or '../'");
  return segments.join("/");
}
function transformerFallback() {
  const addedFiles = /* @__PURE__ */ new Set();
  return {
    root(root) {
      const isolatedStorage = new FileSystem();
      for (const file of this.storage.getFiles()) {
        if (addedFiles.has(file)) continue;
        const content = this.storage.read(file);
        if (content) isolatedStorage.write(file, content);
      }
      if (isolatedStorage.getFiles().length === 0) return root;
      root.fallback = this.builder.build(isolatedStorage, {
        ...this.options,
        id: `fallback-${root.$id ?? ""}`,
        generateFallback: false
      });
      addedFiles.clear();
      return root;
    },
    file(node, file) {
      if (file) addedFiles.add(file);
      return node;
    },
    folder(node, _dir, metaPath) {
      if (metaPath) addedFiles.add(metaPath);
      return node;
    }
  };
}
var group = /^\((?<name>.+)\)$/;
var link = /^(?<external>external:)?(?:\[(?<icon>[^\]]+)])?\[(?<name>[^\]]+)]\((?<url>[^)]+)\)$/;
var separator = /^---(?:\[(?<icon>[^\]]+)])?(?<name>.+)---|^---$/;
var rest = "...";
var restReversed = "z...a";
var extractPrefix = "...";
var excludePrefix = "!";
function createPageTreeBuilder(loaderConfig) {
  const { plugins = [], url, pageTree: defaultOptions = {} } = loaderConfig;
  return {
    build(storage, options = defaultOptions) {
      const key = "";
      return this.buildI18n({ [key]: storage }, options)[key];
    },
    buildI18n(storages, options = defaultOptions) {
      let nextId = 0;
      const out = {};
      const transformers = [];
      if (options.transformers) {
        transformers.push(...options.transformers);
      }
      for (const plugin of plugins) {
        if (plugin.transformPageTree)
          transformers.push(plugin.transformPageTree);
      }
      if (options.generateFallback ?? true) {
        transformers.push(transformerFallback());
      }
      for (const [locale, storage] of Object.entries(storages)) {
        let rootId = locale.length === 0 ? "root" : locale;
        if (options.id) rootId = `${options.id}-${rootId}`;
        out[locale] = createPageTreeBuilderUtils({
          rootId,
          transformers,
          builder: this,
          options,
          getUrl: url,
          locale,
          storage,
          storages,
          generateNodeId() {
            return "_" + nextId++;
          }
        }).root();
      }
      return out;
    }
  };
}
function createFlattenPathResolver(storage) {
  const map = /* @__PURE__ */ new Map();
  const files = storage.getFiles();
  for (const file of files) {
    const content = storage.read(file);
    const flattenPath = file.substring(0, file.length - extname(file).length);
    map.set(flattenPath + "." + content.format, file);
  }
  return (name, format) => {
    return map.get(name + "." + format) ?? name;
  };
}
function createPageTreeBuilderUtils(ctx) {
  const resolveFlattenPath = createFlattenPathResolver(ctx.storage);
  const visitedPaths = /* @__PURE__ */ new Set();
  function nextNodeId(localId = ctx.generateNodeId()) {
    return `${ctx.rootId}:${localId}`;
  }
  return {
    buildPaths(paths, reversed = false) {
      const items = [];
      const folders = [];
      const sortedPaths = paths.sort(
        (a, b) => a.localeCompare(b) * (reversed ? -1 : 1)
      );
      for (const path2 of sortedPaths) {
        const fileNode = this.file(path2);
        if (fileNode) {
          if (basename(path2, extname(path2)) === "index")
            items.unshift(fileNode);
          else items.push(fileNode);
          continue;
        }
        const dirNode = this.folder(path2, false);
        if (dirNode) folders.push(dirNode);
      }
      items.push(...folders);
      return items;
    },
    resolveFolderItem(folderPath, item) {
      if (item === rest || item === restReversed) return item;
      let match = separator.exec(item);
      if (match?.groups) {
        let node = {
          $id: nextNodeId(),
          type: "separator",
          icon: match.groups.icon,
          name: match.groups.name
        };
        for (const transformer of ctx.transformers) {
          if (!transformer.separator) continue;
          node = transformer.separator.call(ctx, node);
        }
        return [node];
      }
      match = link.exec(item);
      if (match?.groups) {
        const { icon, url, name, external } = match.groups;
        let node = {
          $id: nextNodeId(),
          type: "page",
          icon,
          name,
          url,
          external: external ? true : void 0
        };
        for (const transformer of ctx.transformers) {
          if (!transformer.file) continue;
          node = transformer.file.call(ctx, node);
        }
        return [node];
      }
      const isExcept = item.startsWith(excludePrefix);
      const isExtract = !isExcept && item.startsWith(extractPrefix);
      let filename = item;
      if (isExcept) {
        filename = item.slice(excludePrefix.length);
      } else if (isExtract) {
        filename = item.slice(extractPrefix.length);
      }
      const path2 = resolveFlattenPath(joinPath(folderPath, filename), "page");
      if (isExcept) {
        visitedPaths.add(path2);
        return [];
      }
      const dirNode = this.folder(path2, false);
      if (dirNode) {
        return isExtract ? dirNode.children : [dirNode];
      }
      const fileNode = this.file(path2);
      return fileNode ? [fileNode] : [];
    },
    folder(folderPath, isGlobalRoot) {
      const { storage, options, transformers } = ctx;
      const files = storage.readDir(folderPath);
      if (!files) return;
      const metaPath = resolveFlattenPath(joinPath(folderPath, "meta"), "meta");
      const indexPath = resolveFlattenPath(
        joinPath(folderPath, "index"),
        "page"
      );
      let meta = storage.read(metaPath);
      if (meta && meta.format !== "meta") meta = void 0;
      const metadata = meta?.data ?? {};
      const { root = isGlobalRoot, pages: pages2 } = metadata;
      let index;
      let children;
      if (pages2) {
        const resolved = pages2.flatMap((item) => this.resolveFolderItem(folderPath, item));
        if (!root && !visitedPaths.has(indexPath)) {
          index = this.file(indexPath);
        }
        for (let i = 0; i < resolved.length; i++) {
          const item = resolved[i];
          if (item !== rest && item !== restReversed) continue;
          const items = this.buildPaths(
            files.filter((file) => !visitedPaths.has(file)),
            item === restReversed
          );
          resolved.splice(i, 1, ...items);
          break;
        }
        children = resolved;
      } else {
        if (!root && !visitedPaths.has(indexPath)) {
          index = this.file(indexPath);
        }
        children = this.buildPaths(
          files.filter((file) => !visitedPaths.has(file))
        );
      }
      let node = {
        type: "folder",
        name: metadata.title ?? index?.name ?? (() => {
          const folderName = basename(folderPath);
          return pathToName(group.exec(folderName)?.[1] ?? folderName);
        })(),
        icon: metadata.icon,
        root: metadata.root,
        defaultOpen: metadata.defaultOpen,
        description: metadata.description,
        collapsible: metadata.collapsible,
        index,
        children,
        $id: nextNodeId(folderPath),
        $ref: !options.noRef && meta ? {
          metaFile: metaPath
        } : void 0
      };
      visitedPaths.add(folderPath);
      for (const transformer of transformers) {
        if (!transformer.folder) continue;
        node = transformer.folder.call(ctx, node, folderPath, metaPath);
      }
      return node;
    },
    file(path2) {
      const { options, getUrl, storage, locale, transformers } = ctx;
      const page = storage.read(path2);
      if (page?.format !== "page") return;
      const { title: title2, description, icon } = page.data;
      let item = {
        $id: nextNodeId(path2),
        type: "page",
        name: title2 ?? pathToName(basename(path2, extname(path2))),
        description,
        icon,
        url: getUrl(page.slugs, locale),
        $ref: !options.noRef ? {
          file: path2
        } : void 0
      };
      visitedPaths.add(path2);
      for (const transformer of transformers) {
        if (!transformer.file) continue;
        item = transformer.file.call(ctx, item, path2);
      }
      return item;
    },
    root() {
      const folder = this.folder("", true);
      let root = {
        $id: ctx.rootId,
        name: folder.name || "Docs",
        children: folder.children
      };
      for (const transformer of ctx.transformers) {
        if (!transformer.root) continue;
        root = transformer.root.call(ctx, root);
      }
      return root;
    }
  };
}
function pathToName(name) {
  const result = [];
  for (const c of name) {
    if (result.length === 0) result.push(c.toLocaleUpperCase());
    else if (c === "-") result.push(" ");
    else result.push(c);
  }
  return result.join("");
}
var priorityMap = {
  pre: 1,
  default: 0,
  post: -1
};
function buildPlugins(plugins, sort = true) {
  const flatten = [];
  for (const plugin of plugins) {
    if (Array.isArray(plugin)) flatten.push(...buildPlugins(plugin, false));
    else if (plugin) flatten.push(plugin);
  }
  if (sort)
    return flatten.sort(
      (a, b) => priorityMap[b.enforce ?? "default"] - priorityMap[a.enforce ?? "default"]
    );
  return flatten;
}
function slugsPlugin(slugsFn) {
  function isIndex(file) {
    return basename(file, extname(file)) === "index";
  }
  return {
    name: "fumadocs:slugs",
    transformStorage({ storage }) {
      const indexFiles = /* @__PURE__ */ new Set();
      const taken = /* @__PURE__ */ new Set();
      const autoIndex = slugsFn === void 0;
      for (const path2 of storage.getFiles()) {
        const file = storage.read(path2);
        if (!file || file.format !== "page" || file.slugs) continue;
        if (isIndex(path2) && autoIndex) {
          indexFiles.add(path2);
          continue;
        }
        file.slugs = slugsFn ? slugsFn({ path: path2 }) : getSlugs(path2);
        const key = file.slugs.join("/");
        if (taken.has(key)) throw new Error("Duplicated slugs");
        taken.add(key);
      }
      for (const path2 of indexFiles) {
        const file = storage.read(path2);
        if (file?.format !== "page") continue;
        file.slugs = getSlugs(path2);
        if (taken.has(file.slugs.join("/"))) file.slugs.push("index");
      }
    }
  };
}
var GroupRegex = /^\(.+\)$/;
function getSlugs(file) {
  const dir = dirname(file);
  const name = basename(file, extname(file));
  const slugs = [];
  for (const seg of dir.split("/")) {
    if (seg.length > 0 && !GroupRegex.test(seg)) slugs.push(encodeURI(seg));
  }
  if (GroupRegex.test(name))
    throw new Error(`Cannot use folder group in file names: ${file}`);
  if (name !== "index") {
    slugs.push(encodeURI(name));
  }
  return slugs;
}
function indexPages(storages, { url }) {
  const result = {
    // (locale.slugs -> page)
    pages: /* @__PURE__ */ new Map(),
    // (locale.path -> page)
    pathToMeta: /* @__PURE__ */ new Map(),
    // (locale.path -> meta)
    pathToPage: /* @__PURE__ */ new Map()
  };
  for (const [lang, storage] of Object.entries(storages)) {
    for (const filePath of storage.getFiles()) {
      const item = storage.read(filePath);
      const path2 = `${lang}.${filePath}`;
      if (item.format === "meta") {
        result.pathToMeta.set(path2, {
          path: item.path,
          absolutePath: item.absolutePath,
          data: item.data
        });
        continue;
      }
      const page = {
        absolutePath: item.absolutePath,
        path: item.path,
        url: url(item.slugs, lang),
        slugs: item.slugs,
        data: item.data,
        locale: lang
      };
      result.pathToPage.set(path2, page);
      result.pages.set(`${lang}.${page.slugs.join("/")}`, page);
    }
  }
  return result;
}
function createGetUrl(baseUrl, i18n) {
  const baseSlugs = baseUrl.split("/");
  return (slugs, locale) => {
    const hideLocale = i18n?.hideLocale ?? "never";
    let urlLocale;
    if (hideLocale === "never") {
      urlLocale = locale;
    } else if (hideLocale === "default-locale" && locale !== i18n?.defaultLanguage) {
      urlLocale = locale;
    }
    const paths = [...baseSlugs, ...slugs];
    if (urlLocale) paths.unshift(urlLocale);
    return `/${paths.filter((v) => v.length > 0).join("/")}`;
  };
}
function loader(...args) {
  const loaderConfig = args.length === 2 ? resolveConfig(args[0], args[1]) : resolveConfig(args[0].source, args[0]);
  const { i18n } = loaderConfig;
  const defaultLanguage = i18n?.defaultLanguage ?? "";
  const storages = buildContentStorage(loaderConfig, defaultLanguage);
  const walker = indexPages(storages, loaderConfig);
  const builder = createPageTreeBuilder(loaderConfig);
  let pageTrees;
  function getPageTrees() {
    return pageTrees ??= builder.buildI18n(storages);
  }
  return {
    _i18n: i18n,
    get pageTree() {
      const trees = getPageTrees();
      return i18n ? trees : trees[defaultLanguage];
    },
    set pageTree(v) {
      if (i18n) {
        pageTrees = v;
      } else {
        pageTrees ??= {};
        pageTrees[defaultLanguage] = v;
      }
    },
    getPageByHref(href, { dir = "", language = defaultLanguage } = {}) {
      const [value, hash] = href.split("#", 2);
      let target;
      if (value.startsWith("./")) {
        const path2 = joinPath(dir, value);
        target = walker.pathToPage.get(`${language}.${path2}`);
      } else {
        target = this.getPages(language).find((item) => item.url === value);
      }
      if (target)
        return {
          page: target,
          hash
        };
    },
    resolveHref(href, parent) {
      if (href.startsWith("./")) {
        const target = this.getPageByHref(href, {
          dir: path.dirname(parent.path),
          language: parent.locale
        });
        if (target) {
          return target.hash ? `${target.page.url}#${target.hash}` : target.page.url;
        }
      }
      return href;
    },
    getPages(language) {
      const pages2 = [];
      for (const [key, value] of walker.pages.entries()) {
        if (language === void 0 || key.startsWith(`${language}.`)) {
          pages2.push(value);
        }
      }
      return pages2;
    },
    getLanguages() {
      const list = [];
      if (!i18n) return list;
      for (const language of i18n.languages) {
        list.push({
          language,
          pages: this.getPages(language)
        });
      }
      return list;
    },
    // the slugs plugin generates encoded slugs by default.
    // we can assume page slugs are always URI encoded.
    getPage(slugs = [], language = defaultLanguage) {
      let page = walker.pages.get(`${language}.${slugs.join("/")}`);
      if (page) return page;
      page = walker.pages.get(`${language}.${slugs.map(decodeURI).join("/")}`);
      if (page) return page;
    },
    getNodeMeta(node, language = defaultLanguage) {
      const ref = node.$ref?.metaFile;
      if (!ref) return;
      return walker.pathToMeta.get(`${language}.${ref}`);
    },
    getNodePage(node, language = defaultLanguage) {
      const ref = node.$ref?.file;
      if (!ref) return;
      return walker.pathToPage.get(`${language}.${ref}`);
    },
    getPageTree(locale = defaultLanguage) {
      const trees = getPageTrees();
      return trees[locale] ?? trees[defaultLanguage];
    },
    // @ts-expect-error -- ignore this
    generateParams(slug, lang) {
      if (i18n) {
        return this.getLanguages().flatMap(
          (entry) => entry.pages.map((page) => ({
            [slug ?? "slug"]: page.slugs,
            [lang ?? "lang"]: entry.language
          }))
        );
      }
      return this.getPages().map((page) => ({
        [slug ?? "slug"]: page.slugs
      }));
    },
    async serializePageTree(tree) {
      const { renderToString } = await import("react-dom/server.edge");
      return visit(tree, (node) => {
        node = { ...node };
        if ("icon" in node && node.icon) {
          node.icon = renderToString(node.icon);
        }
        if (node.name) {
          node.name = renderToString(node.name);
        }
        if ("children" in node) {
          node.children = [...node.children];
        }
        return node;
      });
    }
  };
}
function resolveConfig(source2, { slugs, icon, plugins = [], baseUrl, url, ...base }) {
  let config = {
    ...base,
    url: url ? (...args) => normalizeUrl(url(...args)) : createGetUrl(baseUrl, base.i18n),
    source: source2,
    plugins: buildPlugins([
      slugsPlugin(slugs),
      icon && iconPlugin(icon),
      ...typeof plugins === "function" ? plugins({
        typedPlugin: (plugin) => plugin
      }) : plugins
    ])
  };
  for (const plugin of config.plugins ?? []) {
    const result = plugin.config?.(config);
    if (result) config = result;
  }
  return config;
}
function lucideIconsPlugin(options = {}) {
  const { defaultIcon } = options;
  return iconPlugin((icon = defaultIcon) => {
    if (icon === void 0) return;
    const Icon = icons[icon];
    if (!icon) {
      console.warn(`[lucide-icons-plugin] Unknown icon detected: ${icon}.`);
      return;
    }
    return createElement(Icon);
  });
}
const title$5 = "Concepts";
const pages$5 = ["index", "telemetry"];
const __vite_glob_0_0 = {
  title: title$5,
  pages: pages$5
};
const title$4 = "Integrations";
const pages$4 = ["index", "aero-arc-relay", "vision", "ffmpeg"];
const __vite_glob_0_1 = {
  title: title$4,
  pages: pages$4
};
const title$3 = "Introduction";
const pages$3 = ["index", "architecture"];
const __vite_glob_0_2 = {
  title: title$3,
  pages: pages$3
};
const title$2 = "Documentation";
const pages$2 = ["index", "introduction", "platform", "concepts", "integrations", "operations"];
const __vite_glob_0_3 = {
  title: title$2,
  pages: pages$2
};
const title$1 = "Operations";
const pages$1 = ["toolbelt", "deployment"];
const __vite_glob_0_4 = {
  title: title$1,
  pages: pages$1
};
const title = "Platform";
const pages = ["installation", "quick-start", "configuration", "api"];
const __vite_glob_0_5 = {
  title,
  pages
};
let frontmatter$e = {
  "title": "Concepts",
  "description": "Core concepts and data design for Constellation Overwatch",
  "icon": "BookOpen"
};
let structuredData$e = {
  "contents": [{
    "heading": "concepts",
    "content": "Understand the core concepts and design principles behind Constellation Overwatch."
  }, {
    "heading": "concepts",
    "content": "Learn how to structure telemetry data with ontological primitives"
  }],
  "headings": [{
    "id": "concepts",
    "content": "Concepts"
  }]
};
const toc$e = [{
  depth: 1,
  url: "#concepts",
  title: jsx(Fragment, {
    children: "Concepts"
  })
}];
function _createMdxContent$e(props) {
  const _components = {
    h1: "h1",
    p: "p",
    ...props.components
  }, { Card, Cards } = _components;
  if (!Card) _missingMdxReference$b("Card");
  if (!Cards) _missingMdxReference$b("Cards");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "concepts",
      children: "Concepts"
    }), "\n", jsx(_components.p, {
      children: "Understand the core concepts and design principles behind Constellation Overwatch."
    }), "\n", jsx(Cards, {
      children: jsx(Card, {
        title: "Ontological Data Design",
        href: "/docs/concepts/telemetry",
        children: jsx(_components.p, {
          children: "Learn how to structure telemetry data with ontological primitives"
        })
      })
    })]
  });
}
function MDXContent$e(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$e, {
      ...props
    })
  }) : _createMdxContent$e(props);
}
function _missingMdxReference$b(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$e,
  frontmatter: frontmatter$e,
  structuredData: structuredData$e,
  toc: toc$e
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$d = {
  "title": "Ontological Data Design",
  "description": "Structuring telemetry data with ontological primitives",
  "icon": "Database"
};
let structuredData$d = {
  "contents": [{
    "heading": "ontological-data-design",
    "content": "Learn how to structure your telemetry data using Constellation Overwatch's ontological data primitives."
  }, {
    "heading": "overview",
    "content": "Constellation Overwatch uses an ontological approach to telemetry data, organizing sensor readings into semantic categories that reflect the physical reality of your entities."
  }, {
    "heading": "position",
    "content": "Geographic location in 3D space:"
  }, {
    "heading": "position",
    "content": "Field"
  }, {
    "heading": "position",
    "content": "Type"
  }, {
    "heading": "position",
    "content": "Description"
  }, {
    "heading": "position",
    "content": "lat"
  }, {
    "heading": "position",
    "content": "float"
  }, {
    "heading": "position",
    "content": "Latitude in degrees"
  }, {
    "heading": "position",
    "content": "lon"
  }, {
    "heading": "position",
    "content": "float"
  }, {
    "heading": "position",
    "content": "Longitude in degrees"
  }, {
    "heading": "position",
    "content": "alt"
  }, {
    "heading": "position",
    "content": "float"
  }, {
    "heading": "position",
    "content": "Altitude in meters (MSL)"
  }, {
    "heading": "orientation",
    "content": "Attitude in 3D space (Euler angles):"
  }, {
    "heading": "orientation",
    "content": "Field"
  }, {
    "heading": "orientation",
    "content": "Type"
  }, {
    "heading": "orientation",
    "content": "Description"
  }, {
    "heading": "orientation",
    "content": "roll"
  }, {
    "heading": "orientation",
    "content": "float"
  }, {
    "heading": "orientation",
    "content": "Roll angle in radians"
  }, {
    "heading": "orientation",
    "content": "pitch"
  }, {
    "heading": "orientation",
    "content": "float"
  }, {
    "heading": "orientation",
    "content": "Pitch angle in radians"
  }, {
    "heading": "orientation",
    "content": "yaw"
  }, {
    "heading": "orientation",
    "content": "float"
  }, {
    "heading": "orientation",
    "content": "Yaw/heading in radians"
  }, {
    "heading": "sensors",
    "content": "Environmental and onboard sensor readings:"
  }, {
    "heading": "state",
    "content": "Operational state and status:"
  }, {
    "heading": "performance",
    "content": "Performance metrics:"
  }, {
    "heading": "complete-telemetry-payload",
    "content": "A complete telemetry update combines all primitives:"
  }, {
    "heading": "publishing-telemetry",
    "content": "Publish to the global state KV bucket:"
  }, {
    "heading": "best-practices",
    "content": "Include timestamps - Always include ISO 8601 timestamps"
  }, {
    "heading": "best-practices",
    "content": "Use SI units - Meters, radians, Celsius, etc."
  }, {
    "heading": "best-practices",
    "content": "Batch updates - Combine related data in single updates"
  }, {
    "heading": "best-practices",
    "content": "Validate data - Check ranges before publishing"
  }],
  "headings": [{
    "id": "ontological-data-design",
    "content": "Ontological Data Design"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "data-primitives",
    "content": "Data Primitives"
  }, {
    "id": "position",
    "content": "Position"
  }, {
    "id": "orientation",
    "content": "Orientation"
  }, {
    "id": "sensors",
    "content": "Sensors"
  }, {
    "id": "state",
    "content": "State"
  }, {
    "id": "performance",
    "content": "Performance"
  }, {
    "id": "complete-telemetry-payload",
    "content": "Complete Telemetry Payload"
  }, {
    "id": "publishing-telemetry",
    "content": "Publishing Telemetry"
  }, {
    "id": "best-practices",
    "content": "Best Practices"
  }]
};
const toc$d = [{
  depth: 1,
  url: "#ontological-data-design",
  title: jsx(Fragment, {
    children: "Ontological Data Design"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#data-primitives",
  title: jsx(Fragment, {
    children: "Data Primitives"
  })
}, {
  depth: 3,
  url: "#position",
  title: jsx(Fragment, {
    children: "Position"
  })
}, {
  depth: 3,
  url: "#orientation",
  title: jsx(Fragment, {
    children: "Orientation"
  })
}, {
  depth: 3,
  url: "#sensors",
  title: jsx(Fragment, {
    children: "Sensors"
  })
}, {
  depth: 3,
  url: "#state",
  title: jsx(Fragment, {
    children: "State"
  })
}, {
  depth: 3,
  url: "#performance",
  title: jsx(Fragment, {
    children: "Performance"
  })
}, {
  depth: 2,
  url: "#complete-telemetry-payload",
  title: jsx(Fragment, {
    children: "Complete Telemetry Payload"
  })
}, {
  depth: 2,
  url: "#publishing-telemetry",
  title: jsx(Fragment, {
    children: "Publishing Telemetry"
  })
}, {
  depth: 2,
  url: "#best-practices",
  title: jsx(Fragment, {
    children: "Best Practices"
  })
}];
function _createMdxContent$d(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "ontological-data-design",
      children: "Ontological Data Design"
    }), "\n", jsx(_components.p, {
      children: "Learn how to structure your telemetry data using Constellation Overwatch's ontological data primitives."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsx(_components.p, {
      children: "Constellation Overwatch uses an ontological approach to telemetry data, organizing sensor readings into semantic categories that reflect the physical reality of your entities."
    }), "\n", jsx(_components.h2, {
      id: "data-primitives",
      children: "Data Primitives"
    }), "\n", jsx(_components.h3, {
      id: "position",
      children: "Position"
    }), "\n", jsx(_components.p, {
      children: "Geographic location in 3D space:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "position"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "lat"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "37.7749"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "lon"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "-122.4194"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "alt"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "100.5"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "lat"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Latitude in degrees"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "lon"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Longitude in degrees"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "alt"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Altitude in meters (MSL)"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "orientation",
      children: "Orientation"
    }), "\n", jsx(_components.p, {
      children: "Attitude in 3D space (Euler angles):"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "orientation"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "roll"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.1"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "pitch"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "-0.2"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "yaw"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "1.5"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Field"
          }), jsx(_components.th, {
            children: "Type"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "roll"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Roll angle in radians"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "pitch"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Pitch angle in radians"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "yaw"
            })
          }), jsx(_components.td, {
            children: "float"
          }), jsx(_components.td, {
            children: "Yaw/heading in radians"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "sensors",
      children: "Sensors"
    }), "\n", jsx(_components.p, {
      children: "Environmental and onboard sensor readings:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "sensors"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "temperature"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "22.5"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "humidity"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "65"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "pressure"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "1013.25"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "battery_voltage"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "22.2"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "state",
      children: "State"
    }), "\n", jsx(_components.p, {
      children: "Operational state and status:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "state"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "battery"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "85"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "mode"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"autonomous"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "armed"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "true"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "health"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"nominal"'
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "performance",
      children: "Performance"
    }), "\n", jsx(_components.p, {
      children: "Performance metrics:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "performance"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "velocity"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "5.2"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "thrust"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.7"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "efficiency"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.92"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "complete-telemetry-payload",
      children: "Complete Telemetry Payload"
    }), "\n", jsx(_components.p, {
      children: "A complete telemetry update combines all primitives:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "timestamp"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"2024-01-01T12:00:00Z"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "entity_id"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"drone-001"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "position"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"lat"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "37.7749"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"lon"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "-122.4194"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"alt"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "100"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "},"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "orientation"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"roll"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.1"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"pitch"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "-0.2"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"yaw"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "1.5"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "},"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "sensors"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"temperature"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "22.5"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"humidity"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "65"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"pressure"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "1013.25"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "},"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "state"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"battery"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "85"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"mode"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"autonomous"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"armed"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "true"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "},"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "performance"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"velocity"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "5.2"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"thrust"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.7"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '"efficiency"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.92"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "publishing-telemetry",
      children: "Publishing Telemetry"
    }), "\n", jsx(_components.p, {
      children: "Publish to the global state KV bucket:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "nats"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " kv"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " put"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " CONSTELLATION_GLOBAL_STATE"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "$ENTITY_ID"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ` '{"position": {...}}'`
            })]
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "best-practices",
      children: "Best Practices"
    }), "\n", jsxs(_components.ol, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Include timestamps"
        }), " - Always include ISO 8601 timestamps"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Use SI units"
        }), " - Meters, radians, Celsius, etc."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Batch updates"
        }), " - Combine related data in single updates"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Validate data"
        }), " - Check ranges before publishing"]
      }), "\n"]
    })]
  });
}
function MDXContent$d(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$d, {
      ...props
    })
  }) : _createMdxContent$d(props);
}
const __vite_glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$d,
  frontmatter: frontmatter$d,
  structuredData: structuredData$d,
  toc: toc$d
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$c = {
  "title": "Mission & Vision",
  "description": "Accelerating American Dynamism through open source industrial technology",
  "icon": "Target"
};
let structuredData$c = {
  "contents": [{
    "heading": "our-mission",
    "content": "Constellation Overwatch is a project focused on accelerating and enabling American dynamism by being cheaper, better, and faster."
  }, {
    "heading": "our-mission",
    "content": "We are uniquely aware of not only the long-term costs and risks to R&D and ROI for Strategic Reindustrialization projects, but also the Software licensing costs that restrict rapid response for commanders and operators to effectively mobilize and have an equitable chance against the big players."
  }, {
    "heading": "why-open-source-matters",
    "content": "type: info"
  }, {
    "heading": "why-open-source-matters",
    "content": "Open source is not just a development model—it's a strategic advantage for national security and industrial competitiveness."
  }, {
    "heading": "why-open-source-matters",
    "content": "Traditional defense and industrial software carries prohibitive licensing costs that:"
  }, {
    "heading": "why-open-source-matters",
    "content": "Limit accessibility for smaller operators and innovators"
  }, {
    "heading": "why-open-source-matters",
    "content": "Slow down iteration with lengthy procurement cycles"
  }, {
    "heading": "why-open-source-matters",
    "content": "Create vendor lock-in that stifles innovation"
  }, {
    "heading": "why-open-source-matters",
    "content": "Restrict rapid deployment in time-critical scenarios"
  }, {
    "heading": "our-approach",
    "content": "Ontological data primitives built for real-world industrial systems and edge computing."
  }, {
    "heading": "our-approach",
    "content": "Zero licensing costs. Deploy without budget constraints holding back your mission."
  }, {
    "heading": "our-approach",
    "content": "Community-driven development with transparent security. Battle-tested by real operators."
  }, {
    "heading": "our-approach",
    "content": "Deploy in minutes, not months. No procurement delays, no approval bottlenecks."
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Constellation Overwatch supports the broader mission of Strategic Reindustrialization by providing:"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Capability"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Impact"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Edge-first architecture"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Reduces infrastructure costs and latency for distributed operations"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Air-gapped deployment"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Full operational capability without external dependencies"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Modular integration"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Works with existing systems without costly overhauls"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "Open standards"
  }, {
    "heading": "strategic-reindustrialization",
    "content": "No vendor lock-in, preserving long-term flexibility"
  }, {
    "heading": "join-the-mission",
    "content": "We believe that the future of American industrial and defense capability depends on accessible, high-quality open source infrastructure. Constellation Overwatch is our contribution to that future."
  }],
  "headings": [{
    "id": "mission--vision",
    "content": "Mission & Vision"
  }, {
    "id": "our-mission",
    "content": "Our Mission"
  }, {
    "id": "why-open-source-matters",
    "content": "Why Open Source Matters"
  }, {
    "id": "our-approach",
    "content": "Our Approach"
  }, {
    "id": "strategic-reindustrialization",
    "content": "Strategic Reindustrialization"
  }, {
    "id": "join-the-mission",
    "content": "Join the Mission"
  }]
};
const toc$c = [{
  depth: 1,
  url: "#mission--vision",
  title: jsx(Fragment, {
    children: "Mission & Vision"
  })
}, {
  depth: 2,
  url: "#our-mission",
  title: jsx(Fragment, {
    children: "Our Mission"
  })
}, {
  depth: 2,
  url: "#why-open-source-matters",
  title: jsx(Fragment, {
    children: "Why Open Source Matters"
  })
}, {
  depth: 2,
  url: "#our-approach",
  title: jsx(Fragment, {
    children: "Our Approach"
  })
}, {
  depth: 2,
  url: "#strategic-reindustrialization",
  title: jsx(Fragment, {
    children: "Strategic Reindustrialization"
  })
}, {
  depth: 2,
  url: "#join-the-mission",
  title: jsx(Fragment, {
    children: "Join the Mission"
  })
}];
function _createMdxContent$c(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    li: "li",
    p: "p",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout, Card, Cards, Database, DollarSign, Rocket, Zap } = _components;
  if (!Callout) _missingMdxReference$a("Callout");
  if (!Card) _missingMdxReference$a("Card");
  if (!Cards) _missingMdxReference$a("Cards");
  if (!Database) _missingMdxReference$a("Database");
  if (!DollarSign) _missingMdxReference$a("DollarSign");
  if (!Rocket) _missingMdxReference$a("Rocket");
  if (!Zap) _missingMdxReference$a("Zap");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "mission--vision",
      children: "Mission & Vision"
    }), "\n", jsx(_components.h2, {
      id: "our-mission",
      children: "Our Mission"
    }), "\n", jsxs(_components.p, {
      children: ["Constellation Overwatch is a project focused on ", jsx(_components.strong, {
        children: "accelerating and enabling American dynamism"
      }), " by being ", jsx(_components.strong, {
        children: "cheaper, better, and faster"
      }), "."]
    }), "\n", jsx(_components.p, {
      children: "We are uniquely aware of not only the long-term costs and risks to R&D and ROI for Strategic Reindustrialization projects, but also the Software licensing costs that restrict rapid response for commanders and operators to effectively mobilize and have an equitable chance against the big players."
    }), "\n", jsx(_components.h2, {
      id: "why-open-source-matters",
      children: "Why Open Source Matters"
    }), "\n", jsx(Callout, {
      type: "info",
      children: jsx(_components.p, {
        children: "Open source is not just a development model—it's a strategic advantage for national security and industrial competitiveness."
      })
    }), "\n", jsx(_components.p, {
      children: "Traditional defense and industrial software carries prohibitive licensing costs that:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Limit accessibility"
        }), " for smaller operators and innovators"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Slow down iteration"
        }), " with lengthy procurement cycles"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Create vendor lock-in"
        }), " that stifles innovation"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Restrict rapid deployment"
        }), " in time-critical scenarios"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "our-approach",
      children: "Our Approach"
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Data Oriented Design",
        icon: jsx(Database, {}),
        children: jsx(_components.p, {
          children: "Ontological data primitives built for real-world industrial systems and edge computing."
        })
      }), jsx(Card, {
        title: "Cheaper",
        icon: jsx(DollarSign, {}),
        children: jsx(_components.p, {
          children: "Zero licensing costs. Deploy without budget constraints holding back your mission."
        })
      }), jsx(Card, {
        title: "Better",
        icon: jsx(Zap, {}),
        children: jsx(_components.p, {
          children: "Community-driven development with transparent security. Battle-tested by real operators."
        })
      }), jsx(Card, {
        title: "Faster",
        icon: jsx(Rocket, {}),
        children: jsx(_components.p, {
          children: "Deploy in minutes, not months. No procurement delays, no approval bottlenecks."
        })
      })]
    }), "\n", jsx(_components.h2, {
      id: "strategic-reindustrialization",
      children: "Strategic Reindustrialization"
    }), "\n", jsx(_components.p, {
      children: "Constellation Overwatch supports the broader mission of Strategic Reindustrialization by providing:"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Capability"
          }), jsx(_components.th, {
            children: "Impact"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Edge-first architecture"
            })
          }), jsx(_components.td, {
            children: "Reduces infrastructure costs and latency for distributed operations"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Air-gapped deployment"
            })
          }), jsx(_components.td, {
            children: "Full operational capability without external dependencies"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Modular integration"
            })
          }), jsx(_components.td, {
            children: "Works with existing systems without costly overhauls"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Open standards"
            })
          }), jsx(_components.td, {
            children: "No vendor lock-in, preserving long-term flexibility"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "join-the-mission",
      children: "Join the Mission"
    }), "\n", jsx(_components.p, {
      children: "We believe that the future of American industrial and defense capability depends on accessible, high-quality open source infrastructure. Constellation Overwatch is our contribution to that future."
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Get Started",
        href: "/docs/platform/installation",
        description: "Deploy Constellation Overwatch in your environment"
      }), jsx(Card, {
        title: "Contribute",
        href: "https://github.com/Constellation-Overwatch/constellation-overwatch",
        description: "Join the community and help build the future"
      })]
    })]
  });
}
function MDXContent$c(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$c, {
      ...props
    })
  }) : _createMdxContent$c(props);
}
function _missingMdxReference$a(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$c,
  frontmatter: frontmatter$c,
  structuredData: structuredData$c,
  toc: toc$c
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$b = {
  "title": "Aero Arc Relay",
  "description": "MAVLink relay bridge for Constellation Overwatch",
  "icon": "Plane"
};
let structuredData$b = {
  "contents": [{
    "heading": "aero-arc-relay",
    "content": "MAVLink relay bridge that connects UAVs and ground control stations to Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "Aero Arc Relay provides a bridge between MAVLink-compatible flight controllers and Constellation Overwatch's data fabric, enabling real-time telemetry streaming from drones and autonomous vehicles."
  }, {
    "heading": "features",
    "content": "MAVLink Protocol Support - Full MAVLink v2 protocol compatibility"
  }, {
    "heading": "features",
    "content": "Real-time Telemetry - Stream position, attitude, and sensor data"
  }, {
    "heading": "features",
    "content": "Bidirectional Communication - Send commands back to vehicles"
  }, {
    "heading": "features",
    "content": "Multi-vehicle Support - Connect multiple UAVs simultaneously"
  }, {
    "heading": "configuration",
    "content": "Configure the relay to connect to your Constellation Overwatch instance:"
  }, {
    "heading": "telemetry-data",
    "content": "The relay streams the following telemetry to Constellation:"
  }, {
    "heading": "telemetry-data",
    "content": "Data Type"
  }, {
    "heading": "telemetry-data",
    "content": "Description"
  }, {
    "heading": "telemetry-data",
    "content": "Position"
  }, {
    "heading": "telemetry-data",
    "content": "GPS coordinates (lat, lon, alt)"
  }, {
    "heading": "telemetry-data",
    "content": "Attitude"
  }, {
    "heading": "telemetry-data",
    "content": "Roll, pitch, yaw angles"
  }, {
    "heading": "telemetry-data",
    "content": "Velocity"
  }, {
    "heading": "telemetry-data",
    "content": "Ground speed and vertical speed"
  }, {
    "heading": "telemetry-data",
    "content": "Battery"
  }, {
    "heading": "telemetry-data",
    "content": "Voltage, current, remaining capacity"
  }, {
    "heading": "telemetry-data",
    "content": "Status"
  }, {
    "heading": "telemetry-data",
    "content": "Armed state, flight mode, health"
  }, {
    "heading": "telemetry-data",
    "content": "type: info"
  }, {
    "heading": "telemetry-data",
    "content": "For full documentation, see the GitHub repository."
  }],
  "headings": [{
    "id": "aero-arc-relay",
    "content": "Aero Arc Relay"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "features",
    "content": "Features"
  }, {
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "configuration",
    "content": "Configuration"
  }, {
    "id": "telemetry-data",
    "content": "Telemetry Data"
  }]
};
const toc$b = [{
  depth: 1,
  url: "#aero-arc-relay",
  title: jsx(Fragment, {
    children: "Aero Arc Relay"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#features",
  title: jsx(Fragment, {
    children: "Features"
  })
}, {
  depth: 2,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 2,
  url: "#configuration",
  title: jsx(Fragment, {
    children: "Configuration"
  })
}, {
  depth: 2,
  url: "#telemetry-data",
  title: jsx(Fragment, {
    children: "Telemetry Data"
  })
}];
function _createMdxContent$b(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    hr: "hr",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$9("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "aero-arc-relay",
      children: "Aero Arc Relay"
    }), "\n", jsx(_components.p, {
      children: "MAVLink relay bridge that connects UAVs and ground control stations to Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.a, {
        href: "https://github.com/Constellation-Overwatch/aero-arc-relay2constellation",
        children: "Aero Arc Relay"
      }), " provides a bridge between MAVLink-compatible flight controllers and Constellation Overwatch's data fabric, enabling real-time telemetry streaming from drones and autonomous vehicles."]
    }), "\n", jsx(_components.h2, {
      id: "features",
      children: "Features"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "MAVLink Protocol Support"
        }), " - Full MAVLink v2 protocol compatibility"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Real-time Telemetry"
        }), " - Stream position, attitude, and sensor data"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Bidirectional Communication"
        }), " - Send commands back to vehicles"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Multi-vehicle Support"
        }), " - Connect multiple UAVs simultaneously"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Clone the repository"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "git"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " clone"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://github.com/Constellation-Overwatch/aero-arc-relay2constellation.git"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "cd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " aero-arc-relay2constellation"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Build and run"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "go"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " build"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -o"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " aero-arc-relay"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "./aero-arc-relay"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "configuration",
      children: "Configuration"
    }), "\n", jsx(_components.p, {
      children: "Configure the relay to connect to your Constellation Overwatch instance:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "constellation"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  host"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "localhost"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  port"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "8080"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "your-api-token"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "mavlink"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  connection"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "serial:///dev/ttyUSB0:57600"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  system_id"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "1"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "telemetry-data",
      children: "Telemetry Data"
    }), "\n", jsx(_components.p, {
      children: "The relay streams the following telemetry to Constellation:"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Data Type"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Position"
          }), jsx(_components.td, {
            children: "GPS coordinates (lat, lon, alt)"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Attitude"
          }), jsx(_components.td, {
            children: "Roll, pitch, yaw angles"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Velocity"
          }), jsx(_components.td, {
            children: "Ground speed and vertical speed"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Battery"
          }), jsx(_components.td, {
            children: "Voltage, current, remaining capacity"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Status"
          }), jsx(_components.td, {
            children: "Armed state, flight mode, health"
          })]
        })]
      })]
    }), "\n", jsx(_components.hr, {}), "\n", jsx(Callout, {
      type: "info",
      children: jsxs(_components.p, {
        children: ["For full documentation, see the ", jsx(_components.a, {
          href: "https://github.com/Constellation-Overwatch/aero-arc-relay2constellation",
          children: "GitHub repository"
        }), "."]
      })
    })]
  });
}
function MDXContent$b(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$b, {
      ...props
    })
  }) : _createMdxContent$b(props);
}
function _missingMdxReference$9(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$b,
  frontmatter: frontmatter$b,
  structuredData: structuredData$b,
  toc: toc$b
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$a = {
  "title": "FFmpeg Streaming",
  "description": "Low-latency video streaming for Constellation Overwatch",
  "icon": "Video"
};
let structuredData$a = {
  "contents": [{
    "heading": "ffmpeg-streaming",
    "content": "Low-latency video streaming integration for edge devices and Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "FFmpeg2Constellation enables low-latency video streaming from edge devices, cameras, and UAVs to the Constellation Overwatch platform."
  }, {
    "heading": "features",
    "content": "Low Latency - Optimized for real-time video streaming"
  }, {
    "heading": "features",
    "content": "Multiple Formats - Support for RTSP, RTMP, HLS, and WebRTC"
  }, {
    "heading": "features",
    "content": "Hardware Acceleration - GPU-accelerated encoding/decoding"
  }, {
    "heading": "features",
    "content": "Adaptive Bitrate - Dynamic quality adjustment based on network conditions"
  }, {
    "heading": "configuration",
    "content": "Configure video streams for your devices:"
  }, {
    "heading": "streaming-protocols",
    "content": "Protocol"
  }, {
    "heading": "streaming-protocols",
    "content": "Latency"
  }, {
    "heading": "streaming-protocols",
    "content": "Use Case"
  }, {
    "heading": "streaming-protocols",
    "content": "WebRTC"
  }, {
    "heading": "streaming-protocols",
    "content": "<100ms"
  }, {
    "heading": "streaming-protocols",
    "content": "Real-time control"
  }, {
    "heading": "streaming-protocols",
    "content": "RTSP"
  }, {
    "heading": "streaming-protocols",
    "content": "200-500ms"
  }, {
    "heading": "streaming-protocols",
    "content": "IP cameras"
  }, {
    "heading": "streaming-protocols",
    "content": "HLS"
  }, {
    "heading": "streaming-protocols",
    "content": "2-10s"
  }, {
    "heading": "streaming-protocols",
    "content": "Playback/recording"
  }, {
    "heading": "streaming-protocols",
    "content": "type: info"
  }, {
    "heading": "streaming-protocols",
    "content": "For full documentation, see the GitHub repository."
  }],
  "headings": [{
    "id": "ffmpeg-streaming",
    "content": "FFmpeg Streaming"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "features",
    "content": "Features"
  }, {
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "configuration",
    "content": "Configuration"
  }, {
    "id": "streaming-protocols",
    "content": "Streaming Protocols"
  }]
};
const toc$a = [{
  depth: 1,
  url: "#ffmpeg-streaming",
  title: jsx(Fragment, {
    children: "FFmpeg Streaming"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#features",
  title: jsx(Fragment, {
    children: "Features"
  })
}, {
  depth: 2,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 2,
  url: "#configuration",
  title: jsx(Fragment, {
    children: "Configuration"
  })
}, {
  depth: 2,
  url: "#streaming-protocols",
  title: jsx(Fragment, {
    children: "Streaming Protocols"
  })
}];
function _createMdxContent$a(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    hr: "hr",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$8("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "ffmpeg-streaming",
      children: "FFmpeg Streaming"
    }), "\n", jsx(_components.p, {
      children: "Low-latency video streaming integration for edge devices and Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.a, {
        href: "https://github.com/Constellation-Overwatch/ffmpeg2constellation",
        children: "FFmpeg2Constellation"
      }), " enables low-latency video streaming from edge devices, cameras, and UAVs to the Constellation Overwatch platform."]
    }), "\n", jsx(_components.h2, {
      id: "features",
      children: "Features"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Low Latency"
        }), " - Optimized for real-time video streaming"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Multiple Formats"
        }), " - Support for RTSP, RTMP, HLS, and WebRTC"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Hardware Acceleration"
        }), " - GPU-accelerated encoding/decoding"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Adaptive Bitrate"
        }), " - Dynamic quality adjustment based on network conditions"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Clone the repository"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "git"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " clone"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://github.com/Constellation-Overwatch/ffmpeg2constellation.git"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "cd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " ffmpeg2constellation"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Build and run"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "make"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " build"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "./ffmpeg2constellation"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "configuration",
      children: "Configuration"
    }), "\n", jsx(_components.p, {
      children: "Configure video streams for your devices:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "streams"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "name"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "drone-camera"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    source"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "rtsp://192.168.1.100:8554/stream"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    output"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "webrtc"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "name"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "ground-camera"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    source"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "/dev/video0"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    output"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "hls"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "streaming-protocols",
      children: "Streaming Protocols"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Protocol"
          }), jsx(_components.th, {
            children: "Latency"
          }), jsx(_components.th, {
            children: "Use Case"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "WebRTC"
          }), jsx(_components.td, {
            children: "<100ms"
          }), jsx(_components.td, {
            children: "Real-time control"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "RTSP"
          }), jsx(_components.td, {
            children: "200-500ms"
          }), jsx(_components.td, {
            children: "IP cameras"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "HLS"
          }), jsx(_components.td, {
            children: "2-10s"
          }), jsx(_components.td, {
            children: "Playback/recording"
          })]
        })]
      })]
    }), "\n", jsx(_components.hr, {}), "\n", jsx(Callout, {
      type: "info",
      children: jsxs(_components.p, {
        children: ["For full documentation, see the ", jsx(_components.a, {
          href: "https://github.com/Constellation-Overwatch/ffmpeg2constellation",
          children: "GitHub repository"
        }), "."]
      })
    })]
  });
}
function MDXContent$a(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$a, {
      ...props
    })
  }) : _createMdxContent$a(props);
}
function _missingMdxReference$8(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$a,
  frontmatter: frontmatter$a,
  structuredData: structuredData$a,
  toc: toc$a
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$9 = {
  "title": "Integrations",
  "description": "Connect Constellation Overwatch with your existing systems",
  "icon": "Plug"
};
let structuredData$9 = {
  "contents": [{
    "heading": "integrations",
    "content": "Connect Constellation Overwatch with your existing infrastructure, sensors, and systems."
  }, {
    "heading": "integrations",
    "content": "type: info"
  }, {
    "heading": "integrations",
    "content": "Integrations documentation is coming soon. Check back for updates on MAVLink, Vision AI, video streaming, and more."
  }, {
    "heading": "planned-integrations",
    "content": "MAVLink relay bridge for UAVs and ground control stations"
  }, {
    "heading": "planned-integrations",
    "content": "Real-time video intelligence and object detection"
  }, {
    "heading": "planned-integrations",
    "content": "Low-latency video streaming for edge devices"
  }],
  "headings": [{
    "id": "integrations",
    "content": "Integrations"
  }, {
    "id": "planned-integrations",
    "content": "Planned Integrations"
  }]
};
const toc$9 = [{
  depth: 1,
  url: "#integrations",
  title: jsx(Fragment, {
    children: "Integrations"
  })
}, {
  depth: 2,
  url: "#planned-integrations",
  title: jsx(Fragment, {
    children: "Planned Integrations"
  })
}];
function _createMdxContent$9(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    p: "p",
    ...props.components
  }, { Callout, Card, Cards } = _components;
  if (!Callout) _missingMdxReference$7("Callout");
  if (!Card) _missingMdxReference$7("Card");
  if (!Cards) _missingMdxReference$7("Cards");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "integrations",
      children: "Integrations"
    }), "\n", jsx(_components.p, {
      children: "Connect Constellation Overwatch with your existing infrastructure, sensors, and systems."
    }), "\n", jsx(Callout, {
      type: "info",
      children: jsx(_components.p, {
        children: "Integrations documentation is coming soon. Check back for updates on MAVLink, Vision AI, video streaming, and more."
      })
    }), "\n", jsx(_components.h2, {
      id: "planned-integrations",
      children: "Planned Integrations"
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Aero Arc Relay",
        href: "/docs/integrations/aero-arc-relay",
        children: jsx(_components.p, {
          children: "MAVLink relay bridge for UAVs and ground control stations"
        })
      }), jsx(Card, {
        title: "Vision AI",
        href: "/docs/integrations/vision",
        children: jsx(_components.p, {
          children: "Real-time video intelligence and object detection"
        })
      }), jsx(Card, {
        title: "FFmpeg Streaming",
        href: "/docs/integrations/ffmpeg",
        children: jsx(_components.p, {
          children: "Low-latency video streaming for edge devices"
        })
      })]
    })]
  });
}
function MDXContent$9(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$9, {
      ...props
    })
  }) : _createMdxContent$9(props);
}
function _missingMdxReference$7(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$9,
  frontmatter: frontmatter$9,
  structuredData: structuredData$9,
  toc: toc$9
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$8 = {
  "title": "Vision AI",
  "description": "Real-time video intelligence for Constellation Overwatch",
  "icon": "Eye"
};
let structuredData$8 = {
  "contents": [{
    "heading": "vision-ai",
    "content": "Real-time video intelligence and object detection integration for Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "Vision2Constellation provides AI-powered video analysis capabilities, enabling real-time object detection, tracking, and classification at the edge."
  }, {
    "heading": "features",
    "content": "Real-time Detection - Low-latency object detection on video streams"
  }, {
    "heading": "features",
    "content": "Edge Processing - Run inference directly on edge devices"
  }, {
    "heading": "features",
    "content": "Custom Models - Support for custom YOLO and other detection models"
  }, {
    "heading": "features",
    "content": "Event Streaming - Push detection events to Constellation"
  }, {
    "heading": "supported-models",
    "content": "Model"
  }, {
    "heading": "supported-models",
    "content": "Use Case"
  }, {
    "heading": "supported-models",
    "content": "YOLOv8"
  }, {
    "heading": "supported-models",
    "content": "General object detection"
  }, {
    "heading": "supported-models",
    "content": "YOLOv8-seg"
  }, {
    "heading": "supported-models",
    "content": "Instance segmentation"
  }, {
    "heading": "supported-models",
    "content": "Custom"
  }, {
    "heading": "supported-models",
    "content": "Domain-specific detection"
  }, {
    "heading": "integration",
    "content": "Detection events are streamed to Constellation Overwatch in real-time:"
  }, {
    "heading": "integration",
    "content": "type: info"
  }, {
    "heading": "integration",
    "content": "For full documentation, see the GitHub repository."
  }],
  "headings": [{
    "id": "vision-ai",
    "content": "Vision AI"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "features",
    "content": "Features"
  }, {
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "supported-models",
    "content": "Supported Models"
  }, {
    "id": "integration",
    "content": "Integration"
  }]
};
const toc$8 = [{
  depth: 1,
  url: "#vision-ai",
  title: jsx(Fragment, {
    children: "Vision AI"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#features",
  title: jsx(Fragment, {
    children: "Features"
  })
}, {
  depth: 2,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 2,
  url: "#supported-models",
  title: jsx(Fragment, {
    children: "Supported Models"
  })
}, {
  depth: 2,
  url: "#integration",
  title: jsx(Fragment, {
    children: "Integration"
  })
}];
function _createMdxContent$8(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    hr: "hr",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$6("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "vision-ai",
      children: "Vision AI"
    }), "\n", jsx(_components.p, {
      children: "Real-time video intelligence and object detection integration for Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.a, {
        href: "https://github.com/Constellation-Overwatch/vision2constellation",
        children: "Vision2Constellation"
      }), " provides AI-powered video analysis capabilities, enabling real-time object detection, tracking, and classification at the edge."]
    }), "\n", jsx(_components.h2, {
      id: "features",
      children: "Features"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Real-time Detection"
        }), " - Low-latency object detection on video streams"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Edge Processing"
        }), " - Run inference directly on edge devices"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Custom Models"
        }), " - Support for custom YOLO and other detection models"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Event Streaming"
        }), " - Push detection events to Constellation"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Clone the repository"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "git"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " clone"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://github.com/Constellation-Overwatch/vision2constellation.git"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "cd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " vision2constellation"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Install dependencies and run"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "pip"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " install"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -r"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " requirements.txt"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "python"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " main.py"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "supported-models",
      children: "Supported Models"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Model"
          }), jsx(_components.th, {
            children: "Use Case"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "YOLOv8"
          }), jsx(_components.td, {
            children: "General object detection"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "YOLOv8-seg"
          }), jsx(_components.td, {
            children: "Instance segmentation"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Custom"
          }), jsx(_components.td, {
            children: "Domain-specific detection"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "integration",
      children: "Integration"
    }), "\n", jsx(_components.p, {
      children: "Detection events are streamed to Constellation Overwatch in real-time:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "timestamp"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"2024-01-01T00:00:00Z"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "entity_id"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"drone-001"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "detections"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": ["
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "    {"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '      "class"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"person"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '      "confidence"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "0.95"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ","
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '      "bbox"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": ["
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "100"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "200"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "150"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ", "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "300"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "]"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "    }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  ]"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.hr, {}), "\n", jsx(Callout, {
      type: "info",
      children: jsxs(_components.p, {
        children: ["For full documentation, see the ", jsx(_components.a, {
          href: "https://github.com/Constellation-Overwatch/vision2constellation",
          children: "GitHub repository"
        }), "."]
      })
    })]
  });
}
function MDXContent$8(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$8, {
      ...props
    })
  }) : _createMdxContent$8(props);
}
function _missingMdxReference$6(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$8,
  frontmatter: frontmatter$8,
  structuredData: structuredData$8,
  toc: toc$8
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$7 = {
  "title": "Architecture",
  "description": "System architecture overview for Constellation Overwatch",
  "icon": "Boxes"
};
let structuredData$7 = {
  "contents": [{
    "heading": "architecture",
    "content": "System architecture overview for Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "Constellation Overwatch is designed as a lightweight, edge-first data fabric that brings together telemetry, video, and AI processing in a unified platform."
  }, {
    "heading": "data-fabric-layer",
    "content": "Component"
  }, {
    "heading": "data-fabric-layer",
    "content": "Technology"
  }, {
    "heading": "data-fabric-layer",
    "content": "Purpose"
  }, {
    "heading": "data-fabric-layer",
    "content": "Messaging"
  }, {
    "heading": "data-fabric-layer",
    "content": "NATS JetStream"
  }, {
    "heading": "data-fabric-layer",
    "content": "Real-time pub/sub and persistent messaging"
  }, {
    "heading": "data-fabric-layer",
    "content": "Database"
  }, {
    "heading": "data-fabric-layer",
    "content": "Turso (SQLite)"
  }, {
    "heading": "data-fabric-layer",
    "content": "Embedded relational storage"
  }, {
    "heading": "data-fabric-layer",
    "content": "API"
  }, {
    "heading": "data-fabric-layer",
    "content": "Go + Templ"
  }, {
    "heading": "data-fabric-layer",
    "content": "RESTful API and server-rendered UI"
  }, {
    "heading": "edge-layer",
    "content": "Component"
  }, {
    "heading": "edge-layer",
    "content": "Purpose"
  }, {
    "heading": "edge-layer",
    "content": "Aero Arc Relay"
  }, {
    "heading": "edge-layer",
    "content": "MAVLink bridge for UAVs"
  }, {
    "heading": "edge-layer",
    "content": "Vision"
  }, {
    "heading": "edge-layer",
    "content": "AI-powered video analysis"
  }, {
    "heading": "edge-layer",
    "content": "FFmpeg"
  }, {
    "heading": "edge-layer",
    "content": "Low-latency video streaming"
  }, {
    "heading": "integration-layer",
    "content": "Protocol"
  }, {
    "heading": "integration-layer",
    "content": "Use Case"
  }, {
    "heading": "integration-layer",
    "content": "MAVLink"
  }, {
    "heading": "integration-layer",
    "content": "Drone communication"
  }, {
    "heading": "integration-layer",
    "content": "RTSP/WebRTC"
  }, {
    "heading": "integration-layer",
    "content": "Video streaming"
  }, {
    "heading": "integration-layer",
    "content": "REST/WebSocket"
  }, {
    "heading": "integration-layer",
    "content": "API and real-time updates"
  }, {
    "heading": "design-principles",
    "content": "Edge-First - Process data as close to the source as possible"
  }, {
    "heading": "design-principles",
    "content": "Offline-Capable - Full functionality without internet connectivity"
  }, {
    "heading": "design-principles",
    "content": "Security-First - Air-gapped deployment support"
  }, {
    "heading": "design-principles",
    "content": "Lightweight - Minimal resource footprint for embedded systems"
  }, {
    "heading": "design-principles",
    "content": "Interoperable - Standard protocols and open APIs"
  }],
  "headings": [{
    "id": "architecture",
    "content": "Architecture"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "system-diagram",
    "content": "System Diagram"
  }, {
    "id": "core-components",
    "content": "Core Components"
  }, {
    "id": "data-fabric-layer",
    "content": "Data Fabric Layer"
  }, {
    "id": "edge-layer",
    "content": "Edge Layer"
  }, {
    "id": "integration-layer",
    "content": "Integration Layer"
  }, {
    "id": "design-principles",
    "content": "Design Principles"
  }]
};
const toc$7 = [{
  depth: 1,
  url: "#architecture",
  title: jsx(Fragment, {
    children: "Architecture"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#system-diagram",
  title: jsx(Fragment, {
    children: "System Diagram"
  })
}, {
  depth: 2,
  url: "#core-components",
  title: jsx(Fragment, {
    children: "Core Components"
  })
}, {
  depth: 3,
  url: "#data-fabric-layer",
  title: jsx(Fragment, {
    children: "Data Fabric Layer"
  })
}, {
  depth: 3,
  url: "#edge-layer",
  title: jsx(Fragment, {
    children: "Edge Layer"
  })
}, {
  depth: 3,
  url: "#integration-layer",
  title: jsx(Fragment, {
    children: "Integration Layer"
  })
}, {
  depth: 2,
  url: "#design-principles",
  title: jsx(Fragment, {
    children: "Design Principles"
  })
}];
function _createMdxContent$7(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "architecture",
      children: "Architecture"
    }), "\n", jsx(_components.p, {
      children: "System architecture overview for Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsx(_components.p, {
      children: "Constellation Overwatch is designed as a lightweight, edge-first data fabric that brings together telemetry, video, and AI processing in a unified platform."
    }), "\n", jsx(_components.h2, {
      id: "system-diagram",
      children: "System Diagram"
    }), "\n", jsx("img", {
      src: "/images/d2.svg",
      alt: "Constellation Overwatch Architecture",
      style: {
        width: "100%",
        maxWidth: "900px",
        margin: "2rem auto",
        display: "block"
      }
    }), "\n", jsx(_components.h2, {
      id: "core-components",
      children: "Core Components"
    }), "\n", jsx(_components.h3, {
      id: "data-fabric-layer",
      children: "Data Fabric Layer"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Component"
          }), jsx(_components.th, {
            children: "Technology"
          }), jsx(_components.th, {
            children: "Purpose"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Messaging"
            })
          }), jsx(_components.td, {
            children: "NATS JetStream"
          }), jsx(_components.td, {
            children: "Real-time pub/sub and persistent messaging"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Database"
            })
          }), jsx(_components.td, {
            children: "Turso (SQLite)"
          }), jsx(_components.td, {
            children: "Embedded relational storage"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "API"
            })
          }), jsx(_components.td, {
            children: "Go + Templ"
          }), jsx(_components.td, {
            children: "RESTful API and server-rendered UI"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "edge-layer",
      children: "Edge Layer"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Component"
          }), jsx(_components.th, {
            children: "Purpose"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Aero Arc Relay"
            })
          }), jsx(_components.td, {
            children: "MAVLink bridge for UAVs"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Vision"
            })
          }), jsx(_components.td, {
            children: "AI-powered video analysis"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "FFmpeg"
            })
          }), jsx(_components.td, {
            children: "Low-latency video streaming"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "integration-layer",
      children: "Integration Layer"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Protocol"
          }), jsx(_components.th, {
            children: "Use Case"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "MAVLink"
          }), jsx(_components.td, {
            children: "Drone communication"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "RTSP/WebRTC"
          }), jsx(_components.td, {
            children: "Video streaming"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "REST/WebSocket"
          }), jsx(_components.td, {
            children: "API and real-time updates"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "design-principles",
      children: "Design Principles"
    }), "\n", jsxs(_components.ol, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Edge-First"
        }), " - Process data as close to the source as possible"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Offline-Capable"
        }), " - Full functionality without internet connectivity"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Security-First"
        }), " - Air-gapped deployment support"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Lightweight"
        }), " - Minimal resource footprint for embedded systems"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Interoperable"
        }), " - Standard protocols and open APIs"]
      }), "\n"]
    })]
  });
}
function MDXContent$7(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$7, {
      ...props
    })
  }) : _createMdxContent$7(props);
}
const __vite_glob_1_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$7,
  frontmatter: frontmatter$7,
  structuredData: structuredData$7,
  toc: toc$7
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$6 = {
  "title": "Constellation Overwatch",
  "description": "Open Source C4 Data Fabric for Industrial Edge Computing",
  "icon": "Shield"
};
let structuredData$6 = {
  "contents": [{
    "heading": "constellation-overwatch",
    "content": "Open Source C4 Data Fabric for Industrial Edge Computing"
  }, {
    "heading": "constellation-overwatch",
    "content": "Constellation Overwatch is a lightweight industrial data stack designed with ontological data primitives for UAVs, robotics, sensors, and real-time video intelligence at the edge under your security control."
  }, {
    "heading": "quick-start",
    "content": "Get started with Constellation Overwatch in minutes:"
  }, {
    "heading": "core-features",
    "content": "Feature"
  }, {
    "heading": "core-features",
    "content": "Description"
  }, {
    "heading": "core-features",
    "content": "Real-time Messaging"
  }, {
    "heading": "core-features",
    "content": "Low-latency pub/sub communication powered by NATS JetStream"
  }, {
    "heading": "core-features",
    "content": "Telemetry Streaming"
  }, {
    "heading": "core-features",
    "content": "Efficient handling of high-frequency sensor data from edge devices"
  }, {
    "heading": "core-features",
    "content": "Multi-Entity Support"
  }, {
    "heading": "core-features",
    "content": "Manage drones, robots, sensors, and autonomous systems"
  }, {
    "heading": "core-features",
    "content": "Secure API"
  }, {
    "heading": "core-features",
    "content": "RESTful API with bearer token authentication"
  }, {
    "heading": "core-features",
    "content": "Offline First"
  }, {
    "heading": "core-features",
    "content": "Full security perimeter isolation for air-gapped environments"
  }, {
    "heading": "core-features",
    "content": "Edge Architecture"
  }, {
    "heading": "core-features",
    "content": "Portable deployment with proximity-based processing"
  }, {
    "heading": "technology-stack",
    "content": "Powered by modern, battle-tested technologies:"
  }, {
    "heading": "technology-stack",
    "content": "Go - High-performance backend with minimal footprint"
  }, {
    "heading": "technology-stack",
    "content": "NATS JetStream - Embedded messaging with global clustering"
  }, {
    "heading": "technology-stack",
    "content": "Templ - Type-safe HTML templating"
  }, {
    "heading": "technology-stack",
    "content": "Datastar - Real-time UI framework"
  }, {
    "heading": "technology-stack",
    "content": "Turso - Embedded SQLite database"
  }],
  "headings": [{
    "id": "constellation-overwatch",
    "content": "Constellation Overwatch"
  }, {
    "id": "quick-start",
    "content": "Quick Start"
  }, {
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "core-features",
    "content": "Core Features"
  }, {
    "id": "technology-stack",
    "content": "Technology Stack"
  }]
};
const toc$6 = [{
  depth: 1,
  url: "#constellation-overwatch",
  title: jsx(Fragment, {
    children: "Constellation Overwatch"
  })
}, {
  depth: 2,
  url: "#quick-start",
  title: jsx(Fragment, {
    children: "Quick Start"
  })
}, {
  depth: 3,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 3,
  url: "#core-features",
  title: jsx(Fragment, {
    children: "Core Features"
  })
}, {
  depth: 3,
  url: "#technology-stack",
  title: jsx(Fragment, {
    children: "Technology Stack"
  })
}];
function _createMdxContent$6(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Card, Cards } = _components;
  if (!Card) _missingMdxReference$5("Card");
  if (!Cards) _missingMdxReference$5("Cards");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "constellation-overwatch",
      children: "Constellation Overwatch"
    }), "\n", jsx(_components.p, {
      children: jsx(_components.strong, {
        children: "Open Source C4 Data Fabric for Industrial Edge Computing"
      })
    }), "\n", jsx(_components.p, {
      children: "Constellation Overwatch is a lightweight industrial data stack designed with ontological data primitives for UAVs, robotics, sensors, and real-time video intelligence at the edge under your security control."
    }), "\n", jsx(_components.h2, {
      id: "quick-start",
      children: "Quick Start"
    }), "\n", jsx(_components.p, {
      children: "Get started with Constellation Overwatch in minutes:"
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Installation",
        href: "/docs/platform/installation",
        description: "Install Constellation Overwatch using our automated installer"
      }), jsx(Card, {
        title: "Quick Start Guide",
        href: "/docs/platform/quick-start",
        description: "Set up your first organization and entities"
      }), jsx(Card, {
        title: "API Reference",
        href: "/docs/platform/api",
        description: "Complete API documentation and examples"
      }), jsx(Card, {
        title: "Integrations",
        href: "/docs/integrations",
        description: "MAVLink, Vision AI, and video streaming integrations"
      })]
    }), "\n", jsx(_components.h3, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Linux / macOS"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -LsSf"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://constellation-overwatch.github.io/overwatch/install.sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: " |"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: " sh"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Windows"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "powershell"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -ExecutionPolicy"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " Bypass"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -c"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "irm https://constellation-overwatch.github.io/overwatch/install.ps1 | iex"'
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "core-features",
      children: "Core Features"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Feature"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Real-time Messaging"
            })
          }), jsx(_components.td, {
            children: "Low-latency pub/sub communication powered by NATS JetStream"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Telemetry Streaming"
            })
          }), jsx(_components.td, {
            children: "Efficient handling of high-frequency sensor data from edge devices"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Multi-Entity Support"
            })
          }), jsx(_components.td, {
            children: "Manage drones, robots, sensors, and autonomous systems"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Secure API"
            })
          }), jsx(_components.td, {
            children: "RESTful API with bearer token authentication"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Offline First"
            })
          }), jsx(_components.td, {
            children: "Full security perimeter isolation for air-gapped environments"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.strong, {
              children: "Edge Architecture"
            })
          }), jsx(_components.td, {
            children: "Portable deployment with proximity-based processing"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "technology-stack",
      children: "Technology Stack"
    }), "\n", jsx(_components.p, {
      children: "Powered by modern, battle-tested technologies:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Go"
        }), " - High-performance backend with minimal footprint"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "NATS JetStream"
        }), " - Embedded messaging with global clustering"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Templ"
        }), " - Type-safe HTML templating"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Datastar"
        }), " - Real-time UI framework"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Turso"
        }), " - Embedded SQLite database"]
      }), "\n"]
    })]
  });
}
function MDXContent$6(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$6, {
      ...props
    })
  }) : _createMdxContent$6(props);
}
function _missingMdxReference$5(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$6,
  frontmatter: frontmatter$6,
  structuredData: structuredData$6,
  toc: toc$6
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$5 = {
  "title": "Deployment",
  "description": "Deploy Constellation Overwatch to production environments",
  "icon": "Cloud"
};
let structuredData$5 = {
  "contents": [{
    "heading": "deployment",
    "content": "Deploy Constellation Overwatch to production cloud and edge environments."
  }, {
    "heading": "docker",
    "content": "The simplest way to deploy Constellation Overwatch:"
  }, {
    "heading": "docker-compose",
    "content": "For multi-container deployments:"
  }, {
    "heading": "kubernetes",
    "content": "Deploy using Helm:"
  }, {
    "heading": "nvidia-jetson",
    "content": "Optimized for edge AI workloads with GPU acceleration."
  }, {
    "heading": "production-checklist",
    "content": "Generate strong API and NATS tokens"
  }, {
    "heading": "production-checklist",
    "content": "Configure TLS/HTTPS termination"
  }, {
    "heading": "production-checklist",
    "content": "Set up persistent storage"
  }, {
    "heading": "production-checklist",
    "content": "Configure log aggregation"
  }, {
    "heading": "production-checklist",
    "content": "Enable monitoring and alerting"
  }, {
    "heading": "production-checklist",
    "content": "Set up backup procedures"
  }, {
    "heading": "production-checklist",
    "content": "Test failover and recovery"
  }, {
    "heading": "architecture-considerations",
    "content": "For high-availability deployments, see the Architecture documentation."
  }],
  "headings": [{
    "id": "deployment",
    "content": "Deployment"
  }, {
    "id": "deployment-options",
    "content": "Deployment Options"
  }, {
    "id": "docker",
    "content": "Docker"
  }, {
    "id": "docker-compose",
    "content": "Docker Compose"
  }, {
    "id": "kubernetes",
    "content": "Kubernetes"
  }, {
    "id": "edge-deployment",
    "content": "Edge Deployment"
  }, {
    "id": "raspberry-pi",
    "content": "Raspberry Pi"
  }, {
    "id": "nvidia-jetson",
    "content": "NVIDIA Jetson"
  }, {
    "id": "production-checklist",
    "content": "Production Checklist"
  }, {
    "id": "architecture-considerations",
    "content": "Architecture Considerations"
  }]
};
const toc$5 = [{
  depth: 1,
  url: "#deployment",
  title: jsx(Fragment, {
    children: "Deployment"
  })
}, {
  depth: 2,
  url: "#deployment-options",
  title: jsx(Fragment, {
    children: "Deployment Options"
  })
}, {
  depth: 3,
  url: "#docker",
  title: jsx(Fragment, {
    children: "Docker"
  })
}, {
  depth: 3,
  url: "#docker-compose",
  title: jsx(Fragment, {
    children: "Docker Compose"
  })
}, {
  depth: 3,
  url: "#kubernetes",
  title: jsx(Fragment, {
    children: "Kubernetes"
  })
}, {
  depth: 2,
  url: "#edge-deployment",
  title: jsx(Fragment, {
    children: "Edge Deployment"
  })
}, {
  depth: 3,
  url: "#raspberry-pi",
  title: jsx(Fragment, {
    children: "Raspberry Pi"
  })
}, {
  depth: 3,
  url: "#nvidia-jetson",
  title: jsx(Fragment, {
    children: "NVIDIA Jetson"
  })
}, {
  depth: 2,
  url: "#production-checklist",
  title: jsx(Fragment, {
    children: "Production Checklist"
  })
}, {
  depth: 2,
  url: "#architecture-considerations",
  title: jsx(Fragment, {
    children: "Architecture Considerations"
  })
}];
function _createMdxContent$5(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    input: "input",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "deployment",
      children: "Deployment"
    }), "\n", jsx(_components.p, {
      children: "Deploy Constellation Overwatch to production cloud and edge environments."
    }), "\n", jsx(_components.h2, {
      id: "deployment-options",
      children: "Deployment Options"
    }), "\n", jsx(_components.h3, {
      id: "docker",
      children: "Docker"
    }), "\n", jsx(_components.p, {
      children: "The simplest way to deploy Constellation Overwatch:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "docker"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " run"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -d"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  --name"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -p"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " 8080:8080"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -p"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " 4222:4222"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -v"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "pwd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ")"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "/data:/data"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -e"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " OVERWATCH_API_TOKEN=your-secure-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -e"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " OVERWATCH_NATS_TOKEN=your-nats-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  ghcr.io/constellation-overwatch/constellation-overwatch:latest"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "docker-compose",
      children: "Docker Compose"
    }), "\n", jsx(_components.p, {
      children: "For multi-container deployments:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "version"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "'3.8'"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "services"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  constellation"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    image"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "ghcr.io/constellation-overwatch/constellation-overwatch:latest"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    ports"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"8080:8080"'
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"4222:4222"'
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    volumes"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "constellation-data:/data"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    environment"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "OVERWATCH_API_TOKEN=${API_TOKEN}"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "OVERWATCH_NATS_TOKEN=${NATS_TOKEN}"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "      - "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "OVERWATCH_LOG_LEVEL=info"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "    restart"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "unless-stopped"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "volumes"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#22863A",
                "--shiki-dark": "#85E89D"
              },
              children: "  constellation-data"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ":"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "kubernetes",
      children: "Kubernetes"
    }), "\n", jsx(_components.p, {
      children: "Deploy using Helm:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "helm"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " repo"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " add"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://constellation-overwatch.github.io/charts"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "helm"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " install"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation/constellation-overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  --set"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " apiToken=your-secure-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  --set"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " natsToken=your-nats-token"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "edge-deployment",
      children: "Edge Deployment"
    }), "\n", jsx(_components.h3, {
      id: "raspberry-pi",
      children: "Raspberry Pi"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Download ARM binary"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -LsSf"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://constellation-overwatch.github.io/overwatch/install.sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: " |"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: " sh"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Create systemd service"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "sudo"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " tee"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " /etc/systemd/system/constellation.service"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: " <<"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " EOF"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "[Unit]"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "Description=Constellation Overwatch"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "After=network.target"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "[Service]"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "Type=simple"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "ExecStart=/usr/local/bin/overwatch"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "Restart=always"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "Environment=OVERWATCH_API_TOKEN=your-token"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "[Install]"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "WantedBy=multi-user.target"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "EOF"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "sudo"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " systemctl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " enable"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "sudo"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " systemctl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " start"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "nvidia-jetson",
      children: "NVIDIA Jetson"
    }), "\n", jsx(_components.p, {
      children: "Optimized for edge AI workloads with GPU acceleration."
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Install with CUDA support"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "./install.sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " --cuda"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "production-checklist",
      children: "Production Checklist"
    }), "\n", jsxs(_components.ul, {
      className: "contains-task-list",
      children: ["\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Generate strong API and NATS tokens"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Configure TLS/HTTPS termination"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Set up persistent storage"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Configure log aggregation"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Enable monitoring and alerting"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Set up backup procedures"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "Test failover and recovery"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "architecture-considerations",
      children: "Architecture Considerations"
    }), "\n", jsxs(_components.p, {
      children: ["For high-availability deployments, see the ", jsx(_components.a, {
        href: "/docs/introduction/architecture",
        children: "Architecture"
      }), " documentation."]
    })]
  });
}
function MDXContent$5(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$5, {
      ...props
    })
  }) : _createMdxContent$5(props);
}
const __vite_glob_1_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$5,
  frontmatter: frontmatter$5,
  structuredData: structuredData$5,
  toc: toc$5
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$4 = {
  "title": "Toolbelt",
  "description": "Infrastructure as Code toolbelt for Constellation Overwatch",
  "icon": "Wrench"
};
let structuredData$4 = {
  "contents": [{
    "heading": "toolbelt",
    "content": "Infrastructure as Code (IaC) toolbelt for deploying and managing Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "The Constellation Toolbelt provides a collection of scripts, templates, and utilities for deploying Constellation Overwatch across various environments."
  }, {
    "heading": "features",
    "content": "Automated Deployment - One-command deployments"
  }, {
    "heading": "features",
    "content": "Multi-Platform - Support for Linux, macOS, and Windows"
  }, {
    "heading": "features",
    "content": "Air-Gapped Support - Offline installation capabilities"
  }, {
    "heading": "features",
    "content": "Configuration Management - Templated configuration files"
  }, {
    "heading": "available-tools",
    "content": "Tool"
  }, {
    "heading": "available-tools",
    "content": "Description"
  }, {
    "heading": "available-tools",
    "content": "overwatch"
  }, {
    "heading": "available-tools",
    "content": "Main CLI for managing Constellation"
  }, {
    "heading": "available-tools",
    "content": "overwatch-init"
  }, {
    "heading": "available-tools",
    "content": "Initialize a new Constellation instance"
  }, {
    "heading": "available-tools",
    "content": "overwatch-backup"
  }, {
    "heading": "available-tools",
    "content": "Backup and restore utilities"
  }, {
    "heading": "available-tools",
    "content": "overwatch-upgrade"
  }, {
    "heading": "available-tools",
    "content": "Upgrade to newer versions"
  }, {
    "heading": "deployment-targets",
    "content": "The toolbelt supports deploying to:"
  }, {
    "heading": "deployment-targets",
    "content": "Bare Metal - Direct installation on physical servers"
  }, {
    "heading": "deployment-targets",
    "content": "Docker - Containerized deployments"
  }, {
    "heading": "deployment-targets",
    "content": "Kubernetes - Helm charts for K8s clusters"
  }, {
    "heading": "deployment-targets",
    "content": "Edge Devices - Raspberry Pi, Jetson, and embedded systems"
  }, {
    "heading": "usage",
    "content": "type: info"
  }, {
    "heading": "usage",
    "content": "For full documentation, see the GitHub repository."
  }],
  "headings": [{
    "id": "toolbelt",
    "content": "Toolbelt"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "features",
    "content": "Features"
  }, {
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "available-tools",
    "content": "Available Tools"
  }, {
    "id": "deployment-targets",
    "content": "Deployment Targets"
  }, {
    "id": "usage",
    "content": "Usage"
  }]
};
const toc$4 = [{
  depth: 1,
  url: "#toolbelt",
  title: jsx(Fragment, {
    children: "Toolbelt"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#features",
  title: jsx(Fragment, {
    children: "Features"
  })
}, {
  depth: 2,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 2,
  url: "#available-tools",
  title: jsx(Fragment, {
    children: "Available Tools"
  })
}, {
  depth: 2,
  url: "#deployment-targets",
  title: jsx(Fragment, {
    children: "Deployment Targets"
  })
}, {
  depth: 2,
  url: "#usage",
  title: jsx(Fragment, {
    children: "Usage"
  })
}];
function _createMdxContent$4(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    hr: "hr",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$4("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "toolbelt",
      children: "Toolbelt"
    }), "\n", jsx(_components.p, {
      children: "Infrastructure as Code (IaC) toolbelt for deploying and managing Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsxs(_components.p, {
      children: ["The ", jsx(_components.a, {
        href: "https://github.com/Constellation-Overwatch/toolbelt",
        children: "Constellation Toolbelt"
      }), " provides a collection of scripts, templates, and utilities for deploying Constellation Overwatch across various environments."]
    }), "\n", jsx(_components.h2, {
      id: "features",
      children: "Features"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Automated Deployment"
        }), " - One-command deployments"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Multi-Platform"
        }), " - Support for Linux, macOS, and Windows"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Air-Gapped Support"
        }), " - Offline installation capabilities"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Configuration Management"
        }), " - Templated configuration files"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Linux / macOS"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -LsSf"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://constellation-overwatch.github.io/overwatch/install.sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: " |"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: " sh"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Windows"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "powershell"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -ExecutionPolicy"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " Bypass"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -c"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "irm https://constellation-overwatch.github.io/overwatch/install.ps1 | iex"'
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "available-tools",
      children: "Available Tools"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Tool"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "overwatch"
            })
          }), jsx(_components.td, {
            children: "Main CLI for managing Constellation"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "overwatch-init"
            })
          }), jsx(_components.td, {
            children: "Initialize a new Constellation instance"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "overwatch-backup"
            })
          }), jsx(_components.td, {
            children: "Backup and restore utilities"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "overwatch-upgrade"
            })
          }), jsx(_components.td, {
            children: "Upgrade to newer versions"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "deployment-targets",
      children: "Deployment Targets"
    }), "\n", jsx(_components.p, {
      children: "The toolbelt supports deploying to:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Bare Metal"
        }), " - Direct installation on physical servers"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Docker"
        }), " - Containerized deployments"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Kubernetes"
        }), " - Helm charts for K8s clusters"]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Edge Devices"
        }), " - Raspberry Pi, Jetson, and embedded systems"]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "usage",
      children: "Usage"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Initialize a new installation"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " init"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Start services"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " start"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Check status"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " status"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# View logs"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " logs"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.hr, {}), "\n", jsx(Callout, {
      type: "info",
      children: jsxs(_components.p, {
        children: ["For full documentation, see the ", jsx(_components.a, {
          href: "https://github.com/Constellation-Overwatch/toolbelt",
          children: "GitHub repository"
        }), "."]
      })
    })]
  });
}
function MDXContent$4(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$4, {
      ...props
    })
  }) : _createMdxContent$4(props);
}
function _missingMdxReference$4(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$4,
  frontmatter: frontmatter$4,
  structuredData: structuredData$4,
  toc: toc$4
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$3 = {
  "title": "API Reference",
  "description": "Complete API documentation for Constellation Overwatch",
  "icon": "Code"
};
let structuredData$3 = {
  "contents": [{
    "heading": "api-reference",
    "content": "Complete API documentation for Constellation Overwatch."
  }, {
    "heading": "overview",
    "content": "Constellation Overwatch provides a RESTful API with bearer token authentication for managing organizations, entities, and telemetry data."
  }, {
    "heading": "authentication",
    "content": "All API requests require authentication using a bearer token in the Authorization header:"
  }, {
    "heading": "organizations",
    "content": "Method"
  }, {
    "heading": "organizations",
    "content": "Endpoint"
  }, {
    "heading": "organizations",
    "content": "Description"
  }, {
    "heading": "organizations",
    "content": "GET"
  }, {
    "heading": "organizations",
    "content": "/organizations"
  }, {
    "heading": "organizations",
    "content": "List all organizations"
  }, {
    "heading": "organizations",
    "content": "POST"
  }, {
    "heading": "organizations",
    "content": "/organizations"
  }, {
    "heading": "organizations",
    "content": "Create a new organization"
  }, {
    "heading": "organizations",
    "content": "GET"
  }, {
    "heading": "organizations",
    "content": "/organizations/:id"
  }, {
    "heading": "organizations",
    "content": "Get organization by ID"
  }, {
    "heading": "organizations",
    "content": "PUT"
  }, {
    "heading": "organizations",
    "content": "/organizations/:id"
  }, {
    "heading": "organizations",
    "content": "Update an organization"
  }, {
    "heading": "organizations",
    "content": "DELETE"
  }, {
    "heading": "organizations",
    "content": "/organizations/:id"
  }, {
    "heading": "organizations",
    "content": "Delete an organization"
  }, {
    "heading": "entities",
    "content": "Method"
  }, {
    "heading": "entities",
    "content": "Endpoint"
  }, {
    "heading": "entities",
    "content": "Description"
  }, {
    "heading": "entities",
    "content": "GET"
  }, {
    "heading": "entities",
    "content": "/entities"
  }, {
    "heading": "entities",
    "content": "List all entities"
  }, {
    "heading": "entities",
    "content": "POST"
  }, {
    "heading": "entities",
    "content": "/entities"
  }, {
    "heading": "entities",
    "content": "Create a new entity"
  }, {
    "heading": "entities",
    "content": "GET"
  }, {
    "heading": "entities",
    "content": "/entities/:id"
  }, {
    "heading": "entities",
    "content": "Get entity by ID"
  }, {
    "heading": "entities",
    "content": "PUT"
  }, {
    "heading": "entities",
    "content": "/entities/:id"
  }, {
    "heading": "entities",
    "content": "Update an entity"
  }, {
    "heading": "entities",
    "content": "DELETE"
  }, {
    "heading": "entities",
    "content": "/entities/:id"
  }, {
    "heading": "entities",
    "content": "Delete an entity"
  }, {
    "heading": "telemetry",
    "content": "Method"
  }, {
    "heading": "telemetry",
    "content": "Endpoint"
  }, {
    "heading": "telemetry",
    "content": "Description"
  }, {
    "heading": "telemetry",
    "content": "GET"
  }, {
    "heading": "telemetry",
    "content": "/telemetry/:entity_id"
  }, {
    "heading": "telemetry",
    "content": "Get telemetry for an entity"
  }, {
    "heading": "telemetry",
    "content": "POST"
  }, {
    "heading": "telemetry",
    "content": "/telemetry"
  }, {
    "heading": "telemetry",
    "content": "Submit telemetry data"
  }, {
    "heading": "response-format",
    "content": "All responses are returned in JSON format:"
  }, {
    "heading": "error-handling",
    "content": "Errors are returned with appropriate HTTP status codes:"
  }, {
    "heading": "error-handling",
    "content": "Status Code"
  }, {
    "heading": "error-handling",
    "content": "Description"
  }, {
    "heading": "error-handling",
    "content": "400"
  }, {
    "heading": "error-handling",
    "content": "Bad Request - Invalid parameters"
  }, {
    "heading": "error-handling",
    "content": "401"
  }, {
    "heading": "error-handling",
    "content": "Unauthorized - Invalid or missing token"
  }, {
    "heading": "error-handling",
    "content": "404"
  }, {
    "heading": "error-handling",
    "content": "Not Found - Resource not found"
  }, {
    "heading": "error-handling",
    "content": "500"
  }, {
    "heading": "error-handling",
    "content": "Internal Server Error"
  }, {
    "heading": "error-handling",
    "content": "type: info"
  }, {
    "heading": "error-handling",
    "content": "Full API documentation with interactive examples coming soon."
  }],
  "headings": [{
    "id": "api-reference",
    "content": "API Reference"
  }, {
    "id": "overview",
    "content": "Overview"
  }, {
    "id": "authentication",
    "content": "Authentication"
  }, {
    "id": "base-url",
    "content": "Base URL"
  }, {
    "id": "endpoints",
    "content": "Endpoints"
  }, {
    "id": "organizations",
    "content": "Organizations"
  }, {
    "id": "entities",
    "content": "Entities"
  }, {
    "id": "telemetry",
    "content": "Telemetry"
  }, {
    "id": "response-format",
    "content": "Response Format"
  }, {
    "id": "error-handling",
    "content": "Error Handling"
  }]
};
const toc$3 = [{
  depth: 1,
  url: "#api-reference",
  title: jsx(Fragment, {
    children: "API Reference"
  })
}, {
  depth: 2,
  url: "#overview",
  title: jsx(Fragment, {
    children: "Overview"
  })
}, {
  depth: 2,
  url: "#authentication",
  title: jsx(Fragment, {
    children: "Authentication"
  })
}, {
  depth: 2,
  url: "#base-url",
  title: jsx(Fragment, {
    children: "Base URL"
  })
}, {
  depth: 2,
  url: "#endpoints",
  title: jsx(Fragment, {
    children: "Endpoints"
  })
}, {
  depth: 3,
  url: "#organizations",
  title: jsx(Fragment, {
    children: "Organizations"
  })
}, {
  depth: 3,
  url: "#entities",
  title: jsx(Fragment, {
    children: "Entities"
  })
}, {
  depth: 3,
  url: "#telemetry",
  title: jsx(Fragment, {
    children: "Telemetry"
  })
}, {
  depth: 2,
  url: "#response-format",
  title: jsx(Fragment, {
    children: "Response Format"
  })
}, {
  depth: 2,
  url: "#error-handling",
  title: jsx(Fragment, {
    children: "Error Handling"
  })
}];
function _createMdxContent$3(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    p: "p",
    pre: "pre",
    span: "span",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$3("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "api-reference",
      children: "API Reference"
    }), "\n", jsx(_components.p, {
      children: "Complete API documentation for Constellation Overwatch."
    }), "\n", jsx(_components.h2, {
      id: "overview",
      children: "Overview"
    }), "\n", jsx(_components.p, {
      children: "Constellation Overwatch provides a RESTful API with bearer token authentication for managing organizations, entities, and telemetry data."
    }), "\n", jsx(_components.h2, {
      id: "authentication",
      children: "Authentication"
    }), "\n", jsxs(_components.p, {
      children: ["All API requests require authentication using a bearer token in the ", jsx(_components.code, {
        children: "Authorization"
      }), " header:"]
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -H"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "Authorization: Bearer <your-token>"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  http://localhost:8080/api/v1/organizations"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "base-url",
      children: "Base URL"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "http://localhost:8080/api/v1"
            })
          })
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "endpoints",
      children: "Endpoints"
    }), "\n", jsx(_components.h3, {
      id: "organizations",
      children: "Organizations"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Method"
          }), jsx(_components.th, {
            children: "Endpoint"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "GET"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/organizations"
            })
          }), jsx(_components.td, {
            children: "List all organizations"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "POST"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/organizations"
            })
          }), jsx(_components.td, {
            children: "Create a new organization"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "GET"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/organizations/:id"
            })
          }), jsx(_components.td, {
            children: "Get organization by ID"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "PUT"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/organizations/:id"
            })
          }), jsx(_components.td, {
            children: "Update an organization"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "DELETE"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/organizations/:id"
            })
          }), jsx(_components.td, {
            children: "Delete an organization"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "entities",
      children: "Entities"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Method"
          }), jsx(_components.th, {
            children: "Endpoint"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "GET"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/entities"
            })
          }), jsx(_components.td, {
            children: "List all entities"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "POST"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/entities"
            })
          }), jsx(_components.td, {
            children: "Create a new entity"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "GET"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/entities/:id"
            })
          }), jsx(_components.td, {
            children: "Get entity by ID"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "PUT"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/entities/:id"
            })
          }), jsx(_components.td, {
            children: "Update an entity"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "DELETE"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/entities/:id"
            })
          }), jsx(_components.td, {
            children: "Delete an entity"
          })]
        })]
      })]
    }), "\n", jsx(_components.h3, {
      id: "telemetry",
      children: "Telemetry"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Method"
          }), jsx(_components.th, {
            children: "Endpoint"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "GET"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/telemetry/:entity_id"
            })
          }), jsx(_components.td, {
            children: "Get telemetry for an entity"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "POST"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "/telemetry"
            })
          }), jsx(_components.td, {
            children: "Submit telemetry data"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "response-format",
      children: "Response Format"
    }), "\n", jsx(_components.p, {
      children: "All responses are returned in JSON format:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "{"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "data"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {},"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '  "meta"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": {"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: '    "timestamp"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ": "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"2024-01-01T00:00:00Z"'
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "  }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "}"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "error-handling",
      children: "Error Handling"
    }), "\n", jsx(_components.p, {
      children: "Errors are returned with appropriate HTTP status codes:"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Status Code"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "400"
            })
          }), jsx(_components.td, {
            children: "Bad Request - Invalid parameters"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "401"
            })
          }), jsx(_components.td, {
            children: "Unauthorized - Invalid or missing token"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "404"
            })
          }), jsx(_components.td, {
            children: "Not Found - Resource not found"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "500"
            })
          }), jsx(_components.td, {
            children: "Internal Server Error"
          })]
        })]
      })]
    }), "\n", jsx(_components.hr, {}), "\n", jsx(Callout, {
      type: "info",
      children: jsx(_components.p, {
        children: "Full API documentation with interactive examples coming soon."
      })
    })]
  });
}
function MDXContent$3(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$3, {
      ...props
    })
  }) : _createMdxContent$3(props);
}
function _missingMdxReference$3(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$3,
  frontmatter: frontmatter$3,
  structuredData: structuredData$3,
  toc: toc$3
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$2 = {
  "title": "Configuration",
  "description": "CLI options and environment variables for Constellation Overwatch",
  "icon": "Settings"
};
let structuredData$2 = {
  "contents": [{
    "heading": "configuration",
    "content": "Configure Constellation Overwatch using CLI flags or environment variables."
  }, {
    "heading": "cli-options",
    "content": "Flag"
  }, {
    "heading": "cli-options",
    "content": "Default"
  }, {
    "heading": "cli-options",
    "content": "Description"
  }, {
    "heading": "cli-options",
    "content": "-port"
  }, {
    "heading": "cli-options",
    "content": "8080"
  }, {
    "heading": "cli-options",
    "content": "HTTP server port"
  }, {
    "heading": "cli-options",
    "content": "-nats-port"
  }, {
    "heading": "cli-options",
    "content": "4222"
  }, {
    "heading": "cli-options",
    "content": "NATS server port"
  }, {
    "heading": "cli-options",
    "content": "-api-token"
  }, {
    "heading": "cli-options",
    "content": "reindustrialize-dev-token"
  }, {
    "heading": "cli-options",
    "content": "API bearer token"
  }, {
    "heading": "cli-options",
    "content": "-nats-token"
  }, {
    "heading": "cli-options",
    "content": "reindustrialize-america"
  }, {
    "heading": "cli-options",
    "content": "NATS authentication token"
  }, {
    "heading": "cli-options",
    "content": "-db-path"
  }, {
    "heading": "cli-options",
    "content": "./data/constellation.db"
  }, {
    "heading": "cli-options",
    "content": "SQLite database path"
  }, {
    "heading": "cli-options",
    "content": "-log-level"
  }, {
    "heading": "cli-options",
    "content": "info"
  }, {
    "heading": "cli-options",
    "content": "Logging level (debug, info, warn, error)"
  }, {
    "heading": "environment-variables",
    "content": "All CLI options can also be set via environment variables:"
  }, {
    "heading": "environment-variables",
    "content": "Variable"
  }, {
    "heading": "environment-variables",
    "content": "CLI Flag"
  }, {
    "heading": "environment-variables",
    "content": "Description"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_PORT"
  }, {
    "heading": "environment-variables",
    "content": "-port"
  }, {
    "heading": "environment-variables",
    "content": "HTTP server port"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_NATS_PORT"
  }, {
    "heading": "environment-variables",
    "content": "-nats-port"
  }, {
    "heading": "environment-variables",
    "content": "NATS server port"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_API_TOKEN"
  }, {
    "heading": "environment-variables",
    "content": "-api-token"
  }, {
    "heading": "environment-variables",
    "content": "API bearer token"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_NATS_TOKEN"
  }, {
    "heading": "environment-variables",
    "content": "-nats-token"
  }, {
    "heading": "environment-variables",
    "content": "NATS authentication token"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_DB_PATH"
  }, {
    "heading": "environment-variables",
    "content": "-db-path"
  }, {
    "heading": "environment-variables",
    "content": "SQLite database path"
  }, {
    "heading": "environment-variables",
    "content": "OVERWATCH_LOG_LEVEL"
  }, {
    "heading": "environment-variables",
    "content": "-log-level"
  }, {
    "heading": "environment-variables",
    "content": "Logging level"
  }, {
    "heading": "development",
    "content": "Uses all default values for local development."
  }, {
    "heading": "security-recommendations",
    "content": "type: warn"
  }, {
    "heading": "security-recommendations",
    "content": "Always use strong, randomly generated tokens in production environments."
  }, {
    "heading": "security-recommendations",
    "content": "Generate tokens with at least 32 bytes of entropy"
  }, {
    "heading": "security-recommendations",
    "content": "Never commit tokens to version control"
  }, {
    "heading": "security-recommendations",
    "content": "Use environment variables or secrets management in production"
  }, {
    "heading": "security-recommendations",
    "content": "Rotate tokens periodically"
  }],
  "headings": [{
    "id": "configuration",
    "content": "Configuration"
  }, {
    "id": "cli-options",
    "content": "CLI Options"
  }, {
    "id": "environment-variables",
    "content": "Environment Variables"
  }, {
    "id": "example-configurations",
    "content": "Example Configurations"
  }, {
    "id": "development",
    "content": "Development"
  }, {
    "id": "production",
    "content": "Production"
  }, {
    "id": "docker",
    "content": "Docker"
  }, {
    "id": "security-recommendations",
    "content": "Security Recommendations"
  }]
};
const toc$2 = [{
  depth: 1,
  url: "#configuration",
  title: jsx(Fragment, {
    children: "Configuration"
  })
}, {
  depth: 2,
  url: "#cli-options",
  title: jsx(Fragment, {
    children: "CLI Options"
  })
}, {
  depth: 2,
  url: "#environment-variables",
  title: jsx(Fragment, {
    children: "Environment Variables"
  })
}, {
  depth: 2,
  url: "#example-configurations",
  title: jsx(Fragment, {
    children: "Example Configurations"
  })
}, {
  depth: 3,
  url: "#development",
  title: jsx(Fragment, {
    children: "Development"
  })
}, {
  depth: 3,
  url: "#production",
  title: jsx(Fragment, {
    children: "Production"
  })
}, {
  depth: 3,
  url: "#docker",
  title: jsx(Fragment, {
    children: "Docker"
  })
}, {
  depth: 2,
  url: "#security-recommendations",
  title: jsx(Fragment, {
    children: "Security Recommendations"
  })
}];
function _createMdxContent$2(props) {
  const _components = {
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout } = _components;
  if (!Callout) _missingMdxReference$2("Callout");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "configuration",
      children: "Configuration"
    }), "\n", jsx(_components.p, {
      children: "Configure Constellation Overwatch using CLI flags or environment variables."
    }), "\n", jsx(_components.h2, {
      id: "cli-options",
      children: "CLI Options"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " [options]"
            })]
          })
        })
      })
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Flag"
          }), jsx(_components.th, {
            children: "Default"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-port"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "8080"
            })
          }), jsx(_components.td, {
            children: "HTTP server port"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-nats-port"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "4222"
            })
          }), jsx(_components.td, {
            children: "NATS server port"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-api-token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "reindustrialize-dev-token"
            })
          }), jsx(_components.td, {
            children: "API bearer token"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-nats-token"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "reindustrialize-america"
            })
          }), jsx(_components.td, {
            children: "NATS authentication token"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-db-path"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "./data/constellation.db"
            })
          }), jsx(_components.td, {
            children: "SQLite database path"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-log-level"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "info"
            })
          }), jsx(_components.td, {
            children: "Logging level (debug, info, warn, error)"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "environment-variables",
      children: "Environment Variables"
    }), "\n", jsx(_components.p, {
      children: "All CLI options can also be set via environment variables:"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Variable"
          }), jsx(_components.th, {
            children: "CLI Flag"
          }), jsx(_components.th, {
            children: "Description"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_PORT"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-port"
            })
          }), jsx(_components.td, {
            children: "HTTP server port"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_NATS_PORT"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-nats-port"
            })
          }), jsx(_components.td, {
            children: "NATS server port"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_API_TOKEN"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-api-token"
            })
          }), jsx(_components.td, {
            children: "API bearer token"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_NATS_TOKEN"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-nats-token"
            })
          }), jsx(_components.td, {
            children: "NATS authentication token"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_DB_PATH"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-db-path"
            })
          }), jsx(_components.td, {
            children: "SQLite database path"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: jsx(_components.code, {
              children: "OVERWATCH_LOG_LEVEL"
            })
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "-log-level"
            })
          }), jsx(_components.td, {
            children: "Logging level"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "example-configurations",
      children: "Example Configurations"
    }), "\n", jsx(_components.h3, {
      id: "development",
      children: "Development"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            })
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "Uses all default values for local development."
    }), "\n", jsx(_components.h3, {
      id: "production",
      children: "Production"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -port"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 8080"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -api-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "openssl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " rand"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -hex"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 32"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ") "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "\\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -nats-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "openssl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " rand"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -hex"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 32"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ") "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "\\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -log-level"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " warn"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "docker",
      children: "Docker"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "docker"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " run"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -d"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -p"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " 8080:8080"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -p"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " 4222:4222"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -e"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " OVERWATCH_API_TOKEN=your-secure-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -e"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " OVERWATCH_NATS_TOKEN=your-nats-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -v"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "pwd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ")"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "/data:/data"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  constellation-overwatch"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "security-recommendations",
      children: "Security Recommendations"
    }), "\n", jsx(Callout, {
      type: "warn",
      children: jsx(_components.p, {
        children: "Always use strong, randomly generated tokens in production environments."
      })
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Generate tokens with at least 32 bytes of entropy"
      }), "\n", jsx(_components.li, {
        children: "Never commit tokens to version control"
      }), "\n", jsx(_components.li, {
        children: "Use environment variables or secrets management in production"
      }), "\n", jsx(_components.li, {
        children: "Rotate tokens periodically"
      }), "\n"]
    })]
  });
}
function MDXContent$2(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$2, {
      ...props
    })
  }) : _createMdxContent$2(props);
}
function _missingMdxReference$2(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$2,
  frontmatter: frontmatter$2,
  structuredData: structuredData$2,
  toc: toc$2
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter$1 = {
  "title": "Installation",
  "description": "Install Constellation Overwatch using our automated installer or build from source",
  "icon": "Download"
};
let structuredData$1 = {
  "contents": [{
    "heading": "installation",
    "content": "Get Constellation Overwatch running on your system in minutes with our automated installer or build from source for development."
  }, {
    "heading": "installer-recommended",
    "content": "The fastest way to get started is with our automated installer:"
  }, {
    "heading": "windows",
    "content": "The installer will:"
  }, {
    "heading": "windows",
    "content": "Download the latest release binary (36.2MB)"
  }, {
    "heading": "windows",
    "content": "Install to /usr/local/bin (Linux/macOS) or %USERPROFILE%\\.local\\bin (Windows)"
  }, {
    "heading": "windows",
    "content": "Add to your system PATH"
  }, {
    "heading": "windows",
    "content": "Verify installation"
  }, {
    "heading": "build-from-source",
    "content": "For development or custom builds:"
  }, {
    "heading": "prerequisites",
    "content": "Go 1.21+ - Download here"
  }, {
    "heading": "prerequisites",
    "content": "Task - Installation guide"
  }, {
    "heading": "verification",
    "content": "Verify your installation:"
  }, {
    "heading": "verification",
    "content": "You should see output similar to:"
  }, {
    "heading": "next-steps",
    "content": "With Constellation Overwatch installed, you're ready to:"
  }],
  "headings": [{
    "id": "installation",
    "content": "Installation"
  }, {
    "id": "installer-recommended",
    "content": "Installer (Recommended)"
  }, {
    "id": "linux--macos",
    "content": "Linux / macOS"
  }, {
    "id": "windows",
    "content": "Windows"
  }, {
    "id": "build-from-source",
    "content": "Build from Source"
  }, {
    "id": "prerequisites",
    "content": "Prerequisites"
  }, {
    "id": "clone-and-build",
    "content": "Clone and Build"
  }, {
    "id": "verification",
    "content": "Verification"
  }, {
    "id": "next-steps",
    "content": "Next Steps"
  }]
};
const toc$1 = [{
  depth: 1,
  url: "#installation",
  title: jsx(Fragment, {
    children: "Installation"
  })
}, {
  depth: 2,
  url: "#installer-recommended",
  title: jsx(Fragment, {
    children: "Installer (Recommended)"
  })
}, {
  depth: 3,
  url: "#linux--macos",
  title: jsx(Fragment, {
    children: "Linux / macOS"
  })
}, {
  depth: 3,
  url: "#windows",
  title: jsx(Fragment, {
    children: "Windows"
  })
}, {
  depth: 2,
  url: "#build-from-source",
  title: jsx(Fragment, {
    children: "Build from Source"
  })
}, {
  depth: 3,
  url: "#prerequisites",
  title: jsx(Fragment, {
    children: "Prerequisites"
  })
}, {
  depth: 3,
  url: "#clone-and-build",
  title: jsx(Fragment, {
    children: "Clone and Build"
  })
}, {
  depth: 2,
  url: "#verification",
  title: jsx(Fragment, {
    children: "Verification"
  })
}, {
  depth: 2,
  url: "#next-steps",
  title: jsx(Fragment, {
    children: "Next Steps"
  })
}];
function _createMdxContent$1(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ul: "ul",
    ...props.components
  }, { Card, Cards } = _components;
  if (!Card) _missingMdxReference$1("Card");
  if (!Cards) _missingMdxReference$1("Cards");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "installation",
      children: "Installation"
    }), "\n", jsx(_components.p, {
      children: "Get Constellation Overwatch running on your system in minutes with our automated installer or build from source for development."
    }), "\n", jsx(_components.h2, {
      id: "installer-recommended",
      children: "Installer (Recommended)"
    }), "\n", jsx(_components.p, {
      children: "The fastest way to get started is with our automated installer:"
    }), "\n", jsx(_components.h3, {
      id: "linux--macos",
      children: "Linux / macOS"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -LsSf"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://constellation-overwatch.github.io/overwatch/install.sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: " |"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: " sh"
            })]
          })
        })
      })
    }), "\n", jsx(_components.h3, {
      id: "windows",
      children: "Windows"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "powershell "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "-"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "ExecutionPolicy Bypass "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "-"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "c "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"irm https://constellation-overwatch.github.io/overwatch/install.ps1 | iex"'
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "The installer will:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Download the latest release binary (36.2MB)"
      }), "\n", jsxs(_components.li, {
        children: ["Install to ", jsx(_components.code, {
          children: "/usr/local/bin"
        }), " (Linux/macOS) or ", jsx(_components.code, {
          children: "%USERPROFILE%\\.local\\bin"
        }), " (Windows)"]
      }), "\n", jsx(_components.li, {
        children: "Add to your system PATH"
      }), "\n", jsx(_components.li, {
        children: "Verify installation"
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "build-from-source",
      children: "Build from Source"
    }), "\n", jsx(_components.p, {
      children: "For development or custom builds:"
    }), "\n", jsx(_components.h3, {
      id: "prerequisites",
      children: "Prerequisites"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Go 1.21+"
        }), " - ", jsx(_components.a, {
          href: "https://golang.org/dl/",
          children: "Download here"
        })]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Task"
        }), " - ", jsx(_components.a, {
          href: "https://taskfile.dev/installation/",
          children: "Installation guide"
        })]
      }), "\n"]
    }), "\n", jsx(_components.h3, {
      id: "clone-and-build",
      children: "Clone and Build"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "git"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " clone"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " https://github.com/Constellation-Overwatch/constellation-overwatch.git"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "cd"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " constellation-overwatch"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Install Task (if not already installed)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# macOS"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "brew"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " install"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " go-task/tap/go-task"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Linux"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "sh"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -c"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "$('
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " --location"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' https://taskfile.dev/install.sh)"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " --"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -d"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -b"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " ~/.local/bin"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Windows (requires Scoop)"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "scoop"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " install"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " task"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Start development server"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "task"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " dev"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "verification",
      children: "Verification"
    }), "\n", jsx(_components.p, {
      children: "Verify your installation:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsx(_components.code, {
          children: jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -version"
            })]
          })
        })
      })
    }), "\n", jsx(_components.p, {
      children: "You should see output similar to:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "Constellation Overwatch v1.0.0"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "Built: 2024-12-22T12:00:00Z"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              children: "Commit: abc123def456"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "next-steps",
      children: "Next Steps"
    }), "\n", jsx(_components.p, {
      children: "With Constellation Overwatch installed, you're ready to:"
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Quick Start",
        href: "/docs/platform/quick-start",
        description: "Start your first server and create organizations"
      }), jsx(Card, {
        title: "Configuration",
        href: "/docs/platform/configuration",
        description: "Learn about CLI options and environment variables"
      })]
    })]
  });
}
function MDXContent$1(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$1, {
      ...props
    })
  }) : _createMdxContent$1(props);
}
function _missingMdxReference$1(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$1,
  frontmatter: frontmatter$1,
  structuredData: structuredData$1,
  toc: toc$1
}, Symbol.toStringTag, { value: "Module" }));
let frontmatter = {
  "title": "Quick Start",
  "description": "Get up and running with Constellation Overwatch in minutes",
  "icon": "Zap"
};
let structuredData = {
  "contents": [{
    "heading": "quick-start",
    "content": "This guide will help you get Constellation Overwatch up and running in just a few minutes."
  }, {
    "heading": "step-1-start-the-server",
    "content": "Once installed, start Constellation Overwatch:"
  }, {
    "heading": "step-1-start-the-server",
    "content": "The server will start with:"
  }, {
    "heading": "step-1-start-the-server",
    "content": "Web UI: http://localhost:8080"
  }, {
    "heading": "step-1-start-the-server",
    "content": "API: http://localhost:8080/api/v1"
  }, {
    "heading": "step-1-start-the-server",
    "content": "NATS: nats://localhost:4222"
  }, {
    "heading": "default-credentials",
    "content": "For development, use these default credentials:"
  }, {
    "heading": "default-credentials",
    "content": "Service"
  }, {
    "heading": "default-credentials",
    "content": "Credential"
  }, {
    "heading": "default-credentials",
    "content": "Value"
  }, {
    "heading": "default-credentials",
    "content": "Web UI Password"
  }, {
    "heading": "default-credentials",
    "content": "Password"
  }, {
    "heading": "default-credentials",
    "content": "reindustrialize"
  }, {
    "heading": "default-credentials",
    "content": "API Token"
  }, {
    "heading": "default-credentials",
    "content": "Bearer Token"
  }, {
    "heading": "default-credentials",
    "content": "reindustrialize-dev-token"
  }, {
    "heading": "default-credentials",
    "content": "NATS Auth Token"
  }, {
    "heading": "default-credentials",
    "content": "Token"
  }, {
    "heading": "default-credentials",
    "content": "reindustrialize-america"
  }, {
    "heading": "default-credentials",
    "content": "type: warn"
  }, {
    "heading": "default-credentials",
    "content": "Production Warning: Always use custom tokens in production with the -api-token and -nats-token flags."
  }, {
    "heading": "step-2-create-your-organization",
    "content": "Organizations group your entities (drones, robots, sensors) under a single management structure."
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": "Navigate to: http://localhost:8080/organizations"
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": 'Click "Create Organization"'
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": "Fill in the form:"
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": "Name: Your organization name"
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": "Type: civilian, military, or commercial"
  }, {
    "heading": "option-a-web-ui-recommended",
    "content": "Description: Brief description"
  }, {
    "heading": "option-b-api",
    "content": "Save the org_id from the response!"
  }, {
    "heading": "step-3-register-an-entity",
    "content": "Entities represent your physical assets (drones, robots, sensors)."
  }, {
    "heading": "step-3-register-an-entity",
    "content": "Extract the entity_id from the response - this is your unique namespace!"
  }, {
    "heading": "step-4-publish-telemetry-data",
    "content": "Now you can publish telemetry to the global state using your entity_id:"
  }, {
    "heading": "step-5-view-your-data",
    "content": "Check your data in the web dashboard:"
  }, {
    "heading": "step-5-view-your-data",
    "content": "Navigate to: http://localhost:8080/fleet"
  }, {
    "heading": "step-5-view-your-data",
    "content": "Select your organization"
  }, {
    "heading": "step-5-view-your-data",
    "content": "View your entity's real-time telemetry"
  }, {
    "heading": "whats-next",
    "content": "You now have a basic Constellation Overwatch setup! Explore these areas next:"
  }],
  "headings": [{
    "id": "quick-start",
    "content": "Quick Start"
  }, {
    "id": "step-1-start-the-server",
    "content": "Step 1: Start the Server"
  }, {
    "id": "default-credentials",
    "content": "Default Credentials"
  }, {
    "id": "step-2-create-your-organization",
    "content": "Step 2: Create Your Organization"
  }, {
    "id": "option-a-web-ui-recommended",
    "content": "Option A: Web UI (Recommended)"
  }, {
    "id": "option-b-api",
    "content": "Option B: API"
  }, {
    "id": "step-3-register-an-entity",
    "content": "Step 3: Register an Entity"
  }, {
    "id": "step-4-publish-telemetry-data",
    "content": "Step 4: Publish Telemetry Data"
  }, {
    "id": "step-5-view-your-data",
    "content": "Step 5: View Your Data"
  }, {
    "id": "whats-next",
    "content": "What's Next?"
  }]
};
const toc = [{
  depth: 1,
  url: "#quick-start",
  title: jsx(Fragment, {
    children: "Quick Start"
  })
}, {
  depth: 2,
  url: "#step-1-start-the-server",
  title: jsx(Fragment, {
    children: "Step 1: Start the Server"
  })
}, {
  depth: 3,
  url: "#default-credentials",
  title: jsx(Fragment, {
    children: "Default Credentials"
  })
}, {
  depth: 2,
  url: "#step-2-create-your-organization",
  title: jsx(Fragment, {
    children: "Step 2: Create Your Organization"
  })
}, {
  depth: 3,
  url: "#option-a-web-ui-recommended",
  title: jsx(Fragment, {
    children: "Option A: Web UI (Recommended)"
  })
}, {
  depth: 3,
  url: "#option-b-api",
  title: jsx(Fragment, {
    children: "Option B: API"
  })
}, {
  depth: 2,
  url: "#step-3-register-an-entity",
  title: jsx(Fragment, {
    children: "Step 3: Register an Entity"
  })
}, {
  depth: 2,
  url: "#step-4-publish-telemetry-data",
  title: jsx(Fragment, {
    children: "Step 4: Publish Telemetry Data"
  })
}, {
  depth: 2,
  url: "#step-5-view-your-data",
  title: jsx(Fragment, {
    children: "Step 5: View Your Data"
  })
}, {
  depth: 2,
  url: "#whats-next",
  title: jsx(Fragment, {
    children: "What's Next?"
  })
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  }, { Callout, Card, Cards } = _components;
  if (!Callout) _missingMdxReference("Callout");
  if (!Card) _missingMdxReference("Card");
  if (!Cards) _missingMdxReference("Cards");
  return jsxs(Fragment, {
    children: [jsx(_components.h1, {
      id: "quick-start",
      children: "Quick Start"
    }), "\n", jsx(_components.p, {
      children: "This guide will help you get Constellation Overwatch up and running in just a few minutes."
    }), "\n", jsx(_components.h2, {
      id: "step-1-start-the-server",
      children: "Step 1: Start the Server"
    }), "\n", jsx(_components.p, {
      children: "Once installed, start Constellation Overwatch:"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Basic start (development mode)"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Custom port"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -port"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 9090"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Production with secure tokens"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "overwatch"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -api-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "openssl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " rand"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -hex"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 32"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ") "
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "-nats-token"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " $("
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "openssl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " rand"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -hex"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " 32"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: ")"
            })]
          })]
        })
      })
    }), "\n", jsx(_components.p, {
      children: "The server will start with:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Web UI"
        }), ": ", jsx(_components.a, {
          href: "http://localhost:8080",
          children: "http://localhost:8080"
        })]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "API"
        }), ": ", jsx(_components.a, {
          href: "http://localhost:8080/api/v1",
          children: "http://localhost:8080/api/v1"
        })]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "NATS"
        }), ": nats://localhost:4222"]
      }), "\n"]
    }), "\n", jsx(_components.h3, {
      id: "default-credentials",
      children: "Default Credentials"
    }), "\n", jsx(_components.p, {
      children: "For development, use these default credentials:"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "Service"
          }), jsx(_components.th, {
            children: "Credential"
          }), jsx(_components.th, {
            children: "Value"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "Web UI Password"
          }), jsx(_components.td, {
            children: "Password"
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "reindustrialize"
            })
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "API Token"
          }), jsx(_components.td, {
            children: "Bearer Token"
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "reindustrialize-dev-token"
            })
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "NATS Auth Token"
          }), jsx(_components.td, {
            children: "Token"
          }), jsx(_components.td, {
            children: jsx(_components.code, {
              children: "reindustrialize-america"
            })
          })]
        })]
      })]
    }), "\n", jsx(Callout, {
      type: "warn",
      children: jsxs(_components.p, {
        children: [jsx(_components.strong, {
          children: "Production Warning"
        }), ": Always use custom tokens in production with the ", jsx(_components.code, {
          children: "-api-token"
        }), " and ", jsx(_components.code, {
          children: "-nats-token"
        }), " flags."]
      })
    }), "\n", jsx(_components.h2, {
      id: "step-2-create-your-organization",
      children: "Step 2: Create Your Organization"
    }), "\n", jsx(_components.p, {
      children: "Organizations group your entities (drones, robots, sensors) under a single management structure."
    }), "\n", jsx(_components.h3, {
      id: "option-a-web-ui-recommended",
      children: "Option A: Web UI (Recommended)"
    }), "\n", jsxs(_components.ol, {
      children: ["\n", jsxs(_components.li, {
        children: ["Navigate to: ", jsx(_components.a, {
          href: "http://localhost:8080/organizations",
          children: "http://localhost:8080/organizations"
        })]
      }), "\n", jsxs(_components.li, {
        children: ["Click ", jsx(_components.strong, {
          children: '"Create Organization"'
        })]
      }), "\n", jsxs(_components.li, {
        children: ["Fill in the form:", "\n", jsxs(_components.ul, {
          children: ["\n", jsxs(_components.li, {
            children: [jsx(_components.strong, {
              children: "Name"
            }), ": Your organization name"]
          }), "\n", jsxs(_components.li, {
            children: [jsx(_components.strong, {
              children: "Type"
            }), ": ", jsx(_components.code, {
              children: "civilian"
            }), ", ", jsx(_components.code, {
              children: "military"
            }), ", or ", jsx(_components.code, {
              children: "commercial"
            })]
          }), "\n", jsxs(_components.li, {
            children: [jsx(_components.strong, {
              children: "Description"
            }), ": Brief description"]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    }), "\n", jsx(_components.h3, {
      id: "option-b-api",
      children: "Option B: API"
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "export"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " TOKEN"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"reindustrialize-dev-token"'
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -X"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " POST"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " http://localhost:8080/api/v1/organizations"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -H"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "Authorization: Bearer '
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "$TOKEN"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -H"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "Content-Type: application/json"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -d"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " '{"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "name": "My Fleet",'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "org_type": "civilian", '
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "description": "My drone fleet operations"'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  }'"
            })
          })]
        })
      })
    }), "\n", jsxs(_components.p, {
      children: ["Save the ", jsx(_components.code, {
        children: "org_id"
      }), " from the response!"]
    }), "\n", jsx(_components.h2, {
      id: "step-3-register-an-entity",
      children: "Step 3: Register an Entity"
    }), "\n", jsx(_components.p, {
      children: "Entities represent your physical assets (drones, robots, sensors)."
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "export"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " TOKEN"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"reindustrialize-dev-token"'
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "export"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " ORG_ID"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"your-org-id-from-step-2"'
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "curl"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " -X"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " POST"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "http://localhost:8080/api/v1/entities?org_id='
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "$ORG_ID"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -H"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "Authorization: Bearer '
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "$TOKEN"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -H"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "Content-Type: application/json"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: "  -d"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " '{"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "name": "Drone-001",'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "entity_type": "aircraft_multirotor",'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "description": "Primary inspection drone",'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "metadata": {'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '      "model": "DJI-M300",'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '      "serial": "ABC123456"'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "    }"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  }'"
            })
          })]
        })
      })
    }), "\n", jsxs(_components.p, {
      children: ["Extract the ", jsx(_components.code, {
        children: "entity_id"
      }), " from the response - this is your unique namespace!"]
    }), "\n", jsx(_components.h2, {
      id: "step-4-publish-telemetry-data",
      children: "Step 4: Publish Telemetry Data"
    }), "\n", jsxs(_components.p, {
      children: ["Now you can publish telemetry to the global state using your ", jsx(_components.code, {
        children: "entity_id"
      }), ":"]
    }), "\n", jsx(Fragment, {
      children: jsx(_components.pre, {
        className: "shiki shiki-themes github-light github-dark",
        style: {
          "--shiki-light": "#24292e",
          "--shiki-dark": "#e1e4e8",
          "--shiki-light-bg": "#fff",
          "--shiki-dark-bg": "#24292e"
        },
        tabIndex: "0",
        icon: '<svg viewBox="0 0 24 24"><path d="m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" fill="currentColor" /></svg>',
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "export"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: " ENTITY_ID"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#D73A49",
                "--shiki-dark": "#F97583"
              },
              children: "="
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"your-entity-id-from-step-3"'
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#6A737D",
                "--shiki-dark": "#6A737D"
              },
              children: "# Publish ontological telemetry to CONSTELLATION_GLOBAL_STATE KV bucket"
            })
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                "--shiki-light": "#6F42C1",
                "--shiki-dark": "#B392F0"
              },
              children: "nats"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " kv"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " put"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: " CONSTELLATION_GLOBAL_STATE"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: ' "'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#24292E",
                "--shiki-dark": "#E1E4E8"
              },
              children: "$ENTITY_ID"
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '"'
            }), jsx(_components.span, {
              style: {
                "--shiki-light": "#005CC5",
                "--shiki-dark": "#79B8FF"
              },
              children: " \\"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  '{"
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "position": {"lat": 37.7749, "lon": -122.4194, "alt": 100},'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "orientation": {"roll": 0.1, "pitch": -0.2, "yaw": 1.5},'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "sensors": {"temperature": 22.5, "humidity": 65, "pressure": 1013.25},'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "state": {"battery": 85, "mode": "autonomous", "armed": true},'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: '    "performance": {"velocity": 5.2, "thrust": 0.7, "efficiency": 0.92}'
            })
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                "--shiki-light": "#032F62",
                "--shiki-dark": "#9ECBFF"
              },
              children: "  }'"
            })
          })]
        })
      })
    }), "\n", jsx(_components.h2, {
      id: "step-5-view-your-data",
      children: "Step 5: View Your Data"
    }), "\n", jsx(_components.p, {
      children: "Check your data in the web dashboard:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: ["Navigate to: ", jsx(_components.a, {
          href: "http://localhost:8080/fleet",
          children: "http://localhost:8080/fleet"
        })]
      }), "\n", jsx(_components.li, {
        children: "Select your organization"
      }), "\n", jsx(_components.li, {
        children: "View your entity's real-time telemetry"
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "whats-next",
      children: "What's Next?"
    }), "\n", jsx(_components.p, {
      children: "You now have a basic Constellation Overwatch setup! Explore these areas next:"
    }), "\n", jsxs(Cards, {
      children: [jsx(Card, {
        title: "Ontological Data Design",
        href: "/docs/concepts/telemetry",
        description: "Learn how to structure your telemetry data effectively"
      }), jsx(Card, {
        title: "API Reference",
        href: "/docs/platform/api",
        description: "Comprehensive API documentation and examples"
      }), jsx(Card, {
        title: "Integrations",
        href: "/docs/integrations",
        description: "MAVLink bridges, Vision AI, and video streaming"
      }), jsx(Card, {
        title: "Cloud Deployment",
        href: "/docs/operations/deployment",
        description: "Deploy to production cloud infrastructure"
      })]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected component `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const __vite_glob_1_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent,
  frontmatter,
  structuredData,
  toc
}, Symbol.toStringTag, { value: "Module" }));
const create = server({ "doc": { "passthroughs": ["extractedReferences"] } });
const docs = await create.docs("docs", "content/docs", /* @__PURE__ */ Object.assign({
  "./concepts/meta.json": __vite_glob_0_0,
  "./integrations/meta.json": __vite_glob_0_1,
  "./introduction/meta.json": __vite_glob_0_2,
  "./meta.json": __vite_glob_0_3,
  "./operations/meta.json": __vite_glob_0_4,
  "./platform/meta.json": __vite_glob_0_5
}), /* @__PURE__ */ Object.assign({
  "./concepts/index.mdx": __vite_glob_1_0,
  "./concepts/telemetry.mdx": __vite_glob_1_1,
  "./index.mdx": __vite_glob_1_2,
  "./integrations/aero-arc-relay.mdx": __vite_glob_1_3,
  "./integrations/ffmpeg.mdx": __vite_glob_1_4,
  "./integrations/index.mdx": __vite_glob_1_5,
  "./integrations/vision.mdx": __vite_glob_1_6,
  "./introduction/architecture.mdx": __vite_glob_1_7,
  "./introduction/index.mdx": __vite_glob_1_8,
  "./operations/deployment.mdx": __vite_glob_1_9,
  "./operations/toolbelt.mdx": __vite_glob_1_10,
  "./platform/api.mdx": __vite_glob_1_11,
  "./platform/configuration.mdx": __vite_glob_1_12,
  "./platform/installation.mdx": __vite_glob_1_13,
  "./platform/quick-start.mdx": __vite_glob_1_14
}));
const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
  plugins: [lucideIconsPlugin()]
});
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
const getStaticCacheUrl = async (opts) => {
  const filename = await sha1Hash(`${opts.functionId}__${opts.hash}`);
  return `/__tsr/staticServerFnCache/${filename}.json`;
};
const jsonToFilenameSafeString = (json) => {
  const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
    acc[curr] = value[curr];
    return acc;
  }, {}) : value;
  const jsonString = JSON.stringify(json ?? "", sortedKeysReplacer);
  return jsonString.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
};
const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
async function addItemToCache({
  functionId,
  data,
  response
}) {
  {
    const hash = jsonToFilenameSafeString(data);
    const url = await getStaticCacheUrl({
      functionId,
      hash
    });
    const clientUrl = "dist/client";
    const filePath = path$1.join(clientUrl, url);
    await fs.mkdir(path$1.dirname(filePath), {
      recursive: true
    });
    const stringifiedResult = JSON.stringify(await toJSONAsync({
      result: response.result,
      context: response.context.sendContext
    }, {
      plugins: getDefaultSerovalPlugins()
    }));
    await fs.writeFile(filePath, stringifiedResult, "utf-8");
  }
}
const fetchItem = async ({
  data,
  functionId
}) => {
  const hash = jsonToFilenameSafeString(data);
  const url = await getStaticCacheUrl({
    functionId,
    hash
  });
  let result = staticClientCache?.get(url);
  result = await fetch(url, {
    method: "GET"
  }).then((r) => r.json()).then((d) => fromJSON(d, {
    plugins: getDefaultSerovalPlugins()
  }));
  return result;
};
const staticFunctionMiddleware = createMiddleware({
  type: "function"
}).client(async (ctx) => {
  if (process.env.NODE_ENV === "production" && // do not run this during SSR on the server
  typeof document !== "undefined") {
    const response = await fetchItem({
      functionId: ctx.functionId,
      data: ctx.data
    });
    if (response) {
      return {
        result: response.result,
        context: {
          ...ctx.context,
          ...response.context
        }
      };
    }
  }
  return ctx.next();
}).server(async (ctx) => {
  const response = await ctx.next();
  if (process.env.NODE_ENV === "production") {
    await addItemToCache({
      functionId: ctx.functionId,
      response: {
        result: response.result,
        context: ctx
      },
      data: ctx.data
    });
  }
  return response;
});
export {
  __toESM as _,
  source as a,
  basename as b,
  __commonJS as c,
  __vite_glob_1_0 as d,
  extname as e,
  findPath as f,
  __vite_glob_1_1 as g,
  __vite_glob_1_2 as h,
  __vite_glob_1_3 as i,
  __vite_glob_1_4 as j,
  __vite_glob_1_5 as k,
  __vite_glob_1_6 as l,
  __vite_glob_1_7 as m,
  normalizeUrl as n,
  __vite_glob_1_8 as o,
  __vite_glob_1_9 as p,
  __vite_glob_1_10 as q,
  __vite_glob_1_11 as r,
  staticFunctionMiddleware as s,
  __vite_glob_1_12 as t,
  __vite_glob_1_13 as u,
  visit as v,
  __vite_glob_1_14 as w
};
