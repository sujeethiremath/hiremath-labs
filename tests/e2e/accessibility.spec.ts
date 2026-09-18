import { test, expect } from "@playwright/test";

test.describe("Accessibility & Semantic Structure Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have semantic landmark roles (main, nav)", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should have an accessible top-level h1 heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const h1Text = await h1.innerText();
    expect(h1Text.length).toBeGreaterThan(0);
  });

  test("should have alt text or aria-label on all images", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const ariaLabel = await img.getAttribute("aria-label");
      const role = await img.getAttribute("role");
      // Image must have an alt tag, aria-label, or role="presentation"
      const isAccessible = alt !== null || ariaLabel !== null || role === "presentation";
      expect(isAccessible).toBeTruthy();
    }
  });

  test("interactive buttons and links should be keyboard-focusable", async ({ page }) => {
    // Focus navigation element
    const firstLink = page.locator("nav a").first();
    await firstLink.focus();
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(["a", "button", "input"]).toContain(activeTagName);
  });
});
