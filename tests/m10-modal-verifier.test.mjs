import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

test('Modal verifier passes its pure deterministic regression suite',()=>{
 const candidates=process.platform==='win32'?[['py',['-3']],['python',[]]]:[['python3',[]],['python',[]]];
 let result;
 for(const [command,prefix] of candidates){result=spawnSync(command,[...prefix,'-m','unittest','discover','-s','tests/modal','-p','test_*.py'],{encoding:'utf8'});if(result.error?.code==='ENOENT')continue;break;}
 assert.equal(result?.status,0,result?.stderr||result?.error?.message||'Python interpreter unavailable');
 assert.match(result.stderr,/Ran 5 tests/);
});

test('Modal endpoint is explicitly protected by proxy authentication',async()=>{
 const source=await import('node:fs/promises').then(fs=>fs.readFile('services/modal/app.py','utf8'));
 assert.match(source,/Image\.debian_slim\(python_version="3\.13"\)/);
 assert.match(source,/pip_install\("fastapi\[standard\]==0\.121\.1"\)/);
 assert.match(source,/add_local_file\([\s\S]*verification_core\.py/);
 assert.match(source,/@app\.function\(image=image, timeout=30\)/);
 assert.match(source,/fastapi_endpoint\(method="POST", requires_proxy_auth=True\)/);
 assert.doesNotMatch(source,/unauthenticated\s*=\s*True/);
});
