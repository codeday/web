import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    screenshot: "only-on-failure",
  },
  webServer: {
    // Builds the static Storybook, then serves it — same as the old
    // Next.js gallery's `next build && next start`, just a Storybook build
    // instead. Slower than a dev server but matches what CI/a real
    // deploy would serve.
    command: "pnpm start",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
