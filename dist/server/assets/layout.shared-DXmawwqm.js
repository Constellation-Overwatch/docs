import { jsx, jsxs } from "react/jsx-runtime";
import { SiGithub, SiDiscord } from "@icons-pack/react-simple-icons";
function baseOptions() {
  return {
    nav: {
      title: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("img", { src: "/images/c4-logo.png", alt: "Constellation Overwatch", className: "w-6 h-6" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Constellation Overwatch" })
      ] }),
      transparentMode: "top"
    },
    links: [
      {
        type: "icon",
        label: "GitHub",
        icon: /* @__PURE__ */ jsx(SiGithub, {}),
        text: "GitHub",
        url: "https://github.com/Constellation-Overwatch/constellation-overwatch",
        external: true
      },
      {
        type: "icon",
        label: "Discord",
        icon: /* @__PURE__ */ jsx(SiDiscord, {}),
        text: "Discord",
        url: "https://discord.gg/hqJebrXmhQ",
        external: true
      }
    ]
  };
}
export {
  baseOptions as b
};
