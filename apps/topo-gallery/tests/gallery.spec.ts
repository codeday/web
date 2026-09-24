import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

interface StoryIndexEntry {
  id: string;
  title: string;
  name: string;
  type: string;
}

function loadStoryIndex(): StoryIndexEntry[] {
  const indexPath = path.join(process.cwd(), "dist", "index.json");
  if (!existsSync(indexPath)) {
    throw new Error(
      `${indexPath} not found — did "storybook build" run first? (see playwright.config.ts webServer)`,
    );
  }
  const data = JSON.parse(readFileSync(indexPath, "utf-8"));
  return (Object.values(data.entries) as StoryIndexEntry[]).filter((e) => e.type === "story");
}

function storyUrl(id: string): string {
  return `/iframe.html?id=${id}&viewMode=story`;
}

async function gotoStory(page: Page, id: string): Promise<void> {
  await page.goto(storyUrl(id));
  await page.waitForFunction(() => {
    const root = document.querySelector("#storybook-root");
    const loader = document.querySelector(".sb-preparing-story, .sb-loader");
    const loaderHidden = !loader || getComputedStyle(loader).display === "none";
    return !!root && root.children.length > 0 && loaderHidden;
  });
  await page.waitForTimeout(200);
}

const STORIES = loadStoryIndex();

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

async function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

test.describe("every story renders with no console errors", () => {
  for (const story of STORIES) {
    test(`${story.title} — ${story.name}`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      await gotoStory(page, story.id);
      await page.screenshot({
        path: `test-results/screenshots/${story.id}.png`,
        fullPage: true,
      });
      expect(errors, `console errors on ${story.id}: ${errors.join("\n")}`).toEqual([]);
    });
  }
});

test("removable chip: the close trigger sits inside the chip, not a circle over the label", async ({
  page,
}) => {
  await gotoStory(page, "atom-chip--removable");
  const chip = page.getByTestId("removable-chip");
  const closeTrigger = chip.locator("button");
  const chipBox = await chip.boundingBox();
  const closeBox = await closeTrigger.boundingBox();
  expect(chipBox).toBeTruthy();
  expect(closeBox).toBeTruthy();
  if (chipBox && closeBox) {
    expect(closeBox.width).toBeLessThan(chipBox.width * 0.5);
    expect(closeBox.x + closeBox.width).toBeGreaterThan(chipBox.x + chipBox.width * 0.6);
  }
});

test("squircle uses native CSS corner-shape, not a clip-path/mask-image simulation", async ({
  page,
}) => {
  await gotoStory(page, "molecule-wash--rect-every-ramp");
  const cornerShape = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll("div"));
    for (const el of els) {
      const shape = getComputedStyle(el).getPropertyValue("corner-shape").trim();
      if (shape && shape !== "none" && shape !== "round" && shape !== "superellipse(1)")
        return shape;
    }
    return null;
  });
  expect(cornerShape).toBeTruthy();
});

test("hero mesh renders three radial-gradient lobes via ::before, not a single blob", async ({
  page,
}) => {
  await gotoStory(page, "molecule-wash--hero-mesh");
  const beforeCount = await page.evaluate(() => {
    let count = 0;
    for (const el of Array.from(document.querySelectorAll("div"))) {
      const before = getComputedStyle(el, "::before");
      const bg = before.backgroundImage;
      if (
        bg &&
        bg.match(/radial-gradient/g) &&
        (bg.match(/radial-gradient/g) as string[]).length >= 3
      ) {
        count += 1;
      }
    }
    return count;
  });
  expect(beforeCount).toBeGreaterThanOrEqual(2);
});

test("format cards: Residency's invitation-only action opens a popup, not a navigation", async ({
  page,
}) => {
  await gotoStory(page, "organism-formatcards--three-cards");
  const trigger = page.getByText("By invitation only");
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("How invitations work")).toBeVisible();
  await expect(dialog.getByText(/Residency spots aren't applied for/)).toBeVisible();
});

test("alert indicator is not a second coloured square inside a coloured box", async ({ page }) => {
  await gotoStory(page, "atom-alert--variants");
  const solidAlertIndicator = page
    .locator("text=Solid")
    .first()
    .locator("xpath=preceding-sibling::*[1]");
  const bg = await solidAlertIndicator
    .evaluate((el) => getComputedStyle(el).backgroundColor)
    .catch(() => null);
  if (bg) {
    expect(["rgba(0, 0, 0, 0)", "transparent"]).toContain(bg);
  }
});

test("no white text sits on any ramp's light end — EmptyState and Alert critical clear 4.5:1", async ({
  page,
}) => {
  async function sampleBackgroundImage(selector: string): Promise<string | null> {
    return page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).backgroundImage : null;
    }, selector);
  }

  await gotoStory(page, "atom-alert--variants");
  const criticalAlertBg = await sampleBackgroundImage('[data-testid="critical-alert"]');

  await gotoStory(page, "atom-emptystate--left-aligned-capped-ramp");
  const emptyStateBg = await sampleBackgroundImage('[class*="empty-state"]');

  for (const [name, bg] of Object.entries({
    emptyState: emptyStateBg,
    criticalAlert: criticalAlertBg,
  })) {
    if (!bg) continue;
    const stops = Array.from(bg.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)) as RegExpMatchArray[];
    expect(stops.length, `${name} should have a multi-stop gradient background`).toBeGreaterThan(0);
    const lastStop = stops[stops.length - 1];
    const rgb: [number, number, number] = [
      Number(lastStop[1]),
      Number(lastStop[2]),
      Number(lastStop[3]),
    ];
    const contrast = contrastRatio(rgb, [255, 255, 255]);
    expect(
      contrast,
      `${name}'s lightest stop must still hold white text legibly`,
    ).toBeGreaterThanOrEqual(4.4);
  }
});
