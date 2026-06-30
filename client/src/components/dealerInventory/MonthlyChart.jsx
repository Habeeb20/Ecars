// components/analytics/MonthlyChart.jsx
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useMonthlyBreakdown } from './UseSalesAnalytics';
import { formatShortNaira } from './Format';


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.dataKey === 'count' ? p.value : formatShortNaira(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear]   = useState(currentYear);
  const { data, loading } = useMonthlyBreakdown(year);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Monthly revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">Revenue and units sold per month</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
        >
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-56 rounded-xl bg-gray-50 dark:bg-gray-700/50 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="revenue"
              tickFormatter={formatShortNaira}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false} tickLine={false} width={48}
            />
            <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar yAxisId="revenue" dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="count"   dataKey="count"   name="Units"   fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}