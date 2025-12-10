/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Star, ExternalLink, X, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import car from "../../assets/car.jpeg";

const Dealership = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerCars, setDealerCars] = useState([]);
  const [dealerLoading, setDealerLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [filters, setFilters] = useState({
    brand: '',
    location: '',
    rating: '',
    type: '',
  });

  const { isLoggedIn } = useAuth();

  const brands = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Volkswagen', 'Hyundai',
  ];

  const dealerTypes = [
    'New Cars', 'Used Cars', 'Certified Pre-Owned', 'All Types',
  ];

  const ratings = [
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
    { label: '2+ Stars', value: '2' },
  ];

  useEffect(() => {
    fetchAllDealers();
  }, []);

  const fetchAllDealers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/alldealers`);
      const data = await res.json();

      if (data.status === 'success') {
        setDealers(data.data.dealers);
        setFilteredDealers(data.data.dealers);
      } else {
        toast.error('Failed to load dealers');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = async (newFilters) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key]) query.append(key, newFilters[key]);
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/dealers/search?${query.toString()}`);
      const data = await res.json();

      if (data.status === 'success') {
        setFilteredDealers(data.data.dealers);
      } else {
        toast.error('No dealers found');
        setFilteredDealers([]);
      }
    } catch (err) {
      toast.error('Filter failed');
      setFilteredDealers([]);
    } finally {
      setLoading(false);
    }
  };

  const openDealerDetails = async (dealer) => {
    setSelectedDealer(dealer);
    setDealerLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/dealers/${dealer._id}`);
      const data = await res.json();

      if (data.status === 'success') {
        setDealerCars(data.data.cars || []);
      } else {
        toast.error('Failed to load dealer details');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setDealerLoading(false);
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
          receiverId: selectedDealer._id,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Car Dealerships
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand
            </label>
            <select
              name="brand"
              className="input"
              value={filters.brand}
              onChange={handleFilterChange}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand.toLowerCase()}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              className="input"
              placeholder="Enter city or ZIP code..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rating
            </label>
            <select
              name="rating"
              className="input"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              {ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dealer Type
            </label>
            <select
              name="type"
              className="input"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {dealerTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          </div>
        ) : filteredDealers.length > 0 ? (
          filteredDealers.map(dealer => (
            <div 
              key={dealer._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => openDealerDetails(dealer)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={dealer.avatar || car || '/placeholder-dealer.jpg'} 
                  alt={dealer.dealerInfo?.businessName || dealer.firstName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {dealer.dealerInfo?.businessName || `${dealer.firstName} ${dealer.lastName}`}
                  </h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(dealer.dealerInfo?.rating || dealer.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{dealer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{dealer.dealerInfo?.state || dealer.state}, {dealer.dealerInfo?.lga || dealer.lga}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dealer.dealerInfo?.brands?.map((brand, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link 
                    to={`/dealers/${dealer._id}`}
                    className="flex-1 btn btn-primary"
                  >
                    View Inventory
                  </Link>
                  <a
                    href="#"
                    className="btn btn-outline flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No dealerships found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* DEALER DETAILS MODAL */}
      {selectedDealer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">{selectedDealer.dealerInfo?.businessName || `${selectedDealer.firstName} ${selectedDealer.lastName}`}</h2>
              <button onClick={() => setSelectedDealer(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <img
                src={selectedDealer.avatar || car || '/placeholder-dealer.jpg'}
                alt={selectedDealer.dealerInfo?.businessName}
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${i < Math.floor(selectedDealer.dealerInfo?.rating || selectedDealer.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold">{selectedDealer.dealerInfo?.rating?.toFixed(1) || 'N/A'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Business Name:</strong> {selectedDealer.dealerInfo?.businessName}</p>
                <p><strong>First Name:</strong> {selectedDealer.firstName}</p>
                <p><strong>Last Name:</strong> {selectedDealer.lastName}</p>
                <p><strong>Email:</strong> {selectedDealer.email}</p>
                <p><strong>Phone:</strong> {selectedDealer.phoneNumber}</p>
                <p><strong>Business Address:</strong> {selectedDealer.dealerInfo?.businessAddress}</p>
                <p><strong>State:</strong> {selectedDealer.dealerInfo?.state}</p>
                <p><strong>LGA:</strong> {selectedDealer.dealerInfo?.lga}</p>
                <p><strong>Verified:</strong> {selectedDealer.dealerInfo?.verified ? 'Yes' : 'No'}</p>
                <p><strong>Featured:</strong> {selectedDealer.dealerInfo?.isFeatured ? 'Yes' : 'No'}</p>
                <p><strong>Featured Until:</strong> {selectedDealer.dealerInfo?.featuredUntil ? new Date(selectedDealer.dealerInfo.featuredUntil).toLocaleString() : 'N/A'}</p>
              </div>

              <h3 className="text-xl font-bold mt-6">Brands</h3>
              <p>{selectedDealer.dealerInfo?.brands?.join(', ') || 'N/A'}</p>

              <h3 className="text-xl font-bold mt-6">Listed Cars</h3>
              {dealerLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : dealerCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dealerCars.map(car => (
                    <div key={car._id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <img src={car.images[0]} alt={car.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                      <p className="font-bold">{car.title}</p>
                      <p className="text-sm">₦{car.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No cars listed yet</p>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={openChat}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                Chat with Dealer
              </button>
            </div>
          </div>
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

export default Dealership;