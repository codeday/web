import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });

const seamlessRequests = [];
page.on("request", (req) => {
  if (req.url().includes("seamless.js")) seamlessRequests.push(req.url());
});
page.on("console", (msg) => {
  if (msg.text().startsWith("MOUNT_CALL")) console.log(msg.text());
});

await page.goto("http://localhost:3000/en-us/direct", { waitUntil: "networkidle" });
const acceptAll = page.getByRole("button", { name: "Accept All" });
if (await acceptAll.isVisible().catch(() => false)) await acceptAll.click();

await page.evaluate(() => {
  window.__mountCount = 0;
  const check = setInterval(() => {
    if (window.Cognito && window.Cognito.mount && !window.__hooked) {
      window.__hooked = true;
      const orig = window.Cognito.mount.bind(window.Cognito);
      window.Cognito.mount = (...args) => {
        window.__mountCount++;
        console.log("MOUNT_CALL formId=" + args[0] + " count=" + window.__mountCount);
        return orig(...args);
      };
      clearInterval(check);
    }
  }, 50);
});

await page.getByRole("button", { name: "Register and pay" }).click({ force: true });
await page.waitForTimeout(8000);

console.log("SEAMLESS.JS REQUEST COUNT:", seamlessRequests.length);
console.log("SEAMLESS.JS URLS:", JSON.stringify(seamlessRequests));
const scriptTagCount = await page.evaluate(
  () => document.querySelectorAll('script[src*="seamless.js"]').length,
);
console.log("SCRIPT TAG COUNT IN DOM:", scriptTagCount);
const finalCount = await page.evaluate(() => window.__mountCount);
console.log("FINAL MOUNT COUNT:", finalCount);

await browser.close();
