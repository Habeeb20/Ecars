/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Car, FileText, Check, X, Camera, Info, Loader2, Shield, ThumbsUp,
  DollarSign, LogIn, ShieldCheck, FileSearch, Key, Calendar, Phone,
  ImageIcon, Sparkles, Gauge, Palette, MapPin, Fuel, Settings2, Tag
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navy = '#0B1B3E';
const rust = '#C2532A';
const cream = '#FAF7F2';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River',
  'Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe','Imo','Jigawa','Kaduna','Kano',
  'Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const COMMON_FEATURES = [
  'Air Conditioning', 'Leather Seats', 'Sunroof', 'Reverse Camera', 'Bluetooth',
  'Navigation System', 'Alloy Wheels', 'Keyless Entry', 'Cruise Control', 'Heated Seats',
];

const SellCar = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '', make: '', model: '', year: '', price: '', mileage: '',
    transmission: '', fuelType: '', bodyType: '', condition: '', color: '',
    vin: '', state: '', lga: '', description: '', phoneNumber: '',
  });
  const [features, setFeatures] = useState([]);
  const [customFeature, setCustomFeature] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFeature = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const addCustomFeature = () => {
    const trimmed = customFeature.trim();
    if (!trimmed) return;
    if (features.includes(trimmed)) {
      toast.error('That feature is already added.', { id: 'dup-feature' });
      return;
    }
    setFeatures((prev) => [...prev, trimmed]);
    setCustomFeature('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (files.length >= 5) {
      toast.error('You can only upload up to 5 photos.', { id: 'max-photos' });
      return;
    }

    const validFiles = Array.from(selectedFiles).filter(
      (file) =>
        ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type) &&
        file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      toast.error('No valid images selected. Use JPG, PNG or GIF up to 10MB.', { id: 'invalid-files' });
      return;
    }

    if (validFiles.length < selectedFiles.length) {
      toast.error('Some files were skipped — only JPG, PNG, GIF up to 10MB are allowed.', {
        id: 'skipped-files',
      });
    }

    const remainingSlots = 5 - files.length;
    const newFiles = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast('Only added what fits — 5 photos max.', { id: 'slots-limit', icon: '📸' });
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    toast.success(`${newFiles.length} photo${newFiles.length > 1 ? 's' : ''} added.`, {
      id: 'photos-added',
    });
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    toast('Photo removed.', { id: 'photo-removed', icon: '🗑️' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title, make, model, year, price, mileage, transmission, fuelType,
      bodyType, condition, color, state, lga, description, phoneNumber,
    } = formData;

    if (!title || !make || !model || !year || !price || !mileage || !transmission ||
        !fuelType || !bodyType || !condition || !color || !state || !lga || !description) {
      toast.error('Please fill in every required field before submitting.', { id: 'validation' });
      return;
    }
    if (files.length === 0) {
      toast.error('Add at least one photo of your car.', { id: 'validation-photos' });
      return;
    }
    if (phoneNumber && !/^0\d{10}$/.test(phoneNumber.trim())) {
      toast.error('Enter a valid Nigerian phone number (e.g. 08123456789).', { id: 'validation-phone' });
      return;
    }
    if (Number(year) < 1980 || Number(year) > new Date().getFullYear() + 1) {
      toast.error('Enter a valid year for your car.', { id: 'validation-year' });
      return;
    }
    if (Number(price) < 10000) {
      toast.error('Price is too low — enter a realistic asking price.', { id: 'validation-price' });
      return;
    }
    if (Number(mileage) < 0) {
      toast.error('Mileage cannot be negative.', { id: 'validation-mileage' });
      return;
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    const uploadToastId = toast.loading('Uploading your photos...', { id: 'upload-progress' });

    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: fd }
          );
          if (!res.ok) throw new Error('Image upload failed');
          const data = await res.json();
          return data.secure_url;
        })
      );

      toast.loading('Publishing your listing...', { id: uploadToastId });

      const payload = {
        title,
        make,
        model,
        year: Number(year),
        price: Number(price),
        mileage: Number(mileage),
        transmission,
        fuelType,
        bodyType,
        condition,
        color,
        vin: formData.vin || undefined,
        location: { state, lga },
        description,
        phoneNumber: phoneNumber || undefined,
        images: imageUrls,
        features,
      };

      const token = localStorage.getItem('token');
      const apiRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await apiRes.json();

      if (data.status === 'success') {
        toast.success('Your car has been listed successfully!', {
          id: uploadToastId,
          duration: 5000,
          icon: '🚗',
        });

        setFormData({
          title: '', make: '', model: '', year: '', price: '', mileage: '',
          transmission: '', fuelType: '', bodyType: '', condition: '', color: '',
          vin: '', state: '', lga: '', description: '', phoneNumber: '',
        });
        setFeatures([]);
        setFiles([]);
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPreviews([]);
      } else {
        toast.error(data.message || 'Failed to list your car. Please try again.', {
          id: uploadToastId,
        });
      }
    } catch (err) {
      toast.error('Network error — check your connection and try again.', {
        id: uploadToastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: cream }}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: navy,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: '0 12px 32px rgba(11,27,62,0.28)',
          },
          success: { iconTheme: { primary: '#3FBF7F', secondary: navy } },
          error: { iconTheme: { primary: '#E5484D', secondary: navy }, style: { background: '#2A0F14' } },
          loading: { iconTheme: { primary: '#F5C518', secondary: navy } },
        }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: navy }}>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide uppercase"
            style={{ background: 'rgba(245,197,24,0.12)', color: '#F5C518', border: '1px solid rgba(245,197,24,0.3)' }}
          >
            <Sparkles size={14} /> List in minutes
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Sell your car with confidence
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/70 max-w-xl mx-auto"
          >
            Reach thousands of verified buyers across Nigeria — no dealer fees, no waiting rooms.
          </motion.p>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none">
          <path d="M0 60L1440 0V60H0Z" fill={cream} />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-20">
        {/* Checklist */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">What to bring with you</h2>
          <p className="text-gray-500 mb-8 text-sm">Have these ready to speed up your listing and buyer verification.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck, color: '#2563EB', title: 'Your ID',
                items: [
                  'Valid Nigerian driving licence or passport',
                  'Two proofs of address dated within 3 months (bank statement, utility bill)',
                  'Proof of settlement if the car has outstanding finance',
                ],
                note: 'Mobile phone bills are not accepted as proof of address.',
              },
              {
                icon: FileSearch, color: rust, title: "Your car's ID",
                items: [
                  'Vehicle inspection certificate',
                  'Proof of ownership / registration document',
                  'Service history',
                  'Any other bills or receipts for the car',
                ],
                note: 'The car must be registered to you, at your address, for at least 3 months.',
              },
              {
                icon: Key, color: '#7C3AED', title: 'Car extras',
                items: [
                  'Spare keys & handbooks',
                  'Sound system facias',
                  'Remote control & wheel nut keys',
                  'Anything else that belongs with the car',
                ],
                note: null,
              },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-6 bg-gray-50 border border-gray-100">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${card.color}15` }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: card.color }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                {card.note && <p className="text-xs text-gray-400 italic mt-4">{card.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 md:px-10 py-8" style={{ background: navy }}>
            <h2 className="text-2xl font-bold text-white">List your vehicle</h2>
            <p className="text-white/60 text-sm mt-1">Tell us about your car — the details buyers care about most.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            {/* Basic info */}
            <Section label="Basic information">
              <Field label="Listing title" icon={Tag} name="title" value={formData.title} onChange={handleInputChange}
                placeholder="e.g. 2019 Toyota Camry SE - Low Mileage" full />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Make" icon={Car} name="make" value={formData.make} onChange={handleInputChange} placeholder="Toyota, Mercedes-Benz" />
                <Field label="Model" icon={Car} name="model" value={formData.model} onChange={handleInputChange} placeholder="Camry, C300, Land Cruiser" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Year" icon={Calendar} name="year" type="number" value={formData.year}
                  onChange={handleInputChange} placeholder="2023" min="1980" max={new Date().getFullYear() + 1} />
                <Field label="Asking price (₦)" icon={DollarSign} name="price" type="number" value={formData.price}
                  onChange={handleInputChange} placeholder="15,000,000" min="10000" accent="green" />
              </div>
            </Section>

            {/* Vehicle details */}
            <Section label="Vehicle details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Condition" icon={ShieldCheck} name="condition" value={formData.condition} onChange={handleInputChange}
                  options={[
                    { value: 'brand new', label: 'Brand New' },
                    { value: 'foreign used', label: 'Foreign Used' },
                    { value: 'nigerian used', label: 'Nigerian Used' },
                  ]} />
                <SelectField label="Body type" icon={Car} name="bodyType" value={formData.bodyType} onChange={handleInputChange}
                  options={[
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'Hatchback', label: 'Hatchback' },
                    { value: 'Coupe', label: 'Coupe' },
                    { value: 'Truck', label: 'Truck' },
                    { value: 'Van', label: 'Van' },
                    { value: 'Convertible', label: 'Convertible' },
                  ]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Transmission" icon={Settings2} name="transmission" value={formData.transmission} onChange={handleInputChange}
                  options={[
                    { value: 'automatic', label: 'Automatic' },
                    { value: 'manual', label: 'Manual' },
                  ]} />
                <SelectField label="Fuel type" icon={Fuel} name="fuelType" value={formData.fuelType} onChange={handleInputChange}
                  options={[
                    { value: 'petrol', label: 'Petrol' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'electric', label: 'Electric' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Mileage (km)" icon={Gauge} name="mileage" type="number" value={formData.mileage}
                  onChange={handleInputChange} placeholder="45,000" min="0" />
                <Field label="Color" icon={Palette} name="color" value={formData.color} onChange={handleInputChange} placeholder="Black, Silver, White" />
              </div>
              <Field label="VIN (optional)" icon={FileSearch} name="vin" value={formData.vin} onChange={handleInputChange}
                placeholder="Vehicle Identification Number" full required={false} />
            </Section>

            {/* Location & contact */}
            <Section label="Location & contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="State" icon={MapPin} name="state" value={formData.state} onChange={handleInputChange}
                  options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))} />
                <Field label="LGA" icon={MapPin} name="lga" value={formData.lga} onChange={handleInputChange} placeholder="e.g. Ikeja" />
              </div>
              <Field label="Phone number (optional)" icon={Phone} name="phoneNumber" type="tel" value={formData.phoneNumber}
                onChange={handleInputChange} placeholder="08123456789" full required={false} />
            </Section>

            {/* Features */}
            <Section label="Features">
              <div className="flex flex-wrap gap-2">
                {COMMON_FEATURES.map((f) => (
                  <button
                    key={f} type="button" onClick={() => toggleFeature(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                      features.includes(f)
                        ? 'text-white border-transparent'
                        : 'text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                    style={features.includes(f) ? { background: navy } : {}}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="text" value={customFeature} onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomFeature(); } }}
                  placeholder="Add another feature..."
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm focus:border-[#0B1B3E] focus:bg-white focus:ring-4 focus:ring-[#0B1B3E]/5 outline-none transition-all"
                />
                <button type="button" onClick={addCustomFeature}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all" style={{ background: navy }}>
                  Add
                </button>
              </div>
              {features.filter((f) => !COMMON_FEATURES.includes(f)).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {features.filter((f) => !COMMON_FEATURES.includes(f)).map((f) => (
                    <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700">
                      {f}
                      <button type="button" onClick={() => toggleFeature(f)}><X className="w-3.5 h-3.5" /></button>
                    </span>
                  ))}
                </div>
              )}
            </Section>

            {/* Description */}
            <Section label="Description">
              <textarea
                name="description" value={formData.description} onChange={handleInputChange} rows="5"
                placeholder="Condition, service history, upgrades, reason for selling..."
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-[#0B1B3E] focus:bg-white focus:ring-4 focus:ring-[#0B1B3E]/5 outline-none transition-all resize-none text-sm"
                required
              />
            </Section>

            {/* Photos */}
            <Section label={`Photos (${files.length}/5)`}>
              {previews.length === 0 ? (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-[#0B1B3E] hover:bg-gray-50 transition-all">
                    <Camera className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-700 text-sm mb-1">Drop photos here or click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG or GIF, up to 10MB each</p>
                  </div>
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif" multiple onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {previews.map((preview, index) => (
                      <motion.div key={preview} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative group">
                        <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-28 object-cover rounded-xl shadow-sm" />
                        <button type="button" onClick={() => removeFile(index)}
                          className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {files.length < 5 && (
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-28 cursor-pointer hover:border-[#0B1B3E] transition-all">
                      <Camera className="w-6 h-6 text-gray-300" />
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              )}
            </Section>

            <div className="pt-2">
              <button
                type="submit" disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isLoading ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'text-white hover:shadow-2xl hover:-translate-y-0.5'
                }`}
                style={!isLoading ? { background: `linear-gradient(135deg, ${navy}, #16255C)` } : {}}
              >
                {isLoading ? (<><Loader2 className="w-6 h-6 animate-spin" /> Listing your car...</>) : (<><Car className="w-6 h-6" /> List my car now</>)}
              </button>
            </div>
          </form>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[
            { icon: Shield, label: 'Secure platform', color: '#22C55E' },
            { icon: ThumbsUp, label: 'Verified buyers', color: '#2563EB' },
            { icon: DollarSign, label: 'Best price guarantee', color: '#16A34A' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 text-gray-600">
              <b.icon className="w-5 h-5" style={{ color: b.color }} />
              <span className="font-medium text-sm">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Login modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center">
              <div className="flex justify-center mb-6">
                <div className="p-5 rounded-2xl" style={{ background: navy }}><LogIn className="w-9 h-9 text-white" /></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Log in to continue</h2>
              <p className="text-gray-500 text-sm mb-8">You need an account to list your car and track its status.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => (window.location.href = '/login')} className="py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5" style={{ background: navy }}>Log in</button>
                <button onClick={() => setShowLoginModal(false)} className="py-4 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Section({ label, children }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: rust }}>{label}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, accent, full, required = true, ...props }) {
  const ring = accent === 'green' ? 'focus:border-green-600 focus:ring-green-100' : 'focus:border-[#0B1B3E] focus:ring-[#0B1B3E]/5';
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
        <Icon className="w-4 h-4" style={{ color: accent === 'green' ? '#16A34A' : rust }} />
        {label}
      </label>
      <input {...props} required={required} className={`w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all text-sm ${ring}`} />
    </div>
  );
}

function SelectField({ label, icon: Icon, options, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
        <Icon className="w-4 h-4" style={{ color: rust }} />
        {label}
      </label>
      <select {...props} required className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-[#0B1B3E] focus:bg-white focus:ring-4 focus:ring-[#0B1B3E]/5 outline-none transition-all text-sm">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

export default SellCar;