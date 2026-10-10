import { expect, test } from "@playwright/test";

const PATH = "/en-us/blog";

test("the nav bar loads", async ({ page }) => {
  await page.goto(PATH);
  const header = page.locator("header");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link").first()).toBeVisible();
});

test("has exactly one h1", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("main").locator("h1")).toHaveCount(1);
});

test("category filters are toggle buttons synced to the URL", async ({ page }) => {
  await page.goto(PATH);
  const filters = page.getByRole("group").filter({ has: page.locator("button[aria-pressed]") });
  const buttons = filters.locator("button[aria-pressed]");
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");

  const second = buttons.nth(1);
  await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "false");
  await expect(page).toHaveURL(/[?&]category=[a-z-]+/);

  await buttons.first().click();
  await expect(page).not.toHaveURL(/category=/);
});

test("category deep link selects the matching filter", async ({ page }) => {
  await page.goto(`${PATH}?category=micro-internships`);
  const pressed = page.locator("button[aria-pressed=true]");
  await expect(pressed).toHaveCount(1);
  await expect(page.locator("button[aria-pressed]").first()).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("load older posts fetches the next page from the API", async ({ page }) => {
  await page.goto(PATH);
  const loadMore = page.getByRole("button", { name: /older/i });
  test.skip((await loadMore.count()) === 0, "fewer than one page of posts");

  const cards = page.getByRole("main").locator("ul li a[href*='/blog/']");
  const before = await cards.count();
  const response = page.waitForResponse(
    (r) =>
      r.url().includes("/api/blog/posts") &&
      new URL(r.url()).searchParams.get("skip") === String(before),
  );
  await loadMore.click();
  expect((await response).ok()).toBe(true);
  await expect.poll(() => cards.count()).toBeGreaterThan(before);
});

test("search input has an accessible name", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("searchbox")).toHaveAccessibleName(/.+/);
});

test("newsletter email input has a visible label", async ({ page }) => {
  await page.goto(PATH);
  const input = page.locator("form input[type=email]");
  test.skip((await input.count()) === 0, "newsletter signup is hidden");
  await expect(input).toBeVisible();
  const id = await input.getAttribute("id");
  await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PATH);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  });
}

test("a post page has one h1, a breadcrumb back to the blog, and share buttons", async ({
  page,
}) => {
  await page.goto(PATH);
  const postLink = page.locator('a[href*="/blog/"]').first();
  test.skip((await postLink.count()) === 0, "no published posts");

  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/[^/?]+$/);
  await expect(page.getByRole("main").locator("h1")).toHaveCount(1);
  const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
  await expect(breadcrumb.getByRole("link").first()).toHaveAttribute("href", /\/blog$/);
  await expect(page.locator("button[aria-label]").first()).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAccessibleName(/.+/);

  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
});
