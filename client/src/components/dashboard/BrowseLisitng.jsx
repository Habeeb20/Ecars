// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Loader2, 
//   Search, 
//   MessageCircle, 
//   Send, 
//   X, 
//   ShieldCheck, 
//   MapPin, 
//   Phone, 
//   Star, 
//   Package, 
//   Wrench, 
//   Car 
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '../../contexts/AuthContext'; // ← Added this

// const BrowseListings = () => {
//   const { user } = useAuth(); // ← Now we have the logged-in user
//   const [activeTab, setActiveTab] = useState('cars'); // cars | parts | services
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sending, setSending] = useState(false);
// const [chatOpen, setChatOpen] = useState(false)
//   useEffect(() => {
//     fetchListings();
//   }, [activeTab, searchQuery]);

//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       let endpoint = '';

//       if (activeTab === 'cars') endpoint = '/cars/allcars';
//       else if (activeTab === 'parts') endpoint = '/carparts';
//       else if (activeTab === 'services') endpoint = '/users/service-providers';

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}?search=${searchQuery}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       if (data.status === 'success') {
//         const items = data.data.cars || data.data.parts || data.data.providers || [];
//         setListings(items);
//       } else {
//         toast.error('Failed to load listings');
//       }
//     } catch (err) {
//         console.log(err)
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openChat = async (seller) => {
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
//           sellerName: `${seller.firstName} ${seller.lastName}`,
//           sellerAvatar: seller.avatar,
//           verified: seller.carPartSellerInfo?.verified || seller.dealerInfo?.verified || false,
//         });
//         setChatOpen(true);
//       }
//     } catch (err) {
//       toast.error('Failed to load chat');
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || sending) return;

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
//           content: newMessage,
//         }),
//       });

//       const data = await res.json();
//       if (data.status === 'success') {
//         setChatMessages(prev => [...prev, data.data.message]);
//         setNewMessage('');
//       } else {
//         toast.error('Failed to send message');
//       }
//     } catch (err) {
//       toast.error('Network error');
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
//           <div className="mt-4 md:mt-0 relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by title, make, part, or business..."
//               className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
//           <button
//             onClick={() => setActiveTab('cars')}
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 ${
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
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 ${
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
//             className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 ${
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
//         ) : listings.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No {activeTab === 'cars' ? 'cars' : activeTab === 'parts' ? 'car parts' : 'services'} found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Try adjusting your search
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {listings.map(item => (
//               <div key={item._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
//                 <img 
//                   src={item.images?.[0] || '/placeholder.jpg'} 
//                   alt={item.title || item.businessName}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                     {item.title || item.businessName}
//                   </h3>
//                   {item.price && (
//                     <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
//                       ₦{item.price.toLocaleString()}
//                     </p>
//                   )}
//                   <div className="mb-4 space-y-2">
//              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//   <MapPin className="h-4 w-4" />
//   {typeof item.location === 'object' && item.location
//     ? `${item.location.state || ''}, ${item.location.lga || ''}`
//     : item.location || `${item.state || ''}, ${item.lga || ''}`}
// </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//                       <Phone className="h-4 w-4" />
//                       {item.seller?.phoneNumber || 'Contact via chat'}
//                     </p>
//                     {(item.seller?.dealerInfo?.verified || item.seller?.carPartSellerInfo?.verified || item.seller?.serviceProviderInfo?.verified) && (
//                       <p className="text-sm text-green-600 flex items-center gap-1">
//                         <ShieldCheck className="h-4 w-4" />
//                         Verified Seller
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => openChat(item.seller)}
//                     className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all"
//                   >
//                     <MessageCircle className="h-5 w-5" />
//                     Message Seller
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Modal */}
//       {selectedChat && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl">
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <img 
//                   src={selectedChat.sellerAvatar || '/default-avatar.jpg'} 
//                   alt={selectedChat.sellerName}
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="font-bold text-lg">{selectedChat.sellerName}</h3>
//                   {selectedChat.verified && <ShieldCheck className="h-5 w-5 text-green-500 inline" />}
//                 </div>
//               </div>
//               <button onClick={() => setSelectedChat(null)}>
//                 <X className="h-6 w-6 text-gray-500" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {chatMessages.length === 0 ? (
//                 <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Start the conversation!</p>
//               ) : (
//                 chatMessages.map(msg => (
//                   <div key={msg._id} className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`max-w-xs px-4 py-3 rounded-2xl ${
//                       msg.sender._id === user?._id 
//                         ? 'bg-indigo-600 text-white' 
//                         : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
//                     }`}>
//                       <p>{msg.content}</p>
//                       <p className="text-xs opacity-70 mt-1">
//                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
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
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
//               >
//                 {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Search, 
  MessageCircle, 
  Send, 
  X, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Package, 
  Wrench, 
  Car 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const BrowseListings = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' | 'parts' | 'services'
  const [allListings, setAllListings] = useState([]);        // Full unfiltered data
  const [displayedListings, setDisplayedListings] = useState([]); // Filtered data for UI
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch listings when tab changes (no search param here)
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
          setDisplayedListings(items); // initially show all
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
  }, [activeTab]);

  // Client-side filtering - updates instantly when search changes
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return allListings;

    const query = searchQuery.toLowerCase().trim();

    return allListings.filter(item => {
      // Common fields across all types
      const title = (item.title || item.businessName || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      
      // Car-specific
      const make = (item.make || '').toLowerCase();
      const model = (item.model || '').toLowerCase();
      
      // Parts-specific
      const partName = (item.partName || '').toLowerCase();
      const category = (item.category || '').toLowerCase();

      // Location handling (flexible for different structures)
      const locationText = [
        item.location?.state,
        item.location?.lga,
        item.location?.city,
        item.state,
        item.lga,
        item.city,
        item.seller?.location?.state,
        item.seller?.location?.lga,
      ].filter(Boolean).join(' ').toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        make.includes(query) ||
        model.includes(query) ||
        partName.includes(query) ||
        category.includes(query) ||
        locationText.includes(query)
      );
    });
  }, [allListings, searchQuery]);

  // Sync displayed listings when filtered result changes
  useEffect(() => {
    setDisplayedListings(filteredListings);
  }, [filteredListings]);

  const openChat = async (seller) => {
    console.log(seller)
    if (!seller?._id) {
      toast.error("Cannot open chat - seller information missing");
      return;
    }

    try {
      const token = localStorage.getItem('token');
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
          verified: 
            seller.carPartSellerInfo?.verified || 
            seller.dealerInfo?.verified || 
            seller.serviceProviderInfo?.verified || 
            false,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Browse Listings
          </h1>
          <div className="mt-4 md:mt-0 relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, make, model, part, or location..."
              className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('cars')}
            className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cars'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <Car className="h-5 w-5" />
            Cars
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'parts'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <Package className="h-5 w-5" />
            Car Parts
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-4 px-6 font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600'
            }`}
          >
            <Wrench className="h-5 w-5" />
            Services
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No {activeTab === 'cars' ? 'cars' : activeTab === 'parts' ? 'car parts' : 'services'} found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedListings.map((item) => (
              <div 
                key={item._id} 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <img 
                  src={item.images?.[0] || '/placeholder-car.jpg'} 
                  alt={item.title || item.businessName || 'Listing'}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.title || item.businessName || 'Untitled Listing'}
                  </h3>

                  {item.price && (
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  )}

                  <div className="mb-6 space-y-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      {typeof item.location === 'object' && item.location
                        ? `${item.location.state || ''}${item.location.lga ? ', ' + item.location.lga : ''}`
                        : item.location || `${item.state || ''}${item.lga ? ', ' + item.lga : ''}` || 'Location not specified'}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      {item.postedBy?.phoneNumber || 'Contact via chat'}
                    </p>

                    {(item.postedBy?.dealerInfo?.verified || 
                      item.postedBy?.carPartSellerInfo?.verified || 
                      item.postedBy?.serviceProviderInfo?.verified) && (
                      <p className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Seller
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => openChat(item.postedBy)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedChat.sellerAvatar || '/default-avatar.jpg'} 
                  alt={selectedChat.sellerName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedChat.sellerName}</h3>
                  {selectedChat.verified && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <ShieldCheck className="h-4 w-4" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedChat(null)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                  <p>Start the conversation!</p>
                  <p className="text-sm mt-1">Say hello and discuss the listing</p>
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
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

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
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseListings;