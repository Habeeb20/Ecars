/* eslint-disable no-unused-vars */


// // pages/dashboard/Overview.jsx
// import { useState, useEffect } from 'react';
// import { useAuth } from "../../contexts/AuthContext";
// import { Building2 } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
// } from 'recharts';
// import { Car, Users, Wrench, TrendingUp, DollarSign, Eye } from 'lucide-react';
// import UpgradeModal from "./UpgradeModal";
// import { toast } from 'sonner';

// const Overview = () => {
//   const { user } = useAuth();
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   const [myCars, setMyCars] = useState([]);
//   const [platformStats, setPlatformStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMyStats();
//     fetchPlatformStats();
//   }, []);

//   const fetchMyStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') {
//         setMyCars(data.data.cars);
//       }
//     } catch (err) {
//       console.log("Failed to load your cars");
//     }
//   };

//   const fetchPlatformStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') {
//         setPlatformStats(data.data);
//       }
//     } catch (err) {
//       // Fallback dummy data if no backend
//       setPlatformStats({
//         totalUsers: 1240,
//         totalDealers: 89,
//         totalServiceProviders: 156,
//         totalCars: 892,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Your car listing stats
//   const myCarStats = [
//     { name: 'Total Listed', value: myCars.length, color: '#6366f1' },
//     { name: 'Active', value: myCars.filter(c => c.status === 'active').length, color: '#10b981' },
//     { name: 'Pending', value: myCars.filter(c => c.status === 'pending').length, color: '#f59e0b' },
//   ];

//   // Platform user distribution
//   const userDistribution = platformStats ? [
//     { name: 'Regular Users', value: platformStats.totalUsers - platformStats.totalDealers - platformStats.totalServiceProviders, color: '#94a3b8' },
//     { name: 'Dealers', value: platformStats.totalDealers, color: '#3b82f6' },
//     { name: 'Service Providers', value: platformStats.totalServiceProviders, color: '#8b5cf6' },
//   ] : [];

//   // Monthly car listing trend (dummy — replace with real data later)
//   const monthlyTrend = [
//     { month: 'Jan', cars: 12 }, { month: 'Feb', cars: 19 }, { month: 'Mar', cars: 25 },
//     { month: 'Apr', cars: 32 }, { month: 'May', cars: 41 }, { month: 'Jun', cars: 52 },
//   ];

//   return (
//     <div className="min-h-screen p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Welcome back, {user?.firstName || 'User'}!
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Here's what's happening with your account
//             </p>
//           </div>

//           {/* Upgrade Button */}
//           {user?.role === 'user' && (
//             <button
//               onClick={() => setShowUpgrade(true)}
//               className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3"
//             >
//               <TrendingUp className="h-5 w-5" />
//               Upgrade to Dealer / Service Provider / car-parts seller
//             </button>
//           )}
//         </div>

//         {/* Your Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Total Cars Listed</p>
//                 <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{myCars.length}</p>
//               </div>
//               <Car className="h-12 w-12 text-indigo-600" />
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Active Listings</p>
//                 <p className="text-3xl font-bold text-green-600 mt-2">
//                   {myCars.filter(c => c.status === 'active').length}
//                 </p>
//               </div>
//               <Eye className="h-12 w-12 text-green-600" />
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
//                 <p className="text-3xl font-bold text-blue-600 mt-2">
//                   {myCars.reduce((sum, c) => sum + (c.views || 0), 0)}
//                 </p>
//               </div>
//               <Eye className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">Account Type</p>
//                 <p className="text-2xl font-bold text-purple-600 mt-2 capitalize">
//                   {user?.role || 'User'}
//                 </p>
//               </div>
//               {user?.role === 'dealer' && <Building2 className="h-12 w-12 text-purple-600" />}
//               {user?.role === 'service-provider' && <Wrench className="h-12 w-12 text-purple-600" />}
//               {user?.role === 'user' && <Users className="h-12 w-12 text-gray-600" />}
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Your Car Listing Status */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent bg-clip-text">
//               Your Car Listing Status
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={myCarStats}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {myCarStats.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Platform User Distribution */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
//             <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Platform User Breakdown
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={userDistribution}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//             {platformStats && (
//               <div className="mt-6 grid grid-cols-3 gap-4 text-center">
//                 <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
//                   <p className="text-3xl font-bold text-gray-800 dark:text-white">{platformStats.totalUsers}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
//                 </div>
//                 <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
//                   <p className="text-3xl font-bold text-blue-600">{platformStats.totalDealers}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Dealers</p>
//                 </div>
//                 <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
//                   <p className="text-3xl font-bold text-purple-600">{platformStats.totalServiceProviders}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Service Providers</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Monthly Trend */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
//           <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Your Monthly Car Listings Trend
//           </h2>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={monthlyTrend}>
//               <CartesianGrid strokeDasharray="4 4" stroke="#e0f172a10" />
//               <XAxis dataKey="month" stroke="#64748b" />
//               <YAxis stroke="#64748b" />
//               <Tooltip />
//               <Line type="monotone" dataKey="cars" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 6 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* UPGRADE MODAL */}
//       <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
//     </div>
//   );
// };

// export default Overview;






/* eslint-disable no-unused-vars */
// pages/dashboard/Overview.jsx
import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Building2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Car, Users, Wrench, TrendingUp, DollarSign, Eye, Package } from 'lucide-react';
import UpgradeModal from "./UpgradeModal";
import { toast } from 'sonner';

const Overview = () => {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [myCars, setMyCars] = useState([]);
  const [myCarParts, setMyCarParts] = useState([]); // NEW: For car part sellers
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStats();
    fetchMyCarPartStats(); // NEW: Fetch car parts if car part seller
    fetchPlatformStats();
  }, []);

  const fetchMyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMyCars(data.data.cars);
      }
    } catch (err) {
      console.log("Failed to load your cars");
    }
  };

  // NEW: Fetch my car part listings if car part seller
  const fetchMyCarPartStats = async () => {
    if (user?.role !== 'carPart-seller') return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMyCarParts(data.data.parts || []); // Assuming /carparts/my endpoint
      }
    } catch (err) {
      console.log("Failed to load your car parts");
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPlatformStats(data.data);
      }
    } catch (err) {
      // Fallback dummy data if no backend
      setPlatformStats({
        totalUsers: 1240,
        totalDealers: 89,
        totalServiceProviders: 156,
        totalCarPartSellers: 120, // NEW: Dummy for car part sellers
        totalCars: 892,
        totalCarParts: 1450, // NEW: Dummy for total car parts
      });
    } finally {
      setLoading(false);
    }
  };

  // Your car listing stats
  const myCarStats = [
    { name: 'Total Listed', value: myCars.length, color: '#6366f1' },
    { name: 'Active', value: myCars.filter(c => c.status === 'active').length, color: '#10b981' },
    { name: 'Pending', value: myCars.filter(c => c.status === 'pending').length, color: '#f59e0b' },
  ];

  // NEW: Your car part stats (only if car part seller)
  const myCarPartStats = user?.role === 'carPart-seller' ? [
    { name: 'Total Listed', value: myCarParts.length, color: '#6366f1' },
    { name: 'Active', value: myCarParts.filter(p => p.status === 'active').length, color: '#10b981' },
    { name: 'Sold', value: myCarParts.filter(p => p.status === 'sold').length, color: '#ef4444' },
  ] : [];

  // Platform user distribution (NEW: Added car part sellers)
  const userDistribution = platformStats ? [
    { name: 'Regular Users', value: platformStats.totalUsers - platformStats.totalDealers - platformStats.totalServiceProviders - platformStats.totalCarPartSellers, color: '#94a3b8' },
    { name: 'Dealers', value: platformStats.totalDealers, color: '#3b82f6' },
    { name: 'Service Providers', value: platformStats.totalServiceProviders, color: '#8b5cf6' },
    { name: 'Car Part Sellers', value: platformStats.totalCarPartSellers, color: '#10b981' }, // NEW
  ] : [];

  // Monthly car listing trend (dummy — replace with real data later)
  const monthlyTrend = [
    { month: 'Jan', cars: 12 }, { month: 'Feb', cars: 19 }, { month: 'Mar', cars: 25 },
    { month: 'Apr', cars: 32 }, { month: 'May', cars: 41 }, { month: 'Jun', cars: 52 },
  ];

  // NEW: Monthly car part trend (dummy for now)
  const monthlyPartTrend = [
    { month: 'Jan', parts: 15 }, { month: 'Feb', parts: 22 }, { month: 'Mar', parts: 28 },
    { month: 'Apr', parts: 35 }, { month: 'May', parts: 45 }, { month: 'Jun', parts: 58 },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening with your account
            </p>
          </div>

          {/* Upgrade Button */}
          {user?.role === 'user' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3"
            >
              <TrendingUp className="h-5 w-5" />
              Upgrade to Dealer / Service Provider / car-parts seller
            </button>
          )}
        </div>

        {/* Your Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Cars Listed</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{myCars.length}</p>
              </div>
              <Car className="h-12 w-12 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {myCars.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Eye className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {myCars.reduce((sum, c) => sum + (c.views || 0), 0)}
                </p>
              </div>
              <Eye className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Account Type</p>
                <p className="text-2xl font-bold text-purple-600 mt-2 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>
              {user?.role === 'dealer' && <Building2 className="h-12 w-12 text-purple-600" />}
              {user?.role === 'service-provider' && <Wrench className="h-12 w-12 text-purple-600" />}
              {user?.role === 'user' && <Users className="h-12 w-12 text-gray-600" />}
            </div>
          </div>
        </div>

        {/* NEW: Car Part Stats Cards (if car part seller) */}
        {user?.role === 'carPart-seller' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Car Parts Listed</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{myCarParts.length}</p>
                </div>
                <Package className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Active Parts</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {myCarParts.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Part Views</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {myCarParts.reduce((sum, p) => sum + (p.views || 0), 0)}
                  </p>
                </div>
                <Eye className="h-12 w-12 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Car Listing Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Car Listing Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={myCarStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {myCarStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Platform User Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform User Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {platformStats && (
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{platformStats.totalUsers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                  <p className="text-3xl font-bold text-blue-600">{platformStats.totalDealers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dealers</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
                  <p className="text-3xl font-bold text-purple-600">{platformStats.totalServiceProviders}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Service Providers</p>
                </div>
                {/* NEW: Car Part Sellers */}
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600">{platformStats.totalCarPartSellers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Car Part Sellers</p>
                </div>
              </div>
            )}
          </div>

          {/* NEW: Platform Total Listings Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform Listings Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{
                name: 'Total Listings',
                Cars: platformStats?.totalCars || 0,
                'Car Parts': platformStats?.totalCarParts || 0,
              }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="Cars" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="Car Parts" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Your Car Part Listing Status (if car part seller) */}
          {user?.role === 'carPart-seller' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Car Part Listing Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={myCarPartStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {myCarPartStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Monthly Car Listings Trend
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e0f172a10" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="cars" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: '#8b5cf6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NEW: Monthly Car Part Trend (if car part seller) */}
        {user?.role === 'carPart-seller' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Monthly Car Part Listings Trend
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyPartTrend}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e0f172a10" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="parts" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* UPGRADE MODAL */}
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default Overview;