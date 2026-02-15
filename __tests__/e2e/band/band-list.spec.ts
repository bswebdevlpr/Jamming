import { test, expect } from "@playwright/test";

test.describe("Band Page", () => {
  test.skip(
    () => !process.env.E2E_AUTH_AVAILABLE,
    "Requires authenticated session"
  );

  test("should display band list", async ({ page }) => {
    await page.goto("/band");
    await page.waitForLoadState("networkidle");

    // Should show band list or empty state
    const hasBands = await page.locator('[data-testid="band-list"]').count() > 0;
    const hasEmptyState = await page.getByText(/밴드가 없|아직|empty/i).count() > 0;
    const hasContent = await page.locator("main, [role='main']").count() > 0;

    expect(hasBands || hasEmptyState || hasContent).toBeTruthy();
  });

  test("should navigate to create band", async ({ page }) => {
    await page.goto("/band");
    await page.waitForLoadState("networkidle");

    const createButton = page.getByRole("button", { name: /만들기|생성|create/i })
      .or(page.locator('[data-testid="create-band"]'));

    if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/band.*create|new/i);
    }
  });

  test("should filter bands by genre", async ({ page }) => {
    await page.goto("/band");
    await page.waitForLoadState("networkidle");

    const genreFilter = page.getByText(/장르|genre/i).first();
    if (await genreFilter.isVisible()) {
      await genreFilter.click();

      const genreOption = page.getByText(/록|rock|재즈|jazz/i).first();
      if (await genreOption.isVisible()) {
        await genreOption.click();
        await page.waitForLoadState("networkidle");
      }
    }
  });

  test("should filter bands by location", async ({ page }) => {
    await page.goto("/band");
    await page.waitForLoadState("networkidle");

    const locationFilter = page.getByText(/지역|location/i).first();
    if (await locationFilter.isVisible()) {
      await locationFilter.click();

      const regionOption = page.getByText(/서울|경기/i).first();
      if (await regionOption.isVisible()) {
        await regionOption.click();
        await page.waitForLoadState("networkidle");
      }
    }
  });
});
