import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("should display landing page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Landing page should be accessible without auth
    expect(page.url()).not.toContain("/signin");

    // Should have main content
    const hasContent = await page.locator("main, [role='main'], body").count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test("should display privacy policy page", async ({ page }) => {
    await page.goto("/privacy-policy");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("privacy-policy");
    const hasContent = await page.getByText(/개인정보|privacy/i).count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test("should display terms of service page", async ({ page }) => {
    await page.goto("/terms-of-service");
    await page.waitForLoadState("networkidle");

    expect(page.url()).toContain("terms-of-service");
    const hasContent = await page.getByText(/이용약관|terms/i).count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test("should display about page", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    // About page should be accessible
    const hasContent = await page.locator("main, [role='main'], body").count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test("should have mobile-friendly viewport", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check viewport meta tag exists
    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("width");
  });
});
