import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  envDir: path.resolve(__dirname, ".."),
  plugins: [react()],
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:8787",
        ws: true,
      },
    },
  },
});
