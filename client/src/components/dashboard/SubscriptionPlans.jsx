/* eslint-disable no-unused-vars */
// components/SubscriptionPlans.jsx
import { useState } from 'react';
import { Check, Crown, Zap, Star, Shield, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [duration, setDuration] = useState('monthly');
  const [loading, setLoading] = useState(false);

//   const plans = [
//     {
//       id: 'featured_listing',
//       name: 'Featured Listing',
//       icon: Star,
//       color: 'from-yellow-500 to-orange-500',
//       price: { monthly: 5000, yearly: 50000 },
//       features: [
//         'Your car appears at the top',
//         'Featured badge on listing',
//         '10x more views',
//         'Priority in search results',
//       ],
//       popular: true,
//     },
//     {
//       id: 'newest_listings_access',
//       name: 'Newest Listings Access',
//       icon: Zap,
//       color: 'from-purple-600 to-pink-600',
//       price: { monthly: 2000, yearly: 20000 },
//       features: [
//         'See cars before everyone else',
//         'Instant notification on new cars',
//         'Early bird advantage',
//         'No ads',
//       ],
//     },
//     {
//       id: 'featured_dealer',
//       name: 'Featured Dealer',
//       icon: Crown,
//       color: 'from-amber-500 to-red-600',
//       price: { monthly: 15000, yearly: 150000 },
//       features: [
//         'Golden dealer badge',
//         'Appear in "Top Dealers"',
//         'Unlimited listings',
//         'Priority support',
//         'Analytics dashboard',
//       ],
//       popular: true,
//     },
//     {
//       id: 'featured_service_provider',
//       name: 'Featured Mechanic',
//       icon: Shield,
//       color: 'from-blue-600 to-cyan-500',
//       price: { monthly: 10000, yearly: 100000 },
//       features: [
//         'Top position in service search',
//         'Verified pro badge',
//         'Unlimited bookings',
//         'Customer reviews highlighted',
//       ],
//     },
//   ];
const plans = [
  {
    id: 'newest_listings_access',
    name: 'Newest Listings Access',
    icon: Zap,
    color: 'from-purple-600 to-pink-600',
    price: { monthly: 2000, yearly: 20000 },
    features: [
      'See new cars before everyone',
      'Instant notifications',
      'No ads',
      'Early access',
    ],
    popular: true,
  },
  {
    id: 'featured_dealer',
    name: 'Featured Dealer',
    icon: Crown,
    color: 'from-amber-500 to-red-600',
    price: { monthly: 15000, yearly: 150000 },
    features: [
      'Golden badge',
      'Top dealer section',
      'Unlimited listings',
      'Priority support',
    ],
  },
  {
    id: 'featured_service_provider',
    name: 'Featured Mechanic',
    icon: Shield,
    color: 'from-blue-600 to-cyan-500',
    price: { monthly: 10000, yearly: 100000 },
    features: [
      'Top in search',
      'Verified pro badge',
      'More bookings',
      'Customer trust',
    ],
  },
];
  const initiatePayment = async (planId) => {
    if (!planId) return toast.error('Please select a plan');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payments/paystack/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: planId,
          duration,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        // Redirect to Paystack
        window.location.href = data.data.authorization_url;
      } else {
        toast.error(data.message || 'Payment failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Power-Up
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get more views, sell faster, and grow your business with premium features
          </p>

          {/* Duration Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-lg ${duration === 'monthly' ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setDuration(duration === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-9 rounded-full bg-indigo-600 transition-all"
            >
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all ${duration === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-lg ${duration === 'yearly' ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 font-bold">-17%</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                selectedPlan === plan.id ? 'ring-4 ring-indigo-500 ring-offset-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden h-full">
                <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
                <div className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.color} text-white mb-6 shadow-lg`}>
                    <plan.icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{plan.name}</h3>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ₦{duration === 'monthly' ? plan.price.monthly.toLocaleString() : plan.price.yearly.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{duration === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      initiatePayment(plan.id);
                    }}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include secure payment • Instant activation • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;