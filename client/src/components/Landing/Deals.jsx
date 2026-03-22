// src/pages/PublicDealsPage.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, X, Phone, MapPin, Building, MessageCircle, Send, ShieldCheck, Eye } from 'lucide-react';
import { toast } from 'sonner';

const PublicDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Chat modal states
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch all public deals
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals`);
        const data = await res.json();

        if (data.status === true) {
          setDeals(data.data.deals || []);
        } else {
          throw new Error(data.message || 'Failed to load deals');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hot Deals
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Amazing cars at unbeatable prices — limited time offers
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">{error}</div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-xl">
            No active deals at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
              >
                {/* Image */}
                <div className="relative h-52 bg-slate-100 dark:bg-slate-700">
                  {deal.images?.[0] ? (
                    <img
                      src={deal.images[0]}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {deal.discountPercentage}% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {deal.title}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₦{deal.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₦{deal.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {deal.make} {deal.model} • {deal.year} • {deal.mileage.toLocaleString()} km
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedDeal(deal)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Deal Detail Modal ──────────────────────────────────────────────── */}
      {selectedDeal && (
        <div
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedDeal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate pr-10">
                {selectedDeal.title}
              </h2>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Images */}
              <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedDeal.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={selectedDeal.title}
                    className="w-full h-48 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                  />
                ))}
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-4 mb-8 bg-emerald-50 dark:bg-emerald-950 p-5 rounded-2xl">
                <div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">NOW ONLY</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    ₦{selectedDeal.discountedPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl text-gray-400 line-through">
                  ₦{selectedDeal.originalPrice.toLocaleString()}
                </div>
                <div className="ml-auto bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold">
                  {selectedDeal.discountPercentage}% OFF
                </div>
              </div>

              {/* Car Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div><strong>Make/Model:</strong> {selectedDeal.make} {selectedDeal.model}</div>
                <div><strong>Year:</strong> {selectedDeal.year}</div>
                <div><strong>Mileage:</strong> {selectedDeal.mileage.toLocaleString()} km</div>
                <div><strong>Condition:</strong> {selectedDeal.condition}</div>
                <div><strong>Transmission:</strong> {selectedDeal.transmission}</div>
                <div><strong>Fuel Type:</strong> {selectedDeal.fuelType}</div>
                <div><strong>Color:</strong> {selectedDeal.color}</div>
                <div><strong>Body Type:</strong> {selectedDeal.bodyType}</div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedDeal.description}
                </p>
              </div>

              {/* Seller Info */}
              {selectedDeal.postedBy && (
                <div className="mt-10 pt-8 border-t dark:border-slate-700">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5" /> Seller Information
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div>
                      <p className="font-medium text-lg">
                        {selectedDeal.postedBy.firstName} {selectedDeal.postedBy.lastName}
                      </p>
                      {selectedDeal.postedBy.dealerInfo?.businessName && (
                        <p className="text-indigo-600">{selectedDeal.postedBy.dealerInfo.businessName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {selectedDeal.postedBy.phoneNumber && (
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {selectedDeal.postedBy.phoneNumber}</p>
                      )}
                      {selectedDeal.postedBy.state && (
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedDeal.postedBy.state}, {selectedDeal.postedBy.lga}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openChat(selectedDeal.postedBy)}
                    className="mt-6 w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message Seller
                  </button>
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

export default PublicDealsPage;