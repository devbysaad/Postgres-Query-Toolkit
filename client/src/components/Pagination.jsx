import React from 'react';

export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  function setPage(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    onChange && onChange(next);
  }
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">{total} items • Page {page} of {totalPages}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(page - 1)} className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1" disabled={page <= 1}>Prev</button>
        <button onClick={() => setPage(page + 1)} className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1" disabled={page >= totalPages}>Next</button>
      </div>
    </div>
  );
}