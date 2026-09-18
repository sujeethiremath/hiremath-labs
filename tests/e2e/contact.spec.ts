import { test, expect } from "@playwright/test";

test.describe("Contact Form & Modals Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("opens contact modal when 'Get in Touch' is clicked", async ({ page }) => {
    const getInTouchBtn = page.getByRole("button", { name: /Get in Touch/i });
    await expect(getInTouchBtn).toBeVisible();
    await getInTouchBtn.click();

    // Verify modal appears
    const modalTitle = page.getByRole("heading", { name: "Get In Touch" });
    await expect(modalTitle).toBeVisible();

    // Verify form fields exist
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("submits contact form with mocked successful network response (no real email)", async ({ page }) => {
    // Intercept network call to /api/contact to prevent real email dispatch
    await page.route("**/api/contact", async (route) => {
      const json = { success: true };
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(json) });
    });

    const getInTouchBtn = page.getByRole("button", { name: /Get in Touch/i });
    await getInTouchBtn.click();

    // Fill form
    await page.fill('input[name="name"]', "Playwright Test Runner");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('textarea[name="message"]', "This is an automated synthetic test message from Playwright.");

    // Click submit
    const submitBtn = page.getByRole("button", { name: "Send Message" });
    await submitBtn.click();

    // Expect success modal
    const successModal = page.getByRole("heading", { name: "Message Sent!" });
    await expect(successModal).toBeVisible();

    // Dismiss modal
    const dismissBtn = page.getByRole("button", { name: "Awesome!" });
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();
    await expect(successModal).not.toBeVisible();
  });

  test("handles rate limited response properly", async ({ page }) => {
    // Intercept network call to simulate 429 rate limit
    await page.route("**/api/contact", async (route) => {
      const json = { error: "Please wait 24 hours before sending another message." };
      await route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify(json) });
    });

    const getInTouchBtn = page.getByRole("button", { name: /Get in Touch/i });
    await getInTouchBtn.click();

    await page.fill('input[name="name"]', "Frequent User");
    await page.fill('input[name="email"]', "frequent@example.com");
    await page.fill('textarea[name="message"]', "Second message in 24 hours.");

    const submitBtn = page.getByRole("button", { name: "Send Message" });
    await submitBtn.click();

    // Expect rate limited modal
    const rateLimitedModal = page.getByRole("heading", { name: "Already got your message!" });
    await expect(rateLimitedModal).toBeVisible();
  });

  test("opens resume options modal when 'View Resume' is clicked", async ({ page }) => {
    const viewResumeBtn = page.getByRole("button", { name: /View Resume/i });
    await expect(viewResumeBtn).toBeVisible();
    await viewResumeBtn.click();

    const resumeModalTitle = page.getByRole("heading", { name: "Resume Options" });
    await expect(resumeModalTitle).toBeVisible();

    // Verify download / view options exist
    const viewLink = page.getByRole("link", { name: /View Resume/i });
    await expect(viewLink).toBeVisible();
    const downloadLink = page.getByRole("link", { name: /Download Resume/i });
    await expect(downloadLink).toBeVisible();
  });
});
