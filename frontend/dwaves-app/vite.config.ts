import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
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
        find: "shaders",
        replacement: path.resolve(__dirname, "./src/shaders"),
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
