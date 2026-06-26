// src/components/inventory/InventoryTable.jsx
import { useState } from 'react';
import { MoreVertical, Eye, Pencil, Trash2, CheckCircle2, Tag } from 'lucide-react';

const statusStyles = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  sold: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  reserved: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const formatNaira = (n) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(n || 0);
};

const RowMenu = ({ car, onEdit, onDelete, onMarkSold }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Row actions"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>
      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 z-10 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 text-sm"
        >
          <a
            href={`/cars/${car._id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Eye className="h-4 w-4" /> View listing
          </a>
          <button
            onClick={() => { onEdit(car); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          {car.status !== 'sold' && (
            <button
              onClick={() => { onMarkSold(car._id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark as sold
            </button>
          )}
          <button
            onClick={() => { onDelete(car._id); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

const InventoryTable = ({
  listings,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onMarkSold,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <Tag className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="font-semibold text-gray-900 dark:text-white">No cars match these filters</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or add a new car to get started.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="py-3 pl-4 w-10">
                <input
                  type="checkbox"
                  checked={listings.length > 0 && selected.length === listings.length}
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="py-3 px-3">Vehicle</th>
              <th className="py-3 px-3">Stock #</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Days in Stock</th>
              <th className="py-3 px-3">Views</th>
              <th className="py-3 px-3 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((car) => (
              <tr key={car._id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/60 dark:hover:bg-gray-700/30">
                <td className="py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(car._id)}
                    onChange={() => onToggleSelect(car._id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <img src={car.images?.[0]} alt={car.title} className="h-12 w-16 rounded-lg object-cover bg-gray-100" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-[220px]">{car.title}</p>
                      <p className="text-xs text-gray-400">{car.year} · {car.mileage?.toLocaleString()} km</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{car.stockNumber}</td>
                <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">{formatNaira(car.price)}</td>
                <td className="py-3 px-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[car.status]}`}>
                    {car.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{car.ageInDays ?? 0}d</td>
                <td className="py-3 px-3 text-gray-500 dark:text-gray-400">{car.views ?? 0}</td>
                <td className="py-3 px-3 text-right pr-4">
                  <RowMenu car={car} onEdit={onEdit} onDelete={onDelete} onMarkSold={onMarkSold} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {listings.map((car) => (
          <div key={car._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 flex gap-3">
            <input
              type="checkbox"
              checked={selected.includes(car._id)}
              onChange={() => onToggleSelect(car._id)}
              className="mt-1 rounded border-gray-300"
            />
            <img src={car.images?.[0]} alt={car.title} className="h-16 w-20 rounded-lg object-cover bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{car.title}</p>
                <RowMenu car={car} onEdit={onEdit} onDelete={onDelete} onMarkSold={onMarkSold} />
              </div>
              <p className="text-xs text-gray-400">{car.year} · {car.stockNumber}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{formatNaira(car.price)}</p>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusStyles[car.status]}`}>
                  {car.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InventoryTable;