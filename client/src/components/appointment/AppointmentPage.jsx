import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CalendarDays, Phone, Mail, User, MapPin, Loader2, Check, X, MessageSquare } from 'lucide-react';

import { appointmentApi, formatDateTime } from '../../lib/appointment';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  declined: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  'no-show': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
};

const isUpcoming = (a, now) =>
  ['pending', 'confirmed'].includes(a.status) &&
  new Date(a.scheduledAt).getTime() + (a.durationMinutes || 30) * 60000 >= now;

const personName = (u) => (u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : 'Unknown');
const businessName = (u) =>
  u?.dealerInfo?.businessName ||
  u?.serviceProviderInfo?.businessName ||
  u?.carPartSellerInfo?.businessName ||
  personName(u);

export default function AppointmentsPage({ mode = 'client' }) {
  const isOwnerView = mode === 'owner';

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [busyId, setBusyId] = useState(null);
  const [reasonModal, setReasonModal] = useState(null); // { id, status, title }
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = isOwnerView ? await appointmentApi.received() : await appointmentApi.mine();
      setAppointments(res.data.appointments);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isOwnerView]);

  useEffect(() => {
    load();
  }, [load]);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const up = [];
    const pa = [];
    appointments.forEach((a) => (isUpcoming(a, now) ? up : pa).push(a));
    up.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    pa.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
    return { upcoming: up, past: pa };
  }, [appointments]);

  const pendingCount = upcoming.filter((a) => a.status === 'pending').length;
  const list = tab === 'upcoming' ? upcoming : past;

  const changeStatus = async (id, status, reasonText) => {
    try {
      setBusyId(id);
      const res = await appointmentApi.updateStatus(id, status, reasonText);
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data.appointment : a)));
      toast.success('Appointment updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitReason = async () => {
    const { id, status } = reasonModal;
    setReasonModal(null);
    await changeStatus(id, status, reason.trim());
    setReason('');
  };

  const openReason = (id, status, title) => {
    setReason('');
    setReasonModal({ id, status, title });
  };

  const btn = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50 sm:text-sm';

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 pb-16 pt-24 sm:px-6">
      <div className="mb-6">
        <h1 className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          {isOwnerView ? 'Viewing Requests' : 'My Viewings'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isOwnerView
            ? 'Manage viewing requests from buyers on your listings.'
            : 'Track the car viewings you have booked.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { key: 'past', label: 'Past', count: past.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-indigo-300'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {isOwnerView && pendingCount > 0 && tab === 'upcoming' && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          {pendingCount} request{pendingCount > 1 ? 's' : ''} waiting for your response
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <CalendarDays className="mx-auto mb-3 text-slate-400" size={36} />
          <p className="font-semibold text-slate-700 dark:text-slate-200">No {tab} viewings</p>
          {!isOwnerView && tab === 'upcoming' && (
            <Link to="/" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Browse cars to book one
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((a) => {
            const started = new Date(a.scheduledAt) <= new Date();
            const busy = busyId === a._id;
            const car = a.car;

            return (
              <div
                key={a._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="flex gap-3 sm:gap-4">
                  {car?.images?.[0] && (
                    <img src={car.images[0]} alt={car.title} className="h-20 w-24 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-32" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link
                        to={`/cars/${car?._id}`}
                        className="truncate text-base font-bold text-slate-900 hover:text-indigo-600 dark:text-white sm:text-lg"
                      >
                        {car?.title || 'Car listing'}
                      </Link>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    {car?.price && (
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        ₦{Number(car.price).toLocaleString()}
                      </p>
                    )}
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <CalendarDays size={15} className="shrink-0" />
                      {formatDateTime(a.scheduledAt)}
                    </p>
                    {car?.location?.state && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={13} className="shrink-0" />
                        {car.location.lga}, {car.location.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact details */}
                <div className="mt-4 space-y-1.5 rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900/50">
                  {isOwnerView ? (
                    <>
                      <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <User size={14} className="shrink-0" /> {personName(a.client)}
                      </p>
                      <a href={`tel:${a.phoneNumber}`} className="flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400">
                        <Phone size={14} className="shrink-0" /> {a.phoneNumber}
                      </a>
                      {a.client?.email && (
                        <p className="flex items-center gap-2 break-all text-slate-600 dark:text-slate-300">
                          <Mail size={14} className="shrink-0" /> {a.client.email}
                        </p>
                      )}
                      {a.note && (
                        <p className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <MessageSquare size={14} className="mt-0.5 shrink-0" /> {a.note}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <User size={14} className="shrink-0" /> {businessName(a.owner)}
                      </p>
                      {a.status === 'confirmed' && car?.phoneNumber && (
                        <a href={`tel:${car.phoneNumber}`} className="flex items-center gap-2 text-indigo-600 hover:underline dark:text-indigo-400">
                          <Phone size={14} className="shrink-0" /> {car.phoneNumber}
                        </a>
                      )}
                      {a.status === 'pending' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Waiting for the seller to confirm.</p>
                      )}
                    </>
                  )}
                  {a.statusReason && ['declined', 'cancelled'].includes(a.status) && (
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">Reason: {a.statusReason}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {isOwnerView ? (
                    <>
                      {a.status === 'pending' && !started && (
                        <button
                          disabled={busy}
                          onClick={() => changeStatus(a._id, 'confirmed')}
                          className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
                        >
                          {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Confirm
                        </button>
                      )}
                      {a.status === 'pending' && (
                        <button
                          disabled={busy}
                          onClick={() => openReason(a._id, 'declined', 'Decline this request')}
                          className={`${btn} border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10`}
                        >
                          <X size={15} /> Decline
                        </button>
                      )}
                      {a.status === 'confirmed' && !started && (
                        <button
                          disabled={busy}
                          onClick={() => openReason(a._id, 'cancelled', 'Cancel this viewing')}
                          className={`${btn} border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10`}
                        >
                          <X size={15} /> Cancel
                        </button>
                      )}
                      {a.status === 'confirmed' && started && (
                        <>
                          <button
                            disabled={busy}
                            onClick={() => changeStatus(a._id, 'completed')}
                            className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
                          >
                            <Check size={15} /> Mark completed
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => changeStatus(a._id, 'no-show')}
                            className={`${btn} border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700`}
                          >
                            No-show
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    ['pending', 'confirmed'].includes(a.status) &&
                    !started && (
                      <button
                        disabled={busy}
                        onClick={() => openReason(a._id, 'cancelled', 'Cancel your viewing')}
                        className={`${btn} border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10`}
                      >
                        {busy ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />} Cancel viewing
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reason modal (decline / cancel) */}
      {reasonModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReasonModal(null)} />
          <div className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl">
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{reasonModal.title}</h3>
            <textarea
              rows={3}
              maxLength={300}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Add a reason (optional)"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setReasonModal(null)}
                className={`${btn} flex-1 border border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200`}
              >
                Back
              </button>
              <button onClick={submitReason} className={`${btn} flex-1 bg-red-600 text-white hover:bg-red-700`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}