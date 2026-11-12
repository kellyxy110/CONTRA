import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
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
 await mkdir('ci-output',{recursive:true});
 for (const [name,engine] of [['chromium',chromium],['firefox',firefox]]) {
  browser = await engine.launch({headless:true});
  for (const width of [320,375,768,1024,1440]) {
   const page = await browser.newPage({viewport:{width, height:900}});
   await page.goto(origin);
   await page.getByRole('heading', {name:'Contestation Overview'}).waitFor();
   await page.getByText('Contract case data is unavailable.').waitFor();
   assert.equal(await page.locator('.kpis article').count(),4);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for (const path of ['/workflow.css', '/tokens.css']) {
    assert.equal((await page.request.get(origin + path)).status(), 404);
   }
   await page.screenshot({path:`ci-output/contra-${name}-${width}-dark.png`,fullPage:true});
   await page.locator('#theme').selectOption('light');
   await page.reload();
   await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
   if(width===1440)await page.screenshot({path:`ci-output/contra-${name}-1440-light.png`,fullPage:true});
   await page.close();
  }
  await browser.close();
  browser = undefined;
 }
} finally {
 await browser?.close();
 server.kill('SIGTERM');
}
