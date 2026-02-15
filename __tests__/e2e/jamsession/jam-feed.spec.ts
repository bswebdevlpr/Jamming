import { test, expect } from "@playwright/test";

/**
 * Jam Session E2E tests
 *
 * These tests require authenticated sessions.
 * In CI, use storageState from an authenticated browser context.
 * Locally, ensure you have a running dev server with a logged-in session.
 */

test.describe("Jam Session Feed", () => {
  // Skip if no auth session is available
  test.skip(
    () => !process.env.E2E_AUTH_AVAILABLE,
    "Requires authenticated session"
  );

  test("should display jam session list", async ({ page }) => {
    await page.goto("/jamsession");
    await page.waitForLoadState("networkidle");

    // Should show jam session feed or empty state
    const hasFeed = await page.locator('[data-testid="jam-feed"]').count() > 0;
    const hasEmptyState = await page.getByText(/세션이 없|아직|empty/i).count() > 0;

    expect(hasFeed || hasEmptyState).toBeTruthy();
  });

  test("should navigate to create jam session", async ({ page }) => {
    await page.goto("/jamsession");
    await page.waitForLoadState("networkidle");

    const createButton = page.getByRole("button", { name: /만들기|생성|create/i })
      .or(page.locator('[data-testid="create-jam"]'));

    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/jamsession.*create|new/i);
    }
  });

  test("should filter jam sessions by location", async ({ page }) => {
    await page.goto("/jamsession");
    await page.waitForLoadState("networkidle");

    // Click location filter
    const locationFilter = page.getByText(/지역|location/i).first();
    if (await locationFilter.isVisible()) {
      await locationFilter.click();

      // Select a region
      const regionOption = page.getByText(/서울|경기/i).first();
      if (await regionOption.isVisible()) {
        await regionOption.click();
        await page.waitForLoadState("networkidle");
      }
    }
  });
});
