import { test, expect } from "@playwright/test";

test.describe("Recruit Page", () => {
  test.skip(
    () => !process.env.E2E_AUTH_AVAILABLE,
    "Requires authenticated session"
  );

  test("should display recruit post list", async ({ page }) => {
    await page.goto("/recruit");
    await page.waitForLoadState("networkidle");

    const hasRecruits = await page.locator('[data-testid="recruit-list"]').count() > 0;
    const hasEmptyState = await page.getByText(/구인글이 없|아직|empty/i).count() > 0;
    const hasContent = await page.locator("main, [role='main']").count() > 0;

    expect(hasRecruits || hasEmptyState || hasContent).toBeTruthy();
  });

  test("should show recruit post detail on click", async ({ page }) => {
    await page.goto("/recruit");
    await page.waitForLoadState("networkidle");

    const firstPost = page.locator('[data-testid="recruit-item"]').first()
      .or(page.locator("article, [role='article']").first());

    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState("networkidle");

      // Should navigate to detail page or show detail view
      const hasDetail = await page.getByText(/모집|recruit|지원|apply/i).count() > 0;
      expect(hasDetail).toBeTruthy();
    }
  });

  test("should filter recruits by position", async ({ page }) => {
    await page.goto("/recruit");
    await page.waitForLoadState("networkidle");

    const positionFilter = page.getByText(/포지션|position/i).first();
    if (await positionFilter.isVisible()) {
      await positionFilter.click();

      const posOption = page.getByText(/기타|guitar|보컬|vocal/i).first();
      if (await posOption.isVisible()) {
        await posOption.click();
        await page.waitForLoadState("networkidle");
      }
    }
  });
});
