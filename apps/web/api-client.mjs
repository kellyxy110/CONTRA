export function createApiClient(getToken, fetchImpl = fetch, {timeoutMs = 15000} = {}) {
 async function request(path, options = {}) {
  const headers = {...(options.headers || {})};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
   const response = await fetchImpl(`/api/${path}`, {...options, headers, signal:controller.signal});
   const contentType=response.headers.get('content-type')||'';
   if(!contentType.toLowerCase().includes('application/json'))throw Error(`The CONTRA API returned ${contentType||'an unknown content type'} instead of JSON. Refresh after the deployment finishes.`);
   const body = await response.json();
   if (!response.ok) throw Error(body.error || `HTTP ${response.status}`);
   return body;
  } catch (error) {
   if (controller.signal.aborted) throw Error('The CONTRA API request timed out.');
   throw error;
  } finally {
   clearTimeout(timer);
  }
 }

 async function view(method, args) {
  const response = await request('view', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify({method, args, envelope: true}),
  });
  return response.value;
 }

 return {request, view};
}
