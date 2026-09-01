// components/VideoCreditBanner.jsx
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function VideoCreditBanner({ onCreditsChange }) {
  const [credits, setCredits] = useState(null);
  const [buying, setBuying] = useState(false);
  const packPrice = 5000;
  const packCredits = 10;

  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/video-credits/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setCredits(data.videoCredits);
      onCreditsChange?.(data.videoCredits);
    }
  };

  useEffect(() => { fetchBalance(); }, []);

  const handleBuy = async () => {
    try {
      setBuying(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/video-credits/initialize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      window.location.href = data.authorization_url; // redirect to Paystack checkout
    } catch (err) {
      toast.error(err.message);
      setBuying(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {credits === null ? 'Loading…' : `${credits} video ${credits === 1 ? 'credit' : 'credits'} left`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">₦{packPrice.toLocaleString()} = {packCredits} video posts</p>
      </div>
      {credits === 0 && (
        <button onClick={handleBuy} disabled={buying}
          className="rounded-lg bg-slate-900 text-white text-sm px-4 py-2 font-medium disabled:opacity-50">
          {buying ? 'Redirecting…' : `Buy ${packCredits} credits`}
        </button>
      )}
    </div>
  );
}