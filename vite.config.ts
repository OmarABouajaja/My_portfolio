import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    devOptions: {
      enabled: true, // Generate SW in dev mode so the user can test the PWA installation locally
    },
    manifest: false, // Tell VitePWA to use the existing public/manifest.json
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      maximumFileSizeToCacheInBytes: 5000000, // Increased to 5MB to handle large libraries like three.js
    },
  }), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));