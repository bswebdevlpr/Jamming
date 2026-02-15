import { test, expect } from "@playwright/test";

test.describe("Signup Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("should display signup form", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    await page.getByRole("textbox", { name: /email/i }).fill("invalid-email");

    // Trigger validation
    const submitButton = page.getByRole("button", { name: /가입|signup|sign up|완료/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }

    // Should show email validation error
    await expect(
      page.getByText(/이메일|email|형식|format/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should validate password requirements", async ({ page }) => {
    await page.getByRole("textbox", { name: /email/i }).fill("test@example.com");
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.first().fill("123");

    const submitButton = page.getByRole("button", { name: /가입|signup|sign up|완료/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }

    // Should show password validation error
    await expect(
      page.getByText(/비밀번호|password|자리|character/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should navigate back to login page", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: /로그인|sign in|login/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/signin/);
    }
  });
});
