/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Loader2,
  Search,
  ShieldCheck,
  MapPin,
  Star,
  Package,
  Phone,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

// Debounce any fast-changing value so we don't fire a request per keystroke.
const useDebouncedValue = (value, delayMs = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
};

const FeaturedCarPartSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    lga: '',
    location: '',
    verifiedOnly: false,
    featuredOnly: false,
  });

  // Debounce both the search box and the filter inputs so typing feels
  // instant in the UI but only actually hits the network ~400ms after
  // the person stops typing.
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const debouncedFilters = useDebouncedValue(filters, 400);

  // Guards against race conditions: if request A is slow and request B
  // (fired after a later keystroke) resolves first, we don't want A's
  // stale response to overwrite B's fresh one.
  const abortControllerRef = useRef(null);
  const latestRequestId = useRef(0);

  const fetchFeaturedSellers = useCallback(async () => {
    const requestId = ++latestRequestId.current;

    // Cancel any in-flight request before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setErrored(false);

    try {
      const token = localStorage.getItem('token');

      // Only include params that actually have a value — sending empty
      // strings ("state=") can make some backends match nothing instead
      // of ignoring the filter. Same logic for verified/featured: only
      // send them when the person actually opted in, otherwise the page
      // silently shows zero results for anyone not flagged that way.
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (debouncedFilters.state.trim()) params.state = debouncedFilters.state.trim();
      if (debouncedFilters.lga.trim()) params.lga = debouncedFilters.lga.trim();
      if (debouncedFilters.location.trim()) params.location = debouncedFilters.location.trim();
      if (debouncedFilters.verifiedOnly) params.verified = 'true';
      if (debouncedFilters.featuredOnly) params.isFeatured = 'true';

      const query = new URLSearchParams(params);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/carpart-sellers/search?${query}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      // A newer request has since been fired — ignore this stale result.
      if (requestId !== latestRequestId.current) return;

      if (data.status === 'success') {
        setSellers(data.data?.sellers || []);
      } else {
        setSellers([]);
        toast.error(data.message || 'Failed to load featured sellers');
      }
    } catch (err) {
      // Aborted requests are expected (we cancel stale ones on purpose) —
      // don't treat them as real errors.
      if (err.name === 'AbortError') return;
      if (requestId !== latestRequestId.current) return;

      console.error('[FeaturedCarPartSellers]', err);
      setErrored(true);
      setSellers([]);
      toast.error('Network error — could not load sellers');
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, debouncedFilters]);

  useEffect(() => {
    fetchFeaturedSellers();
    return () => abortControllerRef.current?.abort();
  }, [fetchFeaturedSellers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ state: '', lga: '', location: '' });
  };

  const hasActiveFilters =
    searchQuery.trim() || filters.state.trim() || filters.lga.trim() || filters.location.trim();

  // Typing indicator: true while a debounce is pending (user still typing)
  // but we're not yet showing the big spinner state.
  const isDebouncePending =
    searchQuery !== debouncedSearch ||
    filters.state !== debouncedFilters.state ||
    filters.lga !== debouncedFilters.lga ||
    filters.location !== debouncedFilters.location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Featured Car Part Sellers
          </h1>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or business..."
              className="w-full h-12 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="e.g. Lagos"
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LGA
              </label>
              <input
                type="text"
                name="lga"
                value={filters.lga}
                onChange={handleFilterChange}
                placeholder="e.g. Iyana Ipaja"
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g. Iyana Ipaja, Lagos"
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isDebouncePending ? 'Typing…' : `${sellers.length} result${sellers.length === 1 ? '' : 's'}`}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Sellers Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : errored ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Couldn't load sellers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Something went wrong on our end. Please try again.
            </p>
            <button
              type="button"
              onClick={fetchFeaturedSellers}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No featured car part sellers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try different search terms or filters
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => {
              const info = seller.carPartSellerInfo || {};
              return (
                <div
                  key={seller._id}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Verified Badge & Business Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-10 w-10 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                          <span className="truncate">{info.businessName || 'Unnamed seller'}</span>
                          {info.verified && (
                            <ShieldCheck
                              className="h-6 w-6 text-green-500 shrink-0"
                              aria-label="Verified Seller"
                            />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.type ? `${info.type.toUpperCase()} Parts` : 'Parts seller'}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {[info.state, info.lga].filter(Boolean).join(', ') || 'Location not specified'}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        {seller.phoneNumber || 'N/A'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                        {info.rating || 0} ({info.totalSales || 0} sales)
                      </p>
                      <p className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          Specialties:{' '}
                          {info.specialties?.length > 0 ? info.specialties.join(', ') : 'Not specified'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCarPartSellers;