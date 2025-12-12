/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Upload, 
  Plus, 
  X, 
  Loader2, 
  Package, 
  DollarSign, 
  Image as ImageIcon, 
  Wrench, 
  CheckCircle2, 
  Car 
} from 'lucide-react';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
const UploadCarPart = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    partType: '',
    compatibleMakes: [],
    images: [],
  });

  const [makeInput, setMakeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCompatibleMake = () => {
    if (makeInput.trim()) {
      setFormData(prev => ({ ...prev, compatibleMakes: [...prev.compatibleMakes, makeInput.trim()] }));
      setMakeInput('');
    }
  };

  const removeCompatibleMake = (index) => {
    setFormData(prev => ({
      ...prev,
      compatibleMakes: prev.compatibleMakes.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter(file => 
      ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type) &&
      file.size <= 10 * 1024 * 1024
    );

    const remainingSlots = 5 - formData.images.length;
    const newFiles = validFiles.slice(0, remainingSlots);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
          );
          const data = await res.json();
          return data.secure_url;
        })
      );

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        condition: formData.condition,
        partType: formData.partType,
        compatibleMakes: formData.compatibleMakes,
        images: imageUrls,
      };

      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Car part listed successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          condition: '',
          partType: '',
          compatibleMakes: [],
          images: [],
        });
        setPreviews([]);
      } else {
        toast.error(data.message || 'Failed to list car part');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description && formData.price && 
                     formData.condition && formData.partType && formData.images.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full mb-6 shadow-2xl">
            <Package className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            Upload Car Part for Sale
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            List your car part in minutes. Reach thousands of buyers across Nigeria.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Add Your Car Part</h2>
            <p className="mt-2 opacity-90">Fill in the details below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
            {/* Title */}
            <div className="relative">
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Package className="inline w-6 h-6 mr-2 text-indigo-600" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Toyota Camry Headlight 2020"
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <FileText className="inline w-6 h-6 mr-2 text-indigo-600" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                placeholder="Describe the part: condition, compatibility, reason for selling..."
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all resize-none"
                required
              />
            </div>

            {/* Price, Condition, Part Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <DollarSign className="inline w-6 h-6 mr-2 text-green-600" />
                  Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="150000"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <CheckCircle2 className="inline w-6 h-6 mr-2 text-indigo-600" />
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Wrench className="inline w-6 h-6 mr-2 text-indigo-600" />
                  Part Type
                </label>
                <select
                  name="partType"
                  value={formData.partType}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                  required
                >
                  <option value="">Select Part Type</option>
                  <option value="engine">Engine</option>
                  <option value="body">Body</option>
                  <option value="electronics">Electronics</option>
                  <option value="tyres">Tyres</option>
                  <option value="interior">Interior</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Compatible Makes */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Car className="inline w-6 h-6 mr-2 text-indigo-600" />
                Compatible Makes
              </label>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={makeInput}
                  onChange={(e) => setMakeInput(e.target.value)}
                  placeholder="e.g. Toyota"
                  className="flex-1 px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all"
                />
                <button type="button" onClick={addCompatibleMake} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.compatibleMakes.map((make, i) => (
                  <span key={i} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center gap-2">
                    {make}
                    <X className="h-4 w-4 cursor-pointer" onClick={() => removeCompatibleMake(i)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                <ImageIcon className="inline w-6 h-6 mr-2 text-indigo-600" />
                Upload Photos (up to 5)
              </label>

              {previews.length === 0 ? (
                <label className="block">
                  <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-16 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-all">
                    <ImageIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                    <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Drop photos here or click to upload
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-3 right-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-48 cursor-pointer hover:border-indigo-500 transition-all">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t-2 border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-6 rounded-2xl font-black text-2xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4 ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-purple-700 hover:to-blue-700 text-white'
                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Package className="w-10 h-10" />
                    Upload Car Part
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCarPart;