/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';


const FeaturedCar = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const { user, isLoggedIn } = useAuth(); // Assume this gives user and login status

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/featured`);
      const data = await res.json();
      console.log(data)
      if (data.status === 'success') {
        setFeaturedCars(data.data.cars);
      } else {
        toast.error('Failed to load featured cars');
      }
    } catch (err) {
      console.log(err)
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = (car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };

  const openChat = () => {
    if (!isLoggedIn) {
      toast.error('Please login to chat');
      window.location.href = '/login';
      return;
    }
    setShowDetailsModal(false);
    setShowChatModal(true);
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return toast.error('Message cannot be empty');

    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/send`, { // Assume messages endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedCar.postedBy._id,
          message: chatMessage,
          carId: selectedCar._id,
        }),
      });
      if (res.ok) {
        toast.success('Message sent!');
        setChatMessage('');
        setShowChatModal(false);
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Cars</h2>
            <Link to="/cars" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center group">
              <span>View all</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.slice(0, 6).map((car) => (
                <div
                  key={car._id}
                  onClick={() => openDetailsModal(car)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl cursor-pointer transition-all"
                >
                  <img src={car.images[0]} alt={car.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{car.title}</h3>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">₦{car.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{car.make} {car.model} • {car.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DETAILS MODAL */}
      {showDetailsModal && selectedCar && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">Car Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-600 hover:text-gray-800 dark:text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Car Image Carousel */}
              <div className="relative">
                <img src={selectedCar.images[0]} alt="" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
                <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full flex items-center gap-2">
                  <img src={selectedCar.images[1]} alt="" className="h-8 w-8 object-cover rounded-full" />
                  +{selectedCar.images.length - 1} photos
                </div>
              </div>

              {/* Car Details */}
              <div>
                <h3 className="text-3xl font-bold mb-4">{selectedCar.title}</h3>
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">₦{selectedCar.price.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Make</p>
                    <p className="font-bold">{selectedCar.make}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Model</p>
                    <p className="font-bold">{selectedCar.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Year</p>
                    <p className="font-bold">{selectedCar.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Mileage</p>
                    <p className="font-bold">{selectedCar.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-bold">{selectedCar.location.lga}, {selectedCar.location.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Condition</p>
                    <p className="font-bold">{selectedCar.condition}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xl font-bold mb-4">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedCar.description}</p>
              </div>

              {/* Seller Details */}
              <div>
                <h4 className="text-xl font-bold mb-4">Seller Details</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedCar.postedBy.firstName[0]}{selectedCar.postedBy.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedCar.postedBy.firstName} {selectedCar.postedBy.lastName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedCar.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
                      </p>
                    </div>
                  </div>
                  {selectedCar.postedBy.role === 'dealer' && (
                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Business:</strong> {selectedCar.postedBy.dealerInfo.businessName}</p>
                      <p><strong>Location:</strong> {selectedCar.postedBy.dealerInfo.lga}, {selectedCar.postedBy.dealerInfo.state}</p>
                      <p><strong>Verified:</strong> {selectedCar.postedBy.dealerInfo.verified ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                  <p className="mt-4 text-sm"><strong>Phone:</strong> {selectedCar.postedBy.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={openChat}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg transition"
              >
                <MessageCircle className="h-6 w-6" />
                Chat with Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}
      {showChatModal && selectedCar && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h3 className="text-2xl font-bold">Chat with Seller</h3>
              <button onClick={() => setShowChatModal(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <p className="text-gray-600 dark:text-gray-300">Send a message to the seller about this car.</p>
              <textarea
                rows="6"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Hi, I'm interested in your car. Is it available?"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
              />
            </div>
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={sendMessage}
                disabled={chatLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-3"
              >
                {chatLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <MessageCircle className="h-6 w-6" />}
                {chatLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCar;