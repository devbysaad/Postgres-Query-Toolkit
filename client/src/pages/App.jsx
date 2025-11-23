import React, { useEffect, useMemo, useState } from 'react';
import CategorySidebar from '../components/CategorySidebar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import QueryList from '../components/QueryList.jsx';
import QueryDetail from '../components/QueryDetail.jsx';
import AddQueryModal from '../components/AddQueryModal.jsx';
import TopBar from '../components/TopBar.jsx';
import Toast from '../components/Toast.jsx';
import Pagination from '../components/Pagination.jsx';
import Skeleton from '../components/Skeleton.jsx';
import useQueries from '../hooks/useQueries.js';
 

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const { queries, categories, loading, error, refetch, addQuery } = useQueries({ category: selectedCategory, search });
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const el = document.getElementById('search-input');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => queries, [queries]);
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]"> 
      <aside className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Categories</h2>
        </div>
        <CategorySidebar
          categories={categories}
          active={selectedCategory}
          onSelect={(c) => { setSelectedCategory(c); setSelectedQuery(null); setPage(1); }}
          onClear={() => { setSelectedCategory(''); setSelectedQuery(null); setPage(1); }}
        />
      </aside>
      <main className="p-0">
        <TopBar onAdd={() => setShowAdd(true)} />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} onSearch={refetch} />
            <button
              onClick={refetch}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-2 gap-6">
              <Skeleton rows={8} />
              <Skeleton rows={4} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <QueryList queries={paged} onSelect={setSelectedQuery} selectedId={selectedQuery?._id} />
                <QueryDetail query={selectedQuery} onCopied={() => setToast({ open: true, message: 'SQL copied', variant: 'success' })} />
              </div>
              <Pagination page={page} pageSize={pageSize} total={filtered.length} onChange={setPage} />
            </>
          )}
        </div>
      </main>
      {showAdd && (
        <AddQueryModal
          categories={categories}
          onClose={() => setShowAdd(false)}
          onSubmit={async (payload) => {
            const created = await addQuery(payload);
            if (created) {
              setShowAdd(false);
              setSelectedCategory(payload.category);
              await refetch();
              setToast({ open: true, message: 'Query added', variant: 'success' });
            }
          }}
        />
      )}
      <Toast open={toast.open} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}