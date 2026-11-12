import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium, firefox} from 'playwright';

const origin = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, ['services/api/server.mjs'], {stdio:['ignore','pipe','pipe']});
let browser;
try {
 await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('Local server did not start')), 15000);
  server.stdout.on('data', chunk => {
   if (chunk.toString().includes('CONTRA http://127.0.0.1:4173')) {
    clearTimeout(timer);
    resolve();
   }
  });
  server.on('exit', code => {clearTimeout(timer); reject(Error(`Local server exited ${code}`));});
 });
 for (const engine of [chromium, firefox]) {
  browser = await engine.launch({headless:true});
  for (const width of [320, 768, 1440]) {
   const page = await browser.newPage({viewport:{width, height:900}});
   await page.goto(origin);
   assert.equal(await page.getByRole('heading', {name:'CONTRA'}).count(), 1);
   assert.equal(await page.getByText('The interface is being updated.').count(), 1);
   assert.equal(await page.locator('link[rel="stylesheet"], script').count(), 0);
   for (const path of ['/workflow.css', '/tokens.css']) {
    assert.equal((await page.request.get(origin + path)).status(), 404);
   }
   await page.goto(origin + '/#cases');
   await page.reload();
   assert.equal(await page.getByRole('heading', {name:'CONTRA'}).count(), 1);
   await page.close();
  }
  await browser.close();
  browser = undefined;
 }
} finally {
 await browser?.close();
 server.kill('SIGTERM');
}
