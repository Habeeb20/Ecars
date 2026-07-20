// // src/components/PostDealForm.jsx
// import React, { useState, useEffect } from 'react';
// import { Loader2, Upload, X, Edit, Trash2, Plus } from 'lucide-react';
// import { toast } from 'sonner';

// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
// const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'essential';

// const PostDealForm = ({ dealToEdit = null, onClose }) => {
//   const isEditMode = !!dealToEdit;

//   const [formData, setFormData] = useState({
//     title: dealToEdit?.title || '',
//     originalPrice: dealToEdit?.originalPrice || '',
//     discountPercentage: dealToEdit?.discountPercentage || 0,
//     discountedPrice: dealToEdit?.discountedPrice || '',
//     make: dealToEdit?.make || '',
//     model: dealToEdit?.model || '',
//     year: dealToEdit?.year || '',
//     mileage: dealToEdit?.mileage || '',
//     transmission: dealToEdit?.transmission || 'automatic',
//     fuelType: dealToEdit?.fuelType || 'petrol',
//     bodyType: dealToEdit?.bodyType || 'sedan',
//     condition: dealToEdit?.condition || 'brand new',
//     color: dealToEdit?.color || '',
//     description: dealToEdit?.description || '',
//     state: dealToEdit?.location?.state || '',
//     lga: dealToEdit?.location?.lga || '',
//     features: dealToEdit?.features?.join(', ') || '',
//   });

//   const [images, setImages] = useState([]);              // preview URLs
//   const [cloudinaryUrls, setCloudinaryUrls] = useState(dealToEdit?.images || []); // existing + new URLs
//   const [uploading, setUploading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [myDeals, setMyDeals] = useState([]);
//   const [loadingDeals, setLoadingDeals] = useState(true);

//   // Auto-calculate discounted price
//   useEffect(() => {
//     const original = Number(formData.originalPrice);
//     const percent = Number(formData.discountPercentage);

//     if (!isNaN(original) && !isNaN(percent) && percent >= 0 && percent <= 100) {
//       const discount = (original * percent) / 100;
//       setFormData(prev => ({
//         ...prev,
//         discountedPrice: Math.round(original - discount),
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, discountedPrice: '' }));
//     }
//   }, [formData.originalPrice, formData.discountPercentage]);

//   // Load user's existing deals
//   useEffect(() => {
//     const fetchMyDeals = async () => {
//       setLoadingDeals(true);
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();
//         if (data.status === true) {
//           setMyDeals(data.data.deals || []);
//         }
//       } catch (err) {
//         toast.error('Failed to load your deals');
//       } finally {
//         setLoadingDeals(false);
//       }
//     };

//     fetchMyDeals();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + images.length > 10) {
//       toast.error("Maximum 10 images allowed");
//       return;
//     }

//     setUploading(true);

//     const newPreviews = [];
//     const newUrls = [];

//     for (const file of files) {
//       const previewUrl = URL.createObjectURL(file);
//       newPreviews.push(previewUrl);

//       try {
//         const form = new FormData();
//         form.append('file', file);
//         form.append('upload_preset', UPLOAD_PRESET);

//         const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: form });
//         const data = await res.json();

//         if (data.secure_url) {
//           newUrls.push(data.secure_url);
//         } else {
//           toast.error(`Failed to upload ${file.name}`);
//         }
//       } catch (err) {
//         toast.error(`Upload failed for ${file.name}`);
//       }
//     }

//     setImages(prev => [...prev, ...newPreviews]);
//     setCloudinaryUrls(prev => [...prev, ...newUrls]);
//     setUploading(false);
//   };

//   const removeImage = (index) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//     setCloudinaryUrls(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (cloudinaryUrls.length < 6) {
//       toast.error("Please upload at least 6 images");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const payload = {
//         ...formData,
//         features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
//         images: cloudinaryUrls,
//         location: { state: formData.state, lga: formData.lga },
//       };

//       const token = localStorage.getItem('token');
//       const method = isEditMode ? 'PUT' : 'POST';
//       const url = isEditMode 
//         ? `${import.meta.env.VITE_BACKEND_URL}/deals/${dealToEdit._id}`
//         : `${import.meta.env.VITE_BACKEND_URL}/deals`;

//       const res = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.status === true) {
//         toast.success(isEditMode ? "Deal updated successfully!" : "Deal posted successfully!");
//         // Reset form or close modal
//         if (onClose) onClose();
//       } else {
//         toast.error(data.message || "Failed to save deal");
//       }
//     } catch (err) {
//       toast.error("Network error");
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (dealId) => {
//     if (!window.confirm("Are you sure you want to delete this deal?")) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals/${dealId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (data.status === true) {
//         toast.success("Deal deleted successfully");
//         setMyDeals(prev => prev.filter(d => d._id !== dealId));
//       } else {
//         toast.error(data.message || "Failed to delete deal");
//       }
//     } catch (err) {
//       toast.error("Network error");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
//       <h2 className="text-3xl font-bold mb-8 text-center">
//         {isEditMode ? 'Edit Deal' : 'Post a New Deal'}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Title & Prices */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <input name="title" placeholder="Deal Title" value={formData.title} onChange={handleInputChange} required className="input col-span-3" />
//           <input type="number" name="originalPrice" placeholder="Original Price (₦)" value={formData.originalPrice} onChange={handleInputChange} required className="input" />
//           <input type="number" name="discountPercentage" placeholder="Discount %" value={formData.discountPercentage} onChange={handleInputChange} required min="0" max="100" className="input" />
//           <div className="input bg-green-50 dark:bg-green-950 cursor-not-allowed">
//             Discounted: ₦{formData.discountedPrice ? formData.discountedPrice.toLocaleString() : '—'}
//           </div>
//         </div>

//         {/* Car Details */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <input name="make" placeholder="Make" value={formData.make} onChange={handleInputChange} required className="input" />
//           <input name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} required className="input" />
//           <input type="number" name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} required className="input" />
//           <input type="number" name="mileage" placeholder="Mileage (km)" value={formData.mileage} onChange={handleInputChange} required className="input" />
//           <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="input">
//             <option value="automatic">Automatic</option>
//             <option value="manual">Manual</option>
//           </select>
//           <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="input">
//             <option value="petrol">Petrol</option>
//             <option value="diesel">Diesel</option>
//             <option value="electric">Electric</option>
//             <option value="hybrid">Hybrid</option>
//           </select>
//           <select name="bodyType" value={formData.bodyType} onChange={handleInputChange} className="input">
//             <option value="sedan">Sedan</option>
//             <option value="suv">SUV</option>
//             <option value="hatchback">Hatchback</option>
//             <option value="truck">Truck</option>
//             <option value="bus">Bus</option>
//             <option value="bikes">Bikes</option>
//           </select>
//           <select name="condition" value={formData.condition} onChange={handleInputChange} className="input">
//             <option value="brand new">Brand New</option>
//             <option value="foreign used">Foreign Used</option>
//             <option value="nigerian used">Nigerian Used</option>
//           </select>
//           <input name="color" placeholder="Color" value={formData.color} onChange={handleInputChange} required className="input" />
//         </div>

//         {/* Location */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required className="input" />
//           <input name="lga" placeholder="LGA" value={formData.lga} onChange={handleInputChange} required className="input" />
//         </div>

//         {/* Description & Features */}
//         <textarea name="description" placeholder="Full description..." value={formData.description} onChange={handleInputChange} required rows={5} className="input" />
//         <input name="features" placeholder="Features (comma separated)" value={formData.features} onChange={handleInputChange} className="input" />

//         {/* Images */}
//         <div>
//           <label className="block text-sm font-medium mb-2 flex items-center gap-2">
//             <Upload className="h-5 w-5" /> Upload images (min 6)
//           </label>
//           <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={uploading} className="file-input" />
//           <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
//             {images.map((src, i) => (
//               <div key={i} className="relative group">
//                 <img src={src} alt="preview" className="w-full h-24 object-cover rounded-lg border" />
//                 <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//           {images.length < 6 && <p className="text-red-600 text-sm mt-2">Minimum 6 images required ({images.length}/6)</p>}
//         </div>

//         <button
//           type="submit"
//           disabled={submitting || uploading || images.length < 6}
//           className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           {submitting || uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditMode ? 'Update Deal' : 'Post Deal')}
//         </button>
//       </form>

//       {/* My Deals List */}
//       <div className="mt-16">
//         <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
//           <span>My Posted Deals</span>
//           <button
//             onClick={() => {
//               // Reset form for new deal
//               setFormData({ ...initialFormData });
//               setImages([]);
//               setCloudinaryUrls([]);
//             }}
//             className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 text-sm"
//           >
//             <Plus className="h-4 w-4" /> New Deal
//           </button>
//         </h3>

//         {loadingDeals ? (
//           <div className="flex justify-center py-10">
//             <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//           </div>
//         ) : myDeals.length === 0 ? (
//           <p className="text-center text-gray-500 dark:text-gray-400 py-10">You haven't posted any deals yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {myDeals.map((deal) => (
//               <div key={deal._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
//                 <div className="h-40 bg-slate-100 dark:bg-slate-700 relative">
//                   {deal.images?.[0] && (
//                     <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
//                   )}
//                 </div>
//                 <div className="p-4">
//                   <h4 className="font-semibold text-lg mb-1 line-clamp-2">{deal.title}</h4>
//                   <div className="flex items-baseline gap-3 mb-2">
//                     <span className="text-xl font-bold text-emerald-600">₦{deal.discountedPrice.toLocaleString()}</span>
//                     <span className="text-sm text-gray-500 line-through">₦{deal.originalPrice.toLocaleString()}</span>
//                     <span className="text-sm text-red-600">-{deal.discountPercentage}%</span>
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                     {deal.make} {deal.model} • {deal.year}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         // Load deal into form for editing
//                         setFormData({
//                           title: deal.title,
//                           originalPrice: deal.originalPrice,
//                           discountPercentage: deal.discountPercentage,
//                           discountedPrice: deal.discountedPrice,
//                           make: deal.make,
//                           model: deal.model,
//                           year: deal.year,
//                           mileage: deal.mileage,
//                           transmission: deal.transmission,
//                           fuelType: deal.fuelType,
//                           bodyType: deal.bodyType,
//                           condition: deal.condition,
//                           color: deal.color,
//                           description: deal.description,
//                           state: deal.location?.state || '',
//                           lga: deal.location?.lga || '',
//                           features: deal.features?.join(', ') || '',
//                         });
//                         setImages(deal.images || []);
//                         setCloudinaryUrls(deal.images || []);
//                       }}
//                       className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
//                     >
//                       <Edit className="h-4 w-4" /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(deal._id)}
//                       className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
//                     >
//                       <Trash2 className="h-4 w-4" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostDealForm;



// src/components/PostDealForm.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, Upload, X, Edit, Trash2, Plus, ImageIcon, Tag, MapPin, Car, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { statesAndLgas } from '../../utils/stateAndLga';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'essential';

const navy = '#0B1B3E';
const rust = '#C2532A';

const NIGERIAN_STATES = Object.keys(statesAndLgas);

const MODELS_BY_MAKE = {
  Toyota: ['Camry', 'Corolla', 'Highlander', 'RAV4', 'Land Cruiser', 'Sienna', 'Hilux', 'Avalon', 'Prado'],
  Honda: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'HR-V'],
  Ford: ['Explorer', 'Edge', 'F-150', 'Focus', 'Escape', 'Mustang'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X6'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'G-Wagon'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'A8'],
  Lexus: ['RX', 'ES', 'GX', 'LX', 'NX'],
  Nissan: ['Altima', 'Maxima', 'Murano', 'Pathfinder', 'Rogue'],
  Kia: ['Sorento', 'Sportage', 'Optima', 'Rio', 'Cerato'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent'],
  Peugeot: ['3008', '5008', '208', '508'],
  Volkswagen: ['Passat', 'Tiguan', 'Jetta', 'Golf'],
  Jeep: ['Grand Cherokee', 'Wrangler', 'Cherokee', 'Compass'],
  Other: [],
};

const CAR_MAKES = Object.keys(MODELS_BY_MAKE);

const CAR_COLORS = [
  'Black', 'White', 'Silver', 'Grey', 'Red', 'Blue', 'Green',
  'Brown', 'Gold', 'Beige', 'Maroon', 'Orange', 'Yellow', 'Other',
];

const inputCls =
  'w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed';

const labelCls = 'block text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-500 dark:text-gray-400';

const initialFormData = {
  title: '', originalPrice: '', discountPercentage: 0, discountedPrice: '',
  make: '', model: '', customMake: '', customModel: '', year: '', mileage: '',
  transmission: 'automatic', fuelType: 'petrol', bodyType: 'sedan', condition: 'brand new',
  color: '', customColor: '', description: '', state: '', lga: '', features: '',
};

function LabeledInput({ label, icon: Icon, className = '', ...props }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />}
        <input {...props} className={`${inputCls} ${Icon ? 'pl-10' : ''}`} />
      </div>
    </div>
  );
}

function LabeledSelect({ label, options, className = '', ...props }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      <select {...props} className={inputCls}>
        {options.map((opt) => (
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

const PostDealForm = ({ dealToEdit = null, onClose }) => {
  const isEditMode = !!dealToEdit;

  const buildFormFromDeal = (deal) => ({
    title: deal?.title || '',
    originalPrice: deal?.originalPrice || '',
    discountPercentage: deal?.discountPercentage || 0,
    discountedPrice: deal?.discountedPrice || '',
    make: CAR_MAKES.includes(deal?.make) ? deal.make : (deal?.make ? 'Other' : ''),
    customMake: CAR_MAKES.includes(deal?.make) ? '' : (deal?.make || ''),
    model: deal?.make && MODELS_BY_MAKE[deal.make]?.includes(deal?.model) ? deal.model : (deal?.model ? 'Other' : ''),
    customModel: deal?.make && MODELS_BY_MAKE[deal.make]?.includes(deal?.model) ? '' : (deal?.model || ''),
    year: deal?.year || '',
    mileage: deal?.mileage || '',
    transmission: deal?.transmission || 'automatic',
    fuelType: deal?.fuelType || 'petrol',
    bodyType: deal?.bodyType || 'sedan',
    condition: deal?.condition || 'brand new',
    color: CAR_COLORS.includes(deal?.color) ? deal.color : (deal?.color ? 'Other' : ''),
    customColor: CAR_COLORS.includes(deal?.color) ? '' : (deal?.color || ''),
    description: deal?.description || '',
    state: deal?.location?.state || '',
    lga: deal?.location?.lga || '',
    features: deal?.features?.join(', ') || '',
  });

  const [formData, setFormData] = useState(dealToEdit ? buildFormFromDeal(dealToEdit) : initialFormData);

  const [images, setImages] = useState(dealToEdit?.images || []);
  const [cloudinaryUrls, setCloudinaryUrls] = useState(dealToEdit?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [myDeals, setMyDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);

  const MIN_IMAGES = 6;
  const MAX_IMAGES = 10;

  const lgaOptions = formData.state && statesAndLgas[formData.state] ? statesAndLgas[formData.state] : [];
  const modelOptions = formData.make && MODELS_BY_MAKE[formData.make] ? MODELS_BY_MAKE[formData.make] : [];

  // Auto-calculate discounted price
  useEffect(() => {
    const original = Number(formData.originalPrice);
    const percent = Number(formData.discountPercentage);

    if (!isNaN(original) && !isNaN(percent) && percent >= 0 && percent <= 100 && original > 0) {
      const discount = (original * percent) / 100;
      setFormData((prev) => ({ ...prev, discountedPrice: Math.round(original - discount) }));
    } else {
      setFormData((prev) => ({ ...prev, discountedPrice: '' }));
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
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'make') { next.model = ''; next.customModel = ''; if (value !== 'Other') next.customMake = ''; }
      if (name === 'model' && value !== 'Other') next.customModel = '';
      if (name === 'color' && value !== 'Other') next.customColor = '';
      if (name === 'state') next.lga = '';
      return next;
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
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

    setImages((prev) => [...prev, ...newPreviews]);
    setCloudinaryUrls((prev) => [...prev, ...newUrls]);
    setUploading(false);

    if (newUrls.length > 0) {
      toast.success(`${newUrls.length} image${newUrls.length > 1 ? 's' : ''} uploaded`);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setCloudinaryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImages([]);
    setCloudinaryUrls([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cloudinaryUrls.length < MIN_IMAGES) {
      toast.error(`Please upload at least ${MIN_IMAGES} images`);
      return;
    }

    const resolvedMake = formData.make === 'Other' ? formData.customMake.trim() : formData.make;
    const resolvedModel = formData.model === 'Other' ? formData.customModel.trim() : formData.model;
    const resolvedColor = formData.color === 'Other' ? formData.customColor.trim() : formData.color;

    if (!resolvedMake) return toast.error('Enter or select a vehicle make');
    if (!resolvedModel) return toast.error('Enter or select a vehicle model');
    if (!resolvedColor) return toast.error('Enter or select a vehicle color');
    if (!formData.state) return toast.error('Select a state');
    if (!formData.lga) return toast.error('Select an LGA');

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        originalPrice: Number(formData.originalPrice),
        discountPercentage: Number(formData.discountPercentage),
        discountedPrice: Number(formData.discountedPrice),
        make: resolvedMake,
        model: resolvedModel,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        bodyType: formData.bodyType,
        condition: formData.condition,
        color: resolvedColor,
        description: formData.description,
        features: formData.features ? formData.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === true) {
        toast.success(isEditMode ? 'Deal updated successfully!' : 'Deal posted successfully!');
        if (onClose) onClose();
      } else {
        toast.error(data.message || 'Failed to save deal');
      }
    } catch (err) {
      toast.error('Network error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deals/${dealId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.status === true) {
        toast.success('Deal deleted successfully');
        setMyDeals((prev) => prev.filter((d) => d._id !== dealId));
      } else {
        toast.error(data.message || 'Failed to delete deal');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const loadDealIntoForm = (deal) => {
    setFormData(buildFormFromDeal(deal));
    setImages(deal.images || []);
    setCloudinaryUrls(deal.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center text-gray-900 dark:text-white">
        {isEditMode ? 'Edit deal' : 'Post a new deal'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <LabeledInput
          label="Deal title"
          icon={Tag}
          name="title"
          placeholder="e.g. Weekend Flash Sale — 2020 Toyota Camry"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        {/* Pricing */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>Pricing</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Original price (₦)</label>
              <input
                type="number" inputMode="numeric" name="originalPrice" placeholder="15,000,000"
                value={formData.originalPrice} onChange={handleInputChange} required min="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Discount (%)</label>
              <input
                type="number" inputMode="numeric" name="discountPercentage" placeholder="10"
                value={formData.discountPercentage} onChange={handleInputChange} required min="0" max="100"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Discounted price</label>
              <div className="h-12 px-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 flex items-center font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                ₦{formData.discountedPrice ? Number(formData.discountedPrice).toLocaleString() : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle details */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>Vehicle details</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <LabeledSelect
                label="Make" icon={Car} name="make" value={formData.make} onChange={handleInputChange}
                options={[{ value: '', label: 'Select make' }, ...CAR_MAKES.map((m) => ({ value: m, label: m }))]}
              />
              {formData.make === 'Other' && (
                <input
                  type="text" name="customMake" placeholder="Type the make"
                  value={formData.customMake} onChange={handleInputChange}
                  className={`${inputCls} mt-2`} required
                />
              )}
            </div>

            {/* Model */}
            <div>
              <LabeledSelect
                label="Model" name="model" value={formData.model} onChange={handleInputChange}
                disabled={!formData.make}
                options={[
                  { value: '', label: formData.make ? 'Select model' : 'Select make first' },
                  ...modelOptions.map((m) => ({ value: m, label: m })),
                  { value: 'Other', label: 'Other' },
                ]}
              />
              {formData.model === 'Other' && (
                <input
                  type="text" name="customModel" placeholder="Type the model"
                  value={formData.customModel} onChange={handleInputChange}
                  className={`${inputCls} mt-2`} required
                />
              )}
            </div>

            <LabeledInput label="Year" type="number" inputMode="numeric" name="year" placeholder="2023" value={formData.year} onChange={handleInputChange} required />
            <LabeledInput label="Mileage (km)" type="number" inputMode="numeric" name="mileage" placeholder="45,000" value={formData.mileage} onChange={handleInputChange} required />

            <LabeledSelect
              label="Transmission" name="transmission" value={formData.transmission} onChange={handleInputChange}
              options={[{ value: 'automatic', label: 'Automatic' }, { value: 'manual', label: 'Manual' }]}
            />
            <LabeledSelect
              label="Fuel type" name="fuelType" value={formData.fuelType} onChange={handleInputChange}
              options={[
                { value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' },
                { value: 'electric', label: 'Electric' }, { value: 'hybrid', label: 'Hybrid' },
              ]}
            />
            <LabeledSelect
              label="Body type" name="bodyType" value={formData.bodyType} onChange={handleInputChange}
              options={[
                { value: 'sedan', label: 'Sedan' }, { value: 'suv', label: 'SUV' },
                { value: 'hatchback', label: 'Hatchback' }, { value: 'truck', label: 'Truck' },
                { value: 'bus', label: 'Bus' }, { value: 'bikes', label: 'Bikes' },
              ]}
            />
            <LabeledSelect
              label="Condition" name="condition" value={formData.condition} onChange={handleInputChange}
              options={[
                { value: 'brand new', label: 'Brand New' }, { value: 'foreign used', label: 'Foreign Used' },
                { value: 'nigerian used', label: 'Nigerian Used' },
              ]}
            />

            {/* Color */}
            <div>
              <LabeledSelect
                label="Color" icon={Palette} name="color" value={formData.color} onChange={handleInputChange}
                options={[{ value: '', label: 'Select color' }, ...CAR_COLORS.map((c) => ({ value: c, label: c }))]}
              />
              {formData.color === 'Other' && (
                <input
                  type="text" name="customColor" placeholder="Type the color"
                  value={formData.customColor} onChange={handleInputChange}
                  className={`${inputCls} mt-2`} required
                />
              )}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>Location</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledSelect
              label="State" icon={MapPin} name="state" value={formData.state} onChange={handleInputChange}
              options={[{ value: '', label: 'Select state' }, ...NIGERIAN_STATES.map((s) => ({ value: s, label: s }))]}
            />
            <LabeledSelect
              label="LGA" name="lga" value={formData.lga} onChange={handleInputChange}
              disabled={!formData.state}
              options={[
                { value: '', label: formData.state ? 'Select LGA' : 'Select state first' },
                ...lgaOptions.map((l) => ({ value: l, label: l })),
              ]}
            />
          </div>
        </div>

        {/* Description & Features */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>Description</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Full description</label>
              <textarea
                name="description" placeholder="Condition, service history, upgrades, reason for the deal..."
                value={formData.description} onChange={handleInputChange} required rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all resize-none text-sm"
              />
            </div>
            <LabeledInput
              label="Features (optional)" name="features"
              placeholder="comma separated, e.g. Sunroof, Leather Seats, Reverse Camera"
              value={formData.features} onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>
              <ImageIcon className="h-4 w-4" /> Images
            </label>
            <span className="text-xs text-gray-400">
              {images.length}/{MAX_IMAGES} uploaded · min {MIN_IMAGES}
            </span>
          </div>

          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all ${
              uploading ? 'border-gray-200 dark:border-gray-700 opacity-60' : 'border-gray-200 dark:border-gray-700 hover:border-[#0B1B3E] hover:bg-gray-50 dark:hover:bg-gray-800/40'
            }`}>
              <Upload className="w-9 h-9 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-1">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </p>
              <p className="text-xs text-gray-400">
                Upload between {MIN_IMAGES} and {MAX_IMAGES} photos — JPG, PNG, up to 10MB each
              </p>
            </div>
            <input
              type="file" multiple accept="image/*" onChange={handleImageChange}
              disabled={uploading || images.length >= MAX_IMAGES} className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {images.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="preview" className="w-full h-24 object-cover rounded-xl border border-gray-100 dark:border-gray-700" />
                  <button
                    type="button" onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MIN_IMAGES && (
            <p className="text-red-600 dark:text-red-400 text-xs font-medium mt-2">
              {MIN_IMAGES - images.length} more image{MIN_IMAGES - images.length > 1 ? 's' : ''} needed ({images.length}/{MIN_IMAGES})
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || uploading || images.length < MIN_IMAGES}
          className="w-full py-4 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${navy}, #16255C)` }}
        >
          {submitting || uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {submitting ? 'Saving...' : uploading ? 'Uploading images...' : isEditMode ? 'Update deal' : 'Post deal'}
        </button>
      </form>

      {/* My Deals List */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">My posted deals</h3>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-white rounded-xl flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: navy }}
          >
            <Plus className="h-4 w-4" /> New deal
          </button>
        </div>

        {loadingDeals ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-9 w-9 animate-spin" style={{ color: navy }} />
          </div>
        ) : myDeals.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
            You haven't posted any deals yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myDeals.map((deal) => (
              <div key={deal._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="h-40 bg-gray-100 dark:bg-gray-700 relative">
                  {deal.images?.[0] && (
                    <img src={deal.images[0]} alt={deal.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 text-sm">{deal.title}</h4>
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span className="text-lg font-black" style={{ color: rust }}>
                      ₦{deal.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">₦{deal.originalPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-red-600">-{deal.discountPercentage}%</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {deal.make} {deal.model} • {deal.year}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDealIntoForm(deal)}
                      className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: navy }}
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(deal._id)}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
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