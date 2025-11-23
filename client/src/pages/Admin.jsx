import React, { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch.js';

export default function Admin() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      const res = await authFetch('http://localhost:5000/api/auth/admin/summary');
      const json = await res.json();
      if (!res.ok) setError(json.message || 'Forbidden');
      else setData(JSON.stringify(json));
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Summary</h2>
      {error ? <div className="text-red-600">{error}</div> : <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto text-sm">{data}</pre>}
    </div>
  );
}