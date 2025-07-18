// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.helper';

test.describe('Authentication', () => {
  
  test('should redirect to login page when not authenticated', async ({ page }) => {
    
    // Try to access protected route directly
    await page.goto('/manager');
    
    // Should be redirected to login
    await expect(page).toHaveURL('/login');
    await expect(page.getByTestId('login-title')).toBeVisible();
  }); 

  test('should login successfully with correct credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Verify login form is visible
    await expect(page.getByTestId('login-title')).toHaveText('Album Manager');
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    
    // Fill credentials
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    
    // Click login button
    await page.getByTestId('login-button').click();
    
    // Wait for loading to finish and navigation to occur
    await page.waitForURL('/manager');
    
    // Verify we're on the album manager page
    await expect(page.getByTestId('app-title')).toHaveText('Album Manager');
    await expect(page.getByTestId('add-album-button')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // Verify token exists in localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).not.toBeNull();
    expect(token).toBeTruthy();
    
    // Verify token format (should be base64 encoded)
    expect(token).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  test('should show error with incorrect credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Try with wrong username
    await page.getByTestId('username-input').fill('wronguser');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText('Invalid credentials');
    
    // Should still be on login page
    await expect(page).toHaveURL('/login');
    
    // Clear error and try with wrong password
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();
    
    // Should show error again
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toHaveText('Invalid credentials');
  });

  test('should handle password visibility toggle', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByTestId('password-input');
    const toggleButton = page.getByTestId('toggle-password');
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    
    // Click login and immediately check for loading spinner
    await page.getByTestId('login-button').click();
    
    // Loading spinner should be visible (might be quick, so we use waitFor)
    await expect(page.getByTestId('loading-spinner')).toBeVisible();
    
    // Wait for login to complete
    await page.waitForURL('/manager');
  });

  test('should logout successfully and redirect to login', async ({ page }) => {
    // First login
    await loginAsAdmin(page);
    
    // Verify we're logged in
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // Click logout
    await page.getByTestId('logout-button').click();
    
    // Should redirect to login page
    await page.waitForURL('/login');
    await expect(page.getByTestId('login-title')).toBeVisible();
    
    // Token should be removed from localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeNull();
  });

  test('should stay logged in after page refresh if token exists', async ({ page }) => {
    // Login first
    await loginAsAdmin(page);
    
    // Refresh the page
    await page.reload();
    
    // Should still be on manager page
    await expect(page).toHaveURL('/manager');
    await expect(page.getByTestId('add-album-button')).toBeVisible();
    
    // Token should still exist
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).not.toBeNull();
  });

  test('should handle whitespace in credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Test with whitespace (this was the bug we found earlier!)
    await page.getByTestId('username-input').fill(' admin ');
    await page.getByTestId('password-input').fill(' password ');
    await page.getByTestId('login-button').click();
    
    // Should still login successfully due to trim()
    await page.waitForURL('/manager');
    await expect(page.getByTestId('add-album-button')).toBeVisible();
  });

});

// ===================================

