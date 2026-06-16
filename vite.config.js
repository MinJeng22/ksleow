import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'entry-server') {
            return 'entry-server.js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    }
  }
});