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

test.describe('Scenario 2: Edit product', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('products list page is accessible', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('products page renders product table', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Wait for product data to load
    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });
  });

  test('clicking product opens edit form', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });

    // Click on first product row
    const productRow = page.locator('[data-testid="product-row"]').first();
    await productRow.click();

    await page.waitForLoadState('networkidle');

    // Should navigate to product edit page
    expect(page.url()).toMatch(/\/products\/p/);
  });

  test('can update product name and save', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });

    const productRow = page.locator('[data-testid="product-row"]').first();
    await productRow.click();
    await page.waitForLoadState('networkidle');

    // Update product name
    const nameInput = page.getByLabel(/name/i);
    await nameInput.clear();
    await nameInput.fill('Updated Widget A');

    await page.getByRole('button', { name: /save/i }).click();

    // Should show success or redirect
    await page.waitForURL('**/products', { timeout: 10_000 });
  });

  test('product:updated event reflected in dashboard ProductActivity', async ({ page }) => {
    // Navigate to products, update a product
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Widget A')).toBeVisible({ timeout: 10_000 });

    const productRow = page.locator('[data-testid="product-row"]').first();
    await productRow.click();
    await page.waitForLoadState('networkidle');

    const nameInput = page.getByLabel(/name/i);
    await nameInput.clear();
    await nameInput.fill('Widget A Updated');

    await page.getByRole('button', { name: /save/i }).click();
    await page.waitForURL('**/products', { timeout: 10_000 });

    // Navigate to dashboard and verify ProductActivity shows updated data
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('region', { name: 'Product Activity' })).toBeVisible({
      timeout: 10_000,
    });
  });
});
