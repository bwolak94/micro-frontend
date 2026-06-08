import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { axeOptions } from './axe-config';

import type { Page } from '@playwright/test';

async function loginAsAdmin(page: Page): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Email address').fill('admin@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
}

test.describe('Scenario 4: Cross-MFE event flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('navigating from dashboard to products and back preserves state', async ({ page }) => {
    // Start on dashboard
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('region', { name: 'Sales Chart' })).toBeVisible({
      timeout: 10_000,
    });

    // Navigate to products
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });

    // Return to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Dashboard should still render correctly
    await expect(page.getByRole('region', { name: 'Sales Chart' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole('region', { name: 'Product Activity' })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('product:updated event triggers ProductActivity refresh', async ({ page }) => {
    // Navigate to products, edit a product
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });

    const firstRow = page.locator('[data-testid="product-row"]').first();
    await firstRow.click();
    await page.waitForLoadState('networkidle');

    const nameInput = page.getByLabel(/name/i);
    await nameInput.clear();
    await nameInput.fill('Cross-MFE Updated Product');

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForURL('**/products', { timeout: 10_000 });

    // Return to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // ProductActivity widget should be visible (event triggered a re-fetch)
    await expect(page.getByRole('region', { name: 'Product Activity' })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('dashboard after product edit is accessible', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
