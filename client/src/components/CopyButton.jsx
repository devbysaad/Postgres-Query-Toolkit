import React, { useState } from 'react';

export default function CopyButton({ text, onCopied }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(true);
      onCopied && onCopied();
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <button onClick={copy} className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm">
      {copied ? 'Copied' : 'Copy SQL'}
    </button>
  );
}