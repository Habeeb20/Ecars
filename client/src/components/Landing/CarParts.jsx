// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Loader2, 
//   Search, 
//   ShieldCheck, 
//   MapPin, 
//   DollarSign, 
//   Package, 
//   Star, 
//   Eye 
// } from 'lucide-react';
// import { toast } from 'sonner';

// const AllCarParts = () => {
//   const [parts, setParts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedPart, setSelectedPart] = useState(null);

//   useEffect(() => {
//     fetchCarParts();
//   }, [searchQuery]);

//   const fetchCarParts = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const query = new URLSearchParams({
//         title: searchQuery,
//       });

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts?${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       if (data.status === 'success') {
//         setParts(data.data.parts || []);
//       } else {
//         toast.error('Failed to load car parts');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col mt-10 md:flex-row justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
//             All Car Parts
//           </h1>
//           <div className="mt-4 md:mt-0 relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by title..."
//               className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Parts Grid */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
//           </div>
//         ) : parts.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No car parts found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Try different search terms
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {parts.map(part => (
//               <div key={part._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
//                 <img 
//                   src={part.images[0] || '/placeholder-part.jpg'} 
//                   alt={part.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                     {part.title}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     ₦{part.price.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                     Condition: {part.condition.toUpperCase()} • Type: {part.partType.toUpperCase()}
//                   </p>
//                   <div className="mb-4">
//                     <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
//                       Posted by: {part.seller.firstName} {part.seller.lastName}
//                       {part.seller.carPartSellerInfo.verified && (
//                         <ShieldCheck className="h-5 w-5 text-green-500" title="Verified Seller" />
//                       )}
//                     </h4>
//                     <p className="text-sm">Business: {part.seller.carPartSellerInfo.businessName}</p>
//                     <p className="text-sm">Location: {part.seller.carPartSellerInfo.state}, {part.seller.carPartSellerInfo.lga}</p>
//                     <p className="text-sm flex items-center gap-1">
//                       <Star className="h-4 w-4 text-yellow-500" />
//                       {part.seller.carPartSellerInfo.rating}
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => setSelectedPart(part)}
//                     className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
//                   >
//                     <Eye className="h-5 w-5" /> View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Part Details Modal */}
//       {selectedPart && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//               {selectedPart.title}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedPart.description}</p>
//             <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-4">₦{selectedPart.price.toLocaleString()}</p>
//             <p className="mb-2">Condition: {selectedPart.condition}</p>
//             <p className="mb-2">Part Type: {selectedPart.partType}</p>
//             <p className="mb-4">Compatible Makes: {selectedPart.compatibleMakes.join(', ')}</p>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {selectedPart.images.map((img, i) => (
//                 <img key={i} src={img} alt={`Image ${i+1}`} className="w-full h-40 object-cover rounded-lg" />
//               ))}
//             </div>
//             <div className="border-t pt-4">
//               <h3 className="font-bold mb-2">Seller Info</h3>
//               <p>{selectedPart.seller.firstName} {selectedPart.seller.lastName}</p>
//               <p>{selectedPart.seller.email}</p>
//               <p>{selectedPart.seller.phoneNumber}</p>
//             </div>
//             <button onClick={() => setSelectedPart(null)} className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCarParts;



















































/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Loader2, Search, ShieldCheck, MapPin, DollarSign, Package, Star, Eye,
  X, Phone, Mail, Wrench, Tag, User
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const navy = '#0B1B3E';
const rust = '#C2532A';

const AllCarParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCarParts();
    }, 350);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchCarParts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({ title: searchQuery });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setParts(data.data.parts || []);
      } else {
        toast.error('Failed to load car parts');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedPart ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPart]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt-12 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                Car Parts Marketplace
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Genuine and aftermarket parts from verified sellers
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts by name..."
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Package className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              No parts found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {parts.map((part) => (
              <div
                key={part._id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={part.images?.[0] || '/placeholder-part.jpg'}
                    alt={part.title}
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-white/95 text-gray-700 shadow-sm">
                    {part.condition}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-1 mb-1">
                    {part.title}
                  </h3>
                  <p className="text-lg font-black mb-3" style={{ color: rust }}>
                    ₦{part.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Wrench className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{part.partType}</span>
                  </div>
      <div>
 <p className="pl-6 text-sm font-bold">Business: {part.seller.carPartSellerInfo.businessName}</p>
                      </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-900/40 p-3 mb-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                

                      <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                      <span className="truncate">{part.seller.firstName} {part.seller.lastName}</span>
                      {part.seller.carPartSellerInfo?.verified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {part.seller.carPartSellerInfo?.state}, {part.seller.carPartSellerInfo?.lga}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                      {part.seller.carPartSellerInfo?.rating ?? 'N/A'}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPart(part)}
                    className="mt-auto w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: navy }}
                  >
                    <Eye className="h-4 w-4" /> View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part Details Modal */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[88vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-bold text-gray-900 dark:text-white text-base truncate pr-4">
                  {selectedPart.title}
                </h2>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Images */}
                {selectedPart.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedPart.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${selectedPart.title} ${i + 1}`}
                        className="w-full h-28 sm:h-32 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                )}

                {/* Price + condition */}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black" style={{ color: rust }}>
                    ₦{selectedPart.price.toLocaleString()}
                  </p>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {selectedPart.condition}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedPart.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="font-medium">Part type:</span> {selectedPart.partType}
                  </div>
                  {selectedPart.compatibleMakes?.length > 0 && (
                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Wrench className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-medium">Compatible with:</span>{' '}
                        {selectedPart.compatibleMakes.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Seller info */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                    Seller information
                    {selectedPart.seller.carPartSellerInfo?.verified && (
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    )}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      {selectedPart.seller.firstName} {selectedPart.seller.lastName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{selectedPart.seller.email}</span>
                    </div>
                    {selectedPart.seller.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                        {selectedPart.seller.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky footer action */}
              <div className="sticky bottom-0 px-5 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setSelectedPart(null)}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: navy }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllCarParts;