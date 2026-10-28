/* eslint-disable no-unused-vars */
// Admin: how many users each agent signed up — today, yesterday, this week,
// last week, last month and last year — with charts and a per-agent breakdown.
// Mount it in your admin dashboard, e.g. {tab === 'agent-signups' && <AgentSignupsDashboard />}
import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, TrendingUp, TrendingDown, Minus, Trophy, Users, UserCheck } from 'lucide-react';
import { adminAgentApi } from '../../api/agentApi';
import {
  fmtDate, fullName, useAsync, useDebounced, Spinner, ErrorBox, Empty,
  Pill, Card, PageHeader, FilterTabs,
} from '../agent/components/UI';

/* ----------------------------- Date periods ------------------------------ */
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`;
};
const short = (d) => d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });

// Weeks run Monday → Sunday. Last month / last year are full calendar periods.
const buildPeriods = (now = new Date()) => {
  const today = startOfDay(now);
  const weekStart = addDays(today, -((today.getDay() + 6) % 7));
  const y = today.getFullYear();
  const m = today.getMonth();
  const list = [
    { key: 'today', label: 'Today', from: today, to: addDays(today, 1), hint: short(today) },
    { key: 'yesterday', label: 'Yesterday', from: addDays(today, -1), to: today, hint: short(addDays(today, -1)) },
    { key: 'thisWeek', label: 'This week', from: weekStart, to: addDays(weekStart, 7), hint: `${short(weekStart)} – ${short(addDays(weekStart, 6))}` },
    { key: 'lastWeek', label: 'Last week', from: addDays(weekStart, -7), to: weekStart, hint: `${short(addDays(weekStart, -7))} – ${short(addDays(weekStart, -1))}` },
    { key: 'lastMonth', label: 'Last month', from: new Date(y, m - 1, 1), to: new Date(y, m, 1), hint: new Date(y, m - 1, 1).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) },
    { key: 'lastYear', label: 'Last year', from: new Date(y - 1, 0, 1), to: new Date(y, 0, 1), hint: String(y - 1) },
  ];
  return list;
};

const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9', '#8b5cf6', '#ef4444', '#14b8a6'];
const roleLabel = (r) => (r ? String(r).replace(/[_-]/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : 'Unknown');

/* ------------------------------ Data loading ----------------------------- */
// Loads every agent, then each agent's referrals (which carry createdAt, role, activated).
const loadAll = async () => {
  const list = await adminAgentApi.agents({});
  const agents = list?.data || [];
  return Promise.all(
    agents.map((a) =>
      adminAgentApi
        .agent(a._id)
        .then((r) => ({ ...a, referrals: r?.data?.referrals || [] }))
        .catch(() => ({ ...a, referrals: [], failed: true }))
    )
  );
};

/* ------------------------------ Small pieces ----------------------------- */
const Delta = ({ cur, prev, label }) => {
  if (cur === 0 && prev === 0) {
    return <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Minus size={12} /> no change</span>;
  }
  if (prev === 0) {
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><TrendingUp size={12} /> new {label}</span>;
  }
  const pct = Math.round(((cur - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? '+' : ''}{pct}% {label}
    </span>
  );
};

const PeriodCard = ({ period, value, activated, delta, active, onClick, accent }) => (
  <button
    onClick={onClick}
    className={`text-left rounded-2xl p-4 border transition-all bg-white hover:-translate-y-0.5 hover:shadow-md ${
      active ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-md' : 'border-slate-200'
    }`}
  >
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{period.label}</p>
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
    </div>
    <p className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">{value}</p>
    <p className="text-[11px] text-slate-400 mt-0.5">{period.hint}</p>
    <div className="mt-2 min-h-[16px]">{delta}</div>
    <p className="text-[11px] text-slate-500 mt-1">{activated} active account{activated === 1 ? '' : 's'}</p>
  </button>
);

/* -------------------------------- Charts --------------------------------- */
// 1) Totals per period — vertical bars
const PeriodBarChart = ({ periods, totals, selected, onSelect }) => {
  const W = 620, H = 250, pad = { t: 28, r: 12, b: 38, l: 36 };
  const max = Math.max(1, ...totals);
  const niceMax = Math.ceil(max / 4) * 4 || 4;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const slot = innerW / periods.length;
  const barW = Math.min(52, slot * 0.58);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="barGradDim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = pad.t + innerH - (innerH * i) / 4;
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 4" />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{Math.round((niceMax * i) / 4)}</text>
          </g>
        );
      })}
      {periods.map((p, i) => {
        const h = (totals[i] / niceMax) * innerH;
        const x = pad.l + slot * i + (slot - barW) / 2;
        const y = pad.t + innerH - h;
        const isSel = p.key === selected;
        return (
          <g key={p.key} className="cursor-pointer" onClick={() => onSelect(p.key)}>
            <rect x={x} y={pad.t} width={barW} height={innerH} fill="transparent" />
            <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx="8" fill={isSel ? 'url(#barGrad)' : 'url(#barGradDim)'} />
            <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b">{totals[i]}</text>
            <text x={x + barW / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight={isSel ? 700 : 500} fill={isSel ? '#4338ca' : '#64748b'}>{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// 2) Daily trend, last 30 days — area + line
const TrendChart = ({ days }) => {
  const W = 620, H = 220, pad = { t: 16, r: 14, b: 28, l: 34 };
  const max = Math.max(1, ...days.map((d) => d.count));
  const niceMax = Math.ceil(max / 4) * 4 || 4;
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const pts = days.map((d, i) => [
    pad.l + (innerW * i) / Math.max(1, days.length - 1),
    pad.t + innerH - (d.count / niceMax) * innerH,
  ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${pad.t + innerH} L${pts[0][0]},${pad.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = pad.t + innerH - (innerH * i) / 4;
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 4" />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{Math.round((niceMax * i) / 4)}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={days[i].count ? 3.5 : 2} fill="#fff" stroke="#4f46e5" strokeWidth="2">
          <title>{`${short(days[i].date)}: ${days[i].count} user${days[i].count === 1 ? '' : 's'}`}</title>
        </circle>
      ))}
      {days.map((d, i) =>
        i % 5 === 0 || i === days.length - 1 ? (
          <text key={i} x={pts[i][0]} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{short(d.date)}</text>
        ) : null
      )}
    </svg>
  );
};

// 3) Role split — donut
const Donut = ({ slices, total }) => {
  const r = 56, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 150 150" className="w-40 h-40 shrink-0">
        <circle cx="75" cy="75" r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
        {total > 0 && slices.map((s) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={s.label} cx="75" cy="75" r={r} fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform="rotate(-90 75 75)"
            >
              <title>{`${s.label}: ${s.value}`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
        <text x="75" y="73" textAnchor="middle" fontSize="26" fontWeight="800" fill="#0f172a">{total}</text>
        <text x="75" y="90" textAnchor="middle" fontSize="10" fill="#94a3b8">users</text>
      </svg>
      <ul className="w-full space-y-2">
        {slices.length === 0 && <li className="text-sm text-slate-400">No users in this period</li>}
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />{s.label}
            </span>
            <span className="tabular-nums text-slate-900 font-semibold">
              {s.value} <span className="text-xs font-normal text-slate-400">({Math.round((s.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 4) Agent leaderboard — horizontal stacked bars (stacked by user type)
const Leaderboard = ({ rows, periodKey, roleColor }) => {
  const ranked = rows.filter((a) => a.counts[periodKey] > 0).sort((a, b) => b.counts[periodKey] - a.counts[periodKey]).slice(0, 10);
  const max = Math.max(1, ...ranked.map((a) => a.counts[periodKey]));
  if (ranked.length === 0) return <p className="text-sm text-slate-400 py-6 text-center">No agent signed up a user in this period.</p>;
  return (
    <ul className="space-y-3">
      {ranked.map((a, i) => (
        <li key={a._id}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-2 font-medium text-slate-800 truncate">
              {i === 0 ? <Trophy size={14} className="text-amber-500 shrink-0" /> : <span className="w-3.5 text-xs text-slate-400 shrink-0">{i + 1}</span>}
              <span className="truncate">{a.name}</span>
            </span>
            <span className="tabular-nums font-bold text-slate-900">{a.counts[periodKey]}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex" style={{ width: `${(a.counts[periodKey] / max) * 100}%`, minWidth: 12 }}>
            {Object.entries(a.roles[periodKey]).map(([role, n]) => (
              <div key={role} title={`${roleLabel(role)}: ${n}`} style={{ width: `${(n / a.counts[periodKey]) * 100}%`, background: roleColor[role] }} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

// 5) All agents × all periods — grouped mini bars
const AgentPeriodChart = ({ rows, periods }) => {
  const top = [...rows].sort((a, b) => b.total - a.total).slice(0, 8);
  const max = Math.max(1, ...top.flatMap((a) => periods.map((p) => a.counts[p.key])));
  const shades = ['#4f46e5', '#818cf8', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b'];
  if (top.length === 0) return null;
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        {periods.map((p, i) => (
          <span key={p.key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: shades[i] }} />{p.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="flex items-end gap-5 min-w-max pb-1" style={{ height: 210 }}>
          {top.map((a) => (
            <div key={a._id} className="flex flex-col items-center justify-end h-full">
              <div className="flex items-end gap-1 flex-1">
                {periods.map((p, i) => {
                  const v = a.counts[p.key];
                  return (
                    <div
                      key={p.key}
                      title={`${a.name} · ${p.label}: ${v}`}
                      className="w-3.5 rounded-t-md transition-all hover:opacity-80"
                      style={{ height: `${Math.max((v / max) * 100, v ? 4 : 1)}%`, background: shades[i], opacity: v ? 1 : 0.25 }}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 w-24 truncate text-center">{a.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------- Main ----------------------------------- */
const AgentStats = () => {
  const { data, loading, error, reload } = useAsync(loadAll, []);
  const [selected, setSelected] = useState('today');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('thisWeek');
  const [expanded, setExpanded] = useState(null);
  const q = useDebounced(search);

  const periods = useMemo(() => buildPeriods(), []);
  const period = periods.find((p) => p.key === selected);

  const { rows, totals, activatedTotals, roleTotals, roleColor, days } = useMemo(() => {
    const agents = data || [];
    const roleSet = new Set();
    agents.forEach((a) => a.referrals.forEach((r) => roleSet.add(r.userRole || 'unknown')));
    const roleColor = {};
    [...roleSet].forEach((r, i) => { roleColor[r] = PALETTE[i % PALETTE.length]; });

    const totals = {}, activatedTotals = {}, roleTotals = {};
    periods.forEach((p) => { totals[p.key] = 0; activatedTotals[p.key] = 0; roleTotals[p.key] = {}; });

    const rows = agents.map((a) => {
      const counts = {}, activated = {}, roles = {}, users = {};
      periods.forEach((p) => { counts[p.key] = 0; activated[p.key] = 0; roles[p.key] = {}; users[p.key] = []; });
      a.referrals.forEach((r) => {
        const t = new Date(r.createdAt).getTime();
        const role = r.userRole || 'unknown';
        periods.forEach((p) => {
          if (t >= p.from.getTime() && t < p.to.getTime()) {
            counts[p.key] += 1;
            if (r.activated) activated[p.key] += 1;
            roles[p.key][role] = (roles[p.key][role] || 0) + 1;
            users[p.key].push(r);
            totals[p.key] += 1;
            if (r.activated) activatedTotals[p.key] += 1;
            roleTotals[p.key][role] = (roleTotals[p.key][role] || 0) + 1;
          }
        });
      });
      Object.values(users).forEach((list) => list.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)));
      return { ...a, name: fullName(a), counts, activated, roles, users, total: a.referrals.length };
    });

    // last 30 days, all agents combined
    const today = startOfDay(new Date());
    const byDay = {};
    agents.forEach((a) => a.referrals.forEach((r) => { const k = dayKey(r.createdAt); byDay[k] = (byDay[k] || 0) + 1; }));
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = addDays(today, i - 29);
      return { date, count: byDay[dayKey(date)] || 0 };
    });

    return { rows, totals, activatedTotals, roleTotals, roleColor, days };
  }, [data, periods]);

  const filtered = useMemo(() => {
    const term = (q || '').trim().toLowerCase();
    return rows
      .filter((a) => !term || a.name.toLowerCase().includes(term) || (a.email || '').toLowerCase().includes(term))
      .sort((a, b) => (sortKey === 'total' ? b.total - a.total : b.counts[sortKey] - a.counts[sortKey]));
  }, [rows, q, sortKey]);

  const colMax = useMemo(() => {
    const m = { total: 1 };
    periods.forEach((p) => { m[p.key] = Math.max(1, ...rows.map((a) => a.counts[p.key])); });
    m.total = Math.max(1, ...rows.map((a) => a.total));
    return m;
  }, [rows, periods]);

  const donutSlices = Object.entries(roleTotals[selected] || {})
    .map(([role, value]) => ({ label: roleLabel(role), value, color: roleColor[role] }))
    .sort((a, b) => b.value - a.value);

  const accents = ['#4f46e5', '#818cf8', '#0ea5e9', '#38bdf8', '#10b981', '#f59e0b'];
  const heat = (v, max) => (v ? { background: `rgba(99,102,241,${0.07 + (v / max) * 0.22})` } : undefined);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const failedCount = rows.filter((a) => a.failed).length;

  return (
    <>
      <PageHeader
        title="Agent signups"
        subtitle="How many users every agent has signed up — today, yesterday, this week, last week, last month and last year."
      />

      {failedCount > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-2.5">
          Couldn't load users for {failedCount} agent{failedCount === 1 ? '' : 's'}; their numbers show as 0.
        </div>
      )}

      {/* Period summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {periods.map((p, i) => (
          <PeriodCard
            key={p.key}
            period={p}
            value={totals[p.key]}
            activated={activatedTotals[p.key]}
            accent={accents[i]}
            active={selected === p.key}
            onClick={() => setSelected(p.key)}
            delta={
              p.key === 'today' ? <Delta cur={totals.today} prev={totals.yesterday} label="vs yesterday" />
              : p.key === 'thisWeek' ? <Delta cur={totals.thisWeek} prev={totals.lastWeek} label="vs last week" />
              : null
            }
          />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900">Signups by period</h3>
          <p className="text-xs text-slate-500 mb-3">All agents combined. Click a bar to focus the charts below.</p>
          <PeriodBarChart periods={periods} totals={periods.map((p) => totals[p.key])} selected={selected} onSelect={setSelected} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900">Last 30 days</h3>
          <p className="text-xs text-slate-500 mb-3">Daily signups across every agent.</p>
          <TrendChart days={days} />
        </Card>
      </div>

      {/* Focus period */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-8 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">Breakdown · {period.label}</h3>
          <p className="text-xs text-slate-500">{period.hint}</p>
        </div>
        <FilterTabs value={selected} onChange={setSelected} options={periods.map((p) => ({ value: p.key, label: p.label }))} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-4">
        <Card className="p-5 xl:col-span-3">
          <h3 className="font-semibold text-slate-900 mb-1">Top agents</h3>
          <p className="text-xs text-slate-500 mb-4">Bars are split by the type of user signed up.</p>
          <Leaderboard rows={rows} periodKey={selected} roleColor={roleColor} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5 pt-4 border-t border-slate-100">
            {Object.entries(roleColor).map(([role, color]) => (
              <span key={role} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />{roleLabel(role)}
              </span>
            ))}
          </div>
        </Card>
        <Card className="p-5 xl:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">User types</h3>
          <Donut slices={donutSlices} total={totals[selected]} />
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600"><UserCheck size={15} className="text-emerald-600" /> Using their account</span>
            <span className="font-semibold tabular-nums">
              {activatedTotals[selected]} / {totals[selected]}
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-slate-900 mb-1">Every period, top agents</h3>
        <p className="text-xs text-slate-500 mb-4">The eight agents with the most signups overall, compared across all six periods.</p>
        <AgentPeriodChart rows={rows} periods={periods} />
      </Card>

      {/* Detailed table */}
      <Card>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">All agents</h3>
            <p className="text-xs text-slate-500">Click a column to sort. Click a row to see the users behind the number for {period.label.toLowerCase()}.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Empty title="No agents found" hint="Agents appear here once they sign up with the Agent role." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Agent</th>
                  {periods.map((p) => (
                    <th
                      key={p.key}
                      onClick={() => setSortKey(p.key)}
                      className={`px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide cursor-pointer whitespace-nowrap select-none ${sortKey === p.key ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {p.label}{sortKey === p.key && ' ↓'}
                    </th>
                  ))}
                  <th
                    onClick={() => setSortKey('total')}
                    className={`px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide cursor-pointer whitespace-nowrap select-none ${sortKey === 'total' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    All time{sortKey === 'total' && ' ↓'}
                  </th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => {
                  const open = expanded === a._id;
                  const list = a.users[selected];
                  return (
                    <React.Fragment key={a._id}>
                      <tr onClick={() => setExpanded(open ? null : a._id)} className="cursor-pointer hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{a.name}</p>
                          <p className="text-xs text-slate-500">{a.email}</p>
                        </td>
                        {periods.map((p) => (
                          <td key={p.key} className="px-3 py-3 text-right tabular-nums font-medium text-slate-800" style={heat(a.counts[p.key], colMax[p.key])}>
                            {a.counts[p.key] || <span className="text-slate-300">0</span>}
                          </td>
                        ))}
                        <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900" style={heat(a.total, colMax.total)}>{a.total}</td>
                        <td className="pr-3"><ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} /></td>
                      </tr>

                      {open && (
                        <tr>
                          <td colSpan={periods.length + 3} className="bg-slate-50/70 px-4 py-4">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 mr-1">{period.label}:</span>
                              <span className="text-sm font-semibold text-slate-800">{a.counts[selected]} user{a.counts[selected] === 1 ? '' : 's'}</span>
                              <span className="text-xs text-slate-400">·</span>
                              <span className="text-sm text-slate-600">{a.activated[selected]} active</span>
                              {Object.entries(a.roles[selected]).map(([role, n]) => (
                                <span key={role} className="inline-flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-700">
                                  <span className="w-2 h-2 rounded-full" style={{ background: roleColor[role] }} />{roleLabel(role)} · {n}
                                </span>
                              ))}
                            </div>
                            {list.length === 0 ? (
                              <p className="text-sm text-slate-400">No users signed up in this period.</p>
                            ) : (
                              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                {list.map((r) => (
                                  <li key={r._id} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-slate-900 truncate">{fullName(r.user)}</p>
                                      <p className="text-xs text-slate-500 truncate">{r.user?.email} · {fmtDate(r.createdAt)}</p>
                                    </div>
                                    <div className="flex gap-1.5 shrink-0">
                                      <Pill kind={r.userRole} />
                                      <Pill kind={r.activated ? 'active' : 'inactive'} />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50/70 border-t border-slate-200">
                <tr>
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Total</td>
                  {periods.map((p) => (
                    <td key={p.key} className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{totals[p.key]}</td>
                  ))}
                  <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{rows.reduce((s, a) => s + a.total, 0)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default AgentStats;