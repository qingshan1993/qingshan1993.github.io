import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("D:/frontend/xuedianbiede/node_modules/vuepress-theme-hope/lib/client/layouts/404.js")),
  "Layout": defineAsyncComponent(() => import("D:/frontend/xuedianbiede/node_modules/vuepress-theme-hope/lib/client/layouts/Layout.js")),
  "Slide": defineAsyncComponent(() => import("D:/frontend/xuedianbiede/node_modules/vuepress-theme-hope/lib/client/layouts/Slide.js")),
}
