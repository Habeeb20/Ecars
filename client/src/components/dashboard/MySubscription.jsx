


/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Crown, 
  Zap, 
  Star, 
  Shield, 
  Calendar,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch active plan
      const activeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeData = await activeRes.json();
      console.log(activeData)
      if (activeData.data?.activePlan) {
        setActivePlan(activeData.data.activePlan);
      }

      // Fetch all subscriptions
      const allRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const allData = await allRes.json();
          console.log(allData)
      if (allData.status === 'success') {
        setSubscriptions(allData.data.subscriptions);
      }
    } catch (err) {
      console.log(err)
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = (type) => {
    const plans = {
      featured_listing: { name: 'Featured Listing', icon: Star, color: 'from-yellow-500 to-orange-500', badge: 'STAR' },
      newest_listings_access: { name: 'Newest Listings Access', icon: Zap, color: 'from-purple-600 to-pink-600', badge: 'ZAP' },
      featured_dealer: { name: 'Featured Dealer', icon: Crown, color: 'from-amber-500 to-red-600', badge: 'CROWN' },
      featured_service_provider: { name: 'Featured Mechanic', icon: Shield, color: 'from-blue-600 to-cyan-500', badge: 'SHIELD' },
    };
    return plans[type] || { name: type, icon: Star, color: 'from-gray-400 to-gray-600', badge: 'PLAN' };
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const isActive = (sub) => sub.status === 'active' && new Date(sub.endDate) > new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Subscriptions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your premium features and boost history
          </p>
        </div>

        {/* Active Plan Card */}
        {activePlan ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Current Active Plan
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-500">
                <div className={`h-3 bg-gradient-to-r ${getPlanInfo(activePlan.type).color}`} />
                <div className="p-10 text-center">
                  {/* Fixed: Render the icon component properly */}
                  <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${getPlanInfo(activePlan.type).color} text-white mb-6 shadow-2xl`}>
                    {React.createElement(getPlanInfo(activePlan.type).icon, { className: "h-10 w-10" })}
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {getPlanInfo(activePlan.type).name}
                  </h3>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-left bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Started</p>
                      <p className="font-bold text-lg">{formatDate(activePlan.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                      <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        {formatDate(activePlan.endDate)}
                      </p>
                    </div>
                  </div>

                  {activePlan.listing && (
                    <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Boosted Car:</p>
                      <p className="font-bold">{activePlan.listing.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <div className="inline-flex p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl mb-6">
              <XCircle className="h-20 w-20 text-gray-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
              No Active Subscription
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Upgrade to unlock premium features!
            </p>
          </div>
        )}

        {/* Subscription History */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Subscription History
          </h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
              <Clock className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-600 dark:text-gray-400">No subscription history yet</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {subscriptions.map((sub) => {
                const info = getPlanInfo(sub.type);
                const active = isActive(sub);

                return (
                  <div
                    key={sub._id}
                    className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                      active ? 'ring-4 ring-green-500 ring-offset-4' : ''
                    }`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${info.color}`} />
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-1 rounded-2xl bg-gradient-to-br ${info.color} text-white`}>
                            {/* Fixed: Render icon properly */}
                            {React.createElement(info.icon, { className: "h-10 w-10" })}
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {info.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {sub.duration === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₦{sub.amount?.toLocaleString()}
                          </p>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mt-2 ${
                            active 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {active ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            {/* {active ? 'ACTIVE' : 'EXPIRED'} */}
                            {sub.status === 'active' ? 'ACTIVE' : sub.status === 'pending' ? 'AWAITING APPROVAL' : 'EXPIRED' }
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                          <Calendar className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Started</p>
                          <p className="font-bold">{formatDate(sub.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                          <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ended</p>
                          <p className="font-bold">{formatDate(sub.endDate)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                          <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                          <p className={`font-bold ${active ? 'text-green-600' : 'text-gray-500'}`}>
                            {active ? 'Running' : 'Completed'}
                          </p>
                        </div>
                      </div>

                      {sub.listing && (
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
                          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            Boosted Car: {sub.listing.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;