import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SalesFeed() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'distress' | 'discount'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = filter === 'all' ? '' : `?type=${filter}`;
    fetch(`${API_BASE}/car-listings/sales${query}`)
      .then((res) => res.json())
      .then((data) => setListings(data.listings || []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Distress & discount sales</h1>
        <div className="flex gap-2">
          {['all', 'distress', 'discount'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize
                ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 text-center py-16">Loading listings…</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-16">No sale listings right now — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {listings.map((l) => <SaleCard key={l._id} listing={l} />)}
        </div>
      )}
    </div>
  );
}

function SaleCard({ listing }) {
  const isDiscount = listing.saleType === 'discount';
  const pct = isDiscount && listing.originalPrice
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/cars/${listing._id}`} className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition block">
      <div className="relative aspect-video bg-slate-100">
        {listing.images?.[0] && <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />}
        <span className={`absolute top-2 left-2 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md
          ${isDiscount ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
          {isDiscount ? `${pct}% off` : 'Distress sale'}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 truncate">{listing.title}</p>
        <p className="text-xs text-slate-500">{listing.make} {listing.model} · {listing.year}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-900">₦{Number(listing.price).toLocaleString()}</span>
          {isDiscount && listing.originalPrice && (
            <span className="text-xs text-slate-400 line-through">₦{Number(listing.originalPrice).toLocaleString()}</span>
          )}
        </div>
        {listing.saleReason && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{listing.saleReason}</p>}
      </div>
    </Link>
  );
}