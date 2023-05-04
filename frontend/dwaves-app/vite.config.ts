import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
  },
  resolve: {
    alias: [
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "images",
        replacement: path.resolve(__dirname, "./src/images"),
      },
      {
        find: "songs",
        replacement: path.resolve(__dirname, "./src/songs"),
      },
      {
        find: "styles",
        replacement: path.resolve(__dirname, "./src/styles"),
      },
      {
        find: "views",
        replacement: path.resolve(__dirname, "./src/views"),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/styles/global/_variables.scss";
          @import "src/styles/global/_global.scss";
        `,
      },
    },
  },
});
