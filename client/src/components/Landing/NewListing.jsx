/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../contexts/AuthContext';
import { CarCard } from '../car/CarCard';
const NewListing = () => {
  const [newestListings, setNewestListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchNewestListings();
  }, []);

  const fetchNewestListings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/newest`);
      const data = await res.json();

      if (data.status === 'success') {
        setNewestListings(data.data.cars);
      } else {
        toast.error('Failed to load newest listings');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const openCarDetails = (car) => {
    setSelectedCar(car);
  };

  const openChat = () => {
    if (!isLoggedIn) {
      toast.error('Please login to chat');
      window.location.href = '/login';
      return;
    }
    setShowChatModal(true);
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return toast.error('Message cannot be empty');

    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send`, {
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
        toast.success('Message sent successfully!');
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
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Newest Listings</h2>
            <Link
              to="/cars"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center group"
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            </div>
          ) : newestListings.length === 0 ? (
            <div className="text-center py-20 text-gray-600 dark:text-gray-400">
              No new listings yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newestListings.map((car) => (
                <div
                  key={car._id}
                  onClick={() => openCarDetails(car)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CAR DETAILS MODAL */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">{selectedCar.title}</h2>
              <button onClick={() => setSelectedCar(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <img src={selectedCar.images[0]} alt="" className="w-full h-80 object-cover rounded-2xl" />
              <p className="text-3xl font-bold text-primary-600">₦{selectedCar.price.toLocaleString()}</p>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Make:</strong> {selectedCar.make}</p>
                <p><strong>Model:</strong> {selectedCar.model}</p>
                <p><strong>Year:</strong> {selectedCar.year}</p>
                <p><strong>Mileage:</strong> {selectedCar.mileage.toLocaleString()} km</p>
                <p><strong>Transmission:</strong> {selectedCar.transmission}</p>
                <p><strong>Fuel:</strong> {selectedCar.fuelType}</p>
                <p><strong>Body:</strong> {selectedCar.bodyType}</p>
                <p><strong>Condition:</strong> {selectedCar.condition}</p>
                <p><strong>Color:</strong> {selectedCar.color}</p>
                <p>
                  <strong>Location:</strong>{' '}
                  {selectedCar.location?.state ? `${selectedCar.location.state}, ${selectedCar.location.lga || ''}` : 'Not specified'}
                </p>
              </div>

              <h3 className="text-xl font-bold mt-6">Description</h3>
              <p>{selectedCar.description}</p>

              <h3 className="text-xl font-bold mt-6">Seller</h3>
              <p>{selectedCar.postedBy.firstName} {selectedCar.postedBy.lastName}</p>
              <p>{selectedCar.postedBy.role === 'dealer' ? 'Dealer' : 'User'}</p>
              <p>Phone: {selectedCar.postedBy.phoneNumber}</p>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={openChat}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-3"
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
              <button onClick={() => setShowChatModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Send a message about this car</p>
              <textarea
                rows="8"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Hi, I'm interested in your car. Is it still available?"
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

export default NewListing;