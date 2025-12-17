// components/StatsSection.jsx
import { useState, useEffect } from 'react';
import { Car, Users, Shield, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalDealers: 0,
    totalServiceProviders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats/platform`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === 'success') {
        setStats({
          totalCars: data.data.totalCars || 0,
          totalDealers: data.data.totalDealers || 0,
          totalServiceProviders: data.data.totalServiceProviders || 0,
          totalUsers: data.data.totalUsers || 0,
        });
      } else {
        toast.error('Failed to load stats');
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      // Optional: fallback to cached or dummy data
    } finally {
      setLoading(false);
    }
  };

  const statsArray = [
    {
      icon: Car,
      label: 'Available Cars',
      value: stats.totalCars,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Shield,
      label: 'Verified Dealers',
      value: stats.totalDealers,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: TrendingUp,
      label: 'Service Providers',
      value: stats.totalServiceProviders,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl  md:text-2xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          eCars in Numbers
        </h2>
<div className="grid grid-cols-2 sm:grid-cols-2 p-6  lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {statsArray.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
             
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 text-center">
          
                <div className="mx-auto w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>

                <div className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {loading ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    <span className="inline-block">
                      {stat.value.toLocaleString()}
                    </span>
                  )}
                </div>

        
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center gap-2">
                  <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
                  {stat.label}
                </p>
              </div>

          
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 pointer-events-none" />
            </div>
          ))}
        </div>

     
      </div>
    </section>
  );
};

export default StatsSection;


