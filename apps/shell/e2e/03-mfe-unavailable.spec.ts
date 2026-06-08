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

test.describe('Scenario 3: Error recovery — MFE unavailable', () => {
  test('MFEUnavailable fallback renders when remoteEntry fails', async ({ page }) => {
    // Intercept the mfe-dashboard remoteEntry to simulate failure
    await page.route('**/mfe-dashboard/remoteEntry.js', (route) => {
      return route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await loginAsAdmin(page);
    await page.waitForLoadState('networkidle');

    // Shell should render the MFEUnavailable fallback instead of white screen
    await expect(page.getByText(/unavailable|failed|error/i)).toBeVisible({ timeout: 10_000 });

    // Navigation should still work (other MFEs unaffected)
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('other MFEs still functional when one fails', async ({ page }) => {
    // Intercept mfe-dashboard remoteEntry
    await page.route('**/mfe-dashboard/remoteEntry.js', (route) => {
      return route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await loginAsAdmin(page);

    // Navigate to products — should work fine
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    // Products MFE should be functional
    await expect(page.getByText(/products/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('error fallback page is accessible', async ({ page }) => {
    await page.route('**/mfe-dashboard/remoteEntry.js', (route) => {
      return route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await loginAsAdmin(page);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).options(axeOptions).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
