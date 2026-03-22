// src/components/PostDealForm.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, Upload, X, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'essential';

const PostDealForm = ({ dealToEdit = null, onClose }) => {
  const isEditMode = !!dealToEdit;

  const [formData, setFormData] = useState({
    title: dealToEdit?.title || '',
    originalPrice: dealToEdit?.originalPrice || '',
    discountPercentage: dealToEdit?.discountPercentage || 0,
    discountedPrice: dealToEdit?.discountedPrice || '',
    make: dealToEdit?.make || '',
    model: dealToEdit?.model || '',
    year: dealToEdit?.year || '',
    mileage: dealToEdit?.mileage || '',
    transmission: dealToEdit?.transmission || 'automatic',
    fuelType: dealToEdit?.fuelType || 'petrol',
    bodyType: dealToEdit?.bodyType || 'sedan',
    condition: dealToEdit?.condition || 'brand new',
    color: dealToEdit?.color || '',
    description: dealToEdit?.description || '',
    state: dealToEdit?.location?.state || '',
    lga: dealToEdit?.location?.lga || '',
    features: dealToEdit?.features?.join(', ') || '',
  });

  const [images, setImages] = useState([]);              // preview URLs
  const [cloudinaryUrls, setCloudinaryUrls] = useState(dealToEdit?.images || []); // existing + new URLs
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [myDeals, setMyDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);

  // Auto-calculate discounted price
  useEffect(() => {
    const original = Number(formData.originalPrice);
    const percent = Number(formData.discountPercentage);

    if (!isNaN(original) && !isNaN(percent) && percent >= 0 && percent <= 100) {
      const discount = (original * percent) / 100;
      setFormData(prev => ({
        ...prev,
        discountedPrice: Math.round(original - discount),
      }));
    } else {
      setFormData(prev => ({ ...prev, discountedPrice: '' }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  // Load user's existing deals
  useEffect(() => {
    const fetchMyDeals = async () => {
      setLoadingDeals(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.status === true) {
          setMyDeals(data.data.deals || []);
        }
      } catch (err) {
        toast.error('Failed to load your deals');
      } finally {
        setLoadingDeals(false);
      }
    };

    fetchMyDeals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setUploading(true);

    const newPreviews = [];
    const newUrls = [];

    for (const file of files) {
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push(previewUrl);

      try {
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form });
        const data = await res.json();

        if (data.secure_url) {
          newUrls.push(data.secure_url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (err) {
        toast.error(`Upload failed for ${file.name}`);
      }
    }

    setImages(prev => [...prev, ...newPreviews]);
    setCloudinaryUrls(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setCloudinaryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cloudinaryUrls.length < 6) {
      toast.error("Please upload at least 6 images");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        images: cloudinaryUrls,
        location: { state: formData.state, lga: formData.lga },
      };

      const token = localStorage.getItem('token');
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${import.meta.env.VITE_BACKEND_URL}/deals/${dealToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/deals`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === true) {
        toast.success(isEditMode ? "Deal updated successfully!" : "Deal posted successfully!");
        // Reset form or close modal
        if (onClose) onClose();
      } else {
        toast.error(data.message || "Failed to save deal");
      }
    } catch (err) {
      toast.error("Network error");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals/${dealId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === true) {
        toast.success("Deal deleted successfully");
        setMyDeals(prev => prev.filter(d => d._id !== dealId));
      } else {
        toast.error(data.message || "Failed to delete deal");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">
        {isEditMode ? 'Edit Deal' : 'Post a New Deal'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Prices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="title" placeholder="Deal Title" value={formData.title} onChange={handleInputChange} required className="input col-span-3" />
          <input type="number" name="originalPrice" placeholder="Original Price (₦)" value={formData.originalPrice} onChange={handleInputChange} required className="input" />
          <input type="number" name="discountPercentage" placeholder="Discount %" value={formData.discountPercentage} onChange={handleInputChange} required min="0" max="100" className="input" />
          <div className="input bg-green-50 dark:bg-green-950 cursor-not-allowed">
            Discounted: ₦{formData.discountedPrice ? formData.discountedPrice.toLocaleString() : '—'}
          </div>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input name="make" placeholder="Make" value={formData.make} onChange={handleInputChange} required className="input" />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} required className="input" />
          <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required className="input" />
          <input type="number" name="mileage" placeholder="Mileage (km)" value={formData.mileage} onChange={handleInputChange} required className="input" />
          <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="input">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
          <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="input">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select name="bodyType" value={formData.bodyType} onChange={handleInputChange} className="input">
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
            <option value="bikes">Bikes</option>
          </select>
          <select name="condition" value={formData.condition} onChange={handleInputChange} className="input">
            <option value="brand new">Brand New</option>
            <option value="foreign used">Foreign Used</option>
            <option value="nigerian used">Nigerian Used</option>
          </select>
          <input name="color" placeholder="Color" value={formData.color} onChange={handleInputChange} required className="input" />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required className="input" />
          <input name="lga" placeholder="LGA" value={formData.lga} onChange={handleInputChange} required className="input" />
        </div>

        {/* Description & Features */}
        <textarea name="description" placeholder="Full description..." value={formData.description} onChange={handleInputChange} required rows={5} className="input" />
        <input name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleInputChange} className="input" />

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Upload className="h-5 w-5" /> Upload images (min 6)
          </label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={uploading} className="file-input" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
            {images.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt="preview" className="w-full h-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {images.length < 6 && <p className="text-red-600 text-sm mt-2">Minimum 6 images required ({images.length}/6)</p>}
        </div>

        <button
          type="submit"
          disabled={submitting || uploading || images.length < 6}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting || uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditMode ? 'Update Deal' : 'Post Deal')}
        </button>
      </form>

      {/* My Deals List */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span>My Posted Deals</span>
          <button
            onClick={() => {
              // Reset form for new deal
              setFormData({ ...initialFormData });
              setImages([]);
              setCloudinaryUrls([]);
            }}
            className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" /> New Deal
          </button>
        </h3>

        {loadingDeals ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        ) : myDeals.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">You haven't posted any deals yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDeals.map((deal) => (
              <div key={deal._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="h-40 bg-slate-100 dark:bg-slate-700 relative">
                  {deal.images?.[0] && (
                    <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-1 line-clamp-2">{deal.title}</h4>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-xl font-bold text-emerald-600">₦{deal.discountedPrice.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">₦{deal.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-red-600">-{deal.discountPercentage}%</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {deal.make} {deal.model} • {deal.year}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Load deal into form for editing
                        setFormData({
                          title: deal.title,
                          originalPrice: deal.originalPrice,
                          discountPercentage: deal.discountPercentage,
                          discountedPrice: deal.discountedPrice,
                          make: deal.make,
                          model: deal.model,
                          year: deal.year,
                          mileage: deal.mileage,
                          transmission: deal.transmission,
                          fuelType: deal.fuelType,
                          bodyType: deal.bodyType,
                          condition: deal.condition,
                          color: deal.color,
                          description: deal.description,
                          state: deal.location?.state || '',
                          lga: deal.location?.lga || '',
                          features: deal.features?.join(', ') || '',
                        });
                        setImages(deal.images || []);
                        setCloudinaryUrls(deal.images || []);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(deal._id)}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDealForm;