import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugin = {
	registerType: "prompt",
	includeAssets: ["prime.png", "prime.png", "prime.png"],
	manifest: {
    "short_name": "Prime",
    "name": "Prime",
    "icons": [
      {
      "src": "logo1.png",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
      },
      {
      "src": "logo1.png",
      "type": "image/png",
      "sizes": "192x192"
      },
      {
      "src": "logo1.png",
      "type": "image/png",
      "sizes": "512x512"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  },
};

export default defineConfig({
	base: "./",
	plugins: [react(), VitePWA(manifestForPlugin)],
});
