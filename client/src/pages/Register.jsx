import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ onRegister }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onRegister({ email, password });
      nav('/');
    } catch (err) {
      setError(err.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2" placeholder="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-md bg-indigo-600 text-white px-3 py-2">{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <div className="mt-3 text-sm">
        <Link to="/login" className="text-indigo-600">Already have an account? Login</Link>
      </div>
    </div>
  );
}