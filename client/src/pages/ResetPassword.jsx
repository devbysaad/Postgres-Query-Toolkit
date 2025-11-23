import React, { useState } from 'react';
import { AUTH_URL } from '../utils/authApi.js';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit() {
    setMessage('');
    const res = await fetch(`${AUTH_URL}/reset`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword: password }) });
    const data = await res.json();
    setMessage(res.ok ? 'Password reset' : data.message || 'Failed');
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      {message && <div className="mb-2">{message}</div>}
      <div className="space-y-3">
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="OTP" autoComplete="one-time-code" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <input type="password" className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="New Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submit} className="rounded-md bg-indigo-600 text-white px-3 py-2">Reset</button>
      </div>
    </div>
  );
}