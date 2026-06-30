// components/analytics/OverviewCards.jsx
import { TrendingUp, TrendingDown, Car, DollarSign, BarChart2, Package } from 'lucide-react';
import { formatShortNaira } from './Format';

const Skeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    ))}
  </div>
);

const Card = ({ label, value, sub, icon: Icon, iconBg, iconColor, bar, trend, trendLabel }) => (
  <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {trend != null && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${Number(trend) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {Number(trend) >= 0
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
        {value}
      </p>
      {(sub || trendLabel) && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub || trendLabel}</p>
      )}
    </div>
    <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${bar}`} />
  </div>
);

export default function OverviewCards({ data, loading }) {
  if (loading || !data) return <Skeleton />;

  const { thisMonth, allTime, inventory } = data;

  const cards = [
    {
      label: 'Revenue this month',
      value: formatShortNaira(thisMonth.revenue),
      sub: `All-time: ${formatShortNaira(allTime.revenue)}`,
      icon: DollarSign,
      iconBg: 'bg-teal-50 dark:bg-teal-900/30',
      iconColor: 'text-teal-700 dark:text-teal-400',
      bar: 'bg-teal-400',
      trend: thisMonth.revenueGrowth,
      trendLabel: 'vs last month',
    },
    {
      label: 'Cars sold this month',
      value: thisMonth.count,
      sub: `${allTime.count} total sold`,
      icon: Car,
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-700 dark:text-blue-400',
      bar: 'bg-blue-400',
      trend: thisMonth.countGrowth,
    },
    {
      label: 'Active inventory',
      value: inventory.active,
      sub: `${inventory.aging} aging · ${inventory.pending} pending`,
      icon: Package,
      iconBg: 'bg-violet-50 dark:bg-violet-900/30',
      iconColor: 'text-violet-700 dark:text-violet-400',
      bar: 'bg-violet-400',
    },
    {
      label: 'Inventory value',
      value: formatShortNaira(inventory.value),
      sub: `Avg ${formatShortNaira(inventory.avgPrice)} / car`,
      icon: BarChart2,
      iconBg: 'bg-pink-50 dark:bg-pink-900/30',
      iconColor: 'text-pink-700 dark:text-pink-400',
      bar: 'bg-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => <Card key={c.label} {...c} />)}
    </div>
  );
}