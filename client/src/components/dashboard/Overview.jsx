


// /* eslint-disable no-unused-vars */
// // pages/dashboard/Overview.jsx
// import { useState, useEffect } from 'react';
// import { useAuth } from "../../contexts/AuthContext";
// import { 
//   Car, Eye, DollarSign, Package, TrendingUp, 
//   BarChart3, PieChart as PieChartIcon, ListFilter 
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   ResponsiveContainer, PieChart, Pie, Cell, LabelList
// } from 'recharts';
// import UpgradeModal from "./UpgradeModal";
// import { toast } from 'sonner';
// import { Award } from 'lucide-react';
// const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// const Overview = () => {
//   const { user } = useAuth();
//   console.log(user)
//   const [showUpgrade, setShowUpgrade] = useState(false);
//   const [myCars, setMyCars] = useState([]);
//   const [myCarParts, setMyCarParts] = useState([]);
//   const [platformStats, setPlatformStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMyStats();
//     if (user?.role === 'carPart-seller') fetchMyCarPartStats();
//     fetchPlatformStats();
//   }, [user]);

//   const fetchMyStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') {
//         setMyCars(data.data.cars || []);
//         console.log(data?.data?.cars)
//       }
//     } catch (err) {
//       console.log("Failed to load your cars");
//     }
//   };

//   const fetchMyCarPartStats = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') {
//         setMyCarParts(data.data.parts || []);
//       }
//     } catch (err) {
//       console.log("Failed to load your car parts");
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
//       // Fallback dummy data
//       setPlatformStats({
//         totalUsers: 1240,
//         totalDealers: 89,
//         totalServiceProviders: 156,
//         totalCarPartSellers: 120,
//         totalCars: 892,
//         totalCarParts: 1450,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Computed Stats ────────────────────────────────────────
//   const totalListed = myCars.length;
//   const activeListed = myCars.filter(c => c.status === 'active').length;
//   const totalValue = myCars.reduce((sum, c) => sum + (Number(c.price) || 0), 0);
//   const uniqueMakes = new Set(myCars.map(c => c.make)).size;

//   const statusBreakdown = [
//     { name: 'Active', value: activeListed, color: '#10b981' },
//     { name: 'Pending', value: myCars.filter(c => c.status === 'pending').length, color: '#f59e0b' },
//     { name: 'Sold', value: myCars.filter(c => c.status === 'sold').length, color: '#ef4444' },
//     { name: 'Other', value: totalListed - activeListed, color: '#64748b' },
//   ].filter(item => item.value > 0);

//   // Top Makes Chart Data
//   const makeCount = myCars.reduce((acc, car) => {
//     acc[car.make] = (acc[car.make] || 0) + 1;
//     return acc;
//   }, {});

//   const topMakes = Object.entries(makeCount)
//     .map(([make, count]) => ({ name: make, count }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 8);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//           <div>
//             <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
//               Dashboard Overview
//             </h1>
//             <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
//               Welcome back, {user?.firstName || 'User'} — here's your activity at a glance
//             </p>
//           </div>

//           {/* {user?.role === 'user' && (
//             <button
//               onClick={() => setShowUpgrade(true)}
//               className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3 whitespace-nowrap"
//             >
//               <TrendingUp className="h-5 w-5" />
//               Become a Dealer / Service Provider
//             </button>
//           )} */}
//         </div>

//         {/* Your Stats Cards - Glassmorphism Style */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Total Listed */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">Total Listed Cars</p>
//                 <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
//                   {totalListed}
//                 </p>
//               </div>
//               <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
//                 <Car className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
//               </div>
//             </div>
//           </div>

//           {/* Active Listings */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">Active Listings</p>
//                 <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">
//                   {activeListed}
//                 </p>
//               </div>
//               <div className="p-4 bg-green-100 dark:bg-green-900/40 rounded-full">
//                 <Eye className="h-10 w-10 text-green-600 dark:text-green-400" />
//               </div>
//             </div>
//           </div>

//           {/* Total Value */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">Total Value</p>
//                 <p className="text-1xl font-bold text-blue-600 dark:text-blue-400 mt-2">
//                   ₦{totalValue.toLocaleString()}
//                 </p>
//               </div>
//               <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-full">
//                 <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400" />
//               </div>
//             </div>
//           </div>

//           {/* Unique Makes */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">Different Makes</p>
//                 <p className="text-4xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
//                   {uniqueMakes}
//                 </p>
//               </div>
//               <div className="p-4 bg-amber-100 dark:bg-amber-900/40 rounded-full">
//                 <Award className="h-10 w-10 text-amber-600 dark:text-amber-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
//           {/* Status Breakdown - Pie Chart */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-700/50">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
//                 Listing Status
//               </h2>
//               <PieChartIcon className="h-8 w-8 text-indigo-600" />
//             </div>

//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={statusBreakdown}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={70}
//                   outerRadius={110}
//                   paddingAngle={8}
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                   labelLine={false}
//                 >
//                   {statusBreakdown.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'rgba(30, 41, 59, 0.95)',
//                     border: 'none',
//                     borderRadius: '12px',
//                     color: 'white',
//                     padding: '12px'
//                   }} 
//                 />
//                 <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Makes - Bar Chart */}
//           <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20 dark:border-slate-700/50">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
//                 Most Listed Makes
//               </h2>
//               <BarChart3 className="h-8 w-8 text-blue-600" />
//             </div>

//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart data={topMakes} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//                 <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} stroke="#64748b" />
//                 <YAxis stroke="#64748b" />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'rgba(30, 41, 59, 0.95)',
//                     border: 'none',
//                     borderRadius: '12px',
//                     color: 'white'
//                   }} 
//                 />
//                 <Bar 
//                   dataKey="count" 
//                   fill="#8b5cf6" 
//                   radius={[12, 12, 0, 0]} 
//                   barSize={40}
//                 >
//                   {topMakes.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                   <LabelList dataKey="count" position="top" fill="#64748b" fontSize={14} />
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Upgrade Modal */}
//         <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
//       </div>
//     </div>
//   );
// };

// export default Overview;








/* eslint-disable no-unused-vars */
// pages/dashboard/Overview.jsx
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity, AlertTriangle, BadgeCheck, BarChart3, CalendarDays, Car, Check, Clock, Copy,
  ExternalLink, Eye, Gift, Globe, Heart, MapPin, MessageCircle, Package,
  PieChart as PieChartIcon, Share2, ShieldCheck, Star, Tag, TrendingUp, Video, Wallet,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { toast } from 'sonner';
import UpgradeModal from './UpgradeModal';

/* ───────────────────────── config ───────────────────────── */

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const API = import.meta.env.VITE_BACKEND_URL;

// Base URL of the public website (set VITE_SITE_URL in .env, e.g. https://e-cars.ng). Falls back to the current origin.
const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

// The public page of each role: SITE_URL / route / slug  -> change these to match your router
const PUBLIC_ROUTE_BY_ROLE = {
  dealer: 'dealerships',
  'carPart-seller': 'car-parts',
  serviceProvider: 'service-providers',
  'service-provider': 'service-providers',
};

const ROLE_LABELS = {
  dealer: 'Dealer',
  'carPart-seller': 'Car Parts Seller',
  serviceProvider: 'Service Provider',
  'service-provider': 'Service Provider',
  agent: 'Agent',
  admin: 'Admin',
  superadmin: 'Super Admin',
  user: 'Member',
};

const TONES = {
  indigo: { icon: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400', value: 'text-indigo-600 dark:text-indigo-400', bar: 'from-indigo-500 to-blue-500' },
  blue: { icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400', value: 'text-blue-600 dark:text-blue-400', bar: 'from-blue-500 to-cyan-500' },
  green: { icon: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400', value: 'text-green-600 dark:text-green-400', bar: 'from-green-500 to-emerald-500' },
  amber: { icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400', bar: 'from-amber-500 to-orange-500' },
  pink: { icon: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400', value: 'text-pink-600 dark:text-pink-400', bar: 'from-pink-500 to-rose-500' },
  violet: { icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400', value: 'text-violet-600 dark:text-violet-400', bar: 'from-violet-500 to-purple-500' },
  rose: { icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400', value: 'text-rose-600 dark:text-rose-400', bar: 'from-rose-500 to-red-500' },
  teal: { icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400', value: 'text-teal-600 dark:text-teal-400', bar: 'from-teal-500 to-emerald-500' },
};

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  sold: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
};

const tooltipStyle = {
  backgroundColor: 'rgba(30, 41, 59, 0.95)',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  padding: '10px 14px',
};

const PRICE_BUCKETS = [
  { name: '< ₦2M', max: 2e6 },
  { name: '₦2–5M', max: 5e6 },
  { name: '₦5–10M', max: 1e7 },
  { name: '₦10–20M', max: 2e7 },
  { name: '₦20M+', max: Infinity },
];

/* ───────────────────────── helpers ───────────────────────── */

const compactNaira = (n) =>
  `₦${new Intl.NumberFormat('en-NG', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n) || 0)}`;
const fullNaira = (n) => `₦${(Number(n) || 0).toLocaleString('en-NG')}`;

const fmtDate = (d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  d ? new Intl.DateTimeFormat('en-GB', opts).format(new Date(d)) : '—';

const timeAgo = (d) => {
  if (!d) return 'never';
  const secs = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const countBy = (items, keyFn) =>
  items.reduce((acc, item) => {
    const key = keyFn(item);
    if (key === undefined || key === null || key === '') return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const carTitle = (c) => [c.year, c.make, c.model].filter(Boolean).join(' ') || c.title || c.name || 'Untitled listing';

const getJson = async (path, signal) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    signal,
  });
  const json = await res.json();
  return json.status === 'success' ? json.data : null;
};

/* ───────────────────────── small UI pieces ───────────────────────── */

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-700/40 ${className}`} />
);

const Panel = ({ title, icon: Icon, className = '', children }) => (
  <section
    className={`rounded-3xl border border-white/30 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/70 ${className}`}
  >
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
      {Icon && (
        <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          <Icon className="h-5 w-5" />
        </span>
      )}
    </div>
    {children}
  </section>
);

const StatCard = ({ icon: Icon, label, value, hint, tone = 'indigo' }) => {
  const t = TONES[tone];
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700/50 dark:bg-slate-800/70">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className={`mt-2 truncate text-3xl font-extrabold ${t.value}`} title={String(value)}>
            {value}
          </p>
        </div>
        <span className={`rounded-2xl p-3 ${t.icon}`}>
          <Icon className="h-6 w-6" />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
};

const EmptyChart = ({ icon: Icon, text }) => (
  <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-slate-400">
    <Icon className="h-10 w-10 opacity-60" />
    <p className="max-w-xs text-sm">{text}</p>
  </div>
);

const Chip = ({ icon: Icon, children, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur ${className}`}>
    {Icon && <Icon className="h-3.5 w-3.5" />}
    {children}
  </span>
);

const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
    <span className="text-slate-500 dark:text-slate-400">{label}</span>
    <span className="text-right font-semibold text-slate-900 dark:text-white">{children}</span>
  </div>
);

/* ───────────────────────── public link card ───────────────────────── */

const PublicLinkCard = ({ url, base, route, slug }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts / older browsers
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy. Select the link and copy it manually.');
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-100 bg-white/80 p-5 shadow-xl backdrop-blur-xl dark:border-indigo-900/40 dark:bg-slate-800/70 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 p-3 text-white shadow-lg">
          <Globe className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your public website link</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share this link with customers. It opens your page on the website.
          </p>
        </div>
      </div>

      {url ? (
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div
            className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/60 px-4 py-3.5 font-mono text-sm dark:border-indigo-700 dark:bg-slate-900/50"
            title={url}
          >
            <span className="text-slate-500 dark:text-slate-400">
              {base}/{route}/
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{slug}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 lg:flex-none"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out my page: ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          Your public link isn't ready yet because your account has no slug.
        </p>
      )}
    </section>
  );
};

/* ───────────────────────── profile strength ───────────────────────── */

const ProfileStrength = ({ checks }) => {
  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const todo = checks.filter((c) => !c.done);

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="strengthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-200 dark:stroke-slate-700" />
            <circle
              cx="50" cy="50" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
              stroke="url(#strengthGrad)" strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-slate-900 dark:text-white">
            {pct}%
          </span>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{pct === 100 ? 'Your profile is complete' : 'Strengthen your profile'}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pct === 100 ? 'Nice work. Buyers trust complete profiles.' : `${todo.length} step${todo.length === 1 ? '' : 's'} left to finish.`}
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {[...todo, ...checks.filter((c) => c.done)].slice(0, 6).map((c) => (
          <li key={c.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                c.done ? 'bg-green-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {c.done && <Check className="h-3 w-3" />}
            </span>
            <span className={c.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}>{c.label}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

/* ───────────────────────── main ───────────────────────── */

const Overview = () => {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [myCars, setMyCars] = useState([]);
  const [myCarParts, setMyCarParts] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role;
  const isDealer = role === 'dealer';
  const isParts = role === 'carPart-seller';
  const isService = /service/i.test(role || '');
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const roleInfo = isDealer ? user?.dealerInfo : isParts ? user?.carPartSellerInfo : isService ? user?.serviceProviderInfo : null;

  useEffect(() => {
    if (!user?._id) return undefined;
    const controller = new AbortController();
    setLoading(true);

    Promise.allSettled([
      getJson('/cars/my', controller.signal),
      isParts ? getJson('/carparts/my', controller.signal) : null,
      isAdmin ? getJson('/admin/stats', controller.signal) : null,
    ])
      .then(([cars, parts, stats]) => {
        if (controller.signal.aborted) return;
        setMyCars(cars.value?.cars || []);
        setMyCarParts(parts.value?.parts || []);
        setPlatformStats(stats.value || null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [user?._id, role]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── numbers & chart data ── */
  const data = useMemo(() => {
    const priceOf = (c) => Number(c.price) || 0;
    const count = (s) => myCars.filter((c) => c.status === s).length;

    const total = myCars.length;
    const active = count('active');
    const pending = count('pending');
    const sold = count('sold');
    const totalValue = myCars.reduce((sum, c) => sum + priceOf(c), 0);
    const avgPrice = total ? Math.round(totalValue / total) : 0;

    const statusBreakdown = [
      { name: 'Active', value: active, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Sold', value: sold, color: '#ef4444' },
      { name: 'Other', value: Math.max(0, total - active - pending - sold), color: '#64748b' },
    ].filter((s) => s.value > 0);

    const topMakes = Object.entries(countBy(myCars, (c) => (c.make || '').trim() || 'Unknown'))
      .map(([name, value]) => ({ name, count: value }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Listings added in the last 6 months
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return { key: `${d.getFullYear()}-${d.getMonth()}`, name: d.toLocaleString('en-GB', { month: 'short' }), listings: 0 };
    });
    myCars.forEach((c) => {
      if (!c.createdAt) return;
      const d = new Date(c.createdAt);
      const m = monthly.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (m) m.listings += 1;
    });

    const priceBuckets = PRICE_BUCKETS.map((b, i) => ({
      name: b.name,
      count: myCars.filter((c) => {
        const p = priceOf(c);
        const min = i === 0 ? -Infinity : PRICE_BUCKETS[i - 1].max;
        return p >= min && p < b.max;
      }).length,
    }));

    const topViewed = myCars
      .filter((c) => Number(c.views) > 0)
      .sort((a, b) => Number(b.views) - Number(a.views))
      .slice(0, 5)
      .map((c) => ({ name: carTitle(c), views: Number(c.views) }));

    const byYear = Object.entries(countBy(myCars, (c) => c.year))
      .map(([name, value]) => ({ name, count: value }))
      .sort((a, b) => Number(a.name) - Number(b.name))
      .slice(-8);

    const recent = [...myCars]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    const partsValue = myCarParts.reduce((sum, p) => sum + priceOf(p), 0);

    return {
      total, active, pending, sold, totalValue, avgPrice, statusBreakdown, topMakes,
      monthly, priceBuckets, topViewed, byYear, recent, partsValue,
    };
  }, [myCars, myCarParts]);

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
        <Skeleton className="h-44" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  /* ── profile / account ── */
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const displayName = roleInfo?.businessName || fullName || 'Your account';
  const initials = ((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || 'U';
  const isVerified = !!roleInfo?.verified;
  const location = [user.lga || roleInfo?.lga, user.state || roleInfo?.state].filter(Boolean).join(', ');

  const publicRoute = PUBLIC_ROUTE_BY_ROLE[role] || 'profile';
  const publicUrl = user.slug ? `${SITE_URL}/${publicRoute}/${user.slug}` : '';

  const checks = [
    { label: 'Add a profile photo', done: !!user.avatar },
    { label: 'Verify your email address', done: !!user.emailVerified },
    { label: 'Add your phone number', done: !!user.phoneNumber },
    { label: 'Set your state and LGA', done: !!(user.state && user.lga) },
    ...(isDealer
      ? [
          { label: 'Add your business name and address', done: !!(roleInfo?.businessName && roleInfo?.businessAddress) },
          { label: 'Get your business verified', done: !!roleInfo?.verified },
          { label: 'Post your first car', done: data.total > 0 },
        ]
      : []),
    ...(isParts
      ? [
          { label: 'Get your shop verified', done: !!roleInfo?.verified },
          { label: 'Add your specialties', done: (roleInfo?.specialties?.length || 0) > 0 },
          { label: 'Upload shop photos', done: (roleInfo?.shopPhotos?.length || 0) > 0 },
        ]
      : []),
    ...(isService
      ? [
          { label: 'Get your workshop verified', done: !!roleInfo?.verified },
          { label: 'List the services you offer', done: (roleInfo?.servicesOffered?.length || 0) > 0 },
          { label: 'Upload workshop photos', done: (roleInfo?.workshopPhotos?.length || 0) > 0 },
        ]
      : []),
  ];

  const engagement = [
    { label: 'Profile views', value: Number(user.views) || 0, icon: Eye, bar: 'from-violet-500 to-indigo-500' },
    { label: 'Likes', value: user.likes?.length || 0, icon: Heart, bar: 'from-pink-500 to-rose-500' },
    { label: 'Shares', value: Number(user.shares) || 0, icon: Share2, bar: 'from-teal-500 to-emerald-500' },
  ];
  const engagementMax = Math.max(...engagement.map((e) => e.value), 1);

  const stock = Number(user.dealerInfo?.totalStock) || 0;
  const threshold = Number(user.dealerInfo?.lowStockThreshold) || 3;
  const stockState =
    stock === 0
      ? { label: 'Out of stock', cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', bar: 'from-red-500 to-rose-500' }
      : stock <= threshold
      ? { label: 'Low stock', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', bar: 'from-amber-500 to-orange-500' }
      : { label: 'Healthy', cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', bar: 'from-green-500 to-emerald-500' };
  const stockPct = Math.min(100, Math.round((stock / Math.max(threshold * 3, 1)) * 100));

  const hasActivity = data.monthly.some((m) => m.listings > 0);
  const hasPrices = data.priceBuckets.some((b) => b.count > 0);
  const optionalChart = data.topViewed.length ? 'views' : data.byYear.length > 1 ? 'year' : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ───── Hero ───── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 p-6 text-white shadow-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/30 sm:h-24 sm:w-24" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-extrabold ring-4 ring-white/30 sm:h-24 sm:w-24">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/80">Welcome back, {user.firstName || 'User'} 👋</p>
              <h1 className="mt-1 truncate text-2xl font-extrabold sm:text-4xl" title={displayName}>
                {displayName}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <Chip icon={ShieldCheck}>{ROLE_LABELS[role] || role}</Chip>
                {isVerified && (
                  <Chip icon={BadgeCheck} className="bg-green-400/30">
                    Verified
                  </Chip>
                )}
                <Chip>
                  <span className={`h-2 w-2 rounded-full ${user.isOnline ? 'animate-pulse bg-green-300' : 'bg-slate-300'}`} />
                  {user.isOnline ? 'Online' : `Seen ${timeAgo(user.lastSeen)}`}
                </Chip>
                {location && <Chip icon={MapPin}>{location}</Chip>}
                <Chip icon={CalendarDays}>Joined {fmtDate(user.createdAt, { month: 'short', year: 'numeric' })}</Chip>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Public link ───── */}
        <PublicLinkCard url={publicUrl} base={SITE_URL} route={publicRoute} slug={user.slug} />

        {/* ───── Platform stats (admins only) ───── */}
        {isAdmin && platformStats && (
          <Panel title="Platform overview" icon={Activity}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries({
                totalUsers: 'Users',
                totalDealers: 'Dealers',
                totalServiceProviders: 'Service providers',
                totalCarPartSellers: 'Parts sellers',
                totalCars: 'Cars',
                totalCarParts: 'Car parts',
              }).map(
                ([key, label]) =>
                  platformStats[key] !== undefined && (
                    <div key={key} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/40">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                        {Number(platformStats[key]).toLocaleString()}
                      </p>
                    </div>
                  )
              )}
            </div>
          </Panel>
        )}

        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <Skeleton className="h-80 lg:col-span-2" />
              <Skeleton className="h-80" />
            </div>
          </div>
        ) : (
          <>
            {/* ───── KPI cards ───── */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Car} label="Total listings" value={data.total} hint={`${data.active} active · ${data.pending} pending`} tone="indigo" />
              <StatCard icon={Wallet} label="Portfolio value" value={compactNaira(data.totalValue)} hint={fullNaira(data.totalValue)} tone="blue" />
              <StatCard icon={TrendingUp} label="Average price" value={compactNaira(data.avgPrice)} hint="Per listed car" tone="violet" />
              <StatCard
                icon={Tag}
                label="Cars sold"
                value={user.dealerInfo?.totalSoldCount ?? data.sold}
                hint={isDealer ? 'All-time sales' : 'Marked as sold'}
                tone="green"
              />
              <StatCard icon={Eye} label="Profile views" value={Number(user.views || 0).toLocaleString()} hint={`${user.likes?.length || 0} likes · ${user.shares || 0} shares`} tone="teal" />
              <StatCard
                icon={Star}
                label="Average rating"
                value={Number(user.averageRating || 0).toFixed(1)}
                hint={user.averageRating > 0 ? 'Based on customer reviews' : 'No reviews yet'}
                tone="amber"
              />
              <StatCard icon={Gift} label="Loyalty points" value={Number(user.loyaltyPoints || 0).toLocaleString()} hint="Earned on the platform" tone="rose" />
              <StatCard
                icon={Video}
                label="Video credits"
                value={user.videoCredits ?? 0}
                hint={`${user.totalVideoCreditsPurchased ?? 0} purchased in total`}
                tone="pink"
              />
              {isParts && (
                <>
                  <StatCard icon={Package} label="Car parts listed" value={myCarParts.length} hint="In your shop" tone="indigo" />
                  <StatCard icon={Wallet} label="Parts value" value={compactNaira(data.partsValue)} hint={fullNaira(data.partsValue)} tone="blue" />
                </>
              )}
            </div>

            {/* ───── Row A: activity + status ───── */}
            <div className="grid gap-8 lg:grid-cols-3">
              <Panel title="Listing activity (last 6 months)" icon={Activity} className="lg:col-span-2">
                {hasActivity ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.monthly} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis allowDecimals={false} stroke="#64748b" />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'New listings']} />
                        <Area type="monotone" dataKey="listings" stroke="#6366f1" strokeWidth={3} fill="url(#activityGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChart icon={Activity} text="Your listing activity will appear here once you post a car." />
                )}
              </Panel>

              <Panel title="Listing status" icon={PieChartIcon}>
                {data.statusBreakdown.length ? (
                  <>
                    <div className="relative h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={data.statusBreakdown} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={6} stroke="none">
                            {data.statusBreakdown.map((s) => (
                              <Cell key={s.name} fill={s.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{data.total}</span>
                        <span className="text-xs text-slate-500">listings</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {data.statusBreakdown.map((s) => (
                        <div key={s.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name}
                          <span className="ml-auto font-bold">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyChart icon={PieChartIcon} text="No listings yet." />
                )}
              </Panel>
            </div>

            {/* ───── Row B: makes + price ───── */}
            <div className="grid gap-8 lg:grid-cols-2">
              <Panel title="Most listed makes" icon={BarChart3}>
                {data.topMakes.length ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topMakes} margin={{ top: 20, right: 10, left: -16, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" angle={-35} textAnchor="end" height={60} interval={0} stroke="#64748b" />
                        <YAxis allowDecimals={false} stroke="#64748b" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                        <Bar dataKey="count" name="Listings" radius={[12, 12, 0, 0]} barSize={36}>
                          {data.topMakes.map((m, i) => (
                            <Cell key={m.name} fill={COLORS[i % COLORS.length]} />
                          ))}
                          <LabelList dataKey="count" position="top" fill="#64748b" fontSize={13} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChart icon={BarChart3} text="Your most listed makes will show up here." />
                )}
              </Panel>

              <Panel title="Price distribution" icon={Wallet}>
                {hasPrices ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.priceBuckets} margin={{ top: 20, right: 10, left: -16, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis allowDecimals={false} stroke="#64748b" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(236,72,153,0.08)' }} />
                        <Bar dataKey="count" name="Cars" radius={[12, 12, 0, 0]} barSize={44} fill="#ec4899">
                          <LabelList dataKey="count" position="top" fill="#64748b" fontSize={13} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChart icon={Wallet} text="See how your cars are spread across price ranges." />
                )}
              </Panel>
            </div>

            {/* ───── Row C: engagement + account + profile strength ───── */}
            <div className="grid gap-8 lg:grid-cols-3">
              <Panel title="Audience engagement" icon={Heart}>
                <div className="space-y-5">
                  {engagement.map((e) => (
                    <div key={e.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                          <e.icon className="h-4 w-4" />
                          {e.label}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{e.value.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${e.bar} transition-all duration-700`}
                          style={{ width: `${e.value ? Math.max(6, (e.value / engagementMax) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {engagement.every((e) => e.value === 0) && (
                  <p className="mt-6 rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                    No activity yet. Copy your public link above and share it to start getting views.
                  </p>
                )}
              </Panel>

              <Panel title="Account snapshot" icon={Clock}>
                {isDealer && (
                  <div className="mb-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Package className="h-4 w-4" /> Inventory
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${stockState.cls}`}>{stockState.label}</span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full rounded-full bg-gradient-to-r ${stockState.bar}`} style={{ width: `${stock ? Math.max(6, stockPct) : 0}%` }} />
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {stock <= threshold && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                      {stock} in stock · alert at {threshold} or fewer
                    </p>
                  </div>
                )}
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  <InfoRow label="Account ID">#{user.uniqueNumber || '—'}</InfoRow>
                  <InfoRow label="Email">
                    <span className={user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                      {user.emailVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </InfoRow>
                  <InfoRow label="Phone">{user.phoneNumber || '—'}</InfoRow>
                  <InfoRow label="Status">{user.isActive ? 'Active' : 'Inactive'}</InfoRow>
                  <InfoRow label="Member since">{fmtDate(user.createdAt)}</InfoRow>
                  <InfoRow label="Signed up via">{user.signedUpByAgent ? 'Agent' : 'Self'}</InfoRow>
                </div>
              </Panel>

              <Panel title="Profile strength" icon={BadgeCheck}>
                <ProfileStrength checks={checks} />
              </Panel>
            </div>

            {/* ───── Row D: recent listings (+ optional chart) ───── */}
            <div className="grid gap-8 lg:grid-cols-3">
              <Panel title="Recent listings" icon={Car} className={optionalChart ? 'lg:col-span-2' : 'lg:col-span-3'}>
                {data.recent.length ? (
                  <div className="-mx-2 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="text-xs uppercase tracking-wide text-slate-400">
                          <th className="px-2 pb-3 font-semibold">Car</th>
                          <th className="px-2 pb-3 font-semibold">Price</th>
                          <th className="px-2 pb-3 font-semibold">Status</th>
                          <th className="px-2 pb-3 text-right font-semibold">Listed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        {data.recent.map((c) => (
                          <tr key={c._id} className="text-slate-700 transition hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-900/30">
                            <td className="max-w-[220px] truncate px-2 py-3 font-semibold" title={carTitle(c)}>
                              {carTitle(c)}
                            </td>
                            <td className="px-2 py-3">{fullNaira(c.price)}</td>
                            <td className="px-2 py-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[c.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                {c.status || 'unknown'}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-right text-slate-500">{fmtDate(c.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyChart icon={Car} text="Cars you list will be shown here." />
                )}
              </Panel>

              {optionalChart === 'views' && (
                <Panel title="Most viewed cars" icon={Eye}>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topViewed} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={110} stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                        <Bar dataKey="views" name="Views" radius={[0, 10, 10, 0]} barSize={18}>
                          {data.topViewed.map((v, i) => (
                            <Cell key={v.name + i} fill={COLORS[i % COLORS.length]} />
                          ))}
                          <LabelList dataKey="views" position="right" fill="#64748b" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}

              {optionalChart === 'year' && (
                <Panel title="Cars by year" icon={CalendarDays}>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.byYear} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis allowDecimals={false} stroke="#64748b" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(20,184,166,0.08)' }} />
                        <Bar dataKey="count" name="Cars" fill="#14b8a6" radius={[10, 10, 0, 0]}>
                          <LabelList dataKey="count" position="top" fill="#64748b" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Panel>
              )}
            </div>
          </>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </div>
    </div>
  );
};

export default Overview;