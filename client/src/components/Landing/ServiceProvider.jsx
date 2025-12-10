/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Star, X, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';


const ServiceProvider = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [filters, setFilters] = useState({
    serviceType: '',
    location: '',
    rating: '',
    specialization: '',
  });

  const { isLoggedIn } = useAuth();

  const serviceTypes = [
    'Repair & Maintenance',
    'Body Shop',
    'Detailing',
    'Tire Services',
    'Oil Change',
    'Diagnostics',
    'Paint Shop',
    'Mobile Mechanic',
  ];

  const specializations = [
    'All Brands',
    'European Cars',
    'Japanese Cars',
    'American Cars',
    'Luxury Vehicles',
    'Classic Cars',
    'Electric Vehicles',
    'Hybrid Vehicles',
  ];

  const ratings = [
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
    { label: '2+ Stars', value: '2' },
  ];

  useEffect(() => {
    fetchAllProviders();
  }, []);

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/all-service-providers`);
      const data = await res.json();

      if (data.status === 'success') {
        setProviders(data.data.providers);
        setFilteredProviders(data.data.providers);
      } else {
        toast.error('Failed to load service providers');
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

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/service-providers/search?${query.toString()}`);
      const data = await res.json();

      if (data.status === 'success') {
        setFilteredProviders(data.data.providers);
      } else {
        toast.error('No service providers found');
        setFilteredProviders([]);
      }
    } catch (err) {
      toast.error('Filter failed');
      setFilteredProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const openProviderDetails = (provider) => {
    setSelectedProvider(provider);
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
          receiverId: selectedProvider._id,
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
        Service Providers
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Type
            </label>
            <select
              name="serviceType"
              className="input"
              value={filters.serviceType}
              onChange={handleFilterChange}
            >
              <option value="">All Services</option>
              {serviceTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
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
              placeholder="Enter location..."
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
              Specialization
            </label>
            <select
              name="specialization"
              className="input"
              value={filters.specialization}
              onChange={handleFilterChange}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
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
        ) : filteredProviders.length > 0 ? (
          filteredProviders.map(provider => (
            <div 
              key={provider._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => openProviderDetails(provider)}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {provider.serviceProviderInfo?.businessName || `${provider.firstName} ${provider.lastName}`}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(provider.serviceProviderInfo?.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({provider.serviceProviderInfo?.totalJobs || 0} reviews)
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{provider.serviceProviderInfo?.state}, {provider.serviceProviderInfo?.lga}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{provider.phoneNumber}</span>
                  </div>
                </div>
                <button className="mt-4 w-full btn btn-primary">
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No service providers found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {/* PROVIDER DETAILS MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold">
                {selectedProvider.serviceProviderInfo?.businessName || `${selectedProvider.firstName} ${selectedProvider.lastName}`}
              </h2>
              <button onClick={() => setSelectedProvider(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${i < Math.floor(selectedProvider.serviceProviderInfo?.rating || 0) ? 'fill-current' : 'fill-none stroke-current'}`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold">{selectedProvider.serviceProviderInfo?.rating?.toFixed(1) || 'N/A'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Business Name:</strong> {selectedProvider.serviceProviderInfo?.businessName}</p>
                <p><strong>Service Type:</strong> {selectedProvider.serviceProviderInfo?.type}</p>
                <p><strong>Phone:</strong> {selectedProvider.phoneNumber}</p>
                <p><strong>State:</strong> {selectedProvider.serviceProviderInfo?.state}</p>
                <p><strong>LGA:</strong> {selectedProvider.serviceProviderInfo?.lga}</p>
                <p><strong>Years of Experience:</strong> {selectedProvider.serviceProviderInfo?.yearsOfExperience || 'N/A'}</p>
                <p><strong>Verified:</strong> {selectedProvider.serviceProviderInfo?.verified ? 'Yes' : 'No'}</p>
                <p><strong>Available:</strong> {selectedProvider.serviceProviderInfo?.available ? 'Yes' : 'No'}</p>
              </div>

              <h3 className="text-xl font-bold mt-6">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProvider.serviceProviderInfo?.servicesOffered?.map((service, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold mt-6">Specialization</h3>
              <p>{selectedProvider.serviceProviderInfo?.specialization || 'N/A'}</p>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={openChat}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                Chat with Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}
      {showChatModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between flex-shrink-0">
              <h3 className="text-2xl font-bold">Chat with Service Provider</h3>
              <button onClick={() => setShowChatModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Send a message to the provider</p>
              <textarea
                rows="8"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Hello, I'm interested in your services..."
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

export default ServiceProvider;