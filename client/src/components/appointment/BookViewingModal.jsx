import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { X, CalendarDays, Clock, Phone, MapPin, Loader2, MessageSquare } from 'lucide-react';
import {
  appointmentApi,
  getNextDays,
  buildSlots,
  dayRangeISO,
  formatTime,
  formatDateTime,
  MIN_LEAD_HOURS,
} from '../../lib/appointment';

const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export default function BookViewingModal({ car, open, onClose, onBooked }) {
  const navigate = useNavigate();
  const days = useMemo(() => getNextDays(), [open]);

  const [dateStr, setDateStr] = useState(days[0].dateStr);
  const [selectedSlot, setSelectedSlot] = useState(null); // ISO string
  const [booked, setBooked] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const slots = useMemo(() => buildSlots(dateStr), [dateStr]);

  // Reset every time the modal opens + lock background scroll
  useEffect(() => {
    if (!open) return;
    setDateStr(days[0].dateStr);
    setSelectedSlot(null);
    setNote('');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, days]);

  // Load already-booked slots for the chosen day
  useEffect(() => {
    if (!open || !car?._id) return;
    let cancelled = false;
    const { from, to } = dayRangeISO(dateStr);

    setLoadingSlots(true);
    appointmentApi
      .getAvailability(car._id, from, to)
      .then((res) => {
        if (!cancelled) {
          setBooked(new Set(res.data.bookedSlots.map((s) => new Date(s).getTime())));
        }
      })
      .catch(() => !cancelled && setBooked(new Set()))
      .finally(() => !cancelled && setLoadingSlots(false));

    return () => {
      cancelled = true;
    };
  }, [open, dateStr, car?._id, refreshKey]);

  if (!open || !car) return null;

  const earliest = Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000;

  const handleSubmit = async () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please log in to book a viewing');
      navigate('/login');
      return;
    }
    if (!selectedSlot) return toast.error('Please pick a date and time');
    if (!PHONE_REGEX.test(phone.trim())) return toast.error('Enter a valid phone number');

    try {
      setSubmitting(true);
      const res = await appointmentApi.create({
        carId: car._id,
        scheduledAt: selectedSlot,
        phoneNumber: phone.trim(),
        note: note.trim() || undefined,
      });
      toast.success('Viewing requested! The seller will confirm shortly.');
      onBooked?.(res.data.appointment);
      onClose();
    } catch (err) {
      toast.error(err.message);
      setSelectedSlot(null);
      setRefreshKey((k) => k + 1); // re-check availability (e.g. slot was just taken)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Book a viewing</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Car summary */}
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
            {car.images?.[0] && (
              <img src={car.images[0]} alt={car.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-white">{car.title}</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                ₦{Number(car.price).toLocaleString()}
              </p>
              {car.location?.state && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={12} />
                  {car.location.lga}, {car.location.state}
                </p>
              )}
            </div>
          </div>

          {/* Date picker */}
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Choose a date</p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map((d) => {
                const active = d.dateStr === dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => {
                      setDateStr(d.dateStr);
                      setSelectedSlot(null);
                    }}
                    className={`min-w-[62px] shrink-0 rounded-2xl border px-3 py-2.5 text-center transition-all ${
                      active
                        ? 'border-transparent bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="block text-[11px] font-medium uppercase opacity-80">{d.weekday}</span>
                    <span className="block text-lg font-bold leading-tight">{d.day}</span>
                    <span className="block text-[11px] opacity-80">{d.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Clock size={15} /> Choose a time
              {loadingSlots && <Loader2 size={14} className="animate-spin text-slate-400" />}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const iso = slot.toISOString();
                const unavailable = booked.has(slot.getTime()) || slot.getTime() < earliest;
                const active = selectedSlot === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setSelectedSlot(iso)}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-all sm:text-sm ${
                      unavailable
                        ? 'cursor-not-allowed border-transparent bg-slate-100 text-slate-400 line-through dark:bg-slate-800 dark:text-slate-600'
                        : active
                        ? 'border-transparent bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Times are in Lagos time (WAT). Struck-through slots are taken or too soon.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Your phone number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Message to seller <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3 top-3.5 text-slate-400" />
              <textarea
                rows={3}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. I'd like to test drive it too."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          {selectedSlot && (
            <p className="mb-2 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
              {formatDateTime(selectedSlot)}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CalendarDays size={18} />}
            {submitting ? 'Requesting...' : 'Request viewing'}
          </button>
        </div>
      </div>
    </div>
  );
}