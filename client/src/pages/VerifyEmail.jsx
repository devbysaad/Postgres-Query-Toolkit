import React, { useState } from 'react';
import { AUTH_URL } from '../utils/authApi.js';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [generated, setGenerated] = useState('');
  const [message, setMessage] = useState('');

  async function requestToken() {
    setMessage('');
    const res = await fetch(`${AUTH_URL}/verify-request`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || 'Failed');
    setGenerated(data.token || '');
  }

  async function submit() {
    setMessage('');
    const res = await fetch(`${AUTH_URL}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
    const data = await res.json();
    setMessage(res.ok ? 'Verified' : data.message || 'Failed');
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Verify Email</h2>
      {message && <div className="mb-2">{message}</div>}
      <div className="space-y-3">
        <button onClick={requestToken} className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2">Request token</button>
        {generated && <div className="text-xs break-all">Token: {generated}</div>}
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="Enter token" value={token} onChange={(e) => setToken(e.target.value)} />
        <button onClick={submit} className="rounded-md bg-indigo-600 text-white px-3 py-2">Verify</button>
      </div>
    </div>
  );
}