import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
	registerType: "prompt",
	includeAssets: ["prime.png", "prime.png", "prime.png"],
	manifest: {
		name: "Prime",
		short_name: "Prime",
		description: "An app for manageing finances",
		icons: [
			{
				src: "/prime.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/prime.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "/prime.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "apple touch icon",
			},
			{
				src: "/prime.png",
				sizes: "225x225",
				type: "image/png",
				purpose: "any maskable",
			},
		],
		theme_color: "#171717",
		background_color: "#e8ebf2",
		display: "standalone",
		scope: "/",
		start_url: "/",
		orientation: "portrait",
	},
};

export default defineConfig({
	base: "./",
	plugins: [react(), VitePWA(manifestForPlugin)],
});
