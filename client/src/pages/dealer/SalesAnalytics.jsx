// pages/SalesAnalyticsDashboard.jsx
import { useState } from 'react';
import { Plus, BarChart2, Users } from 'lucide-react';
import OverviewCards from '../../components/dealerInventory/OverviewCard';
import MonthlyChart from '../../components/dealerInventory/MonthlyChart';
import { TopCarsPanel, PaymentMethodsPanel } from '../../components/dealerInventory/TopCarsAndPayment';
import RecentSales from '../../components/dealerInventory/RecentSales';
import RecordSaleModal from '../../components/dealerInventory/RecordSalesModal';
import CustomersPage from '../../components/dealerInventory/CustomerPage';
import { useSalesOverview } from '../../components/dealerInventory/UseSalesAnalytics';


const TABS = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'customers', label: 'Customers',  icon: Users },
];

export default function SalesAnalyticsDashboard({ activeListings = [] }) {
  const [tab, setTab]               = useState('analytics');
  const [showModal, setShowModal]   = useState(false);
  const { data, loading, error }    = useSalesOverview();

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Sales & analytics</h1>
          <p className="text-xs text-gray-400 mt-0.5">Track revenue, inventory performance, and customer records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition shadow-sm hover:shadow-md shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          Record sale
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 pb-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === id
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Analytics tab ── */}
      {tab === 'analytics' && (
        <div className="space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <OverviewCards data={data} loading={loading} />

          <MonthlyChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopCarsPanel />
            <PaymentMethodsPanel />
          </div>

          <RecentSales />
        </div>
      )}

      {/* ── Customers tab ── */}
      {tab === 'customers' && <CustomersPage />}

      {/* Record sale modal */}
      {showModal && (
        <RecordSaleModal
          listings={activeListings}
          onClose={() => setShowModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}