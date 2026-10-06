import { expect, test } from "@playwright/test";

const PATH = "/en-us/talent";

test("the nav bar loads", async ({ page }) => {
  await page.goto(PATH);
  const header = page.locator("header");
  await expect(header).toBeVisible();
  await expect(header.getByRole("link").first()).toBeVisible();
});

test("has one h1 and every section anchor has a target", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.locator("h1")).toHaveCount(1);
  for (const id of ["top", "signal", "alumni", "how", "profile", "book"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});
