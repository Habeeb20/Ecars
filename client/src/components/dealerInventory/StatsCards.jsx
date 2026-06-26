// src/components/inventory/StatsCards.jsx
import { Car, CheckCircle2, Clock, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

const formatNaira = (n) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(n || 0);
};

const Card = ({ icon, label, value, sub, accent }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StatsCards = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stats.lowStockAlert && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-xl px-4 py-3 text-sm font-medium">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Low stock alert: you only have {stats.counts.active} active listing
          {stats.counts.active === 1 ? '' : 's'} left
          (threshold: {stats.lowStockThreshold}). Time to source more inventory.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card
          icon={<Car className="h-6 w-6 text-primary-600" />}
          label="Active Stock"
          value={stats.counts.active}
          accent="bg-primary-50 dark:bg-primary-900/40"
        />
        <Card
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
          label="Sold This Month"
          value={stats.soldThisMonth}
          sub={formatNaira(stats.revenueThisMonth)}
          accent="bg-green-50 dark:bg-green-900/40"
        />
        <Card
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          label="Pending Review"
          value={stats.counts.pending}
          accent="bg-blue-50 dark:bg-blue-900/40"
        />
        <Card
          icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
          label="Aging Stock (60+ days)"
          value={stats.agingStockCount}
          accent="bg-orange-50 dark:bg-orange-900/40"
        />
        <Card
          icon={<Wallet className="h-6 w-6 text-purple-600" />}
          label="Inventory Value"
          value={formatNaira(stats.totalActiveValue)}
          accent="bg-purple-50 dark:bg-purple-900/40"
        />
        <Card
          icon={<TrendingUp className="h-6 w-6 text-pink-600" />}
          label="Avg. Listing Price"
          value={formatNaira(stats.avgListingPrice)}
          accent="bg-pink-50 dark:bg-pink-900/40"
        />
      </div>
    </div>
  );
};

export default StatsCards;