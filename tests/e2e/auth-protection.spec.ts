import { test, expect } from "@playwright/test";

test.describe("Authentication Protection & Private Routes Suite", () => {
  const protectedRoutes = [
    { path: "/resume-creator", titleMatch: /Resume/i },
    { path: "/server-dashboard", titleMatch: /Stratus|Dashboard/i },
    { path: "/camera", titleMatch: /Camera/i },
    { path: "/terminal", titleMatch: /Terminal/i },
  ];

  for (const route of protectedRoutes) {
    test(`unauthenticated user accessing ${route.path} sees authentication gate`, async ({ page }) => {
      await page.goto(route.path);

      // Verify that the page prompts for authentication or shows access restricted
      // Target the main h2 heading or action button in the auth gate card
      const authHeading = page.getByRole("heading", { level: 2 });
      await expect(authHeading).toBeVisible({ timeout: 10000 });
      const headingText = await authHeading.innerText();
      expect(headingText).toMatch(/Administrator Authentication|Authentication Required|Access Restricted/i);
    });
  }

  test("unauthenticated terminal ticket API request returns 401 Unauthorized", async ({ request }) => {
    const response = await request.post("/api/stratus/terminal-ticket", {
      data: {},
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toContain("Unauthorized");
  });

  test("unauthenticated stratus status API request returns 401 Unauthorized", async ({ request }) => {
    const response = await request.get("/api/stratus/status");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toContain("Unauthorized");
  });

  test("unauthenticated stratus camera API request returns 401 Unauthorized", async ({ request }) => {
    const response = await request.get("/api/stratus/camera");
    expect(response.status()).toBe(401);
  });

  test("unauthenticated stratus audio API request returns 401 Unauthorized", async ({ request }) => {
    const response = await request.get("/api/stratus/audio");
    expect(response.status()).toBe(401);
  });
});
