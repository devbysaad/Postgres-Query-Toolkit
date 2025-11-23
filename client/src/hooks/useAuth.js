import { useCallback, useEffect, useState } from 'react';
import { AUTH_URL } from '../utils/authApi.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access-token') || '');

  useEffect(() => {
    if (accessToken) localStorage.setItem('access-token', accessToken);
    else localStorage.removeItem('access-token');
  }, [accessToken]);

  const register = useCallback(async ({ email, password }) => {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed');
    setUser(data.user);
    setAccessToken(data.tokens?.accessToken || '');
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed');
    setUser(data.user);
    setAccessToken(data.tokens?.accessToken || '');
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${AUTH_URL}/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    setAccessToken('');
  }, []);

  return { user, accessToken, register, login, logout };
}