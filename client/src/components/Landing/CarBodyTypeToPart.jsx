// src/components/CarBodyTypesToParts.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, X, MessageCircle, Send, Phone, MapPin, Building } from 'lucide-react';
import { toast } from 'sonner';

const BODY_TYPES = [
  { value: 'sedan', label: 'Sedan', icon: '🚗', description: 'Classic family & executive cars' },
  { value: 'suv', label: 'SUV', icon: '🚙', description: 'Crossover & off-road capable' },
  { value: 'hatchback', label: 'Hatchback', icon: '🏎️', description: 'Compact & practical' },
  { value: 'truck', label: 'Truck', icon: '🛻', description: 'Pickup & heavy-duty' },
  { value: 'van', label: 'Van', icon: '🚐', description: 'Minivans & cargo' },
  { value: 'coupe', label: 'Coupe', icon: '🛞', description: 'Sporty 2-door' },
  { value: 'convertible', label: 'Convertible', icon: '🚘', description: 'Open-top & fun' }
];

const CarBodyTypesToParts = () => {
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [categories, setCategories] = useState([]); // { title, count, sampleImage? }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chat states
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fetch car part categories filtered by body type
  const fetchPartsByBodyType = async (bodyType) => {
    if (!bodyType) return;

    setLoading(true);
    setError(null);
    setCategories([]);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/carparts/categories?bodyType=${bodyType}&limit=50`;

      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Failed to load parts');

      const data = await res.json();
      if (data.status === 'success') {
        setCategories(data.data || []);
      } else {
        throw new Error(data.message || 'Error');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When user selects a body type → fetch related parts
  useEffect(() => {
    if (selectedBodyType) {
      fetchPartsByBodyType(selectedBodyType);
    }
  }, [selectedBodyType]);

  const handleBodyTypeClick = (value) => {
    setSelectedBodyType(value);
  };

  // ── Messaging Functions ─────────────────────────────────────────────────
  const openChat = async (seller) => {
    if (!seller?._id) {
      toast.error("Cannot open chat - seller information missing");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to message sellers");
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
            Parts by Car Body Type
          </h3>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Choose a body type to see compatible car parts available in our marketplace
          </p>
        </div>

        {/* Body Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 mb-12">
          {BODY_TYPES.map((type) => (
            <div
              key={type.value}
              onClick={() => handleBodyTypeClick(type.value)}
              className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 text-center cursor-pointer border-2 transition-all duration-300 ${
                selectedBodyType === type.value
                  ? 'border-indigo-600 scale-105 shadow-xl'
                  : 'border-transparent hover:border-indigo-400 hover:shadow-xl'
              }`}
            >
              <div className="text-5xl mb-3">{type.icon}</div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                {type.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Selected Body Type → Parts Categories */}
        {selectedBodyType && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
              Parts compatible with <span className="text-indigo-600">{BODY_TYPES.find(t => t.value === selectedBodyType)?.label}</span>
            </h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600 dark:text-red-400">{error}</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-lg">
                No car parts currently listed for {BODY_TYPES.find(t => t.value === selectedBodyType)?.label} vehicles.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.title}
                    className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="h-40 bg-slate-100 dark:bg-slate-700 relative">
                      {cat.sampleImage ? (
                        <img
                          src={cat.sampleImage}
                          alt={cat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        {cat.count}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {cat.condition ? `Condition: ${cat.condition.toUpperCase()}` : 'Various conditions'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal (same as before) */}
      {chatOpen && selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
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
                  <p className="text-sm mt-1">Ask about the part or negotiate</p>
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

export default CarBodyTypesToParts;