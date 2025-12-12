/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { 
  Loader2, 
  Search, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { toast } from 'sonner';

const DealerList = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setDealers(data.data.dealers || []);
      } else {
        toast.error('Failed to load dealers');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (dealerId) => {
    if (updating === dealerId) return;
    setUpdating(dealerId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers/${dealerId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Dealer verified successfully');
        fetchDealers();
      } else {
        toast.error(data.message || 'Failed to verify');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const handleUnverify = async (dealerId) => {
    if (updating === dealerId) return;
    setUpdating(dealerId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers/unverify/${dealerId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Dealer unverified successfully');
        fetchDealers();
      } else {
        toast.error(data.message || 'Failed to unverify');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredDealers = dealers.filter(dealer =>
    `${dealer.firstName} ${dealer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dealer Verification
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
        ) : filteredDealers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No dealers found
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Dealer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Business</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDealers.map(dealer => (
                    <tr key={dealer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {dealer.firstName} {dealer.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {dealer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {dealer?.dealerInfo?.businessName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col">
                          <span>{dealer.phoneNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          dealer.dealerInfo?.verified 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {dealer.dealerInfo?.verified ? (
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
                        {dealer.verified ? (
                          <button
                            onClick={() => handleUnverify(dealer._id)}
                            disabled={updating === dealer._id}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                          >
                            {updating === dealer._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ShieldX className="h-4 w-4" />
                                Unverify
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(dealer._id)}
                            disabled={updating === dealer._id}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1"
                          >
                            {updating === dealer._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4" />
                                Verify
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerList;