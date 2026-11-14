import {readFile,access} from 'node:fs/promises';

const required=[
 'pages/wrangler.jsonc',
 'pages/functions/api/[[path]].mjs',
 'dist/cloudflare-static/index.html',
 'dist/cloudflare-static/dashboard.mjs',
 'dist/cloudflare-static/browser-state.mjs',
];
for(const file of required)await access(file);
const config=JSON.parse((await readFile('pages/wrangler.jsonc','utf8')).replace(/^\s*\/\/.*$/gm,''));
const backend=config.services?.find(value=>value.binding==='BACKEND'&&value.service==='contra-testnet');
if(config.name!=='contra-near'||config.pages_build_output_dir!=='../dist/cloudflare-static'||!backend)throw Error('Cloudflare Pages release must include the contra-near static output and BACKEND service binding');
const proxy=await readFile('pages/functions/api/[[path]].mjs','utf8');
if(!proxy.includes('context.env.BACKEND.fetch'))throw Error('Cloudflare Pages API proxy is not included in the release');
console.log('Cloudflare release includes static assets, Pages Functions and the BACKEND service binding.');
