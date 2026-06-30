// components/analytics/RecentSales.jsx

import { useRecentSales } from './UseSalesAnalytics';
import { formatShortNaira, formatRelative, PAYMENT_LABELS, PAYMENT_STATUS_COLORS } from './Format';

import { Car } from 'lucide-react';

const StatusBadge = ({ status }) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${PAYMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
    {status === 'part_payment' ? 'Part paid' : status}
  </span>
);

export default function RecentSales() {
  const { data, loading } = useRecentSales();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Recent sales</h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest 8 transactions</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-50 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No sales recorded yet</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-50 dark:border-gray-700">
                  <th className="text-left pb-2 font-medium">Car</th>
                  <th className="text-left pb-2 font-medium">Customer</th>
                  <th className="text-left pb-2 font-medium">Amount</th>
                  <th className="text-left pb-2 font-medium">Method</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-xs line-clamp-1">
                        {s.carSnapshot?.year} {s.carSnapshot?.make} {s.carSnapshot?.model}
                      </p>
                      <p className="text-[10px] text-gray-400">{s.carSnapshot?.stockNumber}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs text-gray-700 dark:text-gray-300">{s.customerInfo?.name || '—'}</p>
                      <p className="text-[10px] text-gray-400">{s.customerInfo?.phone}</p>
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {formatShortNaira(s.salePrice)}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">
                      {PAYMENT_LABELS[s.paymentMethod] || s.paymentMethod}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={s.paymentStatus} />
                    </td>
                    <td className="py-3 text-xs text-gray-400 whitespace-nowrap">
                      {formatRelative(s.saleDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {data.map((s) => (
              <div key={s._id} className="flex items-start justify-between bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                    {s.carSnapshot?.year} {s.carSnapshot?.make} {s.carSnapshot?.model}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {s.customerInfo?.name || 'Walk-in'} · {PAYMENT_LABELS[s.paymentMethod]}
                  </p>
                  <p className="text-[10px] text-gray-400">{formatRelative(s.saleDate)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    {formatShortNaira(s.salePrice)}
                  </span>
                  <StatusBadge status={s.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}