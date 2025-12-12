/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  ShieldCheck, 
  MapPin, 
  DollarSign, 
  Package, 
  Star, 
  Eye 
} from 'lucide-react';
import { toast } from 'sonner';

const AllCarParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    fetchCarParts();
  }, [searchQuery]);

  const fetchCarParts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        title: searchQuery,
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setParts(data.data.parts || []);
      } else {
        toast.error('Failed to load car parts');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mt-10 md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            All Car Parts
          </h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No car parts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map(part => (
              <div key={part._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <img 
                  src={part.images[0] || '/placeholder-part.jpg'} 
                  alt={part.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {part.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    ₦{part.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Condition: {part.condition.toUpperCase()} • Type: {part.partType.toUpperCase()}
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      Posted by: {part.seller.firstName} {part.seller.lastName}
                      {part.seller.carPartSellerInfo.verified && (
                        <ShieldCheck className="h-5 w-5 text-green-500" title="Verified Seller" />
                      )}
                    </h4>
                    <p className="text-sm">Business: {part.seller.carPartSellerInfo.businessName}</p>
                    <p className="text-sm">Location: {part.seller.carPartSellerInfo.state}, {part.seller.carPartSellerInfo.lga}</p>
                    <p className="text-sm flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {part.seller.carPartSellerInfo.rating}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedPart(part)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="h-5 w-5" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Part Details Modal */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedPart.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedPart.description}</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-4">₦{selectedPart.price.toLocaleString()}</p>
            <p className="mb-2">Condition: {selectedPart.condition}</p>
            <p className="mb-2">Part Type: {selectedPart.partType}</p>
            <p className="mb-4">Compatible Makes: {selectedPart.compatibleMakes.join(', ')}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedPart.images.map((img, i) => (
                <img key={i} src={img} alt={`Image ${i+1}`} className="w-full h-40 object-cover rounded-lg" />
              ))}
            </div>
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Seller Info</h3>
              <p>{selectedPart.seller.firstName} {selectedPart.seller.lastName}</p>
              <p>{selectedPart.seller.email}</p>
              <p>{selectedPart.seller.phoneNumber}</p>
            </div>
            <button onClick={() => setSelectedPart(null)} className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCarParts;