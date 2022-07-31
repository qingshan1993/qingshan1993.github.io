import { sidebar } from "vuepress-theme-hope";

export default sidebar({
	'/streamprogramming/': [
		{
			text: "写在前面",
			link: "README.md",
			icon: "creative",
		},
		{
			text: "longstream的使用",
			link: "longstream.md",
			icon: "creative",
		},
		{
			text: "flatmap的使用",
			link: "flatmap.md",
			icon: "creative",
		},
		{
			text: "Stream介绍",
			link: "streamoverview.md",
			icon: "creative",
		}
	
	],

	'/concurrent/': [
		{
			text: "并发基础",
			link: "README.md",
			icon: "creative",
		},
		{
			text: "CompletableFuture的使用",
			link: "completablefuture.md",
			icon: "creative",
		}
	],


});
