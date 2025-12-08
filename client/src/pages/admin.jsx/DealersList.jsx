/* eslint-disable no-unused-vars */
// src/pages/admin/components/DealersList.jsx
import { useState, useEffect } from 'react';
import { Search, Check, X, Shield, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const DealersList = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setDealers(data.data.dealers);
      }
    } catch (err) {
      toast.error('Failed to load dealers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this dealer?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Dealer approved successfully!');
        setDealers(dealers.filter(d => d._id !== id));
      }
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/dealers/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success('Dealer rejected');
        setDealers(dealers.filter(d => d._id !== id));
      }
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  const filtered = dealers.filter(d =>
    d.dealerInfo?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dealer Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {dealers.length} pending approval
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search business name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Shield className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No pending dealer applications</p>
          </div>
        ) : (
          filtered.map((dealer) => (
            <div
              key={dealer._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {dealer.dealerInfo.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dealer.firstName} {dealer.lastName}
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-bold">
                  PENDING
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{dealer.email}</span>
                </div>
                {dealer.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{dealer.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>
                    {dealer.dealerInfo.lga}, {dealer.dealerInfo.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Applied {new Date(dealer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {dealer.dealerInfo.businessRegistrationNumber && (
                <p className="mt-4 text-xs text-gray-500">
                  CAC: {dealer.dealerInfo.businessRegistrationNumber}
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleApprove(dealer._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
                >
                  <Check className="h-5 w-5" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(dealer._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  <X className="h-5 w-5" />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DealersList;