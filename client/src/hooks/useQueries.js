import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../utils/api.js';

export default function useQueries({ category = '', search = '' } = {}) {
  const [queries, setQueries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    return `${API_URL}/queries?${params.toString()}`;
  };

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) throw new Error('Failed to load queries');
      const data = await res.json();
      setQueries(data.queries || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  const addQuery = useCallback(async (payload) => {
    const res = await fetch(`${API_URL}/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message || 'Failed to add');
    }
    const created = await res.json();
    return created;
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { queries, categories, loading, error, refetch, addQuery };
}