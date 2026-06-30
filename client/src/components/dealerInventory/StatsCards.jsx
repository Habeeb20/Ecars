// // src/components/inventory/StatsCards.jsx
// import { Car, CheckCircle2, Clock, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

// const formatNaira = (n) => {
//   return new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     maximumFractionDigits: 0
//   }).format(n || 0);
// };

// const Card = ({ icon, label, value, sub, accent }) => (
//   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
//     <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${accent}`}>
//       {icon}
//     </div>
//     <div className="min-w-0">
//       <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
//       <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">{value}</p>
//       {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
//     </div>
//   </div>
// );

// const StatsCards = ({ stats, loading }) => {
//   if (loading || !stats) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {stats.lowStockAlert && (
//         <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl px-4 py-3 text-sm font-medium">
//           <AlertTriangle className="h-5 w-5 shrink-0" />
//           Low stock alert: you only have {stats.counts.active} active listing
//           {stats.counts.active === 1 ? '' : 's'} left
//           (threshold: {stats.lowStockThreshold}). Time to source more inventory.
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         <Card
//           icon={<Car className="h-6 w-6 text-primary-600" />}
//           label="Active Stock"
//           value={stats.counts.active}
//           accent="bg-primary-50 dark:bg-primary-900/40"
//         />
//         <Card
//           icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
//           label="Sold This Month"
//           value={stats.soldThisMonth}
//           sub={formatNaira(stats.revenueThisMonth)}
//           accent="bg-green-50 dark:bg-green-900/40"
//         />
//         <Card
//           icon={<Clock className="h-6 w-6 text-blue-600" />}
//           label="Pending Review"
//           value={stats.counts.pending}
//           accent="bg-blue-50 dark:bg-blue-900/40"
//         />
//         <Card
//           icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
//           label="Aging Stock (60+ days)"
//           value={stats.agingStockCount}
//           accent="bg-orange-50 dark:bg-orange-900/40"
//         />
//         <Card
//           icon={<Wallet className="h-6 w-6 text-purple-600" />}
//           label="Inventory Value"
//           value={formatNaira(stats.totalActiveValue)}
//           accent="bg-purple-50 dark:bg-purple-900/40"
//         />
//         <Card
//           icon={<TrendingUp className="h-6 w-6 text-pink-600" />}
//           label="Avg. Listing Price"
//           value={formatNaira(stats.avgListingPrice)}
//           accent="bg-pink-50 dark:bg-pink-900/40"
//         />
//       </div>
//     </div>
//   );
// };

// export default StatsCards;









// components/inventory/StatsCards.jsx
import { Car, CheckCircle2, Clock, Hourglass, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';

const formatNaira = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n || 0);

const CARDS = [
  {
    key: 'active',
    label: 'Active stock',
    icon: Car,
    badge: 'Live',
    iconBg:   'bg-green-50  dark:bg-green-900/30',
    iconColor:'text-green-700 dark:text-green-400',
    badgeBg:  'bg-green-50  dark:bg-green-900/30',
    badgeText:'text-green-700 dark:text-green-400',
    bar:      'bg-green-400',
    getValue: (s) => s.counts.active,
    getSub:   ()  => null,
  },
  {
    key: 'sold',
    label: 'Sold this month',
    icon: CheckCircle2,
    badge: 'This month',
    iconBg:   'bg-teal-50  dark:bg-teal-900/30',
    iconColor:'text-teal-700 dark:text-teal-400',
    badgeBg:  'bg-teal-50  dark:bg-teal-900/30',
    badgeText:'text-teal-700 dark:text-teal-400',
    bar:      'bg-teal-400',
    getValue: (s) => s.soldThisMonth,
    getSub:   (s) => formatNaira(s.revenueThisMonth) + ' revenue',
  },
  {
    key: 'pending',
    label: 'Pending review',
    icon: Clock,
    badge: 'Awaiting',
    iconBg:   'bg-blue-50  dark:bg-blue-900/30',
    iconColor:'text-blue-700 dark:text-blue-400',
    badgeBg:  'bg-blue-50  dark:bg-blue-900/30',
    badgeText:'text-blue-700 dark:text-blue-400',
    bar:      'bg-blue-400',
    getValue: (s) => s.counts.pending,
    getSub:   ()  => null,
  },
  {
    key: 'aging',
    label: 'Aging stock',
    icon: Hourglass,
    badge: '60+ days',
    iconBg:   'bg-amber-50  dark:bg-amber-900/30',
    iconColor:'text-amber-700 dark:text-amber-400',
    badgeBg:  'bg-amber-50  dark:bg-amber-900/30',
    badgeText:'text-amber-700 dark:text-amber-400',
    bar:      'bg-amber-400',
    getValue: (s) => s.agingStockCount,
    getSub:   (s) => s.agingStockCount > 0 ? 'Needs attention' : 'All good',
  },
  {
    key: 'value',
    label: 'Inventory value',
    icon: Wallet,
    badge: null,
    iconBg:   'bg-violet-50  dark:bg-violet-900/30',
    iconColor:'text-violet-700 dark:text-violet-400',
    badgeBg:  null,
    badgeText:null,
    bar:      'bg-violet-400',
    getValue: (s) => formatNaira(s.totalActiveValue),
    getSub:   ()  => 'Active listings only',
    smallValue: true,
  },
  {
    key: 'avg',
    label: 'Avg. listing price',
    icon: TrendingUp,
    badge: null,
    iconBg:   'bg-pink-50  dark:bg-pink-900/30',
    iconColor:'text-pink-700 dark:text-pink-400',
    badgeBg:  null,
    badgeText:null,
    bar:      'bg-pink-400',
    getValue: (s) => formatNaira(s.avgListingPrice),
    getSub:   ()  => 'Across active stock',
    smallValue: true,
  },
];

const Card = ({ config, stats }) => {
  const Icon = config.icon;
  const value = config.getValue(stats);
  const sub = config.getSub?.(stats);

  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        {config.badge && (
          <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${config.badgeBg} ${config.badgeText}`}>
            {config.badge}
          </span>
        )}
      </div>

      {/* Label + value */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{config.label}</p>
        <p className={`font-semibold text-gray-900 dark:text-white leading-tight tracking-tight ${config.smallValue ? 'text-lg' : 'text-2xl'}`}>
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${config.bar}`} />
    </div>
  );
};

const StatsCards = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[108px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Low stock alert */}
      {stats.lowStockAlert && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <span className="font-semibold">Low stock alert</span> — only{' '}
            <span className="font-semibold">{stats.counts.active} active listing{stats.counts.active === 1 ? '' : 's'}</span>{' '}
            remaining (threshold: {stats.lowStockThreshold}). Time to source more inventory.
          </p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {CARDS.map((config) => (
          <Card key={config.key} config={config} stats={stats} />
        ))}
      </div>

    </div>
  );
};

export default StatsCards;