import { expect, test } from "@playwright/test";

const LOCALE = "en-us";
const PATHS = ["/en-us/", "/en-us/research", "/en-us/events", "/en-us/volunteer", "/en-us/press"];
const PUBLIC_FILE = /\.[a-z0-9]+$/i;

for (const path of PATHS) {
  test(`internal links on ${path} include the locale prefix`, async ({ page }) => {
    await page.goto(path);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
    const unlocalized = hrefs.filter((href) => {
      if (!href.startsWith("/") || href.startsWith("//")) return false;
      const pathname = href.split(/[?#]/, 1)[0];
      if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) return false;
      if (PUBLIC_FILE.test(pathname)) return false;
      return pathname !== `/${LOCALE}` && !pathname.startsWith(`/${LOCALE}/`);
    });
    expect(unlocalized).toEqual([]);
  });
}
