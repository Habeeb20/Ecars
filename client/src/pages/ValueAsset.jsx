/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Car, 
  FileText, 
  Check,
  X,
  Camera,
  Info,
  Shield,
  Clock,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ValueAsset = () => {
  const [formData, setFormData] = useState({
    assetType: '',
    brand: '',
    model: '',
    color: '',
    mileage: '',
    engineType: '',
    displayImage: null,
    additionalImages: [],
    legalTender: null,
    description: '',
    agreeToTerms: false
  });

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carBrands = [
    'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus',
    'Volkswagen', 'Ford', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
    'Peugeot', 'Infiniti', 'Acura', 'Subaru', 'Mitsubishi', 'Jaguar'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file, type) => {
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const validDocTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    const allowedTypes = type === 'legal' ? validDocTypes : validImageTypes;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, GIF or PDF (for documents)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File too large. Maximum 15MB allowed');
      return;
    }

    if (type === 'display') {
      setFormData(prev => ({ ...prev, displayImage: file }));
      toast.success('Display image uploaded!');
    } else if (type === 'additional') {
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, file] 
      }));
    } else if (type === 'legal') {
      setFormData(prev => ({ ...prev, legalTender: file }));
      toast.success('Document uploaded!');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], type);
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    if (!formData.displayImage) {
      toast.error('Please upload at least one display image');
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    toast.success('Valuation request submitted! We\'ll get back to you within 24 hours.', {
      duration: 6000,
      icon: 'Success',
    });

    setIsSubmitting(false);
  };

  const isFormValid = formData.assetType && formData.brand && formData.model && 
                     formData.displayImage && formData.agreeToTerms;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30">
      {/* Hero */}
      <section className="relative py-24 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Know Your Car's <span className="text-yellow-400">True Value</span>
          </h1>
          <p className="text-2xl text-white/90 max-w-4xl mx-auto">
            Free professional valuation by certified experts — accurate, fast, and trusted
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Asset Type */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-8">Vehicle Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: 'new', label: 'Brand New', emoji: 'Sparkles', gradient: 'from-emerald-500 to-teal-600' },
                { value: 'foreign', label: 'Foreign Used', emoji: 'Globe', gradient: 'from-blue-500 to-indigo-600' },
                { value: 'locally-used', label: 'Nigerian Used', emoji: 'Home', gradient: 'from-purple-500 to-pink-600' }
              ].map((opt) => (
                <label key={opt.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="assetType"
                    value={opt.value}
                    checked={formData.assetType === opt.value}
                    onChange={(e) => handleInputChange('assetType', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`relative p-10 rounded-3xl text-white text-center transition-all ${
                    formData.assetType === opt.value 
                      ? `bg-gradient-to-br ${opt.gradient} shadow-2xl scale-105 ring-4 ring-white/50` 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                    <div className="text-6xl mb-4">{opt.emoji}</div>
                    <h3 className={`text-2xl font-bold ${formData.assetType === opt.value ? '' : 'text-gray-900 dark:text-white'}`}>
                      {opt.label}
                    </h3>
                    {formData.assetType === opt.value && (
                      <Check className="w-12 h-12 absolute top-4 right-4 bg-white/20 rounded-full p-2" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Display Image */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-8">Main Display Photo</h2>
            <div
              className={`border-4 border-dashed rounded-3xl p-20 text-center transition-all ${
                dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, 'display')}
            >
              {formData.displayImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(formData.displayImage)}
                    alt="Display"
                    className="mx-auto max-h-96 rounded-2xl shadow-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('displayImage', null)}
                    className="mt-6 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <>
                  <Camera className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                  <p className="text-2xl font-bold mb-4">Drop your best photo here</p>
                  <label className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl rounded-full cursor-pointer shadow-2xl">
                    <Upload className="w-8 h-8 mr-3" />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'display')}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-8">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" placeholder="Brand" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} className="px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:border-indigo-500 transition" />
              <input type="text" placeholder="Model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} className="px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:border-indigo-500 transition" />
              <input type="text" placeholder="Color" value={formData.color} onChange={(e) => handleInputChange('color', e.target.value)} className="px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:border-indigo-500 transition" />
              <input type="number" placeholder="Mileage (km)" value={formData.mileage} onChange={(e) => handleInputChange('mileage', e.target.value)} className="px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:border-indigo-500 transition" />
              <input type="text" placeholder="Engine & Transmission" value={formData.engineType} onChange={(e) => handleInputChange('engineType', e.target.value)} className="md:col-span-2 px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg focus:border-indigo-500 transition" />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-16 py-8 rounded-3xl font-black text-3xl transition-all shadow-2xl ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Get Free Valuation Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ValueAsset;