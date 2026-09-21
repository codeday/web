import { defineConfig } from "@playwright/test";

// Runs against a production `next build` + `next start` — the homepage's
// acceptance criteria (exactly one h1, no horizontal overflow across real
// breakpoints, JS-disabled rendering) need the actual rendered/SSG'd page,
// not a dev-mode approximation. Start the server yourself before running
// (`npx next build && npx next start -p 4400`) — building here isn't
// wired into `webServer` since a full CMS-backed SSG build takes minutes.
export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:4400" },
});
