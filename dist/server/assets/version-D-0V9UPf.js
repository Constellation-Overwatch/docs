import { a as createServerRpc, c as createServerFn } from "../server.js";
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
import "@tanstack/react-router";
let cachedVersionInfo = null;
let lastFetchTime = 0;
const CACHE_TTL = 36e5;
const getLatestVersion_createServerFn_handler = createServerRpc("35bc1bf7ae688a6ff67750ed5d7e45480af8f39d65e4dadbef35dc285bbbf594", (opts, signal) => {
  return getLatestVersion.__executeServer(opts, signal);
});
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
export {
  getLatestVersion_createServerFn_handler
};
