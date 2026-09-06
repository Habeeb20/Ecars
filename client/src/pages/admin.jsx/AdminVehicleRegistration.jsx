import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Search, X, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const STATUS_OPTIONS = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminVehicleRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paidFilter, setPaidFilter] = useState('all'); // all | true | false
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (paidFilter !== 'all') params.set('paid', paidFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`${API_BASE}/vehicle-registrations/admin/all?${params}`, {
        headers: authHeaders,
      });
      const data = await res.json();

      if (data.success) {
        setRegistrations(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || 'Failed to load registrations');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, paidFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/vehicle-registrations/admin/${id}/status`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Status updated');
        setSelected(data.data);
        setRegistrations((prev) => prev.map((r) => (r._id === id ? data.data : r)));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Vehicle Registrations</h1>

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or plate number..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </form>

          <select
            value={paidFilter}
            onChange={(e) => {
              setPaidFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">All payments</option>
            <option value="true">Paid</option>
            <option value="false">Not paid</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-gray-400" size={28} />
            </div>
          ) : registrations.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">No registrations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Plate</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registrations.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.fullName}</td>
                      <td className="px-4 py-3 text-gray-500">
                        <div>{r.email}</div>
                        <div>{r.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {r.make} {r.model} ({r.year})
                      </td>
                      <td className="px-4 py-3 text-gray-500">{r.plateNumber}</td>
                      <td className="px-4 py-3">
                        {r.wantsToPay ? (
                          r.paid ? (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 size={14} /> Paid
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500">
                              <XCircle size={14} /> Unpaid
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400">Opted out</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[r.status]}`}
                        >
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(r)}
                          className="font-semibold text-primary-600 hover:text-primary-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && registrations.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-gray-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-gray-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <h3 className="mb-4 text-lg font-bold text-gray-900">{selected.fullName}</h3>

            <dl className="space-y-2 text-sm">
              <Row label="Email" value={selected.email} />
              <Row label="Phone" value={selected.phone} />
              <Row label="Vehicle" value={`${selected.make} ${selected.model} (${selected.year})`} />
              <Row label="Plate number" value={selected.plateNumber} />
              <Row label="Wants to pay" value={selected.wantsToPay ? 'Yes' : 'No'} />
              <Row label="Paid" value={selected.paid ? `Yes — ${new Date(selected.paidAt).toLocaleString()}` : 'No'} />
              {selected.paystackReference && <Row label="Paystack ref" value={selected.paystackReference} />}
              <Row label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
            </dl>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-400">
                Update status
              </label>
              <select
                value={selected.status}
                disabled={updating}
                onChange={(e) => updateStatus(selected._id, e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-50 pb-2">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-right font-medium text-gray-800">{value}</dd>
    </div>
  );
}