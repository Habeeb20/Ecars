/* eslint-disable no-unused-vars */
// src/pages/user/ListCar.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Car, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';

const ListCar = () => {
  const [form, setForm] = useState({
    title: '',
    price: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    transmission: 'automatic',
    fuelType: 'petrol',
    bodyType: 'sedan',
    condition: 'nigerian used',
    color: '',
    description: '',
    images: [],
    location: { state: '', lga: '' },
    features: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') {
        console.log(data.data.user)
        setUser(data.data.user);
        if (!data.data.user.emailVerified) {
          setShowVerifyModal(true);
        }
      }
    };
    fetchUser();
  }, []);

  const uploadToCloudinary = async (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 20) {
      toast.error('Maximum 20 images allowed');
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setForm({ ...form, images: [...form.images, ...urls] });
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.emailVerified) return toast.error('Verify your email first');

    if (form.images.length < 4) {
      return toast.error('Upload at least 4 clear photos');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Car listed successfully!');
        setForm({
          title: '', price: '', make: '', model: '', year: '', mileage: '',
          transmission: 'automatic', fuelType: 'petrol', bodyType: 'sedan',
          condition: 'nigerian used', color: '', description: '', images: [],
          location: { state: '', lga: '' }, features: [],
        });
      } else {
        toast.error(data.message || 'Failed to list car');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 class="text-3xl font-bold text-center mb-8 text-indigo-600">List Your Car</h1>

          {showVerifyModal && (
            <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <AlertCircle class="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 class="text-2xl font-bold text-center">Verify Your Email</h2>
                <p class="text-center text-gray-600 mt-3">
                  You must verify your email before listing a car.
                </p>
                <button
                  onClick={async () => {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/send-verification-email`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    const data = await res.json();
                    toast[data.status === 'success' ? 'success' : 'error'](data.message);
                  }}
                  class="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Send Verification Email
                </button>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  class="w-full mt-3 text-gray-500"
                >
                  I'll do it later
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Images */}
            <div>
              <label class="block text-sm font-medium mb-3">Car Photos (min 4, max 20)</label>
              <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={uploadToCloudinary}
                  disabled={uploading}
                  class="hidden"
                  id="car-images"
                />
                <label
                  htmlFor="car-images"
                  class="cursor-pointer inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  {uploading ? 'Uploading...' : 'Choose Images'}
                </label>
              </div>
              <div class="grid grid-cols-4 gap-3 mt-4">
                {form.images.map((url, i) => (
                  <div key={i} class="relative group">
                    <img src={url} alt="" class="h-32 w-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                      class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Fields */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Title (e.g. Clean 2018 Camry)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required class="input" />
              <input type="number" placeholder="Price (₦)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required class="input" />
              <input placeholder="Make (e.g. Toyota)" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required class="input" />
              <input placeholder="Model (e.g. Camry)" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required class="input" />
              <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required class="input" />
              <input type="number" placeholder="Mileage (km)" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} required class="input" />
            </div>

            {/* Selects */}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} class="input">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
              <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} class="input">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
              <select value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })} class="input">
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="truck">Truck</option>
              </select>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} class="input">
                <option value="brand new">Brand New</option>
                <option value="foreign used">Foreign Used</option>
                <option value="nigerian used">Nigerian Used</option>
              </select>
            </div>

            {/* Color */}
<div>
  <label className="block text-sm font-medium mb-2">Car Color</label>
  <input
    type="text"
    placeholder="e.g. Black, White, Silver"
    value={form.color}
    onChange={(e) => setForm({ ...form, color: e.target.value })}
    required
    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
  />
</div>

{/* Location - State & LGA */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium mb-2">State</label>
    <select
      value={form.location.state}
      onChange={(e) => setForm({
        ...form,
        location: { ...form.location, state: e.target.value }
      })}
      required
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    >
      <option value="">Select State</option>
      <option value="Lagos">Lagos</option>
      <option value="Abuja">Abuja</option>
      <option value="Rivers">Rivers</option>
      <option value="Ogun">Ogun</option>
      {/* Add more states */}
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium mb-2">LGA</label>
    <input
      type="text"
      placeholder="e.g. Ikeja, Port Harcourt"
      value={form.location.lga}
      onChange={(e) => setForm({
        ...form,
        location: { ...form.location, lga: e.target.value }
      })}
      required
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    />
  </div>
</div>

            <textarea
              placeholder="Description (min 50 chars)"
              rows="5"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              class="input"
            />

            <button
              type="submit"
              disabled={loading || uploading || form.images.length < 4}
              class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl disabled:opacity-50"
            >
              {loading ? 'Listing Car...' : 'List Car For Sale'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ListCar;


