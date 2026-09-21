import { expect, test } from "@playwright/test";

const PATH = "/en-us/research";

test("hero, stats and index render", async ({ page }) => {
  await page.goto(PATH);
  // Matched by name, not just role+level — the third-party cookie-consent
  // banner sometimes mounts its own `<h1>` ("Cookie Settings") before this
  // assertion runs, which otherwise makes a bare `getByRole("heading",
  // { level: 1 })` ambiguous (there's no `<main>` landmark to scope to
  // instead — the page doesn't render one).
  await expect(page.getByRole("heading", { level: 1, name: /What works/ })).toBeVisible();
  await expect(page.locator("#index")).toBeVisible();
});

test("Peer-reviewed filter narrows the index and updates the URL", async ({ page }) => {
  await page.goto(PATH);
  await page.getByRole("button", { name: /Peer-reviewed/ }).click();
  await expect(page).toHaveURL(/type=paper/);
  const rows = page.locator("#index h3");
  await expect(rows.first()).toBeVisible();
});

test("combining an unrelated type + topic filter reaches the empty state", async ({ page }) => {
  await page.goto(PATH);
  await page.locator("select").selectOption("Community college");
  await page.getByRole("button", { name: /Reports/ }).click();
  await expect(
    page.getByText("Nothing matches. Clear the search or pick another type."),
  ).toBeVisible();
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

test("cite panel opens, shows ACM + BibTeX, and the copy pill flips to Copied", async ({
  page,
}) => {
  await page.goto(PATH);
  await page.getByRole("button", { name: "Cite", exact: true }).first().click();
  await expect(page.getByText("ACM reference")).toBeVisible();
  await expect(page.getByText("BibTeX", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Copy reference" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
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
