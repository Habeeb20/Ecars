import React, { useState } from 'react';
import { 
  Eye, MessageCircle, X, Phone, MapPin, ShieldCheck, 
  Calendar, Gauge, Fuel, Cog, Palette, FileText, Star 
} from 'lucide-react';
import { toast } from 'sonner';

const SearchResults = ({ results }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Open Chat with Seller
  const openChat = async (seller) => {
    if (!seller?._id) {
      toast.error("Seller information is missing");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to message seller");
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
        toast.error(data.message || 'Failed to open chat');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to open chat');
    }
  };

  // Send Message
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
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Search Results <span className="text-indigo-600">({results.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results?.map((car) => (
            <div
              key={car._id}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-52">
                {car.images?.[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-slate-400">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  {car.year}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl line-clamp-2 mb-1">
                  {car.make} {car.model}
                </h3>
                <p className="text-2xl font-semibold text-emerald-600">
                  ₦{car.price?.toLocaleString()}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div>{car.mileage?.toLocaleString()} km</div>
                  <div className="capitalize">{car.fuelType}</div>
                  <div className="capitalize">{car.transmission}</div>
                  <div className="capitalize">{car.bodyType}</div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedVehicle(car)}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye size={18} />
                    View Details
                  </button>

                  {car.postedBy && (
                    <button
                      onClick={() => openChat(car.postedBy)}
                      className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-8 py-5 border-b flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">
                {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year}
              </h2>
              <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={28} />
              </button>
            </div>

            <div className="p-8">
              {/* Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {selectedVehicle.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Car ${i + 1}`}
                    className="w-full h-56 object-cover rounded-2xl shadow-md"
                  />
                ))}
              </div>

              {/* Price & Key Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-4xl font-bold text-emerald-600">₦{selectedVehicle.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Mileage</p>
                  <p className="text-3xl font-semibold">{selectedVehicle.mileage?.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Condition</p>
                  <p className="text-3xl font-semibold capitalize">{selectedVehicle.condition}</p>
                </div>
              </div>

              {/* Full Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText size={20} /> Description
                    </h4>
                    <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                      {selectedVehicle.description}
                    </p>
                  </div>

                  {selectedVehicle.features?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Star size={20} /> Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVehicle.features.map((feat, i) => (
                          <span key={i} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Specifications</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between"><span className="text-slate-500">Body Type</span> <span className="capitalize">{selectedVehicle.bodyType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Transmission</span> <span className="capitalize">{selectedVehicle.transmission}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Fuel Type</span> <span className="capitalize">{selectedVehicle.fuelType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Color</span> <span className="capitalize">{selectedVehicle.color}</span></div>
                    </div>
                  </div>

                  {/* Seller Info */}
                  {selectedVehicle.postedBy && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} /> Seller Information
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl">
                        <p className="font-medium text-lg">
                          {selectedVehicle.postedBy.firstName} {selectedVehicle.postedBy.lastName}
                        </p>
                        {selectedVehicle.postedBy.phoneNumber && (
                          <p className="flex items-center gap-2 mt-3">
                            <Phone size={18} /> {selectedVehicle.postedBy.phoneNumber}
                          </p>
                        )}
                        <button
                          onClick={() => openChat(selectedVehicle.postedBy)}
                          className="mt-5 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={20} />
                          Message Seller
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[82vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-5 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <img src={selectedChat.sellerAvatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold">{selectedChat.sellerName}</h3>
                  {selectedChat.verified && <p className="text-green-600 text-sm">✓ Verified Seller</p>}
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                <X size={26} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <MessageCircle size={60} className="opacity-30 mb-4" />
                  <p>Start a conversation with the seller</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender?._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                        msg.sender?._id === localStorage.getItem('userId')
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;