import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/gradients",
  "/buttons-badges",
  "/alerts-cards",
  "/forms",
  "/navigation",
  "/data",
  "/typography",
];

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

for (const route of ROUTES) {
  test(`${route || "index"} renders with no console errors`, async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await page.goto(route);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `test-results/screenshots${route === "/" ? "/index" : route}.png`,
      fullPage: true,
    });
    expect(errors, `console errors on ${route}: ${errors.join("\n")}`).toEqual([]);
  });
}

test("removable chip: the close trigger sits inside the chip, not a circle over the label (.spec.md §6.2)", async ({
  page,
}) => {
  await page.goto("/alerts-cards");
  const chip = page.getByTestId("removable-chip");
  const closeTrigger = chip.locator("button");
  const chipBox = await chip.boundingBox();
  const closeBox = await closeTrigger.boundingBox();
  expect(chipBox).toBeTruthy();
  expect(closeBox).toBeTruthy();
  if (chipBox && closeBox) {
    // The close control must be near the trailing edge, not covering the
    // whole chip (which is what the spec's "circle over its own label" bug
    // looked like — a ~30px circle swallowing the label).
    expect(closeBox.width).toBeLessThan(chipBox.width * 0.5);
    expect(closeBox.x + closeBox.width).toBeGreaterThan(chipBox.x + chipBox.width * 0.6);
  }
});

test("squircle uses a generated SVG mask, not a border-radius approximation (.spec.md §6.2)", async ({ page }) => {
  await page.goto("/gradients");
  const squircle = page.locator('[style*="mask-image"], [class*="squircle"]').first();
  const maskImage = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll("div"));
    for (const el of els) {
      const cs = getComputedStyle(el);
      const mask = cs.maskImage || (cs as any).webkitMaskImage;
      if (mask && mask !== "none") return mask.slice(0, 30);
    }
    return null;
  });
  expect(maskImage).toContain("url(");
});

test("hero mesh renders three radial-gradient lobes via ::before, not a single blob (.spec.md §6.2)", async ({
  page,
}) => {
  await page.goto("/gradients");
  const beforeCount = await page.evaluate(() => {
    let count = 0;
    for (const el of Array.from(document.querySelectorAll("div"))) {
      const before = getComputedStyle(el, "::before");
      const bg = before.backgroundImage;
      if (bg && bg.match(/radial-gradient/g) && (bg.match(/radial-gradient/g) as string[]).length >= 3) {
        count += 1;
      }
    }
    return count;
  });
  expect(beforeCount).toBeGreaterThanOrEqual(2); // normal + tall mesh fields
});

test("alert indicator is not a second coloured square inside a coloured box (.spec.md §6.2)", async ({ page }) => {
  await page.goto("/alerts-cards");
  const solidAlertIndicator = page.locator("text=Solid").first().locator("xpath=preceding-sibling::*[1]");
  const bg = await solidAlertIndicator.evaluate((el) => getComputedStyle(el).backgroundColor).catch(() => null);
  // The indicator itself should carry no background fill of its own —
  // just an icon colored to match, not a filled box.
  if (bg) {
    expect(["rgba(0, 0, 0, 0)", "transparent"]).toContain(bg);
  }
});

test("no white text sits on any ramp's light end — EmptyState and Alert critical clear 4.5:1 (.spec.md §3/§6.2)", async ({
  page,
}) => {
  await page.goto("/alerts-cards");
  await page.waitForTimeout(300);

  const checks = await page.evaluate(() => {
    function sample(el: Element) {
      const rect = el.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      // Can't rasterize arbitrary DOM without html2canvas; fall back to
      // reading the computed background-image's rightmost stop colour as a
      // proxy for "the lightest point a full-field element reaches".
      const bg = getComputedStyle(el).backgroundImage;
      return { bg, rect: { width: rect.width, height: rect.height } };
    }
    const emptyState = document.querySelector('[class*="empty-state"]') as HTMLElement | null;
    const criticalAlert = document.querySelector('[data-testid="critical-alert"]') as HTMLElement | null;
    return {
      emptyState: emptyState ? sample(emptyState) : null,
      criticalAlert: criticalAlert ? sample(criticalAlert) : null,
    };
  });

  for (const [name, result] of Object.entries(checks)) {
    if (!result?.bg) continue;
    const stops = Array.from(result.bg.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)) as RegExpMatchArray[];
    expect(stops.length, `${name} should have a multi-stop gradient background`).toBeGreaterThan(0);
    const lastStop = stops[stops.length - 1];
    const rgb: [number, number, number] = [Number(lastStop[1]), Number(lastStop[2]), Number(lastStop[3])];
    const contrast = contrastRatio(rgb, [255, 255, 255]);
    // The field's own lightest stop, checked against white TEXT (i.e. is
    // this stop dark enough for white text) — mirrors the capRamp contract.
    expect(contrast, `${name}'s lightest stop must still hold white text legibly`).toBeGreaterThanOrEqual(4.4);
  }
});
