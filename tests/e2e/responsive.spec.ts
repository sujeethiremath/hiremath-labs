import { test, expect } from "@playwright/test";

test.describe("Responsive Layout & Viewport Suite", () => {
  const viewports = [
    { name: "Desktop (1280x800)", width: 1280, height: 800 },
    { name: "Tablet (768x1024)", width: 768, height: 1024 },
    { name: "Mobile (375x667)", width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    test(`renders cleanly without horizontal scroll overflow on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Verify page body does not have horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBeFalsy();

      // Verify navigation is visible
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // Verify main content is visible
      const main = page.locator("main");
      await expect(main).toBeVisible();
    });
  }
});
