/* eslint-disable no-unused-vars */
// Frontend: Admin Car Part Seller List (CarPartSellerList.jsx)
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  User, 
  Mail, 
  Phone,
  ShieldCheck,
  ShieldX,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const CarPartSellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/carpart-sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setSellers(data.data.sellers || []);
      } else {
        toast.error('Failed to load car part sellers');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (sellerId) => {
    if (updating === sellerId) return;
    setUpdating(sellerId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/carpart-sellers/${sellerId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Car part seller verified successfully');
        fetchSellers();
      } else {
        toast.error(data.message || 'Failed to verify');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const handleUnverify = async (sellerId) => {
    if (updating === sellerId) return;
    setUpdating(sellerId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/carpart-sellers/unverify/${sellerId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Car part seller unverified successfully');
        fetchSellers();
      } else {
        toast.error(data.message || 'Failed to unverify');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredSellers = sellers.filter(seller =>
    `${seller.firstName} ${seller.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.carPartSellerInfo?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Car Part Seller Verification
          </h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or business..."
              className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No car part sellers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different search terms
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Seller</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Business</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSellers.map(seller => (
                    <tr key={seller._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {seller.firstName} {seller.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {seller.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {seller.carPartSellerInfo?.businessName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col">
                          <span>{seller.phoneNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          seller.carPartSellerInfo?.verified 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {seller.carPartSellerInfo?.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Unverified
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedSeller(seller)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {seller.carPartSellerInfo?.verified ? (
                            <button
                              onClick={() => handleUnverify(seller._id)}
                              disabled={updating === seller._id}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              {updating === seller._id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <ShieldX className="h-5 w-5" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerify(seller._id)}
                              disabled={updating === seller._id}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              {updating === seller._id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <ShieldCheck className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
              <h2 className="text-2xl font-bold">
                {selectedSeller.carPartSellerInfo?.businessName || `${selectedSeller.firstName} ${selectedSeller.lastName}`}
              </h2>
              <button onClick={() => setSelectedSeller(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Name:</strong> {selectedSeller.firstName} {selectedSeller.lastName}</p>
                <p><strong>Email:</strong> {selectedSeller.email}</p>
                <p><strong>Phone:</strong> {selectedSeller.phoneNumber}</p>
                <p><strong>Business Name:</strong> {selectedSeller.carPartSellerInfo?.businessName || 'N/A'}</p>
                <p><strong>Parts Type:</strong> {selectedSeller.carPartSellerInfo?.type || 'N/A'}</p>
                <p><strong>Business Address:</strong> {selectedSeller.carPartSellerInfo?.businessAddress || 'N/A'}</p>
                <p><strong>State:</strong> {selectedSeller.carPartSellerInfo?.state || 'N/A'}</p>
                <p><strong>LGA:</strong> {selectedSeller.carPartSellerInfo?.lga || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> {selectedSeller.carPartSellerInfo?.whatsappNumber || 'N/A'}</p>
                <p><strong>Website:</strong> {selectedSeller.carPartSellerInfo?.website || 'N/A'}</p>
                <p><strong>Verified:</strong> {selectedSeller.carPartSellerInfo?.verified ? 'Yes' : 'No'}</p>
                <p><strong>Years of Experience:</strong> {selectedSeller.carPartSellerInfo?.yearsOfExperience || 'N/A'}</p>
                <p><strong>Available:</strong> {selectedSeller.carPartSellerInfo?.available ? 'Yes' : 'No'}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSeller.carPartSellerInfo?.specialties?.map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                      {spec}
                    </span>
                  )) || <span className="text-gray-500">No specialties listed</span>}
                </div>
              </div>

              {selectedSeller.carPartSellerInfo?.shopPhotos?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Shop Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedSeller.carPartSellerInfo.shopPhotos.map((img, i) => (
                      <img key={i} src={img} alt={`Shop ${i+1}`} className="w-full h-40 object-cover rounded-lg shadow" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex-shrink-0">
              <button
                onClick={() => setSelectedSeller(null)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPartSellerList;