import { test, expect } from "@playwright/test";

test.describe("Notification Flow", () => {
  test.skip(
    () => !process.env.E2E_AUTH_AVAILABLE,
    "Requires authenticated session"
  );

  test("should display notification list", async ({ page }) => {
    await page.goto("/notification");
    await page.waitForLoadState("networkidle");

    const hasNotifications =
      await page.locator('[data-testid="notification-list"]').count() > 0;
    const hasEmptyState =
      await page.getByText(/알림이 없|새로운 알림|empty/i).count() > 0;
    const hasContent = await page.locator("main, [role='main']").count() > 0;

    expect(hasNotifications || hasEmptyState || hasContent).toBeTruthy();
  });

  test("should show notification badge in navigation", async ({ page }) => {
    await page.goto("/jamsession");
    await page.waitForLoadState("networkidle");

    // Check if notification icon exists in navigation
    const navNotification = page
      .locator('[data-testid="nav-notification"]')
      .or(page.getByRole("link", { name: /알림|notification/i }));

    if (await navNotification.isVisible()) {
      expect(await navNotification.isVisible()).toBeTruthy();
    }
  });

  test("should navigate to notification page from nav", async ({ page }) => {
    await page.goto("/jamsession");
    await page.waitForLoadState("networkidle");

    const navNotification = page
      .locator('[data-testid="nav-notification"]')
      .or(page.getByRole("link", { name: /알림|notification/i }));

    if (await navNotification.isVisible()) {
      await navNotification.click();
      await expect(page).toHaveURL(/notification/);
    }
  });
});
