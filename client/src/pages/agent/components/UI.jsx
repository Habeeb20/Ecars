/* eslint-disable no-unused-vars */
// Shared bits for the agent and admin-agent screens
import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { errMsg } from '../../../api/agentApi';

export const naira = (n = 0) => '₦' + Number(n || 0).toLocaleString('en-NG');
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const fullName = (u) => (u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '—');

export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fn());
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, reload: run };
}

export function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-slate-500 text-sm">
    <Loader2 className="h-4 w-4 animate-spin" /> {label}
  </div>
);

export const ErrorBox = ({ message, onRetry }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
    <span>{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="font-semibold underline underline-offset-2">
        Retry
      </button>
    )}
  </div>
);

export const Empty = ({ title, hint, action }) => (
  <div className="flex flex-col items-center text-center py-14 px-6">
    <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <Inbox className="h-5 w-5 text-slate-400" />
    </div>
    <p className="font-semibold text-slate-800">{title}</p>
    {hint && <p className="text-sm text-slate-500 mt-1 max-w-sm">{hint}</p>}
    {action}
  </div>
);

const PILLS = {
  active: ['Active', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  inactive: ['Not used yet', 'bg-amber-50 text-amber-700 ring-amber-600/20'],
  pending: ['Pending', 'bg-amber-50 text-amber-700 ring-amber-600/20'],
  approved: ['Approved', 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'],
  paid: ['Paid', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  rejected: ['Rejected', 'bg-red-50 text-red-700 ring-red-600/20'],
  available: ['Available', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  requested: ['Requested', 'bg-amber-50 text-amber-700 ring-amber-600/20'],
  verified: ['Verified', 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'],
  unverified: ['Not verified', 'bg-slate-100 text-slate-600 ring-slate-500/20'],
  client: ['Client', 'bg-sky-50 text-sky-700 ring-sky-600/20'],
  user: ['Buyer', 'bg-sky-50 text-sky-700 ring-sky-600/20'],
  dealer: ['Dealer', 'bg-violet-50 text-violet-700 ring-violet-600/20'],
  'service-provider': ['Service provider', 'bg-orange-50 text-orange-700 ring-orange-600/20'],
  'carPart-seller': ['Parts seller', 'bg-teal-50 text-teal-700 ring-teal-600/20'],
  driver: ['Driver', 'bg-violet-50 text-violet-700 ring-violet-600/20'],
};

export const Pill = ({ kind }) => {
  const [label, cls] = PILLS[kind] || [kind, 'bg-slate-100 text-slate-600 ring-slate-500/20'];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
};

export const Card = ({ className = '', children }) => (
  <div className={`rounded-2xl bg-white border border-slate-200/80 ${className}`}>{children}</div>
);

export const PageHeader = ({ title, subtitle, right }) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {right}
  </div>
);

export const Stat = ({ label, value, hint, tone = 'default' }) => {
  const tones = { default: 'text-slate-900', good: 'text-emerald-700', warn: 'text-amber-700' };
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${tones[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </Card>
  );
};

export const FilterTabs = ({ value, onChange, options }) => (
  <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1 flex-wrap">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
          value === o.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const Pager = ({ meta, onPage }) => {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
      <span>
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="flex gap-2">
        <button
          disabled={meta.page <= 1}
          onClick={() => onPage(meta.page - 1)}
          className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPage(meta.page + 1)}
          className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const Th = ({ children, right }) => (
  <th className={`px-4 py-3 text-xs font-semibold text-slate-500 ${right ? 'text-right' : 'text-left'} whitespace-nowrap`}>
    {children}
  </th>
);
export const Td = ({ children, right, className = '' }) => (
  <td className={`px-4 py-3 ${right ? 'text-right tabular-nums' : ''} ${className}`}>{children}</td>
);

const SOURCE_LABELS = {
  listing_verified: 'First verified listing',
  car_sold: 'First car sold',
  credits_purchase: 'First credits purchase',
};
export const earningLabel = (e) =>
  e.type === 'signup' ? 'Signup' : SOURCE_LABELS[e.source] || 'Started using account';