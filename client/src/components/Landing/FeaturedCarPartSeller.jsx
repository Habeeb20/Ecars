/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Package,
  Phone,
  Users,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';

const FeaturedCarPartSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    lga: '',
    location: '',
  });

  useEffect(() => {
    fetchFeaturedSellers();
  }, [filters, searchQuery]);

  const fetchFeaturedSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        search: searchQuery,
        ...(filters.state && { state: filters.state }),
        ...(filters.lga && { lga: filters.lga }),
        ...(filters.location && { location: filters.location }),
        verified: true,
        isFeatured: true,
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/carpart-sellers/search?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.status === 'success') {
        setSellers(data.data.sellers || []);
      } else {
        toast.error('Failed to load featured sellers');
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Featured Car Part Sellers
          </h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or business..."
              className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="e.g. Lagos"
              className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LGA
            </label>
            <input
              type="text"
              name="lga"
              value={filters.lga}
              onChange={handleFilterChange}
              placeholder="e.g. Iyana Ipaja"
              className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. Iyana Ipaja, Lagos"
              className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sellers Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No featured car part sellers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map(seller => (
              <div key={seller._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="p-6">
                  {/* Verified Badge & Business Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {seller.carPartSellerInfo.businessName}
                        {seller.carPartSellerInfo.verified && (
                          <ShieldCheck className="h-6 w-6 text-green-500" title="Verified Seller" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {seller.carPartSellerInfo.type.toUpperCase()} Parts
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4" />
                    {seller.carPartSellerInfo.state}, {seller.carPartSellerInfo.lga}
                  </p>

                  {/* Details */}
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {seller.phoneNumber || 'N/A'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {seller.carPartSellerInfo.rating || 0} ({seller.carPartSellerInfo.totalSales || 0} sales)
                    </p>
                    <p className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Specialties: {seller.carPartSellerInfo.specialties?.length > 0 
                        ? seller.carPartSellerInfo.specialties.join(', ') 
                        : 'Not specified'}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all">
                    View Parts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCarPartSellers;