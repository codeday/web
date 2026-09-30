import { expect, test } from "@playwright/test";

const PATH = "/en-us/";

test("the nav bar loads", async ({ page }) => {
  await page.goto(PATH);
  const header = page.locator("header");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link").first()).toBeVisible();
});
