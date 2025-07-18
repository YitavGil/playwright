import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByTestId('username-input').fill('12345');
  await page.getByTestId('password-input').fill('12345');
  await page.getByTestId('login-button').click();
  await page.waitForURL('/manager');
  await expect(page.getByTestId('add-album-button')).toBeVisible();
}