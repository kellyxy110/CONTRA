import { chromium } from 'file:///C:/Users/user/AppData/Local/Temp/contra-playwright-ux2b/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4173';
const app = `${root}/design/judgment-room.html`;
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/ux2b');
const executablePath = 'C:/Users/user/AppData/Local/ms-playwright/chromium-1148/chrome-win/chrome.exe';
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const report = { consoleErrors: [], checks: [] };
const check = (name, pass, detail = '') => {
  report.checks.push({ name, pass, detail });
  if (!pass) process.exitCode = 1;
};

async function open(viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push(message.text());
  });
  page.on('pageerror', error => report.consoleErrors.push(error.message));
  await page.goto(app, { waitUntil: 'networkidle' });
  return { context, page };
}

const desktop = await open({ width: 1200, height: 900 });
await desktop.page.screenshot({ path: path.join(output, 'desktop-1200x900.png') });
check('desktop viewport', await desktop.page.evaluate(() => innerWidth === 1200 && innerHeight === 900));
check('desktop graph and inspector visible', await desktop.page.locator('.graph').isVisible() && await desktop.page.locator('.inspector').isVisible());
check('desktop horizontal overflow', await desktop.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${await desktop.page.evaluate(() => document.documentElement.scrollWidth)}px document width`);

await desktop.page.locator('[data-id="scan"].node').click();
check('node selection updates inspector', await desktop.page.locator('#title').textContent() === 'Automated scan');
await desktop.page.locator('#search').fill('focus trap');
check('search filters graph', await desktop.page.locator('.node:not([hidden])').count() === 1);
await desktop.page.locator('#search').fill('');
await desktop.page.locator('#filter').click();
check('evidence filter', await desktop.page.locator('.node:not([hidden])').count() === 4);
await desktop.page.locator('#filter').click();
await desktop.page.locator('#zoom-in').click();
check('zoom in', await desktop.page.locator('#zoom').textContent() === '110%');
await desktop.page.locator('#fit').click();
check('fit resets zoom', await desktop.page.locator('#zoom').textContent() === '100%');
await desktop.page.locator('#list-view').click();
check('list mode', await desktop.page.locator('#case-list').isVisible() && !(await desktop.page.locator('.graph').isVisible()));
await desktop.page.locator('.list-item.selected').focus();
const before = await desktop.page.locator('.list-item.selected').getAttribute('data-id');
await desktop.page.keyboard.press('ArrowDown');
const after = await desktop.page.locator('.list-item.selected').getAttribute('data-id');
check('keyboard list navigation', before !== after, `${before} to ${after}`);
await desktop.page.locator('#graph-view').click();
await desktop.page.locator('#challenge').click();
check('challenge path selection', await desktop.page.locator('#title').textContent() === 'Focus trap challenge');
await desktop.context.close();

const tablet = await open({ width: 768, height: 1024 });
await tablet.page.screenshot({ path: path.join(output, 'tablet-768x1024.png') });
check('tablet horizontal overflow', await tablet.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${await tablet.page.evaluate(() => document.documentElement.scrollWidth)}px document width`);
check('tablet inspector visible', await tablet.page.locator('.inspector').isVisible());
await tablet.page.locator('#challenge').scrollIntoViewIfNeeded();
check('tablet challenge action reachable', await tablet.page.locator('#challenge').isVisible());
await tablet.context.close();

const mobile = await open({ width: 390, height: 844 });
await mobile.page.screenshot({ path: path.join(output, 'mobile-390x844.png') });
check('mobile horizontal overflow', await mobile.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${await mobile.page.evaluate(() => document.documentElement.scrollWidth)}px document width`);
check('mobile critical controls visible', await mobile.page.locator('#graph-view').isVisible() && await mobile.page.locator('#list-view').isVisible());
await mobile.page.locator('#list-view').click();
check('mobile list fallback', await mobile.page.locator('#case-list').isVisible());
await mobile.page.locator('#challenge').scrollIntoViewIfNeeded();
check('mobile challenge action reachable', await mobile.page.locator('#challenge').isVisible());
await mobile.page.locator('#question').scrollIntoViewIfNeeded();
check('mobile case question input reachable', await mobile.page.locator('#question').isVisible());
await mobile.context.close();

const reduced = await open({ width: 1200, height: 900 }, 'reduce');
check('reduced motion media query', await reduced.page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches));
check('reduced motion removes transition', await reduced.page.locator('#nodes').evaluate(element => getComputedStyle(element).transitionDuration === '0s'));
await reduced.context.close();

const comparison = await browser.newPage({ viewport: { width: 2460, height: 960 } });
await comparison.setContent(`<!doctype html><style>*{box-sizing:border-box}body{margin:0;background:#050807;color:#f5f7f5;font:14px system-ui;display:grid;grid-template-columns:1200px 1200px;gap:20px;padding:20px}.panel{position:relative;width:1200px;height:900px;overflow:hidden;border:1px solid #31413a}.panel:before{position:absolute;z-index:2;top:10px;left:10px;padding:6px 9px;background:#07100dcc;border:1px solid #466055;border-radius:5px}.reference:before{content:'Original reference'}.implementation:before{content:'CONTRA implementation'}.panel img,.panel iframe{width:1200px;height:900px;border:0;object-fit:contain;display:block}</style><div class="panel reference"><img src="${root}/design/reference/control-ai-policy-dashboard.jpeg"></div><div class="panel implementation"><iframe src="${app}"></iframe></div>`);
await comparison.waitForLoadState('networkidle');
await comparison.screenshot({ path: path.join(output, 'desktop-reference-comparison.png') });
await comparison.close();

check('browser console errors', report.consoleErrors.length === 0, report.consoleErrors.join(' | '));
await fs.writeFile(path.join(output, 'visual-qa-report.json'), JSON.stringify(report, null, 2));
await browser.close();

for (const item of report.checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}${item.detail ? `: ${item.detail}` : ''}`);
if (process.exitCode) throw new Error('Visual QA failed');
