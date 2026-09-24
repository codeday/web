import { expect, test } from "@playwright/test";

const PATH = "/en-us/";

const SECTION_MARKERS = [
  "A first CodeDay at",
  "2013",
  "Students have done at least one CodeDay since 2009",
  "The only thing that moves you along is what you finished.",
  "Why this matters more than it did five years ago",
  "Students ship into software other people depend on.",
  "CodeDay has run every year since 2009",
  "Colleges",
  "FUNDERS",
];

test("all sections with content render, in order", async ({ page }) => {
  await page.goto(PATH);
  const text = await page.locator("main, body").first().innerText();
  let cursor = -1;
  for (const marker of SECTION_MARKERS) {
    const index = text.indexOf(marker, cursor + 1);
    expect(index, `"${marker}" not found after position ${cursor}`).toBeGreaterThan(cursor);
    cursor = index;
  }
});

test("renders correctly in dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(PATH);
  await expect(page.getByText("A first CodeDay at")).toBeVisible();
  await expect(page.getByText("Funders")).toBeVisible();
});

test("renders correctly in light mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(PATH);
  await expect(page.getByText("A first CodeDay at")).toBeVisible();
  await expect(page.getByText("Funders")).toBeVisible();
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

test("hero action is fully visible at 390x844 without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PATH);
  const action = page.getByRole("link", { name: "See where they started" });
  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
});

test("exactly one h1, and it is the hero heading", async ({ page }) => {
  await page.goto(PATH);
  const h1s = page.locator("h1");
  await expect(h1s).toHaveCount(1);
  await expect(h1s.first()).toContainText("A first CodeDay at");
});

test("renders correctly with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://localhost:4400${PATH}`);
  for (const marker of SECTION_MARKERS) {
    await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();
  }
  await expect(page.getByRole("link", { name: "See where they started" })).toBeVisible();
  await context.close();
});

test("every CreditLists logo has its organisation name as alt", async ({ page }) => {
  await page.goto(PATH);
  const names = [
    "National Science Foundation (Award No. 2347311)",
    "LexisNexis Risk Solutions",
    "Career Connect Washington",
    "Wilson Sonsini",
    "Fastly",
    "Contentful",
    "Auth0",
    "Kinesis Gaming",
  ];
  for (const name of names) {
    await expect(page.locator(`img[alt="${name}"]`)).toHaveCount(1);
  }
});

test("meta description no longer uses the old CMS mission sentence", async ({ page }) => {
  await page.goto(PATH);
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toBeTruthy();
  expect(description).not.toContain(
    "Helping students use technology and creativity to work on meaningful problems and create a more innovative future.",
  );
  const og = await page.locator('meta[property="og:description"]').getAttribute("content");
  expect(og).not.toContain(
    "Helping students use technology and creativity to work on meaningful problems and create a more innovative future.",
  );
});

test("the margin index is gone — 'For partners' appears exactly once, not per-section", async ({
  page,
}) => {
  await page.goto(PATH);
  const count = await page.getByText("For partners", { exact: true }).count();
  expect(count).toBe(1);
  for (const removed of ["The arc", "Formats", "The field", "Since 2009", "Merged"]) {
    await expect(page.getByText(removed, { exact: true })).toHaveCount(0);
  }
});

test("StatTrio renders — figures pending, but the section is on the page", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByText("Students have done at least one CodeDay since 2009")).toBeVisible();
  await expect(page.getByText("[N]", { exact: true }).first()).toBeVisible();
});

test("StatTrio (the stats block) sits directly under the alumni photos, and FormatCards/'why this matters' follow", async ({
  page,
}) => {
  await page.goto(PATH);
  const text = await page.locator("main, body").first().innerText();
  const studentExamplesIndex = text.indexOf("2013");
  const statsIndex = text.indexOf("Students have done at least one CodeDay since 2009");
  const formatsIndex = text.indexOf("The only thing that moves you along is what you finished.");
  const whyMattersIndex = text.indexOf("Why this matters more than it did five years ago");
  expect(studentExamplesIndex).toBeGreaterThan(-1);
  expect(statsIndex).toBeGreaterThan(studentExamplesIndex);
  expect(formatsIndex).toBeGreaterThan(statsIndex);
  expect(whyMattersIndex).toBeGreaterThan(formatsIndex);
});

test("the gap between the alumni photos section and the StatTrio section is tighter than a normal section gap", async ({
  page,
}) => {
  await page.goto(PATH);
  const gap = await page.evaluate(() => {
    const wallSection = document.querySelector("#then-now") as HTMLElement;
    const statsSection = wallSection?.nextElementSibling as HTMLElement;
    if (!wallSection || !statsSection) return null;
    return statsSection.getBoundingClientRect().top - wallSection.getBoundingClientRect().bottom;
  });
  expect(gap).toBe(0);
  const combinedPadding = await page.evaluate(() => {
    const wallSection = document.querySelector("#then-now") as HTMLElement;
    const statsSection = wallSection?.nextElementSibling as HTMLElement;
    return (
      Number.parseFloat(getComputedStyle(wallSection).paddingBottom) +
      Number.parseFloat(getComputedStyle(statsSection).paddingTop)
    );
  });
  expect(combinedPadding).toBeLessThan(100);
});

test("'Who pays for this' title and its explainer paragraph are gone from CreditLists", async ({
  page,
}) => {
  await page.goto(PATH);
  await expect(page.getByText("Who pays for this", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText("a college or a sponsor covers the seat", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByText("Funders")).toBeVisible();
});

test("FormatCards and ImpactTicker section headings match StatementBlock's h2 level, not h3", async ({
  page,
}) => {
  await page.goto(PATH);
  const formatsHeading = page.getByRole("heading", {
    level: 2,
    name: "The only thing that moves you along is what you finished.",
  });
  await expect(formatsHeading).toBeVisible();
  const impactHeading = page.getByRole("heading", {
    level: 2,
    name: "Students ship into software other people depend on.",
  });
  await expect(impactHeading).toBeVisible();
});

test("PortraitWall shows exactly 4 visible images, each with a non-empty alt", async ({ page }) => {
  await page.goto(PATH);
  const images = page.locator("#then-now img:visible");
  await expect(images).toHaveCount(4);
  const count = await images.count();
  for (let i = 0; i < count; i += 1) {
    const alt = await images.nth(i).getAttribute("alt");
    expect(alt, `image ${i} has an empty alt`).toBeTruthy();
  }
});

test("PortraitWall is a 2x2 grid on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(PATH);
  const columnCount = await page.evaluate(() => {
    const img = document.querySelector("#then-now img");
    let node: HTMLElement | null = img?.parentElement ?? null;
    while (node && getComputedStyle(node).display !== "grid") node = node.parentElement;
    return node ? getComputedStyle(node).gridTemplateColumns.split(" ").length : null;
  });
  expect(columnCount).toBe(2);
});

test("PortraitWall is capped at container.lg (1024px) on very wide viewports", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto(PATH);
  const maxWidth = await page.evaluate(() => {
    const img = document.querySelector("#then-now img");
    let node: HTMLElement | null = img?.parentElement ?? null;
    while (node && getComputedStyle(node).display !== "grid") node = node.parentElement;
    return node ? getComputedStyle(node).maxWidth : null;
  });
  expect(maxWidth).toBe("1024px");
});

test("StatTrio is capped at container.lg (1024px) on very wide viewports", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto(PATH);
  const statsLabel = page.getByText("Students have done at least one CodeDay since 2009");
  const hasContainerLg = await statsLabel.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      if (getComputedStyle(node).maxWidth === "1024px") return true;
      node = node.parentElement;
    }
    return false;
  });
  expect(hasContainerLg).toBe(true);
});

test("'Why this matters' is capped at container.lg (1024px) on very wide viewports", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto(PATH);
  const heading = page.getByRole("heading", {
    level: 2,
    name: "Why this matters more than it did five years ago",
  });
  const hasContainerLg = await heading.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      if (getComputedStyle(node).maxWidth === "1024px") return true;
      node = node.parentElement;
    }
    return false;
  });
  expect(hasContainerLg).toBe(true);
});

test("'Why this matters' keeps the tinted band's background even though it moved out of it", async ({
  page,
}) => {
  await page.goto(PATH);
  const heading = page.getByRole("heading", {
    level: 2,
    name: "Why this matters more than it did five years ago",
  });
  const backgroundColor = await heading.evaluate((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
      node = node.parentElement;
    }
    return null;
  });
  expect(backgroundColor).toBeTruthy();
});

test("FormatCards renders three cards, and the middle one contains both route labels", async ({
  page,
}) => {
  await page.goto(PATH);
  await expect(page.getByText("CodeDay Weekend")).toBeVisible();
  await expect(page.getByText("CodeDay Micro-Internship")).toBeVisible();
  await expect(page.getByText("CodeDay Residency")).toBeVisible();
  await expect(page.getByText("On your own time")).toBeVisible();
  await expect(page.getByText("For credit")).toBeVisible();
});

test("with reduced motion, no element inside the ImpactTicker has a running animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(PATH);
  const runningAnimations = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll("h2")).find((h) =>
      h.textContent?.includes("Students ship into software other people depend on."),
    );
    const section = heading?.closest("section");
    if (!section) return -1;
    return Array.from(section.querySelectorAll("*")).filter((el) => {
      const animationName = getComputedStyle(el).animationName;
      return animationName && animationName !== "none";
    }).length;
  });
  expect(runningAnimations).toBe(0);
});

test("the ticker's duplicate track is aria-hidden, and each impact line appears exactly once in the accessible text", async ({
  page,
}) => {
  await page.goto(PATH);
  const result = await page.evaluate(() => {
    const target = "Runs in [N] million homes";
    function isAriaHidden(el: Element | null): boolean {
      let node: Element | null = el;
      while (node) {
        if (node.getAttribute("aria-hidden") === "true") return true;
        node = node.parentElement;
      }
      return false;
    }
    const matches = Array.from(document.querySelectorAll("*")).filter(
      (el) => el.children.length === 0 && el.textContent?.trim() === target,
    );
    return { total: matches.length, accessible: matches.filter((el) => !isAriaHidden(el)).length };
  });
  expect(result.total).toBeGreaterThanOrEqual(2);
  expect(result.accessible).toBe(1);
});

for (const width of [360, 390, 414, 768, 1024, 1280, 1440]) {
  test(`HistoryRail shows the same number of marked event ticks at ${width}px as at 1440px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PATH);
    const visibleCount = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('i[data-event="true"]')).filter(
          (el) => getComputedStyle(el).display !== "none",
        ).length,
    );
    expect(visibleCount).toBeGreaterThan(0);

    await page.setViewportSize({ width: 1440, height: 900 });
    const referenceCount = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('i[data-event="true"]')).filter(
          (el) => getComputedStyle(el).display !== "none",
        ).length,
    );
    expect(visibleCount).toBe(referenceCount);
  });
}

test("HistoryRail's arrows are disabled at the first and last window and enabled in between", async ({
  page,
}) => {
  await page.goto(PATH);
  const prev = page.getByRole("button", { name: "Show earlier events" });
  const next = page.getByRole("button", { name: "Show later events" });
  await expect(prev).toBeDisabled();
  const eventCount = await page.locator('i[data-event="true"]').count();
  for (let i = 0; i < eventCount; i += 1) {
    if (await next.isDisabled()) break;
    await next.click();
  }
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();
});

test("HistoryRail's tick row is aria-hidden, and the visible event title appears exactly once in the accessible text", async ({
  page,
}) => {
  await page.goto(PATH);
  const result = await page.evaluate(() => {
    function isAriaHidden(el: Element | null): boolean {
      let node: Element | null = el;
      while (node) {
        if (node.getAttribute("aria-hidden") === "true") return true;
        node = node.parentElement;
      }
      return false;
    }
    const tickRow = document.querySelector('i[data-event="true"]')?.parentElement;
    const tickRowHidden = tickRow ? tickRow.getAttribute("aria-hidden") === "true" : false;
    const windowedWrapper = Array.from(
      document.querySelectorAll<HTMLElement>('[aria-live="polite"] > div'),
    ).find((el) => getComputedStyle(el).opacity === "1");
    const target = (windowedWrapper?.lastElementChild as HTMLElement | null)?.textContent?.trim();
    const matches = target
      ? Array.from(document.querySelectorAll("*")).filter(
          (el) => el.children.length === 0 && el.textContent?.trim() === target,
        )
      : [];
    return {
      tickRowHidden,
      hasTarget: !!target,
      accessible: matches.filter((el) => !isAriaHidden(el)).length,
    };
  });
  expect(result.tickRowHidden).toBe(true);
  expect(result.hasTarget).toBe(true);
  expect(result.accessible).toBe(1);
});

test("the header uses its colourful onWash gradient, not a plain bar", async ({ page }) => {
  await page.goto(PATH);
  const backgroundImage = await page
    .locator("header")
    .evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(backgroundImage).not.toBe("none");
  expect(backgroundImage).toContain("gradient");
});

test("the header itself is capped at container.lg and centred on very wide viewports", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 500 });
  await page.goto(PATH);
  const header = page.locator("header");
  const headerBox = await header.boundingBox();
  expect(headerBox!.width).toBeLessThan(1100);
  expect(headerBox!.x).toBeGreaterThan(400);
});

test("the Donate button visually overlays the real FundraiseUp trigger, not a naive click-forward", async ({
  page,
}) => {
  await page.goto(PATH);
  await page.waitForTimeout(1000);
  const donateButton = page.getByRole("button", { name: "Donate" }).first();
  await expect(donateButton).toBeVisible();
  const pointerEvents = await donateButton.evaluate((el) => getComputedStyle(el).pointerEvents);
  expect(pointerEvents).toBe("none");
});
