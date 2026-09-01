import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { BadgeCheck, ShieldOff, Loader2, User, Calendar, MapPin, Search } from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_URL;

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Verified', value: 'true' },
  { label: 'Unverified', value: 'false' },
];

export default function AdminCarVerification() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/cars`, {
        params: { page, verified: verifiedFilter || undefined, search: search || undefined },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data.data);
      setPages(res.data.pages);
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, [page, verifiedFilter, search, token]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleToggleVerify = async (car) => {
    const endpoint = car.isVerified ? 'unverify' : 'verify';
    setActionLoadingId(car._id);
    try {
      const res = await axios.put(
        `${backendUrl}/api/cars/${car._id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setCars((prev) =>
        prev.map((c) => (c._id === car._id ? { ...c, isVerified: !c.isVerified } : c))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Manage Car Listings
        </h1>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search title, make, model..."
            className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0B1B3E]/20"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setPage(1);
              setVerifiedFilter(f.value);
            }}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              verifiedFilter === f.value
                ? 'bg-[#0B1B3E] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BadgeCheck size={40} className="mx-auto mb-3 opacity-40" />
          <p>No cars found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cars.map((car) => (
            <div
              key={car._id}
              className="border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900"
            >
              <div className="relative h-44 bg-gray-100 dark:bg-gray-800">
                {car.images?.[0] && (
                  <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                )}
                <span
                  className={`absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                    car.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {car.isVerified && <BadgeCheck size={11} />}
                  {car.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{car.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {car.year} · {car.make} {car.model}
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  ₦{car.price?.toLocaleString()}
                </p>

                <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <User size={13} /> {car.postedBy?.name || 'Unknown seller'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {car.location?.lga}, {car.location?.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> Posted {new Date(car.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleVerify(car)}
                  disabled={actionLoadingId === car._id}
                  className={`w-full flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${
                    car.isVerified
                      ? 'border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-600'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {actionLoadingId === car._id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : car.isVerified ? (
                    <ShieldOff size={16} />
                  ) : (
                    <BadgeCheck size={16} />
                  )}
                  {car.isVerified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                p === page ? 'bg-[#0B1B3E] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}