import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { axeOptions } from './axe-config';

import type { Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard', { timeout: 10_000 });
}

test.describe('Scenario 5: RBAC denial', () => {
  test('viewer cannot create product via API — returns 403', async ({ page, request }) => {
    await loginAs(page, 'viewer@example.com', 'password123');

    // Direct API call to create a product as viewer
    const response = await request.post('/api/products', {
      data: {
        name: 'Unauthorized Product',
        description: 'Should fail',
        price: 9.99,
        category: 'electronics',
        stock: 1,
      },
    });

    expect(response.status()).toBe(403);
  });

  test('viewer cannot delete product via API — returns 403', async ({ page, request }) => {
    await loginAs(page, 'viewer@example.com', 'password123');

    const response = await request.delete('/api/products/p1');
    expect(response.status()).toBe(403);
  });

  test('viewer cannot update product via API — returns 403', async ({ page, request }) => {
    await loginAs(page, 'viewer@example.com', 'password123');

    const response = await request.put('/api/products/p1', {
      data: { name: 'Unauthorized Update' },
    });

    expect(response.status()).toBe(403);
  });

  test('dashboard is accessible for viewer role', async ({ page }) => {
    await loginAs(page, 'viewer@example.com', 'password123');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
