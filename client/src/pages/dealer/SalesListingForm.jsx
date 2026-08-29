import { useState } from 'react';

// Adjust to wherever you keep your API base URL + auth token
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Failed to upload ${file.name}`);
  return data.secure_url;
}

const initialState = {
  title: '', make: '', model: '', year: '', price: '', mileage: '',
  transmission: 'automatic', fuelType: 'petrol', bodyType: '', condition: 'nigerian used',
  color: '', state: '', lga: '', description: '',
  saleType: 'distress', originalPrice: '', saleReason: '', saleExpiresAt: '',
};

export default function SaleListingForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]); // [{ file, previewUrl }]
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImagesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    const withPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...withPreviews]);
    e.target.value = ''; // allow re-selecting the same file later
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.saleType === 'discount' && Number(form.originalPrice) <= Number(form.price)) {
      setError('Original price must be higher than the sale price for a discount listing.');
      return;
    }
    if (images.length === 0) {
      setError('Add at least one photo of the car.');
      return;
    }

    try {
      setUploadingImages(true);
      const imageUrls = await Promise.all(images.map((img) => uploadImageToCloudinary(img.file)));
      setUploadingImages(false);

      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/car-listings/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.mileage),
          originalPrice: form.saleType === 'discount' ? Number(form.originalPrice) : undefined,
          location: { state: form.state, lga: form.lga },
          images: imageUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setForm(initialState);
      setImages([]);
      onCreated?.(data.listing);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImages(false);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Post a sale listing</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the car's details and choose how you're selling it.</p>
      </div>

      {/* Sale type toggle */}
      <div className="flex gap-2">
        {['distress', 'discount'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((f) => ({ ...f, saleType: type }))}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition
              ${form.saleType === type
                ? type === 'distress'
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            {type} sale
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" value={form.title} onChange={update('title')} span2 />
        <Field label="Make" value={form.make} onChange={update('make')} />
        <Field label="Model" value={form.model} onChange={update('model')} />
        <Field label="Year" type="number" value={form.year} onChange={update('year')} />
        <Field label="Mileage (km)" type="number" value={form.mileage} onChange={update('mileage')} />
        <Field label="Color" value={form.color} onChange={update('color')} />
        <Field label="Body type" value={form.bodyType} onChange={update('bodyType')} />

        <Select label="Transmission" value={form.transmission} onChange={update('transmission')}
          options={['automatic', 'manual']} />
        <Select label="Fuel type" value={form.fuelType} onChange={update('fuelType')}
          options={['petrol', 'diesel', 'electric', 'hybrid']} />
        <Select label="Condition" value={form.condition} onChange={update('condition')}
          options={['brand new', 'foreign used', 'nigerian used']} />

        <Field label="State" value={form.state} onChange={update('state')} />
        <Field label="LGA" value={form.lga} onChange={update('lga')} />

        {form.saleType === 'discount' && (
          <Field label="Original price (₦)" type="number" value={form.originalPrice} onChange={update('originalPrice')} />
        )}
        <Field label={form.saleType === 'discount' ? 'Discounted price (₦)' : 'Asking price (₦)'}
          type="number" value={form.price} onChange={update('price')} />

        <Field label="Sale ends (optional)" type="date" value={form.saleExpiresAt} onChange={update('saleExpiresAt')} />

        <div className="col-span-2">
          <label className="text-sm font-medium text-slate-700">Photos</label>
          <div className="mt-1 grid grid-cols-4 sm:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={img.previewUrl} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 text-xs leading-5 opacity-0 group-hover:opacity-100 transition">
                  ×
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 cursor-pointer text-xs text-center px-1">
              + Add photo
              <input type="file" accept="image/*" multiple onChange={handleImagesSelected} className="hidden" />
            </label>
          </div>
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea rows={3} value={form.description} onChange={update('description')} required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium text-slate-700">
            {form.saleType === 'distress' ? 'Why the urgent sale?' : 'Note about the discount'}
          </label>
          <textarea rows={2} value={form.saleReason} onChange={update('saleReason')}
            placeholder={form.saleType === 'distress' ? 'e.g. Relocating abroad, need to sell this week' : 'e.g. End-of-year clearance'}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button type="submit" disabled={submitting || uploadingImages}
        className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
        {uploadingImages ? 'Uploading photos…' : submitting ? 'Posting…' : 'Post sale listing'}
      </button>
    </form>
  );
}

function Field({ label, span2, ...props }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input {...props} required
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select {...props}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize focus:border-slate-500 focus:outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}