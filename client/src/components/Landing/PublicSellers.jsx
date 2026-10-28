import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Building2, UserCircle2, BadgeCheck, MapPin, Car, ArrowRight, Eye, Heart, Share2 } from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_URL;

export default function PublicSellerSections() {
  const [dealers, setDealers] = useState([]);
  const [privateSellers, setPrivateSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/users/sellers`);
        const data = await res.json();
        if (data.status === 'success') {
          setDealers(data.data.dealers);
          setPrivateSellers(data.data.privateSellers);
        }
      } catch (err) {
        console.log(err);
        toast.error('Failed to load sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
      <SellerSection
        title="Verified Car Dealers"
        subtitle="Verified dealerships with active inventory"
        icon={<Building2 size={20} className="text-[#0B1B3E]" />}
        users={dealers}
        emptyText="No dealers listed yet"
        onSelect={(id) => navigate(`/dealers/${id}`)}
        onViewAll={() => navigate('/dealership')}
        variant="dealer"
      />

      <SellerSection
        title="Private Sellers"
        subtitle="Individuals selling their own vehicles"
        icon={<UserCircle2 size={20} className="text-[#0B1B3E]" />}
        users={privateSellers}
        emptyText="No private sellers yet"
        onSelect={(id) => navigate(`/dealers/${id}`)}
        onViewAll={() => navigate('/dealership')}
        variant="private"
      />
    </div>
  );
}

function SellerSection({ title, subtitle, icon, users, emptyText, onSelect, onViewAll, variant }) {
  if (users.length === 0) return null; // don't show an empty section on the landing page

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <p className="text-xl sm:text-xl text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <button
          onClick={onViewAll}
          className="hidden sm:flex items-center gap-1 text-xl font-semibold text-[#0B1B3E] dark:text-white hover:gap-2 transition-all shrink-0"
        >
          View all <ArrowRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <SellerCard key={user._id} user={user} onClick={() => onSelect(user._id)} variant={variant} />
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="sm:hidden flex items-center justify-center gap-1 w-full mt-4 text-xl font-semibold text-[#0B1B3E] dark:text-white"
      >
        View all {title.toLowerCase()} <ArrowRight size={15} />
      </button>
    </section>
  );
}

function SellerCard({ user, onClick, variant }) {
  const isDealer = variant === 'dealer';
  const displayName = isDealer
    ? user.dealerInfo?.businessName || `${user.firstName} ${user.lastName}`
    : `${user.firstName} ${user.lastName}`;

  const location = isDealer
    ? [user.dealerInfo?.lga, user.dealerInfo?.state].filter(Boolean).join(', ')
    : [user.lga, user.state].filter(Boolean).join(', ');

  const verified = isDealer && user.dealerInfo?.verified;
  const featured = isDealer && user.dealerInfo?.isFeatured;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      {featured && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-amber-100 text-amber-700">
          Featured
        </span>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : isDealer ? (
            <Building2 size={20} className="text-gray-400" />
          ) : (
            <UserCircle2 size={20} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-xl text-gray-900 dark:text-white truncate flex items-center gap-1">
            {displayName}
            {verified && <BadgeCheck size={13} className="text-emerald-600 shrink-0" />}
          </p>
          <p className="text-xl text-gray-400">{isDealer ? 'Dealer' : 'Private seller'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xl text-gray-500 dark:text-gray-400">
        {location && (
          <span className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="shrink-0" /> {location}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Car size={12} className="shrink-0" />
          {user.carListingsCount} listing{user.carListingsCount !== 1 ? 's' : ''}
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xl text-gray-500 dark:text-gray-400 mb-4">
         <span className="flex items-center gap-1">
            <Eye size={12} /> Views: {Number(user.views || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> Likes: {Number(user.likeCount || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Share2 size={12} /> Shares: {Number(user.shareCount || 0).toLocaleString()}
          </span>
          </div>
      </div>
    </div>
  );
}