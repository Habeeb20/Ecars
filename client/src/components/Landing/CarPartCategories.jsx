// // src/components/CarPartsCategories.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // if using react-router
// import { Loader2, X, Phone, MapPin, Building } from 'lucide-react';

// const COMMON_MAKES = [
//   'Toyota', 'Honda', 'Lexus', 'Mercedes-Benz', 'Nissan',
//   'Hyundai', 'Kia', 'Ford', 'Volkswagen', 'Mazda',
//   'Peugeot', 'BMW', 'Audi', 'Chevrolet', 'Innoson'
//   // you can add more from real data later
// ];

// const CarPartsCategories = () => {
//   const [categories, setCategories] = useState([]); // { title, count, sampleImage?, condition? }
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedCondition, setSelectedCondition] = useState('');
//   const [selectedMake, setSelectedMake] = useState('');
//   const [categoryItems, setCategoryItems] = useState([]); // listings for clicked title
//   const [modalLoading, setModalLoading] = useState(false);

//   const navigate = useNavigate();

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       let url = `${import.meta.env.VITE_BACKEND_URL}/carparts/categories?limit=5`;

//       if (selectedCondition) url += `&condition=${selectedCondition}`;
//       if (selectedMake) url += `&compatibleMakes=${encodeURIComponent(selectedMake)}`;

//       const token = localStorage.getItem('token');
//       const res = await fetch(url, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       if (!res.ok) throw new Error('Failed to load categories');

//       const data = await res.json();
//       if (data.status === 'success') {
//         setCategories(data.data || []);
//       } else {
//         throw new Error(data.message || 'Error');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchItemsByTitle = async (title) => {
//     setModalLoading(true);
//     setCategoryItems([]);
//     try {
//       let url = `${import.meta.env.VITE_BACKEND_URL}/carparts/by-title/${encodeURIComponent(title)}`;

//       if (selectedCondition) url += `?condition=${selectedCondition}`;
//       if (selectedMake) url += `${selectedCondition ? '&' : '?'}compatibleMakes=${encodeURIComponent(selectedMake)}`;

//       const token = localStorage.getItem('token');
//       const res = await fetch(url, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });

//       const data = await res.json();
//       if (data.status === 'success') {
//         setCategoryItems(data.data || []);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [selectedCondition, selectedMake]);

//   const handleCardClick = (title) => {
//     setSelectedCategory(title);
//     fetchItemsByTitle(title);
//   };

//   const resetFilters = () => {
//     setSelectedCondition('');
//     setSelectedMake('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header + Filters */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//           <div>
//             <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Car Parts Categories
//             </h1>
//             <p className="mt-2 text-gray-600 dark:text-gray-400">
//               Browse popular parts by title — click to see listings & seller info
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-4 items-center">
//             <select
//               value={selectedCondition}
//               onChange={(e) => setSelectedCondition(e.target.value)}
//               className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="">All Conditions</option>
//               <option value="new">New</option>
//               <option value="used">Used</option>
//               <option value="refurbished">Refurbished</option>
//             </select>

//             <select
//               value={selectedMake}
//               onChange={(e) => setSelectedMake(e.target.value)}
//               className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="">All Makes</option>
//               {COMMON_MAKES.map((make) => (
//                 <option key={make} value={make}>{make}</option>
//               ))}
//             </select>

//             {(selectedCondition || selectedMake) && (
//               <button
//                 onClick={resetFilters}
//                 className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm hover:bg-red-100 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Grid - 5 categories */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
//           </div>
//         ) : error ? (
//           <div className="text-center py-12 text-red-600">{error}</div>
//         ) : categories.length === 0 ? (
//           <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//             No car parts found matching your filters.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
//             {categories.map((cat) => (
//               <div
//                 key={cat.title}
//                 onClick={() => handleCardClick(cat.title)}
//                 className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
//               >
//                 <div className="h-40 bg-gray-100 dark:bg-gray-700 relative">
//                   {cat.sampleImage ? (
//                     <img
//                       src={cat.sampleImage}
//                       alt={cat.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-gray-400">
//                       No Image
//                     </div>
//                   )}
//                   <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
//                     {cat.count}
//                   </div>
//                 </div>

//                 <div className="p-5">
//                   <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
//                     {cat.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {cat.condition ? `Condition: ${cat.condition.toUpperCase()}` : 'Various conditions'}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* View All Categories Button */}
//         <div className="text-center mt-12">
//           <button
//             onClick={() => navigate('/car-parts/all-categories')}
//             className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
//           >
//             View All Categories →
//           </button>
//         </div>
//       </div>

//       {/* Modal - Selected Category Details */}
//       {selectedCategory && (
//         <div
//           className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
//           onClick={() => setSelectedCategory(null)}
//         >
//           <div
//             className="bg-white dark:bg-gray-850 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-white dark:bg-gray-850 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center z-10 rounded-t-2xl">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
//                 {selectedCategory}
//               </h2>
//               <button
//                 onClick={() => setSelectedCategory(null)}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="p-6">
//               {modalLoading ? (
//                 <div className="flex justify-center py-12">
//                   <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//                 </div>
//               ) : categoryItems.length === 0 ? (
//                 <p className="text-center text-gray-500 py-10">No listings found for this title.</p>
//               ) : (
//                 <div className="space-y-8">
//                   {categoryItems.map((part) => (
//                     <div
//                       key={part._id}
//                       className="border-b pb-8 last:border-b-0 last:pb-0 grid grid-cols-1 md:grid-cols-3 gap-6"
//                     >
//                       {/* Images */}
//                       <div className="md:col-span-1">
//                         {part.images?.length > 0 ? (
//                           <div className="grid grid-cols-2 gap-3">
//                             {part.images.slice(0, 4).map((img, i) => (
//                               <img
//                                 key={i}
//                                 src={img}
//                                 alt=""
//                                 className="w-full h-32 object-cover rounded-lg shadow-sm"
//                               />
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
//                             No images
//                           </div>
//                         )}
//                       </div>

//                       {/* Details */}
//                       <div className="md:col-span-2 space-y-4">
//                         <div>
//                           <h4 className="text-xl font-bold">{part.title}</h4>
//                           <p className="text-2xl font-semibold text-green-600 mt-1">
//                             ₦{part.price.toLocaleString()}
//                           </p>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="font-medium">Condition:</span>{' '}
//                             {part.condition.toUpperCase()}
//                           </div>
//                           <div>
//                             <span className="font-medium">Part Type:</span>{' '}
//                             {part.partType.toUpperCase()}
//                           </div>
//                           <div>
//                             <span className="font-medium">Views:</span> {part.views}
//                           </div>
//                           <div>
//                             <span className="font-medium">Inquiries:</span> {part.inquiries}
//                           </div>
//                         </div>

//                         {part.compatibleMakes?.length > 0 && (
//                           <div>
//                             <span className="font-medium">Compatible Makes:</span>{' '}
//                             <div className="flex flex-wrap gap-2 mt-1.5">
//                               {part.compatibleMakes.map((m, i) => (
//                                 <span
//                                   key={i}
//                                   className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-xs"
//                                 >
//                                   {m}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         <div>
//                           <h5 className="font-semibold mt-4 mb-1">Description</h5>
//                           <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                             {part.description}
//                           </p>
//                         </div>

//                         {/* Seller Info */}
//                         {part.seller && (
//                           <div className="mt-6 pt-6 border-t dark:border-gray-700">
//                             <h5 className="font-semibold mb-3 flex items-center gap-2">
//                               <Building className="h-5 w-5" /> Seller Information
//                             </h5>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                               <div>
//                                 <p className="font-medium">
//                                   {part.seller.firstName} {part.seller.lastName}
//                                 </p>
//                                 {part.seller.carPartSellerInfo?.businessName && (
//                                   <p className="text-indigo-600">
//                                     {part.seller.carPartSellerInfo.businessName}
//                                   </p>
//                                 )}
//                               </div>
//                               {part.seller.phoneNumber && (
//                                 <div className="flex items-center gap-2">
//                                   <Phone className="h-4 w-4" />
//                                   {part.seller.phoneNumber}
//                                 </div>
//                               )}
//                               {part.seller.carPartSellerInfo?.state && (
//                                 <div className="flex items-center gap-2">
//                                   <MapPin className="h-4 w-4" />
//                                   {part.seller.carPartSellerInfo.state},{' '}
//                                   {part.seller.carPartSellerInfo.lga || ''}
//                                 </div>
//                               )}
//                               {part.seller.email && (
//                                 <div className="text-gray-600 dark:text-gray-400">
//                                   {part.seller.email}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CarPartsCategories;






// src/components/CarPartsCategories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Loader2, X, Phone, MapPin, Building, MessageCircle, Send 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';
const COMMON_MAKES = [
  'Toyota', 'Honda', 'Lexus', 'Mercedes-Benz', 'Nissan',
  'Hyundai', 'Kia', 'Ford', 'Volkswagen', 'Mazda',
  'Peugeot', 'BMW', 'Audi', 'Chevrolet', 'Innoson'
];

const CarPartsCategories = () => {
const  user = localStorage.getItem("token")
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [categoryItems, setCategoryItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Chat states
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navigate = useNavigate();

  // ── Fetch grouped categories ────────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/carparts/categories?limit=5`;
      if (selectedCondition) url += `&condition=${selectedCondition}`;
      if (selectedMake) url += `${selectedCondition ? '&' : '?'}compatibleMakes=${encodeURIComponent(selectedMake)}`;

      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();

      if (data.status === 'success') {
        setCategories(data.data || []);
      } else {
        throw new Error(data.message || 'Error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch listings for selected title ────────────────────────────────
  const fetchItemsByTitle = async (title) => {
    setModalLoading(true);
    setCategoryItems([]);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/carparts/by-title/${encodeURIComponent(title)}`;
      if (selectedCondition) url += `?condition=${selectedCondition}`;
      if (selectedMake) url += `${selectedCondition ? '&' : '?'}compatibleMakes=${encodeURIComponent(selectedMake)}`;

      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (data.status === 'success') {
        setCategoryItems(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedCondition, selectedMake]);

  const handleCardClick = (title) => {
    setSelectedCategory(title);
    fetchItemsByTitle(title);
  };

  const resetFilters = () => {
    setSelectedCondition('');
    setSelectedMake('');
  };

  // ── Messaging Functions (copied & adapted from your BrowseListings) ──
  const openChat = async (seller) => {
    if (!seller?._id) {
      toast.error("Cannot open chat - seller information missing");
    
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to message sellers");
              navigate('/login', {
              state: { from: location },
      });
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${seller._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.status === 'success') {
        setChatMessages(data.data.messages || []);
        setSelectedChat({
          sellerId: seller._id,
          sellerName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Seller',
          sellerAvatar: seller.avatar || '/default-avatar.jpg',
          verified: seller.carPartSellerInfo?.verified || false,
        });
        setChatOpen(true);
      } else {
        toast.error(data.message || 'Failed to load conversation');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to open chat');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !selectedChat?.sellerId) return;

    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: selectedChat.sellerId,
          content: newMessage.trim(),
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setChatMessages(prev => [...prev, data.data.message]);
        setNewMessage('');
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while sending message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Car Parts Categories
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Browse popular parts by title — click to see listings & seller info
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>

            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Makes</option>
              {COMMON_MAKES.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>

            {(selectedCondition || selectedMake) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm hover:bg-red-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 5 Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No car parts found matching your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.title}
                onClick={() => handleCardClick(cat.title)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className="h-40 bg-gray-100 dark:bg-gray-700 relative">
                  {cat.sampleImage ? (
                    <img
                      src={cat.sampleImage}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {cat.count}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cat.condition ? `Condition: ${cat.condition.toUpperCase()}` : 'Various conditions'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/car-parts/all-categories')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            View All Categories →
          </button>
        </div>
      </div>

      {/* ── Modal: Category Listings ──────────────────────────────────────── */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-white dark:bg-gray-850 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-850 px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {selectedCategory}
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {modalLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
              ) : categoryItems.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No listings found for this title.</p>
              ) : (
                <div className="space-y-8">
                  {categoryItems.map((part) => (
                    <div
                      key={part._id}
                      className="border-b pb-8 last:border-b-0 last:pb-0 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      {/* Images */}
                      <div className="md:col-span-1">
                        {part.images?.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {part.images.slice(0, 4).map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                alt=""
                                className="w-full h-32 object-cover rounded-lg shadow-sm"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            No images
                          </div>
                        )}
                      </div>

                      {/* Details + Message Button */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="text-xl font-bold">{part.title}</h4>
                          <p className="text-2xl font-semibold text-green-600 mt-1">
                            ₦{part.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium">Condition:</span> {part.condition.toUpperCase()}</div>
                          <div><span className="font-medium">Part Type:</span> {part.partType.toUpperCase()}</div>
                          <div><span className="font-medium">Views:</span> {part.views}</div>
                          <div><span className="font-medium">Inquiries:</span> {part.inquiries}</div>
                        </div>

                        {part.compatibleMakes?.length > 0 && (
                          <div>
                            <span className="font-medium">Compatible Makes:</span>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {part.compatibleMakes.map((m, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-xs">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h5 className="font-semibold mt-4 mb-1">Description</h5>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {part.description}
                          </p>
                        </div>

                        {/* Seller Info + Message Button */}
                        {part.seller && (
                          <div className="mt-6 pt-6 border-t dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                              <h5 className="font-semibold flex items-center gap-2">
                                <Building className="h-5 w-5" /> Seller
                              </h5>
                              <button
                                onClick={() => openChat(part.seller)}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
                              >
                                <MessageCircle className="h-4 w-4" />
                                Message Seller
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">
                                  {part.seller.firstName} {part.seller.lastName}
                                </p>
                                {part.seller.carPartSellerInfo?.businessName && (
                                  <p className="text-indigo-600">
                                    {part.seller.carPartSellerInfo.businessName}
                                  </p>
                                )}
                              </div>
                              {part.seller.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {part.seller.phoneNumber}
                                </div>
                              )}
                              {part.seller.carPartSellerInfo?.state && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {part.seller.carPartSellerInfo.state}, {part.seller.carPartSellerInfo.lga || ''}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Chat Modal (same as in BrowseListings) ──────────────────────────────── */}
      {chatOpen && selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChat.sellerAvatar}
                  alt={selectedChat.sellerName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedChat.sellerName}</h3>
                  {selectedChat.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ShieldCheck className="h-4 w-4" /> Verified
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                  <p>Start the conversation!</p>
                  <p className="text-sm mt-1">Say hello and discuss the part</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        msg.sender._id === user?._id
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-shadow"
              >
                {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPartsCategories;