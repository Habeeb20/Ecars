// pages/CarDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Share2, MessageCircle, Facebook, Twitter, Link as LinkIcon, Send,
  Heart, Eye, MapPin, Gauge, Fuel, Cog, Calendar, Palette, Loader2,
  ChevronLeft, ChevronRight, Phone, ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { extractIdFromSlug } from '../utils/carSlug';

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/cars`;
const getToken = () => localStorage.getItem('token');

export default function CarDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const carId = extractIdFromSlug(slug);

  useEffect(() => {
    if (!carId) {
      setError('This car link looks invalid.');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${carId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load car');

        setCar(data.data);
        setLikeCount(data.data.likeCount || 0);
        setLiked(
          !!data.data.likes?.some(
            (l) => l.user === localStorage.getItem('userId') || l.user?._id === localStorage.getItem('userId')
          )
        );

        // Best-effort — don't block the page if this fails
        fetch(`${API_BASE}/${carId}/similar`)
          .then((r) => r.json())
          .then((d) => d.success && setSimilar(d.data))
          .catch(() => {});
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [carId]);

  const handleLike = async () => {
    if (!getToken()) {
      toast.error('Please log in to like this car');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${carId}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = car ? `${car.make} ${car.model} ${car.year} — ₦${Number(car.price).toLocaleString()}` : '';

  const bumpShareCount = () => {
    fetch(`${API_BASE}/${carId}/share`, { method: 'PATCH' }).catch(() => {});
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
        bumpShareCount();
      } catch {}
    } else {
      setShareOpen((o) => !o);
    }
  };

  const shareLinks = [
    { label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600', href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}` },
    { label: 'Facebook', icon: Facebook, color: 'text-blue-600', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'X (Twitter)', icon: Twitter, color: 'text-gray-900 dark:text-white', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: 'Telegram', icon: Send, color: 'text-sky-500', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
      bumpShareCount();
    } catch {
      toast.error('Could not copy link');
    }
    setShareOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Car not found</p>
          <p className="text-sm text-gray-500 mb-6">{error || 'This listing may have been removed.'}</p>
          <button onClick={() => navigate('/cars')} className="text-indigo-600 font-medium hover:underline">
            ← Back to all cars
          </button>
        </div>
      </div>
    );
  }

  const images = car.images?.length ? car.images : [];
  const dealerName = car.postedBy?.businessProfile?.businessName || car.postedBy?.name || 'Private Seller';
  const phone = car.phoneNumber || car.postedBy?.phoneNumber;

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Gauge, label: 'Mileage', value: car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—' },
    { icon: Cog, label: 'Transmission', value: car.transmission, capitalize: true },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType, capitalize: true },
    { icon: Palette, label: 'Color', value: car.color },
    { icon: MapPin, label: 'Location', value: [car.location?.lga, car.location?.state].filter(Boolean).join(', ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* ── Left: gallery + description + specs ── */}
          <div className="space-y-6">
            {/* Gallery */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                {images.length > 0 ? (
                  <img src={images[activeImage]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>
                )}
                {car.condition && (
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {car.condition}
                  </span>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-indigo-600' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{car.description}</p>
            </div>

            {/* Specs grid */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-start gap-2.5">
                    <s.icon size={18} className="text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                      <p className={`text-sm font-medium text-gray-800 dark:text-gray-100 ${s.capitalize ? 'capitalize' : ''}`}>{s.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((f, i) => (
                    <span key={i} className="text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar cars */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3">More {car.make} listings</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similar.map((s) => (
                    <Link
                      key={s._id}
                      to={`/cars/${[s.make, s.model, s.year].filter(Boolean).join('-').toLowerCase().replace(/\s+/g, '-')}-${s._id}`}
                      className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                        {s.images?.[0] && <img src={s.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{s.make} {s.model}</p>
                        <p className="text-xs text-emerald-600 font-bold mt-0.5">₦{Number(s.price).toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: sticky price/contact/share panel ── */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {car.make} {car.model} {car.year}
                  </h1>
                  {car.stockNumber && <p className="text-xs text-gray-400 mt-0.5">Stock #{car.stockNumber}</p>}
                </div>
              </div>

              <p className="text-3xl font-extrabold text-emerald-600 mt-3">₦{Number(car.price).toLocaleString()}</p>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Eye size={14} /> {car.views || 0} views</span>
                <span className="flex items-center gap-1"><Heart size={14} /> {likeCount} likes</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                    liked ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Heart size={16} className={liked ? 'fill-rose-600' : ''} /> {liked ? 'Liked' : 'Like'}
                </button>

                <div className="relative flex-1">
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <Share2 size={16} /> Share
                  </button>

                  {shareOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50">
                        {shareLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => { bumpShareCount(); setShareOpen(false); }}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Icon size={16} className={link.color} />
                              <span className="text-gray-700 dark:text-gray-200">{link.label}</span>
                            </a>
                          );
                        })}
                        <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                          <LinkIcon size={16} className="text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-200">Copy Link</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={car.postedBy?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(dealerName)}`}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{dealerName}</p>
                  <p className="text-xs text-gray-400">Seller</p>
                </div>
              </div>
              {phone ? (
                <div className="space-y-2">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
                  >
                    <Phone size={16} /> Call Seller
                  </a>
                  <a
                    href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in your ${car.make} ${car.model} ${car.year} listed for ₦${Number(car.price).toLocaleString()}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    <MessageCircle size={16} /> WhatsApp Seller
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">No contact number provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}