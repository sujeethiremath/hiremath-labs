import { test, expect } from "@playwright/test";

test.describe("Portfolio Homepage Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
  });

  test("should render the correct page title and metadata", async ({ page }) => {
    await expect(page).toHaveTitle(/Sujeet Hiremath/i);
  });

  test("should render the main navigation and brand logo", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(page.locator("nav").getByText("Hiremath Labs")).toBeVisible();
  });

  test("should render all key content sections", async ({ page }) => {
    // Check main container
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check Summary / Hero Section
    const summarySection = page.locator("#summary");
    await expect(summarySection).toBeVisible();
    await expect(summarySection.getByRole("heading", { level: 1 })).toBeVisible();

    // Check Projects Section
    const projectsSection = page.locator("#projects");
    await expect(projectsSection).toBeVisible();

    // Check LeetCode Section
    const leetcodeSection = page.locator("#leetcode");
    await expect(leetcodeSection).toBeVisible();

    // Check GitHub Section
    const githubSection = page.locator("#github");
    await expect(githubSection).toBeVisible();

    // Check Contact Section
    const contactSection = page.locator("#contact");
    await expect(contactSection).toBeVisible();
  });

  test("should verify external profile links have proper security attributes", async ({ page }) => {
    // GitHub link
    const githubLink = page.locator('a[href*="github.com/sujeethiremath"]').first();
    if (await githubLink.count() > 0) {
      await expect(githubLink).toHaveAttribute("target", "_blank");
      await expect(githubLink).toHaveAttribute("rel", /noopener/);
    }

    // LinkedIn link
    const linkedinLink = page.locator('a[href*="linkedin.com/in/sujeethiremath"]').first();
    if (await linkedinLink.count() > 0) {
      await expect(linkedinLink).toHaveAttribute("target", "_blank");
      await expect(linkedinLink).toHaveAttribute("rel", /noopener/);
    }
  });
});
