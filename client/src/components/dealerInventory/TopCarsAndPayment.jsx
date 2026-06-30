// components/analytics/TopCarsAndPayments.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTopCars, usePaymentMethods } from './UseSalesAnalytics';
import { formatNaira, formatShortNaira, PAYMENT_LABELS } from './Format';


const COLORS = ['#14b8a6', '#818cf8', '#f472b6', '#fb923c', '#34d399', '#60a5fa'];

export function TopCarsPanel() {
  const { data, loading } = useTopCars();

  const max = data[0]?.revenue || 1;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Top makes by revenue</h3>
        <p className="text-xs text-gray-400 mt-0.5">Best performing car brands</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No sales data yet</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={item.make}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.make}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{item.count} sold</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {formatShortNaira(item.revenue)}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.revenue / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PaymentMethodsPanel() {
  const { data, loading } = usePaymentMethods();
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Payment methods</h3>
        <p className="text-xs text-gray-400 mt-0.5">How customers pay</p>
      </div>

      {loading ? (
        <div className="h-40 rounded-xl bg-gray-50 dark:bg-gray-700 animate-pulse" />
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No data yet</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={data} dataKey="count" cx="50%" cy="50%" innerRadius={32} outerRadius={52} paddingAngle={3}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={(v, n, p) => [`${v} sales`, PAYMENT_LABELS[p.payload.method] || p.payload.method]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '0.5px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2 flex-1 w-full">
            {data.map((d, i) => (
              <div key={d.method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-300">{PAYMENT_LABELS[d.method] || d.method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{Math.round((d.count / total) * 100)}%</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}