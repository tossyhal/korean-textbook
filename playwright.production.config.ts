import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig(config, {
  testMatch: "curriculum.spec.ts",
  use: { ...config.use, baseURL: "http://127.0.0.1:4174/korean-textbook/" },
  webServer: {
    command: "pnpm run preview --host 127.0.0.1 --port 4174 --strictPort",
    url: "http://127.0.0.1:4174/korean-textbook/",
    reuseExistingServer: false,
  },
});
