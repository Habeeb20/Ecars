import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Calendar, Gauge, Fuel, Phone, Building2, Award,
  ArrowLeft, Heart, Share2, MessageCircle, Car, Shield, Clock
} from 'lucide-react';

// Import vehicle data
import { vehicleInventory } from '../data/vehicles';
import { mockInventory } from '../data/cars';

// === SAFELY IMPORT DEALERS (no require!) ===
let featuredDealers = [];

// Try to import dealers — if file doesn't exist, just use empty array
try {
  // This works in Vite/CRA/ESM projects
  const dealersData = await import('../data/dealers');
  featuredDealers = (dealersData.featuredDealers || []).map(dealer => ({
    ...dealer,
    reviews: dealer.reviews ?? 0,
  }));
} catch (err) {
  console.log(err)
  console.warn('dealers.js not found — showing vehicle without dealer info');
  // No crash — just no dealer shown
}

// Combine all vehicles
const allVehicles = [
  ...Object.values(vehicleInventory).flat(),
  ...Object.values(mockInventory).flat().map(car => ({
    ...car,
    vehicleType: 'car',
    rating: car.rating || 4.5,
    image: car.imageUrl || car.image || 'https://via.placeholder.com/800x600?text=No+Image',
  }))
];

const VehicleDetails = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const vehicle = useMemo(() => 
    allVehicles.find(v => v.id === id),
    [id]
  );

  const dealer = useMemo(() => 
    vehicle ? featuredDealers.find(d => d.id === vehicle.dealerId) : null,
    [vehicle]
  );

  const handleContact = () => {
    if (dealer) {
      alert(`Contact ${dealer.name}\nPhone: ${dealer.phone}`);
    } else {
      alert('Contact seller directly via WhatsApp or call');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle?.title,
        text: `Check out this ${vehicle?.title} for sale!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pt-20 flex items-center justify-center">
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl">
          <Car className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vehicle Not Found
          </h1>
          <Link 
            to="/vehicles" 
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pt-16">
      <div className="container mx-auto px-6">
        {/* Back & Actions */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/vehicles" className="flex items-center text-blue-600 hover:text-blue-800 font-bold text-lg">
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Listings
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-4 rounded-full transition ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Heart className={`w-7 h-7 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition">
              <Share2 className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-10">
            <img 
              src={vehicle.image} 
              alt={vehicle.title}
              className="w-full h-96 lg:h-[600px] object-cover rounded-3xl shadow-2xl"
            />

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
              <h1 className="text-5xl font-black mb-4">{vehicle.title}</h1>
              <div className="flex items-center gap-4 text-2xl mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
                <span>{vehicle.location}</span>
              </div>
              <div className="text-6xl font-black text-blue-600 mb-8">
                ₦{vehicle.price.toLocaleString()}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Calendar, value: vehicle.year },
                  { icon: Gauge, value: `${vehicle.mileage.toLocaleString()} km` },
                  { icon: Fuel, value: vehicle.fuelType },
                  { icon: Car, value: vehicle.transmission || 'Auto' },
                ].map((spec, i) => (
                  <div key={i} className="text-center">
                    <spec.icon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-2xl font-bold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold mb-8">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {vehicle.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <Check className="w-8 h-8 text-green-500" />
                    <span className="text-lg font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-10 text-white sticky top-24">
              <h1 className="text-4xl font-black mb-6">{vehicle.title}</h1>
              <div className="text-6xl font-black mb-8">
                ₦{vehicle.price.toLocaleString()}
              </div>

              <button 
                onClick={handleContact}
                className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold text-2xl py-6 rounded-2xl mb-6 transition"
              >
                Contact Seller
              </button>
            </div>

            {dealer && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Trusted Dealer</h3>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                    {dealer.name[0]}
                  </div>
                  <h4 className="text-xl font-bold">{dealer.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{dealer.address}</p>
                  <p className="mt-4 font-semibold">{dealer.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;