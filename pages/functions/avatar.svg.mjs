export function onRequest(){
 return new Response('Removed presentation asset',{status:404,headers:{'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'}});
}
