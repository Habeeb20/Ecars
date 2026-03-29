// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, MapPin, Calendar, Fuel, Gauge, Star, ChevronRight } from 'lucide-react';
// import { motion } from 'framer-motion';

// export const CarCard = ({ car, showDealerInfo = false }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [showAllFeatures, setShowAllFeatures] = useState(false);

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

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="card overflow-hidden group cursor-pointer"
//     >
//       <Link to={`/cars/${car._id}`} className="block">
//         {/* Image container */}
//         <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
//           <img
//             src={car.images?.[0] || '/placeholder-car.jpg'}
//             alt={car.title}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />

//           {/* Favorite button */}
//           <button
//             onClick={toggleFavorite}
//             className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
//             aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//           >
//             <Heart
//               className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
//             />
//           </button>

//           {/* Featured badge */}
//           {car.isFeatured && (
//             <div className="absolute top-3 left-3">
//               <span className="badge-primary">Featured</span>
//             </div>
//           )}

             
//             <div className="absolute top-3 right-3 p-2">
//               <span className="bg-blue-800 text-white p-2 rounded-md">for sale</span>
//             </div>
          


//           {/* Rating badge (if exists) */}
//           {car.rating && (
//             <div className="absolute bottom-3 left-3 flex items-center bg-black/70 text-white px-2 py-1 rounded-md text-xs">
//               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
//               <span>{car.rating.toFixed(1)}</span>
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{car.title}</h3>
//           </div>
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-lg font-semibold bg-green-800 p-2 rounded-md text-gray-900 dark:text-white line-clamp-1">Available</h3>
//           </div>

//           <div className="mb-3">
//             <span className="text-xl font-bold text-primary-600 dark:text-primary-500">
//               ₦{car.price?.toLocaleString() || 'N/A'}
//             </span>
//           </div>

//           {/* Car details */}
//           <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
//             <div className="flex items-center space-x-1">
//               <Calendar className="h-3.5 w-3.5" />
//               <span>{car.year || 'N/A'}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Gauge className="h-3.5 w-3.5" />
//               <span>{car.mileage?.toLocaleString() || 'N/A'} km</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Fuel className="h-3.5 w-3.5" />
//               <span>{car.fuelType || 'N/A'}</span>
//             </div>
//             <div className="flex items-center space-x-1 truncate">
//               <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
//               <span className="truncate">
//                 {car.location?.state ? `${car.location.state}, ${car.location.lga || ''}` : 'Location not specified'}
//               </span>
//             </div>
//           </div>

//           {/* Features */}
//           {car.features && car.features.length > 0 && (
//             <div className="mb-2">
//               <div className="flex flex-wrap gap-1.5 mb-1">
//                 {displayedFeatures.map((feature, index) => (
//                   <span
//                     key={index}
//                     className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
//                   >
//                     {feature}
//                   </span>
//                 ))}
//               </div>
//               {car.features.length > 2 && (
//                 <button
//                   onClick={toggleFeatures}
//                   className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center"
//                 >
//                   {showAllFeatures ? 'Show less' : `+${car.features.length - 2} more`}
//                   {!showAllFeatures && <ChevronRight className="h-3 w-3 ml-0.5" />}
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Dealer info (optional) */}
//           {showDealerInfo && car.postedBy && (
//             <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
//               <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                 <span>Sold by:</span>
//                 <Link
//                   to={`/dealers/${car.postedBy._id}`}
//                   className="ml-1 text-primary-600 dark:text-primary-400 hover:underline"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   {car.postedBy.firstName} {car.postedBy.lastName}
//                 </Link>
//               </div>
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
import { Heart, MapPin, Calendar, Fuel, Gauge, Star, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const CarCard = ({ car, showDealerInfo = false, onBookViewing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

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

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white transition-all"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            />
          </button>

          {/* Featured badge */}
          {car.isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">Featured</span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-16">
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">For Sale</span>
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

          {/* Car specs */}
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
          </div>

          {/* Features */}
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