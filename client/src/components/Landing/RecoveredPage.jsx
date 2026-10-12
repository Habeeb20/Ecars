import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, MapPin, Eye, RefreshCw, Car, Hash } from 'lucide-react';

/* Set this to your cars endpoint if you have one. It accepts either a list of cars
   or a list of sightings (cars are read from each sighting's populated reportId). */
const ENDPOINT = '/sighting/sightings';

const STATUS_STYLES = {
  recovered: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30',
  found: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/30',
  stolen: 'bg-red-400/10 text-red-300 ring-red-400/30',
  missing: 'bg-red-400/10 text-red-300 ring-red-400/30',
  pending: 'bg-amber-400/10 text-amber-300 ring-amber-400/30',
  under_review: 'bg-sky-400/10 text-sky-300 ring-sky-400/30',
};
const statusCls = (s) => STATUS_STYLES[s] || 'bg-slate-400/10 text-slate-300 ring-slate-400/30';
const prettyStatus = (s) => (s ? s.replace(/_/g, ' ') : 'unknown');

/* Turns sightings (or plain cars) into a unique list of cars */
function normalize(list) {
  const map = new Map();
  list.forEach((item) => {
    const isSighting = item && Object.prototype.hasOwnProperty.call(item, 'reportId');
    const car = isSighting ? (item.reportId && typeof item.reportId === 'object' ? item.reportId : null) : item;
    if (!car || !car._id) return;

    const entry = map.get(car._id) || { ...car, sightings: 0, lastSeen: '', lastSeenAt: 0 };
    if (isSighting) {
      entry.sightings += 1;
      const t = item.createdAt ? new Date(item.createdAt).getTime() : 0;
      if (t >= entry.lastSeenAt) {
        entry.lastSeenAt = t;
        entry.lastSeen = typeof item.locationSeen === 'string' ? item.locationSeen : '';
      }
    }
    map.set(car._id, entry);
  });
  return [...map.values()];
}

/* ---------- small pieces ---------- */
const PlateBadge = ({ plate }) => (
  <div className="inline-flex items-center overflow-hidden rounded-md border-2 border-slate-200 bg-amber-50 shadow-sm">
    <span className="bg-emerald-700 px-1.5 py-1 text-[9px] font-bold leading-none text-white">NG</span>
    <span className="px-3 py-1 font-mono text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">
      {plate || 'NO PLATE'}
    </span>
  </div>
);

const CarCard = ({ car }) => (
  <li className="group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40 hover:shadow-xl hover:shadow-amber-400/5">
    <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400" />

    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20">
            <Car className="h-5 w-5" />
          </span>
          <h3 className="line-clamp-2 break-words text-base font-bold leading-snug text-white">
            {car.title || 'Untitled vehicle'}
          </h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${statusCls(car.status)}`}>
          {prettyStatus(car.status)}
        </span>
      </div>

      <PlateBadge plate={car.plateNumber} />

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
          <dt className="flex items-center gap-1.5 text-slate-400"><Hash className="h-3.5 w-3.5" /> VIN</dt>
          <dd className="truncate font-mono text-xs text-slate-200">{car.vin || 'N/A'}</dd>
        </div>
        {car.sightings > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
            <dt className="flex items-center gap-1.5 text-slate-400"><Eye className="h-3.5 w-3.5" /> Sightings</dt>
            <dd className="font-semibold text-amber-300">{car.sightings}</dd>
          </div>
        )}
        {car.lastSeen && (
          <div className="flex items-start justify-between gap-3">
            <dt className="flex shrink-0 items-center gap-1.5 text-slate-400"><MapPin className="h-3.5 w-3.5" /> Last seen</dt>
            <dd className="text-right text-slate-200">{car.lastSeen}</dd>
          </div>
        )}
      </dl>
    </div>
  </li>
);

const SkeletonCard = () => (
  <li className="animate-pulse space-y-4 rounded-2xl bg-slate-900 p-5 ring-1 ring-white/10">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-slate-800" />
      <div className="h-4 w-2/3 rounded bg-slate-800" />
    </div>
    <div className="h-7 w-36 rounded bg-slate-800" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-slate-800" />
      <div className="h-3 w-4/5 rounded bg-slate-800" />
    </div>
  </li>
);

/* ---------- page ---------- */
export default function RecoveredCarsPage() {
  const [cars, setCars] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const load = useCallback(async (signal) => {
    try {
      setError('');
      setCars(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${ENDPOINT}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
      });
      if (!res.ok) throw new Error('Could not load recovered vehicles');
      const body = await res.json();
      if (body.status && body.status !== 'success') throw new Error(body.message || 'Could not load vehicles');
      const d = body.data;
      const list = d?.sightings || d?.cars || d?.vehicles || (Array.isArray(d) ? d : []);
      setCars(normalize(list));
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Something went wrong');
      setCars([]);
    }
  }, []);

  useEffect(() => {
    const c = new AbortController();
    load(c.signal);
    return () => c.abort();
  }, [load]);

  const statuses = useMemo(() => [...new Set((cars || []).map((c) => c.status).filter(Boolean))], [cars]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (cars || []).filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (!q) return true;
      return [c.title, c.plateNumber, c.vin].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [cars, query, status]);

  const chip = (active) =>
    `h-9 shrink-0 rounded-full px-4 text-xs font-semibold capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
      active ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10'
    }`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* hero */}
      <header className="relative isolate overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]"
        />
        <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full border border-amber-400/20" />
        <div aria-hidden="true" className="absolute -right-4 -top-8 -z-10 h-44 w-44 rounded-full border border-amber-400/30" />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300 ring-1 ring-amber-400/30">
            <ShieldCheck className="h-4 w-4" /> Vehicle recovery
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Stolen. Found. <span className="text-amber-300">Back on the road.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Vehicles reported by the community and tracked through our recovery process.
          </p>

          {cars && cars.length > 0 && (
            <dl className="mt-7 flex gap-8">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">Vehicles</dt>
                <dd className="text-3xl font-extrabold text-amber-300">{cars.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-400">Sightings</dt>
                <dd className="text-3xl font-extrabold text-amber-300">{cars.reduce((n, c) => n + (c.sightings || 0), 0)}</dd>
              </div>
            </dl>
          )}
        </div>
        <div aria-hidden="true" className="h-1.5 w-full opacity-80 [background-image:repeating-linear-gradient(90deg,#fbbf24_0_32px,transparent_32px_64px)]" />
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* toolbar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by plate number, VIN or name"
              className="h-12 w-full rounded-xl bg-slate-900 pl-11 pr-4 text-sm text-white placeholder-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            />
          </div>

          {statuses.length > 1 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" onClick={() => setStatus('all')} className={chip(status === 'all')}>All</button>
              {statuses.map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)} className={chip(status === s)}>
                  {prettyStatus(s)}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-400/30">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => load()}
              className="inline-flex items-center gap-2 rounded-lg bg-red-400/20 px-3 py-1.5 font-semibold hover:bg-red-400/30"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {/* grid */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars === null
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visible.map((car) => <CarCard key={car._id} car={car} />)}
        </ul>

        {cars && !error && visible.length === 0 && (
          <div className="rounded-2xl bg-slate-900 px-6 py-14 text-center ring-1 ring-white/10">
            <Car className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 font-semibold text-white">No vehicles found</p>
            <p className="mt-1 text-sm text-slate-400">
              {cars.length === 0 ? 'Nothing has been reported yet.' : 'Try a different search or filter.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}