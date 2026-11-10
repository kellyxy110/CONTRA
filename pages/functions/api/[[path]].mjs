export async function onRequest(context){
 if(!context.env?.BACKEND?.fetch)return new Response(JSON.stringify({error:'Backend service binding unavailable'}),{status:503,headers:{'Content-Type':'application/json'}});
 const incoming=new URL(context.request.url);
 const headers=new Headers(context.request.headers);
 headers.set('Origin','https://contra-near.pages.dev');
 headers.set('Host','contra-near.pages.dev');
 headers.set('X-Forwarded-Host',incoming.host);
 const request=new Request(context.request.url,{method:context.request.method,headers,body:['GET','HEAD'].includes(context.request.method)?undefined:context.request.body,redirect:'manual'});
 const response=await context.env.BACKEND.fetch(request);
 const outputHeaders=new Headers(response.headers);
 outputHeaders.delete('Access-Control-Allow-Origin');
 outputHeaders.delete('Access-Control-Allow-Credentials');
 outputHeaders.set('Content-Security-Policy',"default-src 'self'; connect-src 'self' https://wallet.testnet.near.org https://testnet.mynearwallet.com; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://testnet.mynearwallet.com");
 outputHeaders.set('Referrer-Policy','no-referrer');
 outputHeaders.set('X-Content-Type-Options','nosniff');
 outputHeaders.set('X-Frame-Options','DENY');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers:outputHeaders});
}
