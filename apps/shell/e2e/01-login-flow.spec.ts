import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { axeOptions } from './axe-config';

test.describe('Scenario 1: Login flow', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('dashboard renders widgets without errors after login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    await page.waitForLoadState('networkidle');

    // Dashboard widgets should render
    await expect(page.getByRole('region', { name: 'Sales Chart' })).toBeVisible({
      timeout: 10_000,
    });

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('invalid credentials show error message', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5_000 });
    expect(page.url()).toContain('/login');
  });

  test('session persists after page refresh', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/dashboard', { timeout: 10_000 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be on dashboard after refresh
    expect(page.url()).toContain('/dashboard');
  });
});
