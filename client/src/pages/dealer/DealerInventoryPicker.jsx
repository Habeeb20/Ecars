import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DealerInventoryPicker({ onConverted }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // the chosen listing, or null

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/car-listings/my-inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setListings(data.listings || []))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return <ConvertForm listing={selected} onBack={() => setSelected(null)} onConverted={onConverted} />;
  }

  if (loading) return <p className="text-sm text-slate-500 text-center py-8">Loading your inventory…</p>;

  if (listings.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">You don't have any active listings to convert yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Pick a listing to put on sale</h2>
      <p className="text-sm text-slate-500 mb-4">Choose one from your inventory — we'll reuse its details.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {listings.map((l) => (
          <button key={l._id} onClick={() => setSelected(l)}
            className="text-left rounded-xl border border-slate-200 overflow-hidden hover:border-slate-400 transition bg-white">
            <div className="aspect-video bg-slate-100">
              {l.images?.[0] && <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-900 truncate">{l.title}</p>
              <p className="text-xs text-slate-500">{l.make} {l.model} · {l.year}</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">₦{Number(l.price).toLocaleString()}</p>
              {l.saleType !== 'regular' && (
                <span className="inline-block mt-1 text-[11px] uppercase tracking-wide font-medium text-amber-700">
                  Already a {l.saleType} sale
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ConvertForm({ listing, onBack, onConverted }) {
  const [saleType, setSaleType] = useState('distress');
  const [price, setPrice] = useState('');
  const [saleReason, setSaleReason] = useState('');
  const [saleExpiresAt, setSaleExpiresAt] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (saleType === 'discount' && Number(price) >= listing.price) {
      setError('New price must be lower than the current price.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/car-listings/${listing._id}/convert-to-sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          saleType,
          price: saleType === 'discount' ? Number(price) : undefined,
          saleReason,
          saleExpiresAt: saleExpiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      onConverted?.(data.listing);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <button type="button" onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700">← Choose a different listing</button>

      <div className="flex items-center gap-3">
        {listing.images?.[0] && <img src={listing.images[0]} className="w-16 h-16 rounded-lg object-cover" alt="" />}
        <div>
          <p className="font-medium text-slate-900">{listing.title}</p>
          <p className="text-sm text-slate-500">Currently ₦{Number(listing.price).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['distress', 'discount'].map((type) => (
          <button key={type} type="button" onClick={() => setSaleType(type)}
            className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium capitalize
              ${saleType === type
                ? type === 'distress' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-slate-200 text-slate-500'}`}>
            {type}
          </button>
        ))}
      </div>

      {saleType === 'discount' && (
        <div>
          <label className="text-sm font-medium text-slate-700">New price (₦)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-slate-700">
          {saleType === 'distress' ? 'Why the urgent sale?' : 'Note about the discount'}
        </label>
        <textarea rows={2} value={saleReason} onChange={(e) => setSaleReason(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Sale ends (optional)</label>
        <input type="date" value={saleExpiresAt} onChange={(e) => setSaleExpiresAt(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={submitting}
        className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
        {submitting ? 'Converting…' : 'Put on sale'}
      </button>
    </form>
  );
}