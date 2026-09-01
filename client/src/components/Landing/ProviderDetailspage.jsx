import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Loader2, ArrowLeft, Star, MapPin, Phone, BadgeCheck, ShieldCheck,
  Briefcase, Users, Building2, ExternalLink, Clock,
} from 'lucide-react';

const API_URL = 'https://backend-efixit.ereligion.ng/api/provider/providers';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        console.log(data)
        if (data.success) {
          const found = data.data.find((p) => p._id === id);
          if (found) {
            setProvider(found);
          } else {
            toast.error('Provider not found');
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load provider');
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500">Provider not found.</p>
        <Link to="/" className="text-[#0B1B3E] font-semibold hover:underline mt-2 inline-block">
          Back home
        </Link>
      </div>
    );
  }

  const profile = provider.providerProfile || {};
  const displayName = profile.businessName || `${provider.firstName} ${provider.lastName}`;
  const location = [provider.lga, provider.state].filter(Boolean).join(', ');
  const hireUrl = `https://efixit.ng/providers/${provider.email}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <img
          src={
            provider.profilePicture ||
            `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=6366f1&color=fff&bold=true&size=128`
          }
          alt={displayName}
          className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
            {provider.isVerified && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
            {provider.isCertified && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-100 text-blue-700">
                <ShieldCheck size={12} /> Certified
              </span>
            )}
            {provider.urgentAvailable?.isActive && (
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
                Urgently Available
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 capitalize mt-1">
            {profile.serviceType || 'Service Provider'}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {location}
              </span>
            )}
            {provider.averageRating > 0 && (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star size={14} className="fill-amber-500" /> {provider.averageRating.toFixed(1)}{' '}
                <span className="text-gray-400 font-normal">({provider.reviews?.length || 0} reviews)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Business info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <InfoStat icon={<Briefcase size={16} />} label="Experience" value={profile.yearsOfBusiness ? `${profile.yearsOfBusiness} yrs` : 'N/A'} />
        <InfoStat icon={<Users size={16} />} label="Staff" value={profile.staffCount || 'N/A'} />
        <InfoStat icon={<Building2 size={16} />} label="Registered" value={profile.registeredBusiness ? 'Yes' : 'No'} />
        <InfoStat icon={<Phone size={16} />} label="Phone" value={provider.phoneNumber || 'N/A'} />
      </div>

      {/* Specialties */}
      {profile.specialties?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-sm rounded-full capitalize">
                {s.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {profile.gallery?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.gallery.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.caption || `Gallery ${i + 1}`}
                className="w-full h-32 sm:h-40 object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {profile.services?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Services</h2>
          <div className="space-y-3">
            {profile.services.map((s, i) => (
              <div key={i} className="p-4 border-2 border-gray-100 dark:border-gray-800 rounded-xl">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                  {s.price > 0 && (
                    <span className="font-bold text-[#0B1B3E] dark:text-white shrink-0">
                      ₦{Number(s.price).toLocaleString()}
                      {s.unit === 'per_hour' && <span className="text-xs font-normal">/hr</span>}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opening hours */}
      {profile.openingHours?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock size={18} /> Opening Hours
          </h2>
          <div className="space-y-1.5">
            {profile.openingHours.map((h, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-gray-600 dark:text-gray-300">{h.day}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {h.openTime && h.closeTime ? `${h.openTime} - ${h.closeTime}` : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {provider.reviews?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Reviews</h2>
          <div className="space-y-3">
            {provider.reviews.map((r) => (
              <div key={r._id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hire button */}
      <a
        href={hireUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 bg-gradient-to-r from-[#0B1B3E] to-[#16255C] text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
      >
        Hire {displayName}
        <ExternalLink size={18} />
      </a>
    </div>
  );
}

function InfoStat({ icon, label, value }) {
  return (
    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
      <div className="flex justify-center text-gray-400 mb-1.5">{icon}</div>
      <p className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate">{value}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}