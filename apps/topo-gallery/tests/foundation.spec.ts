import { expect, test } from "@playwright/test";

async function gotoStory(page: any, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(() => {
    const root = document.querySelector("#storybook-root");
    const loader = document.querySelector(".sb-preparing-story, .sb-loader");
    const loaderHidden = !loader || getComputedStyle(loader).display === "none";
    return !!root && root.children.length > 0 && loaderHidden;
  });
  await page.waitForTimeout(200);
}

async function noOverflow(page: any) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow, "horizontal overflow").toBe(false);
}

const SHOT_DIR = "test-results/screenshots/foundation";

test("Band tinted spacing", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await gotoStory(page, "molecule-section--inside-tinted-band");
  await page.screenshot({ path: `${SHOT_DIR}/section-band.png`, fullPage: true });
  await noOverflow(page);
});

test("PullQuote feature variant", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 700 });
  await gotoStory(page, "organism-pullquote--feature");
  await page.screenshot({ path: `${SHOT_DIR}/pullquote-feature.png`, fullPage: true });
  await noOverflow(page);
});
