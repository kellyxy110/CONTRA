export function createApiClient(getToken, fetchImpl = fetch) {
 async function request(path, options = {}) {
  const headers = {...(options.headers || {})};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetchImpl(`/api/${path}`, {...options, headers});
  const body = await response.json();
  if (!response.ok) throw Error(body.error || `HTTP ${response.status}`);
  return body;
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
