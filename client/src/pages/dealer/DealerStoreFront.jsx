// src/pages/DealerStorefront.jsx
// Rendered on the dynamic route: baseurl/:slug  (e.g. baseurl/habeebdealers)
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Star, ArrowLeft, BadgeCheck, Car as CarIcon, MessageCircle } from 'lucide-react';
import { dealerApi } from '../../lib/api';


const formatNaira = (n) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(n || 0);
};

const CarCard = ({ car }) => (
  <Link to={`/cars/${car._id}`} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group">
    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
      <img src={car.images?.[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {car.isFeatured && (
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span>
      )}
    </div>
    <div className="p-4">
      <p className="font-semibold text-gray-900 dark:text-white truncate">{car.title}</p>
      <p className="text-primary-600 font-bold mt-1">{formatNaira(car.price)}</p>
      <p className="text-xs text-gray-400 mt-1">{car.year} · {car.mileage?.toLocaleString()} km · {car.transmission}</p>
    </div>
  </Link>
);

const DealerStorefront = () => {
  const { slug } = useParams();
  const [dealer, setDealer] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [makeFilter, setMakeFilter] = useState('');

  // const load = (page = 1) => {
  //   if (!slug) return;
  //   setLoading(true);
  //   dealerApi.getBySlug(slug, { page, limit: 12, make: makeFilter || undefined })
  //     .then((data) => {
  //       setDealer(data.dealer);
  //       setInventory(data.inventory);
  //       setPagination(data.pagination);
  //     })
  //     .catch(() => setNotFound(true))
  //     .finally(() => setLoading(false));
  // };


  const load = (page = 1) => {
  if (!slug) return;

  // ← CLEAN THE SLUG BEFORE SENDING
  const cleanSlug = slug.replace(/^:/, '').trim();

  console.log('Frontend sending slug:', cleanSlug); // ← Add this for debugging

  setLoading(true);

  dealerApi.getBySlug(cleanSlug, { 
    page, 
    limit: 12, 
    make: makeFilter || undefined 
  })
    .then((data) => {
      setDealer(data.dealer);
      setInventory(data.inventory);
      setPagination(data.pagination);
      setNotFound(false);
    })
    .catch((err) => {
      console.error("Dealer fetch error:", err);
      setNotFound(true);
    })
    .finally(() => setLoading(false));
};
  useEffect(() => { 
    load(1); 
  }, [slug, makeFilter]);

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dealer not found</h1>
        <p className="text-gray-500 mt-2">The dealer page "{slug}" doesn't exist or has been deactivated.</p>
        <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  if (loading && !dealer) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!dealer) return null;

  const businessName = dealer.dealerInfo?.businessName || 
                      dealer.serviceProviderInfo?.businessName || 
                      dealer.carPartSellerInfo?.businessName || 
                      `${dealer.firstName} ${dealer.lastName}`;

  const address = dealer.dealerInfo?.businessAddress || dealer.address;
  const verified = dealer.dealerInfo?.verified ?? 
                  dealer.serviceProviderInfo?.verified ?? 
                  dealer.carPartSellerInfo?.verified;
  
  const makes = Array.from(new Set(inventory.map((c) => c.make)));

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero / cover */}
      <div className="relative h-40 sm:h-56 bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="container mx-auto px-4">
        <div className="-mt-12 sm:-mt-16 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-6">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={dealer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${businessName}`}
                alt={businessName}
                className="h-20 w-20 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow -mt-12 sm:mt-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{businessName}</h1>
                  {verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {address && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {address}</span>}
                  {dealer.averageRating > 0 && (
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /> {dealer.averageRating.toFixed(1)}</span>
                  )}
                  <span className="flex items-center gap-1.5"><CarIcon className="h-4 w-4" /> {pagination.total} cars in stock</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {dealer.phoneNumber && (
                  <a href={`tel:${dealer.phoneNumber}`} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl">
                    <Phone className="h-4 w-4" /> Call
                  </a>
                )}
                {(dealer.serviceProviderInfo?.whatsappNumber || dealer.carPartSellerInfo?.whatsappNumber) && (
                  <a
                    href={`https://wa.me/${(dealer.serviceProviderInfo?.whatsappNumber || dealer.carPartSellerInfo?.whatsappNumber).replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium px-4 py-2.5 rounded-xl"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            {dealer.bio && <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">{dealer.bio}</p>}
          </div>
        </div>

        {/* Inventory */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Inventory ({pagination.total})</h2>
            {makes.length > 1 && (
              <select 
                value={makeFilter} 
                onChange={(e) => setMakeFilter(e.target.value)} 
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
              >
                <option value="">All makes</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
          </div>

          {inventory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {inventory.map((car) => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-dashed border-gray-200 dark:border-gray-800 p-10 text-center">
              <CarIcon className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No vehicles listed yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Check back soon — {businessName} is restocking.</p>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => load(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${pagination.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerStorefront;