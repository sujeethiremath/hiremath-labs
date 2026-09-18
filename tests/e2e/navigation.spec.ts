import { test, expect } from "@playwright/test";

test.describe("Navigation Suite", () => {
  test("desktop navigation links scroll to sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop test only");
    await page.goto("/");

    // Click Projects link
    const projectsLink = page.locator("nav").getByRole("link", { name: "Projects" }).first();
    await expect(projectsLink).toBeVisible();
    await projectsLink.click();

    // Check URL or section visibility
    await expect(page.locator("#projects")).toBeInViewport();

    // Click Contact link
    const contactLink = page.locator("nav").getByRole("link", { name: "Contact" }).first();
    await expect(contactLink).toBeVisible();
    await contactLink.click();

    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("mobile hamburger menu opens and displays links", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile test only");
    await page.goto("/");

    // Look for mobile toggle button
    const mobileToggle = page.getByRole("button", { name: /Open menu|Close menu/i });
    await expect(mobileToggle).toBeVisible();
    await mobileToggle.click();

    // Verify drawer navigation links appear
    const mobileSummaryLink = page.locator("nav").getByRole("link", { name: "Summary" });
    await expect(mobileSummaryLink).toBeVisible();

    const mobileProjectsLink = page.locator("nav").getByRole("link", { name: "Projects" });
    await expect(mobileProjectsLink).toBeVisible();

    const mobileContactLink = page.locator("nav").getByRole("link", { name: "Contact" });
    await expect(mobileContactLink).toBeVisible();
  });

  test("clicking brand logo returns to top/home", async ({ page }) => {
    await page.goto("/#contact");
    const logoLink = page.locator('nav a[href="/"]').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await page.waitForFunction(() => window.scrollY <= 200, null, { timeout: 5000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThanOrEqual(200);
  });
});
