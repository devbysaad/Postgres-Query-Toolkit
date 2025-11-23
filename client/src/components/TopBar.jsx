import React from 'react';
import DarkModeToggle from './DarkModeToggle.jsx';

export default function TopBar({ onAdd }) {
  return (
    <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-indigo-600"></div>
        <span className="font-semibold">PostgreSQL Query Library</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onAdd} className="rounded-md bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700">Add Query</button>
        <DarkModeToggle />
      </div>
    </div>
  );
}