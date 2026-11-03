import fs from 'node:fs/promises';
import path from 'node:path';

import {chromium} from 'playwright';

const root = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4174';
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/m042/phase1/after-empty');
const populatedCase = process.env.CONTRA_QA_CASE_ID || '';
const viewports = [
  ['desktop-1200x900', 1200, 900],
  ['laptop-1366x768', 1366, 768],
  ['owner-1536x676', 1536, 676],
  ['desktop-1440x900', 1440, 900],
  ['desktop-1920x1080', 1920, 1080],
  ['tablet-768x1024', 768, 1024],
  ['mobile-390x844', 390, 844],
  ['mobile-320x844', 320, 844]
];
const report = {
  checkpoint: 'CONTRA-2026-11-03-IMPL-M04.2-P1',
  root,
  populated_case: populatedCase || null,
  checks: [],
  measurements: {},
  console_errors: []
};
const check = (name, pass, detail = '') => {
  report.checks.push({name, pass, detail});
  if (!pass) process.exitCode = 1;
};

await fs.mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true});

for (const [name, width, height] of viewports) {
  const context = await browser.newContext({viewport: {width, height}, hasTouch: width <= 900});
  const page = await context.newPage();
  page.on('console', message => {
    if (message.type() === 'error') report.console_errors.push(`${name}: ${message.text()}`);
  });
  page.on('pageerror', error => report.console_errors.push(`${name}: ${error.message}`));
  await page.goto(root, {waitUntil: 'networkidle'});
  if (populatedCase) {
    await page.locator('[data-action="account"]').first().click();
    await page.locator('#account-choice').selectOption({label: 'creator.test.near'});
    await page.locator('[data-action="connect"]').click();
    await page.locator('dialog').evaluate(dialog => dialog.close());
    await page.locator('[data-action="refresh"]').click();
    await page.waitForTimeout(300);
    await page.locator('[data-nav="Cases"]').click();
    await page.locator(`[data-case="${populatedCase}"]`).click();
    await page.locator('#dialog-title').filter({hasText: 'Agreement & escrow'}).waitFor();
    await page.locator('dialog').evaluate(dialog => dialog.close());
  }
  const measurements = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const sections = [...document.querySelectorAll('main section')].filter(visible).map(element => {
      const rect = element.getBoundingClientRect();
      return {
        className: element.className,
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    });
    const shell = document.querySelector('.shell').getBoundingClientRect();
    const columns = [...document.querySelectorAll('.left,.middle,.right')].map(element => {
      const style = getComputedStyle(element);
      return {
        className: element.className,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        overflowY: style.overflowY,
        scrollbarGutter: style.scrollbarGutter
      };
    });
    const tinyText = [...document.querySelectorAll('body *')].filter(visible).filter(element => {
      const hasDirectText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      return hasDirectText && Number.parseFloat(getComputedStyle(element).fontSize) < 10;
    }).map(element => ({
      tag: element.tagName.toLowerCase(),
      className: element.className,
      text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 50),
      fontSize: getComputedStyle(element).fontSize
    }));
    const heading = document.querySelector('.profile .person h2');
    return {
      viewport: {width: innerWidth, height: innerHeight},
      document: {width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight},
      shell: {left: Math.round(shell.left), top: Math.round(shell.top), width: Math.round(shell.width), height: Math.round(shell.height)},
      sections,
      columns,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clippedSections: sections.filter(section => section.left < 0 || section.right > innerWidth + 1).map(section => section.className),
      independentColumnScrolls: columns.filter(column => ['auto', 'scroll'].includes(column.overflowY)),
      documentScrollable: document.documentElement.scrollHeight > innerHeight + 1,
      headingTruncated: heading.scrollWidth > heading.clientWidth + 1 || getComputedStyle(heading).whiteSpace === 'nowrap',
      tinyText
    };
  });
  report.measurements[name] = measurements;
  check(`${name} has no horizontal overflow`, !measurements.horizontalOverflow, `${measurements.document.width}px document at ${width}px viewport`);
  check(`${name} has no clipped section`, measurements.clippedSections.length === 0, measurements.clippedSections.join(', '));
  check(`${name} does not use independent column scrolling`, measurements.independentColumnScrolls.length === 0, JSON.stringify(measurements.independentColumnScrolls));
  check(`${name} contains no text below 10px`, measurements.tinyText.length === 0, JSON.stringify(measurements.tinyText));
  check(`${name} keeps the case heading readable`, !measurements.headingTruncated);
  if (name === 'desktop-1200x900') {
    check('1200 x 900 preserves the approved shell origin and width', measurements.shell.left === 60 && measurements.shell.top === 45 && measurements.shell.width === 1080, JSON.stringify(measurements.shell));
  }
  if (height <= 768 && width > 900) {
    check(`${name} uses the document as the short-screen scroll owner`, measurements.documentScrollable, `${measurements.document.height}px document at ${height}px viewport`);
  }
  await page.screenshot({path: path.join(output, `${populatedCase ? 'populated' : 'empty'}-${name}.png`), fullPage: true});
  await context.close();
}

check('browser console remains error-free', report.console_errors.length === 0, report.console_errors.join(' | '));
await browser.close();
await fs.writeFile(path.join(output, `${populatedCase ? 'populated' : 'empty'}-responsive-report.json`), JSON.stringify(report, null, 2));
for (const item of report.checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}${item.detail ? `: ${item.detail}` : ''}`);
if (process.exitCode) throw Error('M04.2 responsive QA failed');
