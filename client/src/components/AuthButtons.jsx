import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthButtons({ user, onLogout }) {
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">{user.email}</span>
        <button onClick={onLogout} className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm">Logout</button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link to="/login" className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm">Login</Link>
      <Link to="/register" className="rounded-md bg-indigo-600 text-white px-3 py-1 text-sm">Register</Link>
    </div>
  );
}