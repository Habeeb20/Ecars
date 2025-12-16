/* eslint-disable no-unused-vars */
// Frontend: DealerOffers.jsx (new component for dealers to see offers)
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  Check, 
  X, 
  MessageCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
const DealerOffers = () => {
      const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/offers/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setOffers(data.data.offers || []);
      } else {
        toast.error('Failed to load offers');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/offers/${offerId}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Offer accepted');
        fetchOffers();
      }
    } catch (err) {
      toast.error('Failed to accept offer');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/offers/${offerId}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Offer rejected');
        fetchOffers();
      }
    } catch (err) {
      toast.error('Failed to reject offer');
    }
  };

  const openChat = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setMessages(data.data.messages || []);
        setChatOpen(true);
      }
    } catch (err) {
      toast.error('Failed to load chat');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

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
          recipient: selectedOffer.user._id,
          content: newMessage,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, data.data.message]);
        setNewMessage('');
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
          My Offers
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No offers received yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              When buyers send offers, they'll appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map(offer => (
              <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={offer.user.avatar || '/default-avatar.jpg'} alt={offer.user.firstName} className="h-12 w-12 rounded-full" />
                  <div>
                    <h3 className="font-bold">{offer.user.firstName} {offer.user.lastName}</h3>
                    <p className="text-sm text-gray-500">{offer.user.email} • {offer.user.phoneNumber}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Cars in Offer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offer.carIds.map(car => (
                      <div key={car._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                        <img src={car.images?.[0]} alt={car.title} className="w-full h-32 object-cover rounded-md mb-2" />
                        <p className="font-medium">{car.make} {car.model} ({car.year})</p>
                        <p className="text-sm text-gray-500">Original Price: ₦{car.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                    <p className="text-sm text-gray-500">Offer Price</p>
                    <p className="text-2xl font-bold text-green-600">₦{offer.offerPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-xl font-semibold capitalize">{offer.status}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleAcceptOffer(offer._id)}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={offer.status !== 'pending'}
                  >
                    <Check className="h-5 w-5" /> Accept
                  </button>
                  <button
                    onClick={() => handleRejectOffer(offer._id)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={offer.status !== 'pending'}
                  >
                    <X className="h-5 w-5" /> Reject
                  </button>
                  <button
                    onClick={() => openChat(offer.user._id)}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" /> Chat with Buyer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal - same as before */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-xl w-full h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedOffer?.user.avatar} alt={selectedOffer?.user.firstName} className="h-10 w-10 rounded-full" />
                <span className="font-bold">{selectedOffer.user.firstName} {selectedOffer.user.lastName}</span>
              </div>
              <button onClick={() => setChatOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl ${
                    msg.sender._id === user._id ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerOffers;








