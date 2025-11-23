import React from 'react';

export default function CategorySidebar({ categories = [], active = '', onSelect, onClear }) {
  return (
    <div>
      <button
        className={`w-full text-left px-3 py-2 rounded-md mb-2 ${active === '' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' : ''}`}
        onClick={onClear}
      >
        All
      </button>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c}>
            <button
              onClick={() => onSelect(c)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${active === c ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' : ''}`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}