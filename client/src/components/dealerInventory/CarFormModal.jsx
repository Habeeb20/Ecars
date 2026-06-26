// src/components/inventory/CarFormModal.jsx
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

const emptyForm = {
  title: '',
  price: undefined,
  make: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: undefined,
  transmission: 'automatic',
  fuelType: 'petrol',
  bodyType: '',
  condition: 'nigerianUsed',
  color: '',
  vin: '',
  description: '',
  images: [],
  features: [],
  phoneNumber: '',
  warehouseLocation: '',
  location: { state: '', lga: '' },
};

const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none";
const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

const CarFormModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [imageUrls, setImageUrls] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setImageUrls((initial.images || []).join('\n'));
    } else {
      setForm(emptyForm);
      setImageUrls('');
    }
  }, [initial, open]);

  if (!open) return null;

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const updateLocation = (key, value) => {
    setForm((f) => ({
      ...f,
      location: {
        ...(f.location || { state: '', lga: '' }),
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const images = imageUrls.split('\n').map((s) => s.trim()).filter(Boolean);
    
    if (!images.length) {
      return setError('Add at least one image URL (e.g. from Cloudinary).');
    }

    setSubmitting(true);
    
    try {
      await onSubmit({ ...form, images });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
            {initial ? 'Edit Car' : 'Add Car to Inventory'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className={labelCls}>Listing Title</label>
            <input
              className={inputCls}
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="2019 Toyota Camry XLE"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Make</label>
              <input
                className={inputCls}
                required
                value={form.make}
                onChange={(e) => update('make', e.target.value)}
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className={labelCls}>Model</label>
              <input
                className={inputCls}
                required
                value={form.model}
                onChange={(e) => update('model', e.target.value)}
                placeholder="Camry"
              />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input
                type="number"
                className={inputCls}
                required
                value={form.year}
                onChange={(e) => update('year', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (₦)</label>
              <input
                type="number"
                className={inputCls}
                required
                value={form.price ?? ''}
                onChange={(e) => update('price', Number(e.target.value))}
                placeholder="15000000"
              />
            </div>
            <div>
              <label className={labelCls}>Mileage (km)</label>
              <input
                type="number"
                className={inputCls}
                required
                value={form.mileage ?? ''}
                onChange={(e) => update('mileage', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Transmission</label>
              <select
                className={inputCls}
                value={form.transmission}
                onChange={(e) => update('transmission', e.target.value)}
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Fuel Type</label>
              <select
                className={inputCls}
                value={form.fuelType}
                onChange={(e) => update('fuelType', e.target.value)}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Condition</label>
              <select
                className={inputCls}
                value={form.condition}
                onChange={(e) => update('condition', e.target.value)}
              >
                <option value="brandNew">Brand New</option>
                <option value="foreignUsed">Foreign Used</option>
                <option value="nigerianUsed">Nigerian Used</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input
                className={inputCls}
                required
                value={form.color}
                onChange={(e) => update('color', e.target.value)}
                placeholder="Black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Body Type</label>
              <input
                className={inputCls}
                required
                value={form.bodyType}
                onChange={(e) => update('bodyType', e.target.value)}
                placeholder="Sedan, SUV, Truck..."
              />
            </div>
            <div>
              <label className={labelCls}>VIN (optional)</label>
              <input
                className={inputCls}
                value={form.vin || ''}
                onChange={(e) => update('vin', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>State</label>
              <input
                className={inputCls}
                required
                value={form.location?.state || ''}
                onChange={(e) => updateLocation('state', e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>LGA</label>
              <input
                className={inputCls}
                required
                value={form.location?.lga || ''}
                onChange={(e) => updateLocation('lga', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Warehouse / Lot Location (optional)</label>
            <input
              className={inputCls}
              value={form.warehouseLocation || ''}
              onChange={(e) => update('warehouseLocation', e.target.value)}
              placeholder="Lot A - Bay 3"
            />
          </div>

          <div>
            <label className={labelCls}>Description (min. 50 characters)</label>
            <textarea
              className={inputCls}
              rows={4}
              required
              minLength={50}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe the vehicle's condition, history and standout features..."
            />
          </div>

          <div>
            <label className={labelCls}>Features (comma separated)</label>
            <input
              className={inputCls}
              value={(form.features || []).join(', ')}
              onChange={(e) =>
                update('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
              }
              placeholder="AC, Leather seats, Reverse camera"
            />
          </div>

          <div>
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5">
                <Upload className="h-4 w-4" /> Image URLs (one per line, from Cloudinary)
              </span>
            </label>
            <textarea
              className={inputCls}
              rows={3}
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="https://res.cloudinary.com/.../car1.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-gray-900 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? 'Save Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormModal;