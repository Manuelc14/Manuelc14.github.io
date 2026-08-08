// site/astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://manuelc14.github.io/",
  base: "/",
  outDir: "dist",
  integrations: [sitemap()],
});
