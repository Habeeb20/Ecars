




import React, { useState, useEffect } from 'react';
import {
  Search, ChevronDown, X, Loader2, SlidersHorizontal, Share2,
  MessageCircle, Facebook, Twitter, Link as LinkIcon, Send,
  MapPin, Gauge, Calendar, Fuel, Settings2, Filter, Frown
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildCarSlug, buildCarUrl } from '../../utils/carSlug';

const navy = '#0B1B3E';
const rust = '#C2532A';

const makeOptions = [
  { value: '', label: 'All Makes' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'ford', label: 'Ford' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
  { value: 'lexus', label: 'Lexus' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'subaru', label: 'Subaru' },
  { value: 'jeep', label: 'Jeep' },
  { value: 'kia', label: 'Kia' },
  { value: 'hyundai', label: 'Hyundai' },
];

const priceRangeOptions = [
  { value: '', label: 'Any Price' },
  { value: '0-500000', label: 'Under ₦500,000' },
  { value: '500000-1000000', label: 'Under ₦1,000,000' },
  { value: '1000000-2000000', label: '₦1,000,000 - ₦2,000,000' },
  { value: '2000000-3000000', label: '₦2,000,000 - ₦3,000,000' },
  { value: '3000000-5000000', label: '₦3,000,000 - ₦5,000,000' },
  { value: '5000000-', label: 'Over ₦5,000,000' },
];

const yearOptions = [
  { value: '', label: 'Any Year' },
  { value: '2022-2024', label: '2022 - 2024' },
  { value: '2018-2021', label: '2018 - 2021' },
  { value: '2014-2017', label: '2014 - 2017' },
  { value: '2010-2013', label: '2010 - 2013' },
  { value: '2000-2009', label: '2000 - 2009' },
  { value: '-1999', label: 'Before 2000' },
];

const conditionType = [
  { value: '', label: 'Any Condition' },
  { value: 'brand new', label: 'Brand New' },
  { value: 'foreign used', label: 'Foreign Used' },
  { value: 'nigerian used', label: 'Nigerian Used' },
];

const bodyTypeOptions = [
  { value: '', label: 'All Body Types' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'saloon', label: 'Saloon' },
  { value: 'estate', label: 'Estate' },
  { value: 'mpv', label: 'MPV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
];

/* ------------------------- Reusable select field ------------------------- */
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full h-12 pl-4 pr-9 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 appearance-none focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ----------------------------- Share button ------------------------------ */
function ShareButton({ car }) {
  const [open, setOpen] = useState(false);
  const shareUrl = buildCarUrl(car);
  const shareText = `${car.make || ''} ${car.model || ''} ${car.year || ''} — ₦${car.price ? Number(car.price).toLocaleString() : ''}`.trim();

  const handleNativeShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
      } catch (err) {
        /* cancelled */
      }
    } else {
      setOpen((o) => !o);
    }
  };

  const shareLinks = [
    { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600', href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
    { label: 'Facebook', icon: Facebook, color: 'text-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'X (Twitter)', icon: Twitter, color: 'text-gray-900 dark:text-white', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: 'Telegram', icon: Send, color: 'text-sky-500', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
  ];

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
    setOpen(false);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share this car"
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
      >
        <Share2 size={15} className="text-gray-600 dark:text-gray-200" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon size={16} className={link.color} />
                  <span className="text-gray-700 dark:text-gray-200">{link.label}</span>
                </a>
              );
            })}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <LinkIcon size={16} className="text-gray-500" />
              <span className="text-gray-700 dark:text-gray-200">Copy Link</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------ Result card ------------------------------ */
const SimpleCarCard = ({ car, onClick }) => (
  <div
    onClick={onClick}
    className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
  >
    <div className="flex items-start justify-between gap-2 mb-1">
      <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#0B1B3E] dark:group-hover:text-white transition-colors">
        {car.make} {car.model}
      </h3>
      <ShareButton car={car} />
    </div>
    <p className="text-xl font-black mt-1" style={{ color: rust }}>
      ₦{car.price ? Number(car.price).toLocaleString() : '—'}
    </p>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-3">
      <span className="flex items-center gap-1"><Calendar size={12} /> {car.year || '—'}</span>
      <span className="flex items-center gap-1"><Gauge size={12} /> {car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—'}</span>
      <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {car.condition}
      </span>
    </div>
  </div>
);

/* --------------------------------------------------------------------- */

const SearchFilters = ({ variant = 'hero', className = '' }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    make: '', model: '', priceRange: '', year: '', bodyType: '',
    condition: '', fuelType: '', transmission: '', state: '',
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFilters((prev) => ({ ...prev, model: '' }));
  }, [filters.make]);

  // Lock body scroll behind open modals
  useEffect(() => {
    document.body.style.overflow = (isAdvancedOpen || isModalOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isAdvancedOpen, isModalOpen]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const url = `${import.meta.env.VITE_BACKEND_URL}/cars/allcarsearch?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error('Failed to fetch cars');

      const data = await response.json();
      const cars = data.data || data.cars || data.results || [];
      setSearchResults(cars);
      setIsModalOpen(true);

      if (cars.length === 0) {
        toast.info('No cars found matching your criteria');
      } else {
        toast.success(`${cars.length} car${cars.length > 1 ? 's' : ''} found`);
      }
    } catch (err) {
      setError('Failed to load cars. Please try again.');
      toast.error('Search failed — please try again');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      make: '', model: '', priceRange: '', year: '', bodyType: '',
      condition: '', fuelType: '', transmission: '', state: '',
    });
    toast('Filters cleared', { icon: '🧹' });
  };

  const openCarDetail = (car) => {
    navigate(`/cars/${buildCarSlug(car)}`);
  };

  return (
    <>
      {/* ============================ Main Search Bar ============================ */}
      <div className={`rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-5 sm:p-7 bg-white dark:bg-gray-900 w-full lg:w-[1000px] mb-10 sm:mb-16 lg:mb-24 ${className}`}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-5 sm:mb-6">
           
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#0B1B3E] hover:text-[#0B1B3E] dark:hover:text-white transition-colors shrink-0"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">More filters</span>
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: rust }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <SelectField label="Make" name="make" value={filters.make} onChange={handleChange} options={makeOptions} />
            <SelectField label="Body type" name="bodyType" value={filters.bodyType} onChange={handleChange} options={bodyTypeOptions} />
            <SelectField label="Condition" name="condition" value={filters.condition} onChange={handleChange} options={conditionType} />
            <SelectField label="Year" name="year" value={filters.year} onChange={handleChange} options={yearOptions} />
          </div>

          <div className="flex items-center gap-3 mt-5 sm:mt-6">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 sm:h-14 px-4 sm:px-5 rounded-2xl font-medium text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-2 border-gray-200 dark:border-gray-700 transition-colors shrink-0"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 sm:h-14 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 text-sm sm:text-lg shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ background: `linear-gradient(135deg, ${navy}, #16255C)` }}
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} />}
              {loading ? 'Searching...' : 'Search vehicles'}
            </button>
          </div>
        </form>
      </div>

      {/* ====================== ADVANCED SEARCH MODAL ====================== */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setIsAdvancedOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <Filter size={18} style={{ color: rust }} />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Advanced search</h2>
                </div>
                <button
                  onClick={() => setIsAdvancedOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <SelectField label="Price range" name="priceRange" value={filters.priceRange} onChange={handleChange} options={priceRangeOptions} />
                <SelectField
                  label="Fuel type" name="fuelType" value={filters.fuelType} onChange={handleChange}
                  options={[
                    { value: '', label: 'Any Fuel Type' },
                    { value: 'petrol', label: 'Petrol' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'electric', label: 'Electric' },
                  ]}
                />
                <SelectField
                  label="Transmission" name="transmission" value={filters.transmission} onChange={handleChange}
                  options={[
                    { value: '', label: 'Any' },
                    { value: 'automatic', label: 'Automatic' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-500 dark:text-gray-400">
                    State / Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="state"
                      value={filters.state}
                      onChange={handleChange}
                      placeholder="e.g Lagos, Abuja, Port Harcourt"
                      className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 text-sm focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdvancedOpen(false);
                    handleSubmit({ preventDefault: () => {} });
                  }}
                  className="flex-1 h-12 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  style={{ background: navy }}
                >
                  Apply filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================ Results Modal ============================ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-6xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">Search results</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    {searchResults.length} car{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                {Array.isArray(searchResults) && searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {searchResults.map((car) => (
                      <SimpleCarCard key={car._id} car={car} onClick={() => openCarDetail(car)} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Frown className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">No matches found</h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Try widening your filters — a different price range, year, or body type might turn up more results.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchFilters;