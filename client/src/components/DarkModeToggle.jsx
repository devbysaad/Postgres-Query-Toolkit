import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('dark-mode', String(dark));
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm"
      title="Toggle dark mode"
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  );
}