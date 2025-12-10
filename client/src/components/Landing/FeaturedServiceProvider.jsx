/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, X, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import car from "../../assets/car.jpeg";

export const FeaturedServiceProvider = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // null = show featured, [] = no results

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchFeaturedDealers();
  }, []);

  const fetchFeaturedDealers = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `${import.meta.env.VITE_BACKEND_URL}/users/serviceprovider/search?q=${encodeURIComponent(query)}`
        : `${import.meta.env.VITE_BACKEND_URL}/users/featured-serviceprovider`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'success') {
        const fetchedDealers = data.data.dealers || [];
        if (query) {
          setSearchResults(fetchedDealers); // search mode
        } else {
          setDealers(fetchedDealers); // featured mode
          setSearchResults(null); // reset search
        }
      } else {
        toast.error('Failed to load dealers');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    fetchFeaturedDealers(searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === '') {
      // If user clears input, show featured dealers again
      setSearchResults(null);
      fetchFeaturedDealers('');
    }
  };

  const openDealerDetails = (dealer) => {
    setSelectedDealer(dealer);
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

  const displayDealers = searchResults !== null ? searchResults : dealers;

  return (
    <div>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          {/* Search Engine */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search dealers by name, business, location, brands..."
                className="w-full h-12 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-md hover:shadow-lg"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition"
              >
                {searchLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>
            </form>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Featured Service Provider</h2>
            <Link to="/dealerships" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center group">
              <span>View all dealers</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
              </div>
            ) : displayDealers.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {searchQuery ? 'No dealer matches your search' : 'No featured dealers available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {searchQuery ? 'Try different keywords' : 'Check back later for featured dealers'}
                </p>
              </div>
            ) : (
              displayDealers.map((dealer) => (
                <div 
                  key={dealer._id}
                  onClick={() => openDealerDetails(dealer)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="h-48 overflow-hidden">
                    {/* <img 
                      src={dealer.avatar || car || 'https://via.placeholder.com/400x200?text=Dealer+Logo'} 
                      alt={dealer.dealerInfo?.businessName}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                      {dealer.dealerInfo?.businessName}
                    </h3>
                    <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                      {dealer.dealerInfo?.phoneNumber}
                    </p>
                    <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                      {dealer.dealerInfo?.state || dealer.state}, {dealer.dealerInfo?.lga || dealer.lga}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(dealer.dealerInfo?.rating || dealer.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {dealer.dealerInfo?.rating?.toFixed(1) || dealer.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dealer.dealerInfo?.brands?.map((brand, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

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
              {/* <img
                src={selectedDealer.avatar || car || 'https://via.placeholder.com/400x200?text=Dealer+Logo'}
                alt={selectedDealer.dealerInfo?.businessName}
                className="w-full h-80 object-cover rounded-2xl"
              /> */}
              <p className="text-3xl font-bold text-primary-600">
                {selectedDealer.dealerInfo?.rating ? `${selectedDealer.dealerInfo.rating.toFixed(1)} ★` : 'N/A'}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>First Name:</strong> {selectedDealer.firstName}</p>
                <p><strong>Last Name:</strong> {selectedDealer.lastName}</p>
                <p><strong>Email:</strong> {selectedDealer.email}</p>
                <p><strong>Phone:</strong> {selectedDealer.phoneNumber}</p>
                <p><strong>Role:</strong> {selectedDealer.role}</p>
                <p><strong>Unique Number:</strong> {selectedDealer.uniqueNumber}</p>
                <p><strong>Active:</strong> {selectedDealer.isActive ? 'Yes' : 'No'}</p>
                <p><strong>Email Verified:</strong> {selectedDealer.emailVerified ? 'Yes' : 'No'}</p>
                <p><strong>State:</strong> {selectedDealer.dealerInfo?.state}</p>
                <p><strong>LGA:</strong> {selectedDealer.dealerInfo?.lga}</p>
                <p><strong>Address:</strong> {selectedDealer.address}</p>
                <p><strong>Bio:</strong> {selectedDealer.bio}</p>
                <p><strong>Business Name:</strong> {selectedDealer.dealerInfo?.businessName}</p>
                <p><strong>Business Reg No:</strong> {selectedDealer.dealerInfo?.businessRegistrationNumber}</p>
                <p><strong>Business Address:</strong> {selectedDealer.dealerInfo?.businessAddress}</p>
                <p><strong>Dealer State:</strong> {selectedDealer.dealerInfo?.state}</p>
                <p><strong>Dealer LGA:</strong> {selectedDealer.dealerInfo?.lga}</p>
                <p><strong>Verified:</strong> {selectedDealer.dealerInfo?.verified ? 'Yes' : 'No'}</p>
                <p><strong>Featured:</strong> {selectedDealer.dealerInfo?.isFeatured ? 'Yes' : 'No'}</p>
                <p><strong>Featured Until:</strong> {selectedDealer.dealerInfo?.featuredUntil ? new Date(selectedDealer.dealerInfo.featuredUntil).toLocaleString() : 'N/A'}</p>
              </div>

              <h3 className="text-xl font-bold mt-6">Brands</h3>
              <p>{selectedDealer.dealerInfo?.brands?.join(', ') || 'N/A'}</p>
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
