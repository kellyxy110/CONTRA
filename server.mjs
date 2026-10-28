import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(req.url==='/' )p=path.join(root,'design/ux3a/index.html');if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(p,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript','jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png'})[p.split('.').pop()]||'application/octet-stream');res.end(b);});}).listen(4173,'0.0.0.0');
