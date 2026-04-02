const { test, expect } = require('@playwright/test');

test('verify service category images on services page', async ({ page }) => {
  await page.goto('https://blowincoldac.fly.dev/services.html');
  
  // Wait for images to load
  await page.waitForLoadState('networkidle');

  const expectedImages = [
    '/images/cat_images/ac_repair_large.jpg',
    '/images/cat_images/ac_installation_large.jpg',
    '/images/cat_images/maintenance_plans_large.jpg',
    '/images/cat_images/warranty_service_large.jpg'
  ];

  for (const src of expectedImages) {
    const img = page.locator(`img[src="${src}"]`);
    await expect(img).toBeVisible();
    
    // Additional check to see if image is loaded naturally
    const isLoaded = await img.evaluate((i) => i.complete && i.naturalWidth > 0);
    expect(isLoaded, `Image ${src} should be loaded`).toBeTruthy();
  }
});

test('verify images on index page', async ({ page }) => {
  await page.goto('https://blowincoldac.fly.dev/index.html');
  await page.waitForLoadState('networkidle');

  const expectedImages = [
    '/images/cat_images/ac_repair_small.png',
    '/images/cat_images/ac_installation_small.png',
    '/images/cat_images/maintenance_plans_small.png',
    '/images/cat_images/warranty_service_small.png'
  ];

  for (const src of expectedImages) {
    const img = page.locator(`img[src="${src}"]`);
    await expect(img).toBeVisible();
    
    const isLoaded = await img.evaluate((i) => i.complete && i.naturalWidth > 0);
    expect(isLoaded, `Image ${src} should be loaded on index page`).toBeTruthy();
  }
});
