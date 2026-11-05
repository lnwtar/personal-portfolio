import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/Tatzaed03/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(import.meta.dirname, '..');
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'load' });
  await page.locator('.project-card').first().waitFor({ state: 'visible' });
  assert.equal(await page.locator('.project-card').count(), 11, 'All projects should render through file://');
  assert.match(await page.locator('h1').innerText(), /Kantaphon\s+Thanwisetuaong\./);
  assert.equal((await page.locator('#project-count').innerText()).trim(), '11 projects');
  assert.equal(
    await page.locator('a[href="https://canva.link/dc9a3ov0nlx5l56"]').count(),
    3,
    'All homepage resume actions should use the approved Canva link',
  );

  const detailUrl = `${pathToFileURL(path.join(root, 'projects', 'project.html')).href}?slug=fashion-ecommerce`;
  await page.goto(detailUrl, { waitUntil: 'load' });
  await page.locator('#detail-title').waitFor({ state: 'visible' });
  assert.equal((await page.locator('#detail-title').innerText()).trim(), 'AI Fashion Shopping & Outfit Matching');
  assert.equal((await page.locator('#gallery-counter').innerText()).trim(), '1 / 5');
  assert.match(await page.title(), /Kantaphon Thanwisetuaong$/);

  const rehabUrl = `${pathToFileURL(path.join(root, 'projects', 'project.html')).href}?slug=smart-rehab`;
  await page.goto(rehabUrl, { waitUntil: 'load' });
  await page.locator('#detail-title').waitFor({ state: 'visible' });
  assert.equal((await page.locator('#gallery-counter').innerText()).trim(), '1 / 4');
  assert.match(
    await page.locator('#gallery-active').getAttribute('src'),
    /unity-boat-gameplay-score-40\.png$/,
  );
  assert.equal(
    await page.locator('a[href="https://canva.link/dc9a3ov0nlx5l56"]').count(),
    1,
    'Project resume action should use the approved Canva link',
  );

  console.log('File protocol test passed: 11 projects and project details render offline.');
} finally {
  await browser.close();
}
