



/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, MapPin, Share2, Calendar, Fuel, Gauge, Eye, MessageCircle,
  CalendarCheck, Settings2, ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Zap, ArrowUpRight } from 'lucide-react';
// Same check BookViewingModal uses
const isLoggedIn = () => !!localStorage.getItem('token');


function ChatButton({ href, icon: Icon, name, tone }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${tone}`}
    >
      {/* soft light sweep on top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent"
      />

      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-inset ring-white/25">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>

      <span className="relative flex min-w-0 flex-col items-start leading-tight">
        <span className="text-xs text-white/85">Chat on</span>
        <span className="text-base font-semibold">{name}</span>
      </span>

      <ArrowUpRight
        aria-hidden="true"
        className="relative ml-auto h-5 w-5 shrink-0 text-white/70 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white motion-reduce:transition-none"
      />
    </a>
  );
}


// Normalize Nigerian numbers (080..., +234..., 234...) into wa.me's required format (no +, no leading 0)
const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0')) return `234${digits.slice(1)}`;
  return digits;
};

const WHATSAPP_MESSAGE = 'Hello, I found your business on eCars and would like to make an enquiry about some cars.';

const Spec = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-1.5 min-w-0">
    <Icon className="h-4 w-4 shrink-0" />
    <span className="truncate">{children}</span>
  </div>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1 text-gray-700">
    <Icon className="h-5 w-5 text-slate-500" />
    <span className="font-semibold text-gray-900">{label} {value}</span>
  </div>
);

export const CarCard = ({ car,  dealer, showDealerInfo = false, onBookViewing }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const likes = car.likesCount ?? car.likeCount ?? 0;
  const views = car.views ?? 0;
  const shares = car.shareCount ?? 0;
  const bookings = car.bookingsCount ?? 0;

  const detailsPath = `/cars/${car._id}`;
  const locationText = [car.location?.state, car.location?.lga].filter(Boolean).join(', ');

  const features = car.features || [];
  const displayedFeatures = showAllFeatures ? features : features.slice(0, 2);

  const whatsappNumber = formatPhoneForWhatsApp(car.postedBy?.phoneNumber);
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : null;

     const d = dealer?.dealerInfo;
  const rawName =
    d?.businessName ||
    d?.firstName ||
    [d?.firstName, d?.lastName].filter(Boolean).join(" ") ||
    "";
  const sellerName = rawName.toLowerCase().replace(/\s+/g, "");
  const showaLink = sellerName
    ? `https://api.showapp.ng/api/showa/chat/${encodeURIComponent(sellerName)}`
    : null;

  const buttons = [
    whatsappLink && {
      key: "whatsapp",
      href: whatsappLink,
      icon: MessageCircle,
      name: "WhatsApp",
      tone: "bg-gradient-to-br from-green-600 to-green-700 shadow-green-700/25 focus-visible:ring-green-600",
    },
    showaLink && {
      key: "showa",
      href: showaLink,
      icon: Zap,
      name: "Showa",
      tone: "bg-gradient-to-br from-[#0A66C2] to-[#2C7BE5] shadow-blue-700/25 focus-visible:ring-[#0A66C2]",
    },
  ].filter(Boolean);

  if (buttons.length === 0) return null;

  // The modal only opens for logged-in users. Everyone else is sent to login
  // and can return here afterwards via location.state.from.
  const handleBookViewing = () => {
    if (!isLoggedIn()) {
      toast.error('Please log in to book a viewing');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    onBookViewing?.(car);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-900"
    >
      {/* Image. The link and the overlay controls are siblings, so there are no buttons inside a link. */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-800">
        <Link to={detailsPath} className="block h-full w-full" aria-label={`View ${car.title}`}>
          <img
            src={car.images?.[0] || '/placeholder-car.jpg'}
            alt={car.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/placeholder-car.jpg'; }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Top-left badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
            {car.postedBy?.role === 'dealer' ? 'Dealer' : 'Personal'}
          </span>
          {car.isFeatured && (
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">Featured</span>
          )}
        </div>

        {/* Top-right: status + favourite */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span className="pointer-events-none rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
            For Sale
          </span>
          <button
            type="button"
            onClick={() => setIsFavorite((v) => !v)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            className="rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white dark:bg-gray-800/90"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Title, price and specs link to the details page */}
        <Link to={detailsPath} className="block">
          <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">{car.title}</h3>

          <div className="mb-3">
            <span className="text-2xl font-bold text-green-600">
              {car.price != null ? `₦${Number(car.price).toLocaleString()}` : 'N/A'}
            </span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
            <Spec icon={Calendar}>{car.year || 'N/A'}</Spec>
            <Spec icon={Gauge}>{car.mileage != null ? `${Number(car.mileage).toLocaleString()} km` : 'N/A'}</Spec>
            <Spec icon={Fuel}>{car.fuelType || 'N/A'}</Spec>
            <Spec icon={MapPin}>{locationText || 'N/A'}</Spec>
            <Spec icon={ShieldCheck}>{car.condition || 'N/A'}</Spec>
            <Spec icon={Settings2}>{car.transmission || 'N/A'}</Spec>
          </div>
        </Link>

        {features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {displayedFeatures.map((feature, i) => (
                <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
                  {feature}
                </span>
              ))}
            </div>
            {features.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllFeatures((v) => !v)}
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
                {showAllFeatures ? 'Show less' : `+${features.length - 2} more`}
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-3 shadow-sm transition-colors hover:from-gray-100 hover:to-gray-300">
          <Stat icon={Heart} label="Likes" value={likes} />
          <Stat icon={Eye} label="Views" value={views} />
          <Stat icon={Share2} label="Shares" value={shares} />
          <Stat icon={CalendarCheck} label="Bookings" value={bookings} />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleBookViewing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <CalendarCheck className="h-5 w-5" />
            Book Viewing
          </button>

          <Link
            to={detailsPath}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-center font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            View Details
          </Link>
        </div>

         <div className={`mt-3 grid gap-3 ${buttons.length === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      {buttons.map(({ key, ...props }) => (
        <ChatButton key={key} {...props} />
      ))}
    </div>

        


        {showDealerInfo && car.postedBy && (
          <div className="mt-3 border-t pt-3 text-xs text-gray-500">
            Sold by: {car.postedBy.firstName} {car.postedBy.lastName}
          </div>
        )}
      </div>
    </motion.div>
  );
};






















