// src/components/inventory/InventoryFilters.jsx
import { Search, SlidersHorizontal, CheckCircle2, Trash2 } from 'lucide-react';

const InventoryFilters = ({ filters, onChange, selectedCount, onBulkSold, onBulkDelete }) => {
  const set = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by title, make, stock number, VIN..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
          <option value="draft">Draft</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => set('sortBy', e.target.value)}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-price">Price: High to Low</option>
          <option value="price">Price: Low to High</option>
          <option value="-views">Most Viewed</option>
        </select>

        <button className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
          <SlidersHorizontal className="h-4 w-4" /> More
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/30 rounded-xl px-4 py-2.5">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selectedCount} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkSold}
              className="flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-black/20"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark sold
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 px-3 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-black/20"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;