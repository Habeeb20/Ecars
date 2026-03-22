// // src/pages/VehiclesByBodyType.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Loader2, X, Phone, MapPin, Building, MessageCircle, Send, ShieldCheck } from 'lucide-react';
// import { toast } from 'sonner';

// const VehiclesByBodyType = () => {
//   const { bodyType } = useParams(); // e.g. "suv", "sedan"
//   const navigate = useNavigate();

//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Chat modal states
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sending, setSending] = useState(false);
//   const [chatOpen, setChatOpen] = useState(false);

//   // Fetch vehicles by body type
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const url = `${import.meta.env.VITE_BACKEND_URL}/cars/by-body-type/${bodyType}`;
//         const token = localStorage.getItem('token');

//         const res = await fetch(url, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });



//         const data = await res.json();
//         if (data.status === 'success') {
//           setVehicles(data.data || []);
//         } else {
//           throw new Error(data.message || 'Error loading vehicles');
//         }
//       } catch (err) {
//         console.log(err)
//         setError(err.message);
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, [bodyType]);

//   // ── Messaging Functions ─────────────────────────────────────────────────
//   const openChat = async (seller) => {
//     if (!seller?._id) {
//       toast.error("Cannot open chat - seller information missing");
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error("You must be logged in to message sellers");
//         return;
//       }

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
//           verified: seller.dealerInfo?.verified || false,
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
//     <div className="min-h-screen mt-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)} Vehicles
//             </h1>
//             <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
//               All listed {bodyType} cars with seller details
//             </p>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//           >
//             ← Back
//           </button>
//         </div>

//         {/* Vehicles Grid */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
//           </div>
//         ) : error ? (
//           <div className="text-center py-12 text-red-600 dark:text-red-400 text-lg">{error}</div>
//         ) : vehicles.length === 0 ? (
//           <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-xl">
//             No {bodyType} vehicles listed at the moment.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {vehicles.map((vehicle) => (
//               <div
//                 key={vehicle._id}
//                 className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300"
//               >
//                 {/* Image */}
//                 <div className="relative h-48 bg-slate-100 dark:bg-slate-700">
//                   {vehicle.images?.[0] ? (
//                     <img
//                       src={vehicle.images[0]}
//                       alt={vehicle.title || `${vehicle.make} ${vehicle.model}`}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-400">
//                       No Image
//                     </div>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">
//                   <h3 className="text-xl font-bold mb-2 line-clamp-2">
//                     {vehicle.title || `${vehicle.make} ${vehicle.model}`}
//                   </h3>

//                   <p className="text-2xl font-semibold text-emerald-600 mb-4">
//                     ₦{vehicle.price?.toLocaleString() || 'Contact for price'}
//                   </p>

//                   <div className="grid grid-cols-2 gap-3 text-sm mb-5">
//                     <div>
//                       <span className="font-medium text-slate-600 dark:text-slate-300">Make/Model:</span><br />
//                       {vehicle.make} {vehicle.model}
//                     </div>
//                     <div>
//                       <span className="font-medium text-slate-600 dark:text-slate-300">Year:</span><br />
//                       {vehicle.year || '—'}
//                     </div>
//                     <div>
//                       <span className="font-medium text-slate-600 dark:text-slate-300">Mileage:</span><br />
//                       {vehicle.mileage?.toLocaleString() || '—'} km
//                     </div>
//                     <div>
//                       <span className="font-medium text-slate-600 dark:text-slate-300">Condition:</span><br />
//                       {vehicle.condition?.toUpperCase() || '—'}
//                     </div>
//                   </div>

//                   {/* Seller Info + Message */}
//                   {vehicle.postedBy && (
//                     <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
//                       <div className="flex justify-between items-start mb-3">
//                         <h4 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
//                           <Building className="h-4 w-4" /> Seller
//                         </h4>
//                         <button
//                           onClick={() => openChat(vehicle.postedBy)}
//                           className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
//                         >
//                           <MessageCircle className="h-4 w-4" />
//                           Message
//                         </button>
//                       </div>

//                       <div className="text-sm space-y-1.5 text-slate-700 dark:text-slate-300">
//                         <p className="font-medium">
//                           {vehicle.postedBy.firstName} {vehicle.postedBy.lastName}
//                         </p>
//                         {vehicle.postedBy.dealerInfo?.businessName && (
//                           <p className="text-indigo-600 font-medium">
//                             {vehicle.postedBy.dealerInfo.businessName}
//                           </p>
//                         )}
//                         {vehicle.postedBy.phoneNumber && (
//                           <p className="flex items-center gap-2">
//                             <Phone className="h-3.5 w-3.5" />
//                             {vehicle.postedBy.phoneNumber}
//                           </p>
//                         )}
//                         {vehicle.postedBy.state && (
//                           <p className="flex items-center gap-2">
//                             <MapPin className="h-3.5 w-3.5" />
//                             {vehicle.postedBy.state}
//                             {vehicle.postedBy.lga && `, ${vehicle.postedBy.lga}`}
//                           </p>
//                         )}
//                         {vehicle.postedBy.dealerInfo?.verified && (
//                           <p className="text-green-600 flex items-center gap-1">
//                             <ShieldCheck className="h-3.5 w-3.5" /> Verified Dealer
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Modal */}
//       {chatOpen && selectedChat && (
//         <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
//             <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={selectedChat.sellerAvatar}
//                   alt={selectedChat.sellerName}
//                   className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200"
//                 />
//                 <div>
//                   <h3 className="font-bold text-lg">{selectedChat.sellerName}</h3>
//                   {selectedChat.verified && (
//                     <div className="flex items-center gap-1 text-sm text-green-600">
//                       <ShieldCheck className="h-4 w-4" /> Verified
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={() => setChatOpen(false)}
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
//                   <p className="text-sm mt-1">Ask about the vehicle or negotiate price</p>
//                 </div>
//               ) : (
//                 chatMessages.map((msg) => (
//                   <div
//                     key={msg._id}
//                     className={`flex ${msg.sender?._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-[75%] px-4 py-3 rounded-2xl ${
//                         msg.sender?._id === localStorage.getItem('userId')
//                           ? 'bg-indigo-600 text-white rounded-br-none'
//                           : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
//                       }`}
//                     >
//                       <p className="break-words">{msg.content}</p>
//                       <p className="text-xs opacity-70 mt-1 text-right">
//                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
//                 {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VehiclesByBodyType;












// src/pages/VehiclesByBodyType.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, X, Phone, MapPin, Building, MessageCircle, Send, ShieldCheck, 
  Eye, Calendar, Gauge, Fuel, Cog, Palette, FileText, Tag, Star 
} from 'lucide-react';
import { toast } from 'sonner';

const VehiclesByBodyType = () => {
  const { bodyType } = useParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Chat modal states
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/cars/by-body-type/${bodyType}`;
        const token = localStorage.getItem('token');

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error('Failed to load vehicles');

        const data = await res.json();
        if (data.status === 'success') {
          setVehicles(data.data || []);
        } else {
          throw new Error(data.message || 'Error loading vehicles');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [bodyType]);

  // ── Messaging Functions ─────────────────────────────────────────────────
  const openChat = async (seller) => {
    if (!seller?._id) {
      toast.error("Cannot open chat - seller information missing");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to message sellers");
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
          verified: seller.dealerInfo?.verified || false,
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
    <div className="min-h-screen mt-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {bodyType.charAt(0).toUpperCase() + bodyType.slice(1)} Vehicles
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              All listed {bodyType} cars with seller details
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400 text-lg">{error}</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-xl">
            No {bodyType} vehicles listed at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-700">
                  {vehicle.images?.[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title || `${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {vehicle.title || `${vehicle.make} ${vehicle.model}`}
                  </h3>

                  <p className="text-2xl font-semibold text-emerald-600 mb-4">
                    ₦{vehicle.price?.toLocaleString() || 'Contact for price'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-5 flex-1">
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">Year:</span><br />
                      {vehicle.year || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">Mileage:</span><br />
                      {vehicle.mileage?.toLocaleString() || '—'} km
                    </div>
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">Condition:</span><br />
                      {vehicle.condition?.toUpperCase() || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">Transmission:</span><br />
                      {vehicle.transmission?.toUpperCase() || '—'}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>

                    {vehicle.postedBy && (
                      <button
                        onClick={() => openChat(vehicle.postedBy)}
                        className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Vehicle Details Modal ──────────────────────────────────────────────── */}
      {selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b dark:border-slate-700 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate pr-10">
                {selectedVehicle.title || `${selectedVehicle.make} ${selectedVehicle.model}`}
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Images Grid */}
              <div className="mb-8">
                {selectedVehicle.images?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedVehicle.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedVehicle.make} ${selectedVehicle.model} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                    No images available
                  </div>
                )}
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-indigo-600" /> Price
                    </h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      ₦{selectedVehicle.price?.toLocaleString() || '—'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" /> Year
                    </h3>
                    <p className="text-xl">{selectedVehicle.year || '—'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-indigo-600" /> Mileage
                    </h3>
                    <p className="text-xl">{selectedVehicle.mileage?.toLocaleString() || '—'} km</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Cog className="h-5 w-5 text-indigo-600" /> Transmission
                    </h3>
                    <p className="text-xl capitalize">{selectedVehicle.transmission || '—'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-indigo-600" /> Fuel Type
                    </h3>
                    <p className="text-xl capitalize">{selectedVehicle.fuelType || '—'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-indigo-600" /> Color
                    </h3>
                    <p className="text-xl capitalize">{selectedVehicle.color || '—'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" /> Condition
                    </h3>
                    <p className="text-xl capitalize">{selectedVehicle.condition?.toUpperCase() || '—'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-indigo-600" /> Views
                    </h3>
                    <p className="text-xl">{selectedVehicle.views || 0}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600" /> Listed On
                    </h3>
                    <p className="text-xl">
                      {new Date(selectedVehicle.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" /> Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedVehicle.description || 'No description provided.'}
                </p>
              </div>

              {/* Features */}
              {selectedVehicle.features?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-indigo-600" /> Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {selectedVehicle.postedBy && (
                <div className="pt-6 border-t dark:border-slate-700">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-indigo-600" /> Seller Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="font-medium text-lg">
                        {selectedVehicle.postedBy.firstName} {selectedVehicle.postedBy.lastName}
                      </p>
                      {selectedVehicle.postedBy.dealerInfo?.businessName && (
                        <p className="text-indigo-600 font-medium">
                          {selectedVehicle.postedBy.dealerInfo.businessName}
                        </p>
                      )}
                      {selectedVehicle.postedBy.phoneNumber && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {selectedVehicle.postedBy.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedVehicle.postedBy.state && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {selectedVehicle.postedBy.state}
                          {selectedVehicle.postedBy.lga && `, ${selectedVehicle.postedBy.lga}`}
                        </p>
                      )}
                      {selectedVehicle.postedBy.dealerInfo?.verified && (
                        <p className="text-green-600 flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4" /> Verified Dealer
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message Seller */}
                  <div className="mt-6">
                    <button
                      onClick={() => openChat(selectedVehicle.postedBy)}
                      className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Message Seller
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
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

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 dark:bg-gray-900/30">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                  <p>Start the conversation!</p>
                  <p className="text-sm mt-1">Ask about the vehicle or negotiate price</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender?._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                        msg.sender?._id === localStorage.getItem('userId')
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesByBodyType;