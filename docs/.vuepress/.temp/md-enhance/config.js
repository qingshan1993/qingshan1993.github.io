import { defineClientConfig } from "@vuepress/client";
import Presentation from "D:/frontend/xuedianbiede/node_modules/vuepress-plugin-md-enhance/lib/client/components/Presentation";
import "D:/frontend/xuedianbiede/node_modules/vuepress-plugin-md-enhance/lib/client/styles/container/index.scss";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("Presentation", Presentation);
    
  }
});