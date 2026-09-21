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

const SHOT_DIR = "test-results/screenshots/homepage-components";

const STORIES: { id: string; name: string; widths: number[] }[] = [
  { id: "organism-statementblock--hero", name: "statement-hero", widths: [390, 1280] },
  { id: "organism-statementblock--section", name: "statement-section", widths: [1280] },
  { id: "organism-statementblock--closing", name: "statement-closing", widths: [1280] },
  { id: "organism-portraitwall--four-people", name: "portraitwall", widths: [390, 900, 1400] },
  { id: "organism-formatcards--three-cards", name: "formatcards", widths: [390, 1280] },
  { id: "organism-impactticker--two-rows", name: "impactticker", widths: [1280] },
  { id: "organism-rowlist--ways-in", name: "rowlist-waysin", widths: [1280] },
  { id: "organism-historyrail--desktop", name: "historyrail-desktop", widths: [1280] },
  { id: "organism-historyrail--mobile", name: "historyrail-mobile", widths: [390] },
  { id: "organism-stattrio--three-cells", name: "stattrio", widths: [360, 1280] },
  { id: "organism-stattrio--null-cell-omitted-and-widens", name: "stattrio-null", widths: [1280] },
  { id: "organism-creditlists--default", name: "creditlists", widths: [1280] },
];

for (const story of STORIES) {
  for (const width of story.widths) {
    test(`${story.name} @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await gotoStory(page, story.id);
      await page.screenshot({ path: `${SHOT_DIR}/${story.name}-${width}.png`, fullPage: true });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow, `horizontal overflow at ${width}px for ${story.id}`).toBe(false);
    });
  }
}
