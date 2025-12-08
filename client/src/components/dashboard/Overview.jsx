/* eslint-disable no-unused-vars */
// // pages/dashboard/Overview.jsx
// import { useAuth } from "../../contexts/AuthContext"



// import React, { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
// import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, CartesianGrid as LineGrid, Tooltip as LineTooltip, Legend as LineLegend } from 'recharts';
// import UpgradeModal from "./UpgradeModal";

// // Dummy Data
// const salesData = [
//   { month: 'Jan', sales: 120, rentals: 80 },
//   { month: 'Feb', sales: 150, rentals: 100 },
//   { month: 'Mar', sales: 180, rentals: 120 },
//   { month: 'Apr', sales: 200, rentals: 140 },
//   { month: 'May', sales: 220, rentals: 160 },
//   { month: 'Jun', sales: 250, rentals: 180 },
//   { month: 'Jul', sales: 280, rentals: 200 },
//   { month: 'Aug', sales: 300, rentals: 220 },
//   { month: 'Sep', sales: 320, rentals: 240 },
//   { month: 'Oct', sales: 350, rentals: 260 },
//   { month: 'Nov', sales: 380, rentals: 280 },
//   { month: 'Dec', sales: 400, rentals: 300 },
// ];

// const carTypeData = [
//   { name: 'Sedan', value: 400, color: '#0088FE' },
//   { name: 'SUV', value: 300, color: '#00C49F' },
//   { name: 'Truck', value: 200, color: '#FFBB28' },
//   { name: 'Sports', value: 100, color: '#FF8042' },
//   { name: 'Electric', value: 150, color: '#A28EFF' },
// ];

// const dealerPerformanceData = [
//   { dealer: 'Dealer A', sales: 500, rentals: 300 },
//   { dealer: 'Dealer B', sales: 400, rentals: 250 },
//   { dealer: 'Dealer C', sales: 350, rentals: 200 },
//   { dealer: 'Dealer D', sales: 300, rentals: 180 },
//   { dealer: 'Dealer E', sales: 250, rentals: 150 },
// ];

// const userEngagementData = [
//   { day: 'Mon', buys: 50, rents: 30, views: 200 },
//   { day: 'Tue', buys: 60, rents: 40, views: 220 },
//   { day: 'Wed', buys: 70, rents: 50, views: 240 },
//   { day: 'Thu', buys: 80, rents: 60, views: 260 },
//   { day: 'Fri', buys: 90, rents: 70, views: 280 },
//   { day: 'Sat', buys: 100, rents: 80, views: 300 },
//   { day: 'Sun', buys: 110, rents: 90, views: 320 },
// ];

// const Overview= () => {
//   const [showUpgrade, setShowUpgrade] = useState(false)
//   return (
//     <div className="min-h-screen  p-8">
//       <div className="max-w-7xl mx-auto">
//    <h1 className="text-2xl font-bold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome back, {useAuth().user?.firstName}!</h1>
//    <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Sales vs Rentals Trend */}
//           <div className=" rounded-2xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sales vs Rentals Trend</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={salesData}>
//                 <LineGrid strokeDasharray="3 3" />
//                 <LineXAxis dataKey="month" stroke="#888" />
//                 <LineYAxis stroke="#888" />
//                 <LineTooltip />
//                 <LineLegend />
//                 <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
//                 <Line type="monotone" dataKey="rentals" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Car Type Distribution */}
//           <div className="rounded-2xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold mb-4  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Car Type Distribution</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={carTypeData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {carTypeData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <PieLegend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Dealer Performance */}
//           <div className="rounded-2xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dealer Performance</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={dealerPerformanceData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="dealer" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="sales" fill="#8884d8" barSize={40} radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="rentals" fill="#82ca9d" barSize={40} radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* User Engagement */}
//           <div className=" rounded-2xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">User Engagement Weekly</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={userEngagementData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="buys" fill="#FF8042" barSize={30} radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="rents" fill="#00C49F" barSize={30} radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="views" fill="#0088FE" barSize={30} radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Overview;





// pages/dashboard/Overview.jsx
import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Building2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Car, Users, Wrench, TrendingUp, DollarSign, Eye } from 'lucide-react';
import UpgradeModal from "./UpgradeModal";
import { toast } from 'sonner';

const Overview = () => {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [myCars, setMyCars] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyStats();
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
        totalCars: 892,
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

  // Platform user distribution
  const userDistribution = platformStats ? [
    { name: 'Regular Users', value: platformStats.totalUsers - platformStats.totalDealers - platformStats.totalServiceProviders, color: '#94a3b8' },
    { name: 'Dealers', value: platformStats.totalDealers, color: '#3b82f6' },
    { name: 'Service Providers', value: platformStats.totalServiceProviders, color: '#8b5cf6' },
  ] : [];

  // Monthly car listing trend (dummy — replace with real data later)
  const monthlyTrend = [
    { month: 'Jan', cars: 12 }, { month: 'Feb', cars: 19 }, { month: 'Mar', cars: 25 },
    { month: 'Apr', cars: 32 }, { month: 'May', cars: 41 }, { month: 'Jun', cars: 52 },
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
              Upgrade to Dealer / Service Provider
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Car Listing Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent bg-clip-text">
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
              </div>
            )}
          </div>
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
      </div>

      {/* UPGRADE MODAL */}
      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
};

export default Overview;