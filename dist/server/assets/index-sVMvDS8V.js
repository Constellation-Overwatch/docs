import { r as reactExports, j as jsxRuntimeExports, R as React } from "./worker-entry-CaO_sJbc.js";
import { R as Route, H as HomeLayout, L as Link } from "./router-C0K6BgM3.js";
import { b as baseOptions } from "./layout.shared-CvZbSMCY.js";
import "node:events";
import "node:stream";
import "node:async_hooks";
import "node:stream/web";
import "./staticFunctionMiddleware-vKLtSUic.js";
import "path";
import "node:path";
const CosmicParallaxBg = ({
  head,
  loop = true,
  className = ""
}) => {
  const [smallStars, setSmallStars] = reactExports.useState("");
  const [mediumStars, setMediumStars] = reactExports.useState("");
  const [bigStars, setBigStars] = reactExports.useState("");
  const generateStarBoxShadow = (count) => {
    const width = Math.max(typeof window !== "undefined" ? window.innerWidth : 2e3, 2e3);
    const height = Math.max(typeof window !== "undefined" ? window.innerHeight : 2e3, 2e3);
    let shadows = [];
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      shadows.push(`${x}px ${y}px #FFF`);
    }
    return shadows.join(", ");
  };
  reactExports.useEffect(() => {
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));
    document.documentElement.style.setProperty(
      "--animation-iteration",
      loop ? "infinite" : "1"
    );
  }, [loop]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `cosmic-parallax-container ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        id: "stars",
        style: { boxShadow: smallStars },
        className: "cosmic-stars"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        id: "stars2",
        style: { boxShadow: mediumStars },
        className: "cosmic-stars-medium"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        id: "stars3",
        style: { boxShadow: bigStars },
        className: "cosmic-stars-large"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "horizon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "earth" }),
    head && head.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "title", children: head.split(" ").map((word, index, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
      word.toUpperCase(),
      index < arr.length - 1 && (index === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}) : " ")
    ] }, index)) })
  ] });
};
function Home() {
  const versionInfo = Route.useLoaderData();
  const version = versionInfo?.version || "v1.0.0";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HomeLayout, { ...baseOptions(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col min-h-[calc(100vh-64px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-gradient-to-b from-[#090A0F] to-[#1B2735]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CosmicParallaxBg, { head: "", loop: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-8 md:top-12 lg:top-16 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/c4-logo.png", alt: "Constellation Overwatch", className: "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-4 md:mb-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase mb-3 md:mb-4", children: "Open Source C4 for the Industrial Edge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-xs md:text-sm bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full border border-blue-500/30 mb-4 md:mb-5", children: version }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-sm md:text-lg lg:text-xl font-medium mb-2 md:mb-3 max-w-sm md:max-w-2xl lg:max-w-3xl mx-auto text-center leading-relaxed", children: "Data Fabric & Toolbelt for Agentic Drones, Robots, Sensors, and Video Streams" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/50 text-xs md:text-sm lg:text-base max-w-xs md:max-w-xl lg:max-w-2xl mx-auto text-center mb-6 md:mb-8", children: [
        "Rapid response industrial data stack designed with ontological data primitives. Use ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "entity_id" }),
        " to stream semantic real time signal trees."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-sm md:max-w-lg lg:max-w-xl w-full mx-auto mb-5 md:mb-6 pointer-events-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-black/50 backdrop-blur-sm text-green-400 p-3 md:p-4 rounded-lg font-mono text-left relative group border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          navigator.clipboard.writeText("curl -LsSf https://constellation-overwatch.dev/install.sh | sh");
        }, className: "absolute top-2 md:top-3 right-2 md:right-3 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100", title: "Copy to clipboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/40 text-xs md:text-sm mb-1", children: "# Quick Install" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pr-8 text-xs md:text-sm break-all md:break-normal", children: "curl -LsSf https://constellation-overwatch.dev/install.sh | sh" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto mb-5 md:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/docs/$", params: {
        _splat: ""
      }, className: "inline-block px-8 md:px-10 py-3 md:py-3.5 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25", children: "Get Started" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs md:text-sm font-medium mb-3 md:mb-4 text-white/40 tracking-wider uppercase text-center", children: "Powered By" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-5 md:gap-8 lg:gap-10 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/go-logo.svg", alt: "Go", className: "h-10 md:h-12 lg:h-14" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/nats.avif", alt: "NATS", className: "h-6 md:h-8 lg:h-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/templ.svg", alt: "Templ", className: "h-5 md:h-6 lg:h-7" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/data-star.webp", alt: "Datastar", className: "h-6 md:h-8 lg:h-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/turso.svg", alt: "Turso", className: "h-6 md:h-8 lg:h-10" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "absolute bottom-4 left-0 right-0 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-white/50", children: [
      "Managed by ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://jedi-ops.dev", target: "_blank", rel: "noopener noreferrer", className: "hover:text-blue-400 transition-colors", children: "Jedi Labs" })
    ] }) })
  ] }) }) });
}
export {
  Home as component
};
