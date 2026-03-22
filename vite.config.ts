import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "charts";
          }

          if (id.includes("node_modules/@radix-ui")) {
            return "radix";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }

          return undefined;
        },
      },
    },
  },
});
