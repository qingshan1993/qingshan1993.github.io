import { hopeTheme } from "vuepress-theme-hope";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://vuepress-theme-hope-v2-demo.mrhope.site",

  author: {
    name: "qingshan",
    url: "https://mrhope.site",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "vuepress-theme-hope/vuepress-theme-hope",

  docsDir: "demo/src",

  footer: "Default footer",

  sidebar: sidebar,

  displayFooter: false,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  encrypt: {
    config: {
      "/guide/encrypt.html": ["1234"],
    },
  },

  plugins: {
    blog: false,

    mdEnhance: {
        enableAll: false,
        presentation: {
            plugins: ["highlight", "math", "search", "notes", "zoom"],
        },
    },
   },

});
