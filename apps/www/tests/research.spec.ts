import { expect, test } from "@playwright/test";

const PATH = "/en-us/research";

test("the nav bar loads", async ({ page }) => {
  await page.goto(PATH);
  const header = page.locator("header");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link").first()).toBeVisible();
});

test("filter bar stays pinned below the header while scrolling", async ({ page }) => {
  await page.goto(PATH);
  const bar = page.getByTestId("filter-bar");
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(150);
  await expect(bar).toBeVisible();
  const box = await bar.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeLessThan(150);
});

for (const width of [360, 390, 414, 768, 1024, 1280, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PATH);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  });
}

test("/publications redirects to /research", async ({ page }) => {
  await page.goto("/publications");
  await expect(page).toHaveURL(/\/research$/);
});
