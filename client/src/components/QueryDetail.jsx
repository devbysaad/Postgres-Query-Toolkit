import React from 'react';
import CopyButton from './CopyButton.jsx';

export default function QueryDetail({ query, onCopied }) {
  if (!query) return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Details</h2>
      <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">Select a query</div>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Details</h2>
      <div className="rounded-md border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">{query.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{query.category}</div>
          </div>
          <div className="text-xs text-gray-500">{new Date(query.createdAt).toLocaleString()}</div>
        </div>
        <p className="text-sm">{query.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">SQL</span>
          <CopyButton text={query.queryText} onCopied={onCopied} />
        </div>
        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto"><code>{query.queryText}</code></pre>
        {Array.isArray(query.tags) && query.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {query.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}