/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Star, 
  ArrowLeft,
  Loader2,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { CarCard } from '../car/CarCard';
import car from "../../assets/car.jpeg"

const DealerDetails = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
const [selectedDealer, setSelectedDealer] = useState([])
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchDealerDetails();
  }, [id]);

  const fetchDealerDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/dealers/${id}`);
      const data = await res.json();
console.log(data)
      if (data.status === 'success') {
        setDealer(data.data.dealer);
        setCars(data.data.cars || []);
      } else {
        toast.error('Dealer not found');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: dealer._id,
          message: chatMessage,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dealer not found</h1>
        <Link to="/dealers" className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
          Back to dealers
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/dealers" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dealers
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={dealer.avatar ||car || '/placeholder-dealer.jpg'} 
              alt={dealer.dealerInfo?.businessName || dealer.firstName}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {dealer.dealerInfo?.businessName || `${dealer.firstName} ${dealer.lastName}`}
              </h1>
              <div className="flex items-center bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">
                  {dealer.dealerInfo?.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                <span>{dealer.dealerInfo?.state}, {dealer.dealerInfo?.lga}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                <span>{dealer.phoneNumber}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Brands Available</h3>
              <div className="flex flex-wrap gap-2">
                {dealer.dealerInfo?.brands?.map((brand, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About This Dealer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {dealer.dealerInfo?.businessName} is a premier automotive dealership specializing in 
                {dealer.dealerInfo?.brands?.join(', ') || 'various'} vehicles. 
                With excellent customer service and high-quality vehicles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Available Inventory ({cars.length})
      </h2>
      
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Inventory Available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This dealer currently has no vehicles listed.
          </p>
        </div>
      )}

      {/* CHAT MODAL */}
      {showChatModal && selectedDealer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h3 className="text-2xl font-bold">Chat with Dealer</h3>
              <button onClick={() => setShowChatModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Send a message to the dealer</p>
              <textarea
                rows="8"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Hello, I'm interested in your dealership..."
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
    </div>
  );
};

export default DealerDetails;