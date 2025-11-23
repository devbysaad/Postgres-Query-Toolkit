import React from 'react';

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex items-center gap-2 w-full max-w-lg">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, description, or SQL..."
        id="search-input"
        className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
      />
      <button
        onClick={onSearch}
        className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
      >
        Search
      </button>
    </div>
  );
}