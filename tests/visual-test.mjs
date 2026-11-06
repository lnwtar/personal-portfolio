import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Tatzaed03/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const baseUrl = 'http://127.0.0.1:4173';
const output = path.resolve(import.meta.dirname, 'screenshots');
fs.mkdirSync(output, { recursive: true });

const viewports = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 390, height: 844, screenshot: 'mobile-390.png' },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180, screenshot: 'ipad-portrait-820.png' },
  { width: 1024, height: 768 },
  { width: 1180, height: 820, screenshot: 'ipad-landscape-1180.png' },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000, screenshot: 'desktop-1440.png' },
  { width: 1920, height: 1080 },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

const failures = [];

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let position = 0; position < document.body.scrollHeight; position += 700) {
      window.scrollTo(0, position);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    window.scrollTo(0, 0);
  });
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(`Request failed: ${request.url()}`));

  await page.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle' });
  await page.locator('.project-card').first().waitFor();
  assert.equal(await page.locator('.project-card').count(), 11, `${viewport.width}px should render 11 projects`);
  assert.ok(
    await page.locator('.hero-copy h1').evaluate(element => element.scrollWidth <= element.clientWidth + 1),
    `${viewport.width}px hero heading should not split or overflow the name`,
  );
  const featuredCard = page.locator('.project-card--featured');
  assert.equal(await featuredCard.count(), 1, `${viewport.width}px should have one clear featured project`);
  if (viewport.width >= 821) {
    const featuredBody = await featuredCard.locator('.project-body').boundingBox();
    assert.ok(featuredBody?.width >= 220, `${viewport.width}px featured project copy should remain visible beside its image`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${viewport.width}px home page overflows by ${overflow}px`);

  if (viewport.width <= 430) {
    await page.locator('.nav-toggle').click();
    assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'), 'false');
  }

  if (viewport.width === 390) {
    await page.locator('[data-filter="uxui"]').click();
    assert.equal(await page.locator('.project-card').count(), 1, 'UX/UI filter should show 1 project');
    assert.ok(page.url().includes('filter=uxui'), 'Filter state should be reflected in the URL');
    await page.locator('[data-filter="all"]').click();
  }

  await scrollThrough(page);
  if (viewport.screenshot) {
    await page.screenshot({ path: path.join(output, viewport.screenshot), fullPage: true });
  }

  await page.goto(`${baseUrl}/projects/project.html?slug=v-resq`, { waitUntil: 'networkidle' });
  await page.locator('#gallery-viewer:not([hidden])').waitFor();
  const detailResponsiveOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(detailResponsiveOverflow <= 1, `${viewport.width}px detail page overflows by ${detailResponsiveOverflow}px`);
  if (viewport.width === 390 || viewport.width === 1440) {
    await scrollThrough(page);
    await page.screenshot({ path: path.join(output, `detail-${viewport.width}.png`), fullPage: true });

    await page.goto(`${baseUrl}/projects/project.html?slug=fashion-ecommerce`, { waitUntil: 'networkidle' });
    await page.locator('#gallery-viewer:not([hidden])').waitFor();
    assert.equal((await page.locator('#gallery-counter').textContent()).trim(), '1 / 9');
    assert.ok(await page.locator('#gallery-open').evaluate(element => element.classList.contains('is-portrait')));
    const imageRatios = await page.locator('#gallery-active').evaluate(image => ({
      natural: image.naturalWidth / image.naturalHeight,
      rendered: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
    }));
    assert.ok(Math.abs(imageRatios.natural - imageRatios.rendered) < 0.02, `${viewport.width}px Figma image should preserve its original aspect ratio`);
    await page.locator('.project-gallery-section').screenshot({ path: path.join(output, `figma-gallery-${viewport.width}.png`) });
  }
  if (errors.length) failures.push(`${viewport.width}x${viewport.height}: ${errors.join(' | ')}`);
  await context.close();
}

const detailContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
const detail = await detailContext.newPage();
const detailErrors = [];
detail.on('console', message => { if (message.type() === 'error') detailErrors.push(message.text()); });
detail.on('pageerror', error => detailErrors.push(error.message));
await detail.goto(`${baseUrl}/projects/project.html?slug=v-resq`, { waitUntil: 'networkidle' });
await detail.locator('#gallery-viewer:not([hidden])').waitFor();
assert.equal((await detail.locator('#gallery-counter').textContent()).trim(), '1 / 10');
await detail.locator('#gallery-next').click();
assert.equal((await detail.locator('#gallery-counter').textContent()).trim(), '2 / 10');
await detail.locator('#gallery-open').click();
assert.ok(await detail.locator('#lightbox').evaluate(dialog => dialog.open), 'Lightbox should open');
await detail.keyboard.press('ArrowRight');
assert.equal((await detail.locator('#gallery-counter').textContent()).trim(), '3 / 10');
await detail.keyboard.press('Escape');
assert.ok(!(await detail.locator('#lightbox').evaluate(dialog => dialog.open)), 'Escape should close lightbox');
assert.ok(await detail.locator('#gallery-open').evaluate(element => element === document.activeElement), 'Focus should return to gallery opener');

await detail.locator('#gallery-open').click();
await detail.locator('#lightbox-stage').evaluate(element => {
  element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 320, clientY: 160, pointerType: 'touch' }));
  element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 120, clientY: 160, pointerType: 'touch' }));
});
assert.equal((await detail.locator('#gallery-counter').textContent()).trim(), '4 / 10', 'Swipe should advance the gallery');
await detail.keyboard.press('Escape');

const detailOverflow = await detail.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert.ok(detailOverflow <= 1, `Detail page overflows by ${detailOverflow}px`);
const brokenImages = await detail.locator('img').evaluateAll(images => images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.src));
assert.deepEqual(brokenImages, [], `Broken images: ${brokenImages.join(', ')}`);

const projectSlugs = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../data/projects.json'), 'utf8')).map(project => project.slug);
for (const projectSlug of projectSlugs) {
  await detail.goto(`${baseUrl}/projects/project.html?slug=${encodeURIComponent(projectSlug)}`, { waitUntil: 'networkidle' });
  await detail.locator('#detail-title').waitFor();
  assert.notEqual((await detail.locator('#detail-title').textContent()).trim(), 'Project Not Found', `${projectSlug} detail page should render`);
}
await detail.goto(`${baseUrl}/projects/project.html?slug=fashion-ecommerce`, { waitUntil: 'networkidle' });
assert.equal((await detail.locator('.detail-github').textContent()).trim(), 'Live Web Shopping Demo ↗');
assert.equal(await detail.locator('.detail-github').getAttribute('href'), 'https://lnwtar.github.io/shopping_Project/');
await detail.goto(`${baseUrl}/projects/project.html?slug=seizure-mission-roblox`, { waitUntil: 'networkidle' });
assert.equal((await detail.locator('#gallery-counter').textContent()).trim(), '1 / 7', 'Removed Roblox image must not remain in the gallery');
if (detailErrors.length) failures.push(`detail: ${detailErrors.join(' | ')}`);
await detailContext.close();

await browser.close();
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`Visual tests passed at ${viewports.length} viewports. Screenshots saved to ${output}.`);
