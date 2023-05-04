import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/styles/shared/_variables.scss";
          @import "src/styles/shared/_global.scss";
        `,
      },
    },
  },
});
