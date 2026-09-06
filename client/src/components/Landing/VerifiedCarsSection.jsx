import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { BadgeCheck, Loader2, Gauge, Fuel, Eye, Heart, Share2 } from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_URL;

export default function VerifiedCarsSection() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerifiedCars = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/cars/verified`, {
          params: { limit: 12 },
        });
        setCars(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load verified cars');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedCars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  if (cars.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <BadgeCheck className="text-emerald-600" size={22} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Verified Listings
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {cars.map((car) => (
          <div
            key={car._id}
            onClick={() => navigate(`/cars/${car._id}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="relative h-36 sm:h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              {car.images?.[0] && (
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                <BadgeCheck size={11} /> Verified
              </span>
              {car.saleType === 'discount' && car.discountPercentage > 0 && (
                <span className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  -{car.discountPercentage}%
                </span>
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                {car.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                {car.year} · {car.make} {car.model}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Gauge size={11} /> {car.mileage?.toLocaleString()} km
                </span>
                <span className="flex items-center gap-1">
                  <Fuel size={11} /> {car.fuelType}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
               <span className="flex items-center gap-1">
                  <Eye size={12} /> Views: {Number(car.views || 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={12} /> Likes: {Number(car.likeCount || 0).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={12} /> Shares: {Number(car.shareCount || 0).toLocaleString()}
                </span>
                </div>

              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                ₦{car.price?.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}