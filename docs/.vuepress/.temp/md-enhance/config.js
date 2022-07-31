import { defineClientConfig } from "@vuepress/client";
import CodeTabs from "D:/frontend/xuedianbiede/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeTabs";
import Presentation from "D:/frontend/xuedianbiede/node_modules/vuepress-plugin-md-enhance/lib/client/components/Presentation";
import "D:/frontend/xuedianbiede/node_modules/vuepress-plugin-md-enhance/lib/client/styles/container/index.scss";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Presentation", Presentation);
    
  }
});