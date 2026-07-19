



// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Loader2, 
//   Search, 
//   MessageCircle, 
//   Send, 
//   X, 
//   ShieldCheck, 
//   MapPin, 
//   Phone, 
//   Package, 
//   Wrench, 
//   Car 
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '../../contexts/AuthContext';
// import DistanceInfo from './DistanceMap';

// const BrowseListings = () => {
//   const { user } = useAuth();
//   console.log(user)
//   const [activeTab, setActiveTab] = useState('cars'); // 'cars' | 'parts' | 'services'
//   const [allListings, setAllListings] = useState([]);        // Full unfiltered data
//   const [displayedListings, setDisplayedListings] = useState([]); // Filtered data for UI
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sending, setSending] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);
//    const token = localStorage.getItem('token');
//   // Fetch listings when tab changes (no search param here)
//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         let endpoint = '';

//         if (activeTab === 'cars') endpoint = '/cars/allcars';
//         else if (activeTab === 'parts') endpoint = '/carparts';
//         else if (activeTab === 'services') endpoint = '/users/service-providers';

//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error('Network response was not ok');

//         const data = await res.json();
// console.log(data)
//         if (data.status === 'success') {
//           const items = data.data.cars || data.data.parts || data.data.providers || [];
//           setAllListings(items);
//           setDisplayedListings(items); // initially show all
//         } else {
//           toast.error(data.message || 'Failed to load listings');
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//         toast.error('Failed to load listings. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchListings();
//   }, [activeTab]);

//   // Client-side filtering - updates instantly when search changes
//   const filteredListings = useMemo(() => {
//     if (!searchQuery.trim()) return allListings;

//     const query = searchQuery.toLowerCase().trim();

//     return allListings.filter(item => {
//       // Common fields across all types
//       const title = (item.title || item.businessName || '').toLowerCase();
//       const description = (item.description || '').toLowerCase();
      
//       // Car-specific
//       const make = (item.make || '').toLowerCase();
//       const model = (item.model || '').toLowerCase();
      
//       // Parts-specific
//       const partName = (item.partName || '').toLowerCase();
//       const category = (item.category || '').toLowerCase();

//       // Location handling (flexible for different structures)
//       const locationText = [
//         item.location?.state,
//         item.location?.lga,
//         item.location?.city,
//         item.state,
//         item.lga,
//         item.city,
//         item.seller?.location?.state,
//         item.seller?.location?.lga,
//       ].filter(Boolean).join(' ').toLowerCase();

//       return (
//         title.includes(query) ||
//         description.includes(query) ||
//         make.includes(query) ||
//         model.includes(query) ||
//         partName.includes(query) ||
//         category.includes(query) ||
//         locationText.includes(query)
//       );
//     });
//   }, [allListings, searchQuery]);

//   // Sync displayed listings when filtered result changes
//   useEffect(() => {
//     setDisplayedListings(filteredListings);
//   }, [filteredListings]);

//   const openChat = async (seller) => {
//     console.log(seller)
//     if (!seller?._id) {
//       toast.error("Cannot open chat - seller information missing");
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${seller._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         setChatMessages(data.data.messages || []);
//         setSelectedChat({
//           sellerId: seller._id,
//           sellerName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'Seller',
//           sellerAvatar: seller.avatar || '/default-avatar.jpg',
//           verified: 
//             seller.carPartSellerInfo?.verified || 
//             seller.dealerInfo?.verified || 
//             seller.serviceProviderInfo?.verified || 
//             false,
//         });
//         setChatOpen(true);
//       } else {
//         toast.error(data.message || 'Failed to load conversation');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to open chat');
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || sending || !selectedChat?.sellerId) return;

//     setSending(true);

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           recipient: selectedChat.sellerId,
//           content: newMessage.trim(),
//         }),
//       });

//       const data = await res.json();

//       if (data.status === 'success') {
//         setChatMessages(prev => [...prev, data.data.message]);
//         setNewMessage('');
//       } else {
//         toast.error(data.message || 'Failed to send message');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Network error while sending message');
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Browse Listings
//           </h1>
//           <div className="mt-4 md:mt-0 relative w-full md:w-80">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by title, make, model, part, or location..."
//               className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md transition-all"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1">
//           <button
//             onClick={() => setActiveTab('cars')}
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
//               activeTab === 'cars'
//                 ? 'text-indigo-600 border-b-2 border-indigo-600'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
//             }`}
//           >
//             <Car className="h-5 w-5" />
//             Cars
//           </button>
//           <button
//             onClick={() => setActiveTab('parts')}
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
//               activeTab === 'parts'
//                 ? 'text-indigo-600 border-b-2 border-indigo-600'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
//             }`}
//           >
//             <Package className="h-5 w-5" />
//             Car Parts
//           </button>
//           <button
//             onClick={() => setActiveTab('services')}
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
//               activeTab === 'services'
//                 ? 'text-indigo-600 border-b-2 border-indigo-600'
//                 : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
//             }`}
//           >
//             <Wrench className="h-5 w-5" />
//             Services
//           </button>
//         </div>

//         {/* Listings Grid */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
//           </div>
//         ) : displayedListings.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No {activeTab === 'cars' ? 'cars' : activeTab === 'parts' ? 'car parts' : 'services'} found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Try adjusting your search or check back later
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedListings.map((item) => (
//               <div 
//                 key={item._id} 
//                 className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
//               >
//                 <img 
//                   src={item.images?.[0] || item.serviceProviderInfo?.workshopPhotos || item?.avatar || '/placeholder-car.jpg'} 
//                   alt={item.title || item.businessName || item.serviceProviderInfo?.businessName || 'Listing'}
//                   className="w-full h-48 object-cover"
//                   onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
//                     {item.title || item.businessName ||  item.serviceProviderInfo?.businessName ||'Untitled Listing'}
//                   </h3>

//                   {item.price && (
//                     <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
//                       ₦{Number(item.price).toLocaleString()}
//                     </p>
//                   )}

//                   <div className="mb-6 space-y-2 text-sm">
//                     <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
//                       <MapPin className="h-4 w-4 flex-shrink-0" />
//                       {typeof item.location === 'object' && item.location
//                         ? `${item.location.state || ''}${item.location.lga ? ', ' + item.location.lga : ''}`
//                         : item.location || `${item.state || ''}${item.lga ? ', ' + item.serviceProviderInfo.lga : ''} ` || `${item.serviceProviderInfo?.lga}` || 'Location not specified'}
//                     </p>

//                     <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
//                       <Phone className="h-4 w-4 flex-shrink-0" />
//                       {item.postedBy?.phoneNumber || item.serviceProviderInfo?.phoneNumber || 'Contact via chat'}
//                     </p>

//                     {(item.postedBy?.dealerInfo?.verified || 
//                       item.postedBy?.carPartSellerInfo?.verified || 
//                       item.postedBy?.serviceProviderInfo?.verified) && (
//                       <p className="text-green-600 dark:text-green-400 flex items-center gap-1">
//                         <ShieldCheck className="h-4 w-4" />
//                         Verified Seller
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => openChat(item.postedBy)}
//                     className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300"
//                   >
//                     <MessageCircle className="h-5 w-5" />
//                     Message Seller
//                   </button>

//                        <DistanceInfo

//                             clientAddressParts={{
//                         address: user?.address || user?.dealerInfo?.businessAddress || user?.dealerInfo?.lga ,
//                         lga:user?.lga || user?.dealerInfo?.lga ,
//                         state: user?.state || user?.dealerInfo?.state
//                       }}
                    
//                       providerAddressParts={{
//                         address: item.location?.lga ,
//                         lga:item.location?.lga ,
//                         state: item.location?.state
//                       }}
//                     />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Modal */}
//       {selectedChat && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
//               <div className="flex items-center gap-3">
//                 <img 
//                   src={selectedChat.sellerAvatar || '/default-avatar.jpg'} 
//                   alt={selectedChat.sellerName}
//                   className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
//                 />
//                 <div>
//                   <h3 className="font-bold text-lg">{selectedChat.sellerName}</h3>
//                   {selectedChat.verified && (
//                     <div className="flex items-center gap-1 text-sm text-green-600">
//                       <ShieldCheck className="h-4 w-4" />
//                       Verified
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setSelectedChat(null)}
//                 className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//               >
//                 <X className="h-6 w-6 text-gray-500" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30">
//               {chatMessages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
//                   <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
//                   <p>Start the conversation!</p>
//                   <p className="text-sm mt-1">Say hello and discuss the listing</p>
//                 </div>
//               ) : (
//                 chatMessages.map((msg) => (
//                   <div 
//                     key={msg._id} 
//                     className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div 
//                       className={`max-w-[75%] px-4 py-3 rounded-2xl ${
//                         msg.sender._id === user?._id 
//                           ? 'bg-indigo-600 text-white rounded-br-none' 
//                           : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
//                       }`}
//                     >
//                       <p className="break-words">{msg.content}</p>
//                       <p className="text-xs opacity-70 mt-1 text-right">
//                         {new Date(msg.createdAt).toLocaleTimeString([], { 
//                           hour: '2-digit', 
//                           minute: '2-digit' 
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && !sending && sendMessage()}
//                 placeholder="Type your message..."
//                 className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={sending || !newMessage.trim()}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-shadow"
//               >
//                 {sending ? (
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                 ) : (
//                   <Send className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrowseListings;





/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Loader2, Search, MessageCircle, Send, X, ShieldCheck, MapPin, Phone,
  Package, Wrench, Car, Frown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import DistanceInfo from './DistanceMap';

const navy = '#0B1B3E';
const rust = '#C2532A';

const TABS = [
  { key: 'cars', label: 'Cars', icon: Car },
  { key: 'parts', label: 'Car Parts', icon: Package },
  { key: 'services', label: 'Services', icon: Wrench },
];

/* -------------------------------------------------------------------- */
/*  Normalizes "who owns this listing" across cars / parts / services,   */
/*  since each type stores the seller/provider under a different key.   */
/* -------------------------------------------------------------------- */
function getListingOwner(item, tab) {
  if (tab === 'services') return item; // the provider IS the listing (a User doc)
  return item.postedBy || item.seller || null;
}

function getOwnerVerified(owner) {
  return !!(
    owner?.dealerInfo?.verified ||
    owner?.carPartSellerInfo?.verified ||
    owner?.serviceProviderInfo?.verified
  );
}

function getOwnerPhone(item, owner, tab) {
  return (
    owner?.phoneNumber ||
    item.phoneNumber ||
    (tab === 'services' ? owner?.serviceProviderInfo?.phoneNumber : null) ||
    null
  );
}

function getListingTitle(item, tab) {
  if (tab === 'cars') {
    const parts = [item.year, item.make, item.model].filter(Boolean);
    if (parts.length) return parts.join(' ');
    return item.title || 'Untitled Listing';
  }
  return (
    item.title ||
    item.businessName ||
    item.serviceProviderInfo?.businessName ||
    'Untitled Listing'
  );
}

function getListingImage(item) {
  return (
    item.images?.[0] ||
    item.serviceProviderInfo?.workshopPhotos?.[0] ||
    item.avatar ||
    '/placeholder-car.jpg'
  );
}

function getListingLocation(item, owner) {
  if (typeof item.location === 'object' && item.location) {
    return [item.location.state, item.location.lga].filter(Boolean).join(', ') || null;
  }
  if (typeof item.location === 'string' && item.location) return item.location;
  const state = item.state || owner?.dealerInfo?.state || owner?.serviceProviderInfo?.state;
  const lga = item.lga || owner?.dealerInfo?.lga || owner?.serviceProviderInfo?.lga;
  const combined = [state, lga].filter(Boolean).join(', ');
  return combined || null;
}

const BrowseListings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cars');
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        let endpoint = '';

        if (activeTab === 'cars') endpoint = '/cars/allcars';
        else if (activeTab === 'parts') endpoint = '/carparts';
        else if (activeTab === 'services') endpoint = '/users/service-providers';

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();

        if (data.status === 'success') {
          const items = data.data.cars || data.data.parts || data.data.providers || [];
          setAllListings(items);
        } else {
          toast.error(data.message || 'Failed to load listings');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to load listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    setSearchQuery('');
  }, [activeTab]);

  // Client-side filtering — builds one combined searchable string per item so
  // multi-word queries like "toyota camry" match across make + model together,
  // not just within a single field in isolation.
  const displayedListings = useMemo(() => {
    if (!searchQuery.trim()) return allListings;
    const query = searchQuery.toLowerCase().trim();

    return allListings.filter((item) => {
      const owner = getListingOwner(item, activeTab);
      const haystack = [
        item.title,
        item.make,
        item.model,
        item.year,
        item.businessName,
        item.serviceProviderInfo?.businessName,
        item.description,
        item.partName,
        item.category,
        item.partType,
        item.location?.state,
        item.location?.lga,
        item.location?.city,
        item.state,
        item.lga,
        item.city,
        owner?.firstName,
        owner?.lastName,
        owner?.dealerInfo?.state,
        owner?.dealerInfo?.lga,
        owner?.serviceProviderInfo?.state,
        owner?.serviceProviderInfo?.lga,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [allListings, searchQuery, activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    document.body.style.overflow = selectedChat ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedChat]);

  const openChat = async (item) => {
    const owner = getListingOwner(item, activeTab);

    if (!owner?._id) {
      toast.error('Cannot open chat — seller information is missing.');
      return;
    }

    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${owner._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.status === 'success') {
        setChatMessages(data.data.messages || []);
        setSelectedChat({
          sellerId: owner._id,
          sellerName: `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Seller',
          sellerAvatar: owner.avatar || '/default-avatar.jpg',
          verified: getOwnerVerified(owner),
        });
      } else {
        toast.error(data.message || 'Failed to load conversation');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to open chat');
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async () => {
    const content = newMessage.trim();
    if (!content || sending || !selectedChat?.sellerId) return;

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
          content,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setChatMessages((prev) => [...prev, data.data.message]);
        setNewMessage('');
        toast.success('Message sent', { id: 'msg-sent' });
      } else {
        toast.error(data.message || 'Failed to send message', { id: 'msg-error' });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while sending message', { id: 'msg-network-error' });
    } finally {
      setSending(false);
    }
  };

  const activeMeta = TABS.find((t) => t.key === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt-12 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                Browse listings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Cars, parts, and service providers in one place
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeMeta.label.toLowerCase()}...`}
                className="w-full h-11 pl-10 pr-9 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X className="h-3.5 w-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3.5 px-4 sm:px-5 font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap border-b-2 ${
                  active
                    ? 'border-current'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                style={active ? { color: navy } : {}}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-44 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Frown className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              No {activeMeta.label.toLowerCase()} found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try a different search term or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedListings.map((item) => {
              const owner = getListingOwner(item, activeTab);
              const verified = getOwnerVerified(owner);
              const phone = getOwnerPhone(item, owner, activeTab);
              const location = getListingLocation(item, owner);

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  <img
                    src={getListingImage(item)}
                    alt={getListingTitle(item, activeTab)}
                    className="w-full h-44 object-cover"
                    onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                  />

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-1">
                      {getListingTitle(item, activeTab)}
                    </h3>

                    {item.price != null && (
                      <p className="text-xl font-black mb-3" style={{ color: rust }}>
                        ₦{Number(item.price).toLocaleString()}
                      </p>
                    )}

                    <div className="space-y-1.5 mb-4 text-xs text-gray-500 dark:text-gray-400">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {location || 'Location not specified'}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        {phone || 'Contact via chat'}
                      </p>
                      {verified && (
                        <p className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                          Verified seller
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => openChat(item)}
                      disabled={chatLoading}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: navy }}
                    >
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                      Message seller
                    </button>

                    <div className="mt-3">
                      <DistanceInfo
                        clientAddressParts={{
                          address: user?.address || user?.dealerInfo?.businessAddress || user?.dealerInfo?.lga,
                          lga: user?.lga || user?.dealerInfo?.lga,
                          state: user?.state || user?.dealerInfo?.state,
                        }}
                        providerAddressParts={{
                          address: item.location?.lga,
                          lga: item.location?.lga,
                          state: item.location?.state,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedChat(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg h-[75vh] max-h-[600px] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-gray-900/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedChat.sellerAvatar}
                    alt={selectedChat.sellerName}
                    className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm shrink-0"
                    onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{selectedChat.sellerName}</h3>
                    {selectedChat.verified && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition shrink-0"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60 dark:bg-gray-900/20">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <MessageCircle className="h-10 w-10 mb-3 opacity-40" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start the conversation</p>
                    <p className="text-xs mt-1">Say hello and ask about the listing</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender._id === user?._id
                            ? 'text-white rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-100 dark:border-gray-600'
                        }`}
                        style={msg.sender._id === user?._id ? { background: navy } : {}}
                      >
                        <p className="break-words leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3.5 border-t border-gray-100 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800 shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !sending) sendMessage(); }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-[#0B1B3E]/5 transition"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
                  style={{ background: navy }}
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseListings;