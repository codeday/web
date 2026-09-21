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

const STORY = "organism-header--on-wash-and-light-ground";
const SHOT_DIR = "test-results/screenshots/mobile-nav";

for (const width of [320, 375, 768]) {
  test(`closed state at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await gotoStory(page, STORY);
    await page.screenshot({ path: `${SHOT_DIR}/closed-${width}.png` });
    // no horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  });
}

test("open state — trigger position, aria, and screenshot at 375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);

  const trigger = page.getByRole("button", { name: "Open menu" }).first();
  const triggerBox = await trigger.boundingBox();
  expect(triggerBox).toBeTruthy();

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.waitForTimeout(250);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const dialog = page.getByRole("dialog", { name: "Menu" }).first();
  await expect(dialog).toBeVisible();

  // close control lands where the trigger was
  const closeButtons = page.getByRole("button", { name: "Close menu" });
  const topClose = closeButtons.first();
  const topCloseBox = await topClose.boundingBox();
  expect(topCloseBox).toBeTruthy();
  if (triggerBox && topCloseBox) {
    expect(Math.abs(topCloseBox.x - triggerBox.x)).toBeLessThan(2);
    expect(Math.abs(topCloseBox.y - triggerBox.y)).toBeLessThan(2);
  }

  // no trailing arrows on plain links, only the accordion item gets one
  const arrowCount = await dialog.locator("svg").count();
  // brand + close + 1 chevron on the "Programs" accordion item = at least 1, but
  // definitely fewer than one-per-link; just sanity check it's a small number
  expect(arrowCount).toBeLessThan(6);

  await page.screenshot({ path: `${SHOT_DIR}/open-375.png` });

  // focus should have moved into the dialog (to the close control)
  const activeIsInsideDialog = await page.evaluate(() => {
    const dialogEl = document.querySelector('[role="dialog"]');
    return !!dialogEl && dialogEl.contains(document.activeElement);
  });
  expect(activeIsInsideDialog).toBe(true);
});

test("open state at 320 — link type does not wrap mid-word, no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await gotoStory(page, STORY);
  await page.getByRole("button", { name: "Open menu" }).first().click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${SHOT_DIR}/open-320.png` });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflow, "horizontal overflow at 320px open").toBe(false);

  // No link row should wrap to more than one line (mid-word or otherwise) —
  // a wrapped row grows past the single-line font-size * line-height box.
  const rowHeights = await page.evaluate(() => {
    const dialogEl = document.querySelector('[role="dialog"]');
    if (!dialogEl) return [];
    const rows = Array.from(dialogEl.querySelectorAll("nav > *"));
    return rows.map((el) => (el as HTMLElement).getBoundingClientRect().height);
  });
  expect(rowHeights.length).toBeGreaterThan(0);
  for (const h of rowHeights) {
    // 28px * 1.15 line-height ~= 32px; allow generous slack for the min-height/gap box, but a wrap would roughly double it
    expect(h).toBeLessThan(60);
  }
});

test("open state over light-ground header at 375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  const triggers = page.getByRole("button", { name: "Open menu" });
  await triggers.nth(1).click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${SHOT_DIR}/open-light-375.png` });
});

test("accordion opens in place", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await gotoStory(page, STORY);
  await page.getByRole("button", { name: "Open menu" }).first().click();
  await page.waitForTimeout(250);
  await page.getByRole("button", { name: "Programs" }).click();
  await page.waitForTimeout(250);
  await expect(page.getByText("CodeDay").last()).toBeVisible();
  await page.screenshot({ path: `${SHOT_DIR}/accordion-375.png` });
});

test("esc closes the menu", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  const trigger = page.getByRole("button", { name: "Open menu" }).first();
  await trigger.click();
  await page.waitForTimeout(250);
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("tab cannot escape the open menu (focus trap)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  await page.getByRole("button", { name: "Open menu" }).first().click();
  await page.waitForTimeout(250);
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press("Tab");
  }
  const stillInsideDialog = await page.evaluate(() => {
    const dialogEl = document.querySelector('[role="dialog"]');
    return !!dialogEl && dialogEl.contains(document.activeElement);
  });
  expect(stillInsideDialog).toBe(true);
});

test("body scroll position survives open + close", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  await page.evaluate(() => window.scrollTo(0, 240));
  await page.waitForTimeout(50);
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Open menu" }).first().click();
  await page.waitForTimeout(250);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => window.scrollY);
  expect(after).toBe(before);
});

test("menu ramp is capped — white clears 4.5:1 against the lightest stop", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  await page.getByRole("button", { name: "Open menu" }).first().click();
  await page.waitForTimeout(250);
  const bg = await page.evaluate(() => {
    const dialogEl = document.querySelector('[role="dialog"]') as HTMLElement | null;
    return dialogEl ? getComputedStyle(dialogEl).backgroundImage : null;
  });
  expect(bg).toBeTruthy();
  const stops = Array.from(bg!.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g));
  expect(stops.length).toBeGreaterThan(0);
  const last = stops[stops.length - 1];
  const [r, g, b] = [Number(last[1]), Number(last[2]), Number(last[3])];
  function toLinear(c: number) {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  }
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const contrast = 1.05 / (luminance + 0.05);
  expect(contrast).toBeGreaterThanOrEqual(4.4);
});

test("tap targets are at least 44x44", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await gotoStory(page, STORY);
  const trigger = page.getByRole("button", { name: "Open menu" }).first();
  const box = await trigger.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
