// src/pages/dashboard/MyReceivedOffers.jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, Calendar, User, Phone, MapPin, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const MyReceivedOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [replying, setReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const fetchMyOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/my-offers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.status) {
        setOffers(data.data.offers || []);
      } else {
        toast.error(data.message || "Failed to load offers");
      }
    } catch (err) {
      toast.error("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (offer) => {
    if (!replyMessage.trim()) {
      toast.error("Please write a reply");
      return;
    }

    setReplying(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: offer.sender._id,
          carId: offer.carId?._id,
          content: replyMessage,
          type: 'message'
        }),
      });

      const data = await res.json();

      if (data.status) {
        toast.success("Reply sent successfully!");
        setReplyMessage('');
        setSelectedOffer(null);
        fetchMyOffers(); // Refresh list
      } else {
        toast.error(data.message || "Failed to send reply");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setReplying(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Received Offers
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage all offers sent to you by buyers
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-600">{offers.length}</p>
            <p className="text-sm text-slate-500">Total Offers</p>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center">
            <MessageCircle className="h-20 w-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No offers yet</h3>
            <p className="text-slate-500">When buyers make offers on your cars, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700"
              >
                {/* Car Info Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl">
                        {offer.carId?.make} {offer.carId?.model} ({offer.carId?.year})
                      </h3>
                      <p className="text-emerald-600 font-semibold text-lg mt-1">
                        Asking: ₦{offer.carId?.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      {formatDate(offer.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {offer.sender.firstName?.[0]}{offer.sender.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {offer.sender.firstName} {offer.sender.lastName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {offer.sender.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" /> {offer.sender.phoneNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Offer Amount */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-5 mb-6">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">OFFER AMOUNT</p>
                    <p className="text-4xl font-bold text-emerald-600 mt-1">
                      ₦{offer.offerAmount?.toLocaleString() || '0'}
                    </p>
                    {offer.preferredColor && (
                      <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                        Preferred Color: <span className="font-medium">{offer.preferredColor}</span>
                      </p>
                    )}
                  </div>

                  {/* Buyer Message */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-2">BUYER'S NOTE</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl">
                      {offer.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Reply
                    </button>

                    <button
                      onClick={() => toast.info("Mark as Reviewed - Coming Soon")}
                      className="flex-1 py-4 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-2xl transition"
                    >
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Reply to Offer</h2>

            <div className="mb-6 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="font-medium">From: {selectedOffer.sender.firstName} {selectedOffer.sender.lastName}</p>
              <p className="text-emerald-600 font-bold text-xl mt-2">
                Offer: ₦{selectedOffer.offerAmount?.toLocaleString()}
              </p>
            </div>

            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              placeholder="Write your reply... (e.g. Thank you for your offer. The car is still available...)"
              className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
            />

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setSelectedOffer(null)}
                className="flex-1 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReply(selectedOffer)}
                disabled={replying || !replyMessage.trim()}
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2"
              >
                {replying ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReceivedOffers;