import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
  });

  test("should display login page with email and OAuth options", async ({
    page,
  }) => {
    // Email login form should be present
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /password/i }).or(page.locator('input[type="password"]'))).toBeVisible();

    // OAuth buttons should exist
    await expect(page.getByRole("button", { name: /kakao/i }).or(page.locator('[data-testid="kakao-login"]'))).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i }).or(page.locator('[data-testid="google-login"]'))).toBeVisible();
  });

  test("should show error message on invalid email login", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: /email/i }).fill("invalid@test.com");
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("wrongpassword");

    await page.getByRole("button", { name: /로그인|sign in|login/i }).click();

    // Should show error message
    await expect(
      page.getByText(/잘못된|유효하지|invalid|error/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.getByRole("link", { name: /회원가입|signup|sign up/i }).click();
    await expect(page).toHaveURL(/signup/);
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /로그인|sign in|login/i }).click();

    // Should show validation errors
    await expect(
      page.getByText(/필수|required|입력/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Protected Routes", () => {
  test("should redirect unauthenticated users to signin", async ({ page }) => {
    await page.goto("/jamsession");
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect from mypage to signin when not logged in", async ({
    page,
  }) => {
    await page.goto("/mypage");
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect from band to signin when not logged in", async ({
    page,
  }) => {
    await page.goto("/band");
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect from recruit to signin when not logged in", async ({
    page,
  }) => {
    await page.goto("/recruit");
    await expect(page).toHaveURL(/signin/);
  });

  test("should redirect from notification to signin when not logged in", async ({
    page,
  }) => {
    await page.goto("/notification");
    await expect(page).toHaveURL(/signin/);
  });
});
