

// src/pages/CarDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, Gauge, Calendar, Fuel, Settings, Palette,
  Heart, Share2, Eye, ChevronLeft, ChevronRight, ShieldCheck, MessageCircle, X,
} from 'lucide-react';
import { inventoryApi } from '../../lib/api';

const formatNaira = (n) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(n || 0);
};

const SpecItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3">
    <div className="h-9 w-9 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-primary-600 dark:text-primary-400 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{value}</p>
    </div>
  </div>
);

const TitleBlock = ({ car, liked, setLiked }) => (
  <div>
    <div className="flex items-start justify-between gap-3">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">{car.title}</h1>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => setLiked(!liked)}
          className={`h-9 w-9 rounded-full flex items-center justify-center border ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
        >
          <Heart className={`h-4.5 w-4.5 ${liked ? 'fill-current' : ''}`} />
        </button>
        <button className="h-9 w-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400">
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
    <p className="text-2xl sm:text-3xl font-extrabold text-primary-600 mt-2">{formatNaira(car.price)}</p>
    <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1">
      <MapPin className="h-3.5 w-3.5" /> {car.location?.lga}, {car.location?.state} · Stock #{car.stockNumber}
    </div>
  </div>
);

const MyCarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([inventoryApi.getById(id), inventoryApi.getSimilar(id)])
      .then(([carData, similarData]) => {
        setCar(carData);
        setSimilar(similarData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl animate-pulse">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-6" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
        <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Car not found</h1>
        <p className="text-gray-500 mt-2">This listing may have been sold or removed.</p>
        <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block">Browse other cars</Link>
      </div>
    );
  }

  const images = car.images?.length ? car.images : ['/placeholder-car.jpg'];
  const dealer = car.postedBy;
  const dealerSlug = dealer?.slug;
  const dealerName = dealer?.dealerInfo?.businessName || `${dealer?.firstName || ''} ${dealer?.lastName || ''}`.trim();

  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);
  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="bg-gray-50 mt-20 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-5 max-w-6xl">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-gray-100 dark:bg-gray-800 group">
                <img
                  src={images[activeImg]}
                  alt={car.title}
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
                {car.isFeatured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Featured
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {car.views ?? 0}
                </span>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                  {activeImg + 1} / {images.length}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-primary-600' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price (mobile) */}
            <div className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <TitleBlock car={car} liked={liked} setLiked={setLiked} />
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <SpecItem icon={<Calendar className="h-4.5 w-4.5" />} label="Year" value={String(car.year)} />
                <SpecItem icon={<Gauge className="h-4.5 w-4.5" />} label="Mileage" value={`${car.mileage?.toLocaleString()} km`} />
                <SpecItem icon={<Settings className="h-4.5 w-4.5" />} label="Transmission" value={car.transmission} />
                <SpecItem icon={<Fuel className="h-4.5 w-4.5" />} label="Fuel Type" value={car.fuelType} />
                <SpecItem icon={<Palette className="h-4.5 w-4.5" />} label="Color" value={car.color} />
                <SpecItem icon={<ShieldCheck className="h-4.5 w-4.5" />} label="Condition" value={car.condition.replace(/([A-Z])/g, ' $1')} />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            {!!car.features?.length && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-20">
              <TitleBlock car={car} liked={liked} setLiked={setLiked} />

              <div className="border-t border-gray-100 dark:border-gray-800 mt-5 pt-5 space-y-3">
                <a
                  href={`tel:${car.phoneNumber || dealer?.phoneNumber || ''}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  <Phone className="h-4.5 w-4.5" /> Call Seller
                </a>
                <a
                  href={`https://wa.me/${(dealer?.serviceProviderInfo?.whatsappNumber || car.phoneNumber || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium py-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                  <MessageCircle className="h-4.5 w-4.5" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Dealer card */}
            {dealer && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Sold by</h3>
                <Link to={dealerSlug ? `/${dealerSlug}` : '#'} className="flex items-center gap-3 group">
                  <img
                    src={dealer.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + dealerName}
                    alt={dealerName}
                    className="h-12 w-12 rounded-full object-cover bg-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600">{dealerName}</p>
                    <p className="text-xs text-gray-400">{car.location?.lga}, {car.location?.state}</p>
                  </div>
                </Link>
                {dealerSlug && (
                  <Link
                    to={`/${dealerSlug}`}
                    className="mt-4 w-full block text-center border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    View all stock from {dealerName}
                  </Link>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400 px-1">
              <MapPin className="h-4 w-4" /> {car.location?.lga}, {car.location?.state}
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3 flex gap-3 z-30">
          <a
            href={`tel:${car.phoneNumber || dealer?.phoneNumber || ''}`}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white font-medium py-3 rounded-xl"
          >
            <Phone className="h-4.5 w-4.5" /> Call Seller
          </a>
          <a
            href={`https://wa.me/${(dealer?.serviceProviderInfo?.whatsappNumber || car.phoneNumber || '').replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium py-3 rounded-xl"
          >
            <MessageCircle className="h-4.5 w-4.5" /> WhatsApp
          </a>
        </div>
        <div className="h-20 lg:hidden" />

        {/* Similar cars */}
        {similar.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((s) => (
                <Link
                  key={s._id}
                  to={`/cars/${s._id}`}
                  className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img src={s.images?.[0]} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{s.title}</p>
                    <p className="text-primary-600 font-bold mt-1">{formatNaira(s.price)}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.year} · {s.mileage?.toLocaleString()} km</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxOpen(false)}>
            <X className="h-7 w-7" />
          </button>
          <img
            src={images[activeImg]}
            alt={car.title}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
              >
                <ChevronLeft className="h-9 w-9" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
              >
                <ChevronRight className="h-9 w-9" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCarDetails;

