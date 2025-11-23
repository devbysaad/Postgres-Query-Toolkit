import React, { useState } from 'react';

export default function AddQueryModal({ categories = [], onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0] || 'CRUD');
  const [queryText, setQueryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!title || !description || !category || !queryText) {
        throw new Error('All fields are required');
      }
      await onSubmit({ title, description, category, queryText });
    } catch (err) {
      setError(err.message || 'Failed to add query');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-950 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold">Add Query</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
                {['CRUD', 'Joins', 'Indexing', 'Aggregation', 'CTE', 'Window Functions', 'Misc'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">SQL</label>
              <textarea value={queryText} onChange={(e) => setQueryText(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2" rows={4} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2">Cancel</button>
            <button disabled={loading} type="submit" className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}