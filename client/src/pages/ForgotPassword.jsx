import React, { useState } from 'react';
import { AUTH_URL } from '../utils/authApi.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  async function submit() {
    setMessage('');
    const res = await fetch(`${AUTH_URL}/forgot`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (!res.ok) return setMessage(data.message || 'Failed');
    setOtp(data.otp || '');
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      {message && <div className="mb-2">{message}</div>}
      <div className="space-y-3">
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={submit} className="rounded-md bg-indigo-600 text-white px-3 py-2">Request OTP</button>
        {otp && <div className="text-xs break-all">OTP: {otp}</div>}
      </div>
    </div>
  );
}