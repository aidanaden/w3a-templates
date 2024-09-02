import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  server: {
    preset: "cloudflare-pages",
    // alias: { "process/": "process" },
    esbuild: {
      options: {
        // We need BigInt support (default: 2019)
        target: "esnext",
      },
    },
  },
  vite: {
    define: {
      global: "globalThis",
    },
  },
});
