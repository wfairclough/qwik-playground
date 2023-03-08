import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikReact } from "@builder.io/qwik-react/vite";

export default defineConfig(() => {
  return {
    build: {
      target: "es2020",
      lib: {
        entry: "./src/index.ts",
        formats: ["es", "cjs"],
        fileName: (format) => `index.qwik.${format === "es" ? "mjs" : "cjs"}`,
      },
    },
    plugins: [qwikVite(), qwikReact()],
  };
});
