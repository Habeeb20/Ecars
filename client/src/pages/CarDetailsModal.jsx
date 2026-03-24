// src/components/CarDetailModal.jsx
import React from 'react';
import { X, MapPin, Calendar, Gauge, Fuel, Car as CarIcon, Shield, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

const CarDetailModal = ({ car, isOpen, onClose, onMakeOffer }) => {
  if (!isOpen || !car) return null;

  const formatPrice = (price) => {
    return '₦' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatMileage = (mileage) => {
    return mileage ? mileage.toLocaleString() + ' km' : 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[90] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="relative h-80 bg-slate-900">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
          >
            <X className="h-6 w-6" />
          </button>

          {car.images?.[0] ? (
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <CarIcon className="h-24 w-24 text-slate-600" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
            <h1 className="text-4xl font-bold text-white">
              {car.title || `${car.make} ${car.model}`}
            </h1>
            <p className="text-3xl font-semibold text-emerald-400 mt-2">
              {formatPrice(car.price)}
            </p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Key Specs */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CarIcon className="h-7 w-7 text-indigo-600" />
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  { icon: CarIcon, label: 'Transmission', value: car.transmission },
                  { icon: CarIcon, label: 'Body Type', value: car.bodyType },
                  { icon: Shield, label: 'Condition', value: car.condition },
                  { icon: MapPin, label: 'Location', value: `${car.location?.state || ''}, ${car.location?.lga || ''}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl">
                    <item.icon className="h-8 w-8 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="font-semibold text-lg">{item.value || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                {car.description || "No description provided by the seller."}
              </p>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {car.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Seller + Actions */}
          <div className="space-y-6">
            {/* Seller Info */}
            {car.postedBy && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {car.postedBy.firstName?.[0]}{car.postedBy.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xl">
                      {car.postedBy.firstName} {car.postedBy.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {car.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
                    </p>
                  </div>
                </div>

                {car.postedBy.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-3">
                    <Phone className="h-5 w-5" />
                    <span>{car.postedBy.phoneNumber}</span>
                  </div>
                )}

                {car.location?.state && (
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <MapPin className="h-5 w-5" />
                    <span>{car.location.state}, {car.location.lga}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => onMakeOffer(car)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all"
              >
                <MessageCircle className="h-6 w-6" />
                Make an Offer
              </button>

              <button
                onClick={() => {
                  if (car.postedBy?.phoneNumber) {
                    window.open(`https://wa.me/${car.postedBy.phoneNumber.replace(/\D/g, '')}`, '_blank');
                  } else {
                    toast.error("Seller phone number not available");
                  }
                }}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all"
              >
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Mobile Friendly) */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-6 flex gap-4 lg:hidden">
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl font-medium"
          >
            Close
          </button>
          <button
            onClick={() => onMakeOffer(car)}
            className="flex-1 py-4 bg-emerald-600 text-white font-semibold rounded-2xl"
          >
            Make Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailModal;