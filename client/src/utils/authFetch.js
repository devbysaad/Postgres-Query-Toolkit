export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('access-token') || '';
  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  return res;
}