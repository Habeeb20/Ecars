/* eslint-disable no-unused-vars */
// components/admin/SuperadminSubscriptions.jsx
import { useState, useEffect } from 'react';
import { 
  Crown, Star, Zap, Shield, CheckCircle2, XCircle, Loader2, 
  Users, Car, TrendingUp, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

const SuperadminSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPlans(data.data.subscriptions);
      }
    } catch (err) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const activatePlan = async (subId) => {
    if (!confirm('Activate this subscription?')) return;

    setActivating(prev => ({ ...prev, [subId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/${subId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Subscription activated successfully!');
        fetchPlans();
      } else {
        toast.error(data.message || 'Failed to activate');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setActivating(prev => ({ ...prev, [subId]: false }));
    }
  };

  const getPlanIcon = (type) => {
    const icons = {
      featured_listing: Star,
      newest_listings_access: Zap,
      featured_dealer: Crown,
      featured_service_provider: Shield,
    };
    return icons[type] || Star;
  };

  const getPlanColor = (type) => {
    const colors = {
      featured_listing: 'from-yellow-500 to-orange-500',
      newest_listings_access: 'from-purple-600 to-pink-600',
      featured_dealer: 'from-amber-500 to-red-600',
      featured_service_provider: 'from-blue-600 to-cyan-500',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Manage Subscriptions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Activate premium plans for users
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <XCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <p className="text-2xl text-gray-600 dark:text-gray-400">No pending subscriptions</p>
            </div>
          ) : (
            plans.map((plan) => {
              const Icon = getPlanIcon(plan.type);
              const color = getPlanColor(plan.type);
              const isActive = plan.status === 'active';

              return (
                <div
                  key={plan._id}
                  className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 ${
                    isActive ? 'ring-4 ring-green-500 ring-offset-4' : ''
                  }`}
                >
                  <div className={`h-3 bg-gradient-to-r ${color}`} />
                  <div className="p-8 text-center">
                    <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${color} text-white mb-6 shadow-2xl`}>
                      <Icon className="h-10 w-10" />
                    </div>

                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {plan.type.replace(/_/g, ' ').toUpperCase()}
                    </h4>

                    <div className="mb-6">
                      <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                        isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {isActive ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                        {isActive ? 'ACTIVE' : 'PENDING ACTIVATION'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-left mb-8">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">User</p>
                        <p className="font-bold">{plan.user.firstName} {plan.user.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">
                          ₦{plan.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-bold">{plan.duration === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                        <p className="font-bold">{new Date(plan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => activatePlan(plan._id)}
                        disabled={activating[plan._id]}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition"
                      >
                        {activating[plan._id] ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6" />
                        )}
                        {activating[plan._id] ? 'Activating...' : 'Activate Plan Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperadminSubscriptions;