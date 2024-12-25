import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('link', { name: 'Intro' }).click();
  await page.locator('#intro').getByText('Close').click();

  await page.getByRole('link', { name: 'Work' }).click();
  await page.locator('#work').getByText('Close').click();
  
  await page.getByRole('link', { name: 'About' }).click();
  await page.locator('#about').getByText('Close').click();
});