import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "./",
  publicDir: "public",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "docs",
    assetsDir: "js",
    assetsInlineLimit: 4096,
    sourcemap: false,
    cssMinify: true,
    minify: "esbuild",
    target: "es2020",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/motion")) return "motion";
          if (id.includes("node_modules/lucide")) return "lucide";
        },
      },
    },
  },
  esbuild: {
    drop: ["debugger"],
  },
});
