import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.cwd();
const output=path.join(root,'ci-output','visual-comparison');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const theme of ['dark','light']){
  const reference=`data:image/jpeg;base64,${(await readFile(path.join(root,'design','approved',`overview-${theme}.jpeg`))).toString('base64')}`;
  const rendered=`data:image/png;base64,${(await readFile(path.join(root,'ci-output',`contra-chromium-1280-fixture-${theme}.png`))).toString('base64')}`;
  const page=await browser.newPage({viewport:{width:2560,height:900}});
  await page.setContent(`<!doctype html><html><style>*{box-sizing:border-box}body{margin:0;background:#202724;color:white;font:20px system-ui;display:grid;grid-template-columns:1fr 1fr;gap:0}.frame{display:grid;grid-template-rows:52px 848px}.label{display:grid;place-items:center;background:#16221d;font-weight:700;letter-spacing:.04em}.frame+ .frame{border-left:2px solid #ff8678}img{display:block;width:1280px;height:848px;object-fit:contain;background:#0b1110}</style><body><section class="frame"><div class="label">Approved ${theme} reference</div><img src="${reference}"></section><section class="frame"><div class="label">Rendered Chromium ${theme}</div><img src="${rendered}"></section></body></html>`);
  await page.locator('img').last().waitFor();
  await page.screenshot({path:path.join(output,`overview-${theme}-side-by-side.png`),fullPage:false});
  await page.close();
 }
}finally{await browser.close();}
console.log(`Overview comparisons written to ${output}`);
