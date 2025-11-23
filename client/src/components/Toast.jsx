import React, { useEffect } from 'react';

export default function Toast({ open, message, variant = 'success', onClose }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose && onClose(), 2500);
    return () => clearTimeout(id);
  }, [open, onClose]);

  if (!open) return null;
  const color = variant === 'error' ? 'bg-red-600' : 'bg-green-600';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className={`text-white ${color} px-4 py-2 rounded shadow`}>{message}</div>
    </div>
  );
}