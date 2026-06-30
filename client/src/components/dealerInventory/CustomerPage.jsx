// components/customers/CustomersPage.jsx
import { useState, useCallback } from 'react';
import { Search, Users, Phone, Mail, MapPin, Car, ChevronRight, X } from 'lucide-react';
import { useCustomers } from './UseSalesAnalytics';
import { formatShortNaira,formatDate, formatRelative  } from './Format';


const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'spend',  label: 'Highest spend' },
  { value: 'name',   label: 'Name A–Z' },
  { value: 'count',  label: 'Most purchases' },
];

// ── Customer detail drawer ────────────────────────────────────────────────────
function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-800 w-full sm:w-96 h-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl sm:rounded-l-3xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-sm">
              {customer.name?.slice(0, 2).toUpperCase() || 'NA'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{customer.name || 'Unknown'}</p>
              <p className="text-xs text-gray-400">{customer.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 transition">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total spend', value: formatShortNaira(customer.totalSpend) },
              { label: 'Purchases', value: customer.totalPurchases },
              { label: 'First visit', value: formatDate(customer.firstPurchase) },
              { label: 'Last visit', value: formatRelative(customer.lastPurchase) },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 mb-1">{s.label}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Contact</p>
            {customer.email && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <Mail size={13} className="text-gray-400 shrink-0" />
                {customer.email}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <Phone size={13} className="text-gray-400 shrink-0" />
              {customer.phone}
            </div>
            {(customer.state || customer.lga) && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                {[customer.lga, customer.state].filter(Boolean).join(', ')}
              </div>
            )}
          </div>

          {/* Cars bought */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cars purchased</p>
            <div className="space-y-2">
              {customer.carsBought?.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 border border-gray-100 dark:border-gray-600 flex items-center justify-center">
                    <Car size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                      {c.year} {c.make} {c.model}
                    </p>
                    <p className="text-[10px] text-gray-400">{c.stockNumber} · {c.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [search, setSearch]       = useState('');
  const [sort, setSort]           = useState('recent');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const { data, loading } = useCustomers({ search, sort, page, limit: 20 });
  console.log(data)
  const { customers, total, pages } = data;

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setSearch(searchInput);
      setPage(1);
    }
  }, [searchInput]);

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search by name, phone, or email…"
            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 transition"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-xs text-gray-400">{total} customer{total !== 1 ? 's' : ''} found</p>
      )}

      {/* Desktop table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr className="text-xs text-gray-400 font-medium">
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Purchases</th>
              <th className="text-left px-4 py-3">Total spend</th>
              <th className="text-left px-4 py-3">Last purchase</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-50 dark:border-gray-700/50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" style={{ width: `${60 + (j * 13) % 30}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              : customers?.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-300 text-xs font-bold shrink-0">
                          {c.name?.slice(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{c.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700 dark:text-gray-300">{c.phone}</p>
                      {c.email && <p className="text-[10px] text-gray-400">{c.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {[c.lga, c.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{c.totalPurchases}</span>
                      <span className="text-[10px] text-gray-400 ml-1">car{c.totalPurchases !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-teal-700 dark:text-teal-400">
                      {formatShortNaira(c.totalSpend)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatRelative(c.lastPurchase)}</td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {!loading && customers?.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-200" />
            <p className="text-sm text-gray-400">No customers found</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))
          : customers.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-3.5 text-left hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-300 text-sm font-bold shrink-0">
                  {c.name?.slice(0, 2).toUpperCase() || 'NA'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{c.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{c.phone} · {c.totalPurchases} purchase{c.totalPurchases !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-400">{formatShortNaira(c.totalSpend)}</p>
                  <p className="text-[10px] text-gray-400">{formatRelative(c.lastPurchase)}</p>
                </div>
              </button>
            ))
        }
        {!loading && customers.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No customers found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Previous
          </button>
          <span className="text-xs text-gray-400">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-600 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Customer detail drawer */}
      {selected && <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}