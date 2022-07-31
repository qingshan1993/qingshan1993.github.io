import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
    lang: "zh-CN",
    title: "Learn Something Else",
    description: "A demo for vuepress-theme-hope",

    base: "/",

    theme
});
