// src/pages/InventoryDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Package } from 'lucide-react';
import StatsCards from '../../components/dealerInventory/StatsCards';
import { inventoryApi } from '../../lib/api';
import InventoryTable from '../../components/dealerInventory/InventoryTable';
import InventoryFilters from '../../components/dealerInventory/InventoryFilters';
import CarFormModal from '../../components/dealerInventory/CarFormModal';



const InventoryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [filters, setFilters] = useState({ search: '', status: '', make: '', sortBy: '-createdAt' });
  const [selected, setSelected] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await inventoryApi.stats();
      setStats(data);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadListings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await inventoryApi.list({ ...filters, page, limit: 12 });
      setListings(res.data);
      setPagination(res.pagination);
      setSelected([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { 
    loadStats(); 
  }, [loadStats]);

  useEffect(() => {
    const t = setTimeout(() => loadListings(1), 350); // debounce search typing
    return () => clearTimeout(t);
  }, [filters]);

  const refreshAll = () => { 
    loadStats(); 
    loadListings(pagination.page); 
  };

  const toggleSelect = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleSelectAll = () =>
    setSelected((s) => (s.length === listings.length ? [] : listings.map((l) => l._id)));

  const handleCreateOrUpdate = async (data) => {
    if (editingCar) {
      await inventoryApi.update(editingCar._id, data);
    } else {
      await inventoryApi.create(data);
    }
    setEditingCar(null);
    refreshAll();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this car from your inventory? This cannot be undone.')) return;
    await inventoryApi.remove(id);
    refreshAll();
  };

  const handleMarkSold = async (id) => {
    await inventoryApi.markSold(id);
    refreshAll();
  };

  const handleBulkSold = async () => {
    await inventoryApi.bulkStatus(selected, 'sold');
    refreshAll();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected listing(s)? This cannot be undone.`)) return;
    await inventoryApi.bulkDelete(selected);
    refreshAll();
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-20 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-7 w-7 text-primary-600" /> Stock Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage every vehicle in your lot, track stock levels and spot trends.</p>
        </div>
        <button
          onClick={() => { setEditingCar(null); setModalOpen(true); }}
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5" /> Add Car
        </button>
      </div>

      <div className="mb-6">
        <StatsCards stats={stats} loading={statsLoading} />
      </div>

      <div className="mb-4">
        <InventoryFilters
          filters={filters}
          onChange={setFilters}
          selectedCount={selected.length}
          onBulkSold={handleBulkSold}
          onBulkDelete={handleBulkDelete}
        />
      </div>

      <InventoryTable
        listings={listings}
        selected={selected}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={(car) => { setEditingCar(car); setModalOpen(true); }}
        onDelete={handleDelete}
        onMarkSold={handleMarkSold}
        loading={loading}
      />

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => loadListings(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                pagination.page === i + 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <CarFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCar(null); }}
        onSubmit={handleCreateOrUpdate}
        initial={editingCar}
      />
    </div>
  );
};

export default InventoryDashboard;