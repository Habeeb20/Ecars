// /* eslint-disable no-unused-vars */
// // src/pages/user/MyListings.jsx
// import { useState, useEffect } from 'react';
// import { Car, Edit, Trash2 } from 'lucide-react';
// import { toast } from 'sonner';

// const MyListings = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMyCars();
//   }, []);

//   const fetchMyCars = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.status === 'success') setCars(data.data.cars);
//     } catch (err) {
//       toast.error('Failed to load your listings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCar = async (id) => {
//     if (!confirm('Delete this car listing?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCars(cars.filter(c => c._id !== id));
//       toast.success('Car deleted');
//     } catch (err) {
//       toast.error('Delete failed');
//     }
//   };

//   return (
//     <div class="max-w-7xl mx-auto p-6">
//       <h1 class="text-4xl font-bold text-center mb-10">My Car Listings</h1>

//       {loading ? (
//         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {[1,2,3,4,5,6].map(i => (
//             <div key={i} class="bg-gray-200 dark:bg-gray-700 h-96 rounded-2xl animate-pulse"></div>
//           ))}
//         </div>
//       ) : cars.length === 0 ? (
//         <div class="text-center py-20">
//           <Car class="h-24 w-24 text-gray-300 mx-auto mb-4" />
//           <p class="text-xl text-gray-600">You haven't listed any car yet</p>
//         </div>
//       ) : (
//         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {cars.map(car => (
//             <div key={car._id} class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
//               <img src={car.images[0]} alt="" class="w-full h-64 object-cover" />
//               <div class="p-6">
//                 <h3 class="text-xl font-bold">{car.title}</h3>
//                 <p class="text-2xl font-bold text-indigo-600 mt-2">₦{car.price.toLocaleString()}</p>
//                 <p class="text-gray-600 mt-2">{car.make} {car.model} • {car.year}</p>
//                 <div class="flex justify-between mt-6">
//                   <span class={`px-3 py-1 rounded-full text-xs font-bold ${car.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
//                     {car.status.toUpperCase()}
//                   </span>
//                   <div class="flex gap-3">
//                     <button class="text-blue-600 hover:text-blue-800">
//                       <Edit class="h-5 w-5" />
//                     </button>
//                     <button onClick={() => deleteCar(car._id)} class="text-red-600 hover:text-red-800">
//                       <Trash2 class="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyListings;

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Car, Edit, Trash2, Eye, X, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';

const MyListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState(null);
  const [viewingCar, setViewingCar] = useState(null);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyCars();
  }, []);

  const fetchMyCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === 'success') setCars(data.data.cars);
    } catch (err) {
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm('Delete this car listing permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter(c => c._id !== id));
      toast.success('Car deleted successfully');
    } catch (err) {
      toast.error('Failed to delete car');
    }
  };

  const startEdit = (car) => {
    setEditingCar(car._id);
    setForm({
      title: car.title,
      price: car.price,
      make: car.make,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      transmission: car.transmission,
      fuelType: car.fuelType,
      bodyType: car.bodyType,
      condition: car.condition,
      color: car.color,
      description: car.description,
      location: { state: car.location.state, lga: car.location.lga },
      features: car.features?.join(', ') || '',
      images: car.images,
    });
  };

  const uploadImage = async (e) => {
    const files = Array.from(e.target.files);
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
      toast.success(`${urls.length} image(s) added`);
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const saveEdit = async () => {
    if (form.images.length < 4) {
      toast.error('At least 4 images required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${editingCar}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          features: form.features.split(',').map(f => f.trim()).filter(f => f),
          price: Number(form.price),
          year: Number(form.year),
          mileage: Number(form.mileage),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Car updated successfully!');
        setCars(cars.map(c => c._id === editingCar ? { ...c, ...form } : c));
        setEditingCar(null);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        My Car Listings
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-96 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-20">
          <Car className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-400">No cars listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map(car => (
            <div key={car._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              <img src={car.images[0]} alt={car.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                {editingCar === car._id ? (
                  <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <input
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Car Title"
                    />
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Price (₦)"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} placeholder="Make" className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                      <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Model" className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                      <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                      <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Color" className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                    </div>
                    <input value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} placeholder="Mileage (km)" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                    <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Features (comma separated)" className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                    <div className="grid grid-cols-2 gap-3">
                      <select value={form.location.state} onChange={e => setForm({ ...form, location: { ...form.location, state: e.target.value } })} className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700">
                        <option value="">State</option>
                        <option>Lagos</option><option>Abuja</option><option>Rivers</option>
                      </select>
                      <input value={form.location.lga} onChange={e => setForm({ ...form, location: { ...form.location, lga: e.target.value } })} placeholder="LGA" className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700" />
                    </div>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Description"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Images ({form.images.length}/20)</label>
                      <input type="file" multiple accept="image/*" onChange={uploadImage} disabled={uploading} className="hidden" id="edit-images" />
                      <label htmlFor="edit-images" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                        <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Add Images'}
                      </label>
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {form.images.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} className="h-20 w-full object-cover rounded" />
                            <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveEdit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" /> Save Changes
                      </button>
                      <button onClick={() => setEditingCar(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{car.title}</h3>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                      ₦{car.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {car.make} {car.model} • {car.year}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {car.location.lga}, {car.location.state}
                    </p>
                    <div className="flex justify-between items-center mt-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        car.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {car.status.toUpperCase()}
                      </span>
                      <div className="flex gap-4">
                        <button onClick={() => setViewingCar(car)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400" title="View">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => startEdit(car)} className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400" title="Edit">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => deleteCar(car._id)} className="text-red-600 hover:text-red-800 dark:text-red-400" title="Delete">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingCar && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img src={viewingCar.images[0]} alt="" className="w-full h-96 object-cover rounded-t-3xl" />
              <button onClick={() => setViewingCar(null)} className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur">
                <X className="h-7 w-7" />
              </button>
            </div>
            <div className="p-8 text-gray-800 dark:text-gray-200">
              <h2 className="text-4xl font-bold">{viewingCar.title}</h2>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-4">
                ₦{viewingCar.price.toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  ['Make', viewingCar.make],
                  ['Model', viewingCar.model],
                  ['Year', viewingCar.year],
                  ['Mileage', `${viewingCar.mileage.toLocaleString()} km`],
                  ['Color', viewingCar.color],
                  ['Condition', viewingCar.condition],
                  ['Transmission', viewingCar.transmission],
                  ['Fuel Type', viewingCar.fuelType],
                  ['Location', `${viewingCar.location.lga}, ${viewingCar.location.state}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <strong className="text-gray-600 dark:text-gray-400">{label}:</strong>
                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <strong>Description:</strong>
                <p className="mt-3 leading-relaxed">{viewingCar.description}</p>
              </div>
              {viewingCar.features?.length > 0 && (
                <div className="mt-8">
                  <strong>Features:</strong>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {viewingCar.features.map((f, i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;