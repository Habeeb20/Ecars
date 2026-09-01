

// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, MapPin, Share2, Calendar, Fuel, Gauge, Star, ChevronRight, Eye } from 'lucide-react';
// import { motion } from 'framer-motion';

// export const CarCard = ({ car, showDealerInfo = false, onBookViewing }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showAllFeatures, setShowAllFeatures] = useState(false);



//   const likes = car.likesCount ?? car.likeCount ?? 0;
//   const views = car.views ?? 0;
//   const shares = car.shareCount ?? 0;




//   console.log(car)

//   const toggleFavorite = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };

//   const toggleFeatures = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowAllFeatures(!showAllFeatures);
//   };

//   const displayedFeatures = car.features
//     ? showAllFeatures
//       ? car.features
//       : car.features.slice(0, 2)
//     : [];

//   const handleBookViewing = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onBookViewing) {
//       onBookViewing(car);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="card overflow-hidden group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all"
//     >
//       <Link to={`/cars/${car._id}`} className="block">
//         {/* Image container */}
//         <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
//           <img
//             src={car.images?.[0] || '/placeholder-car.jpg'}
//             alt={car.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />

//           {/* Favorite button */}
//           <button
//             onClick={toggleFavorite}
//             className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white transition-all"
//           >
//             <Heart
//               className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
//             />
//           </button>

//           {/* Featured badge */}
//           {car.isFeatured && (
//             <div className="absolute top-3 left-3">
//               <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">Featured</span>
              
//             </div>
//           )}

//           {/* Status badge */}
//           <div className="absolute top-3 right-16">
//             <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">For Sale</span>

//           </div>
//              <div className="absolute top-3 left-5">
//  <p className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">{car.postedBy?.role === 'dealer' ? 'Dealer' : 'Personal'}</p>
//              </div>

                       
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
//             {car.title} 
//           </h3>

//           <div className="mb-3">
//             <span className="text-2xl font-bold text-green-600">
//               ₦{car.price?.toLocaleString() || 'N/A'}
//             </span>
//           </div>

//           {/* Car specs */}
//           <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
//             <div className="flex items-center gap-1.5">
//               <Calendar className="h-4 w-4" />
//               <span>{car.year}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Gauge className="h-4 w-4" />
//               <span>{car.mileage?.toLocaleString()} km</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Fuel className="h-4 w-4" />
//               <span>{car.fuelType}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <MapPin className="h-4 w-4" />
//               <span className="truncate">{car.location?.state}, {car.location?.lga}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Fuel className="h-4 w-4" />
//               <span>{car.condition}</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <MapPin className="h-4 w-4" />
//               <span className="truncate">{car.transmission}</span>
//             </div>
//           </div>

//           {/* Features */}
//           {car.features && car.features.length > 0 && (
//             <div className="mb-4">
//               <div className="flex flex-wrap gap-1.5">
//                 {displayedFeatures.map((feature, i) => (
//                   <span key={i} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
//                     {feature}
//                   </span>
//                 ))}
//               </div>
//               {car.features.length > 2 && (
//                 <button
//                   onClick={toggleFeatures}
//                   className="text-xs text-blue-600 mt-1 hover:underline"
//                 >
//                   {showAllFeatures ? 'Show less' : `+${car.features.length - 2} more`}
//                 </button>
//               )}
//             </div>
//           )}
//         <div className="flex justify-center items-center gap-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-3 shadow-sm hover:from-gray-100 hover:to-gray-300 transition-colors">
//       {/* Likes */}
//       <div className="flex items-center gap-1 text-gray-700">
//         <Heart className="h-5 w-5 text-slate-500" />
//         <span className="font-semibold text-gray-900">{likes}</span>
//       </div>

//       {/* Views */}
//       <div className="flex items-center gap-1 text-gray-700">
//         <Eye className="h-5 w-5 text-slate-500" />
//         <span className="font-semibold text-gray-900">{views}</span>
//       </div>

//       {/* Shares */}
//       <div className="flex items-center gap-1 text-gray-700">
//         <Share2 className="h-5 w-5 text-slate-500" />
//         <span className="font-semibold text-gray-900">{shares}</span>
//       </div>
//     </div>
//           {/* Action Buttons */}
//           <div className="flex gap-3 mt-4">
//             <button
//               onClick={handleBookViewing}
//               className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
//             >
//               <Eye className="h-5 w-5" />
//               Book Viewing
//             </button>

//             <Link
//               to={`/cars/${car._id}`}
//               className="flex-1 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl text-center transition"
//             >
//               View Details
//             </Link>

//             {car.postedBy?.phoneNumber}
//           </div>

//           {/* Dealer Info (optional) */}
//           {showDealerInfo && car.postedBy && (
//             <div className="mt-3 pt-3 border-t text-xs text-gray-500">
//               Sold by: {car.postedBy.firstName} {car.postedBy.lastName}
//             </div>
//           )}
//         </div>
//       </Link>
//     </motion.div>
//   );
// };







/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Share2, Calendar, Fuel, Gauge, Star, ChevronRight, Eye, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const CarCard = ({ car, showDealerInfo = false, onBookViewing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const likes = car.likesCount ?? car.likeCount ?? 0;
  const views = car.views ?? 0;
  const shares = car.shareCount ?? 0;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const toggleFeatures = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAllFeatures(!showAllFeatures);
  };

  const displayedFeatures = car.features
    ? showAllFeatures
      ? car.features
      : car.features.slice(0, 2)
    : [];

  const handleBookViewing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookViewing) {
      onBookViewing(car);
    }
  };

  // Normalize Nigerian numbers (080..., +234..., 234...) into wa.me's required format (no +, no leading 0)
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, ''); // strip spaces, +, dashes, etc.
    if (digits.startsWith('234')) return digits;
    if (digits.startsWith('0')) return `234${digits.slice(1)}`;
    return digits;
  };

  const whatsappNumber = formatPhoneForWhatsApp(car.postedBy?.phoneNumber);
  const whatsappMessage = "Hello, I found your business on eCars and would like to make an enquiry about some cars.";
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (whatsappLink) {
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all"
    >
      <Link to={`/cars/${car._id}`} className="block">
        {/* Image container */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
          <img
            src={car.images?.[0] || '/placeholder-car.jpg'}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white transition-all"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            />
          </button>

          {car.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">Featured</span>
            </div>
          )}

          <div className="absolute top-3 right-16">
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">For Sale</span>
          </div>
          <div className="absolute top-3 left-5">
            <p className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {car.postedBy?.role === 'dealer' ? 'Dealer' : 'Personal'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
            {car.title}
          </h3>

          <div className="mb-3">
            <span className="text-2xl font-bold text-green-600">
              ₦{car.price?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{car.year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" />
              <span>{car.mileage?.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4" />
              <span>{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{car.location?.state}, {car.location?.lga}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4" />
              <span>{car.condition}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {displayedFeatures.map((feature, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
              {car.features.length > 2 && (
                <button
                  onClick={toggleFeatures}
                  className="text-xs text-blue-600 mt-1 hover:underline"
                >
                  {showAllFeatures ? 'Show less' : `+${car.features.length - 2} more`}
                </button>
              )}
            </div>
          )}

          <div className="flex justify-center items-center gap-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-3 shadow-sm hover:from-gray-100 hover:to-gray-300 transition-colors">
            <div className="flex items-center gap-1 text-gray-700">
              <Heart className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-gray-900">Likes {likes}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Eye className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-gray-900">Views {views}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Share2 className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-gray-900">Shares {shares}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleBookViewing}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Book Viewing
            </button>

            <Link
              to={`/cars/${car._id}`}
              className="flex-1 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl text-center transition"
            >
              View Details
            </Link>
          </div>

          {whatsappLink && (
            <button
              onClick={handleWhatsAppClick}
              className="w-full mt-3 py-3 bg-white hover:bg-white text-green-800 font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </button>
          )}

          {/* Dealer Info (optional) */}
          {showDealerInfo && car.postedBy && (
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              Sold by: {car.postedBy.firstName} {car.postedBy.lastName}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};