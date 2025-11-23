import React from 'react';

export default function QueryList({ queries = [], onSelect, selectedId }) {
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Queries</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">{queries.length} shown</div>
      </div>
      <ul className="space-y-3">
        {queries.map((q) => (
          <li key={q._id}>
            <button
              onClick={() => onSelect(q)}
              className={`w-full text-left p-4 rounded-md border ${selectedId === q._id ? 'border-indigo-600' : 'border-gray-200 dark:border-gray-800'} bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{q.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">{q.category}</span>
                  <span className="text-xs text-gray-500">{q.createdAt ? new Date(q.createdAt).toLocaleString() : ''}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{q.description}</p>
            </button>
          </li>
        ))}
        {queries.length === 0 && (
          <li>
            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm">No queries found</div>
          </li>
        )}
      </ul>
    </div>
  );
}