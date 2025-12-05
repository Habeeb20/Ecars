import React, { useState, useEffect } from 'react';
import { Car, DollarSign, FileText, Image as ImageIcon, Calendar, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const SellCar = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Show toast if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to sell your car', {
        duration: 5000,
        position: 'top-center',
        icon: 'Warning',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter(file => 
      ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type) &&
      file.size <= 10 * 1024 * 1024 // 10MB
    );

    if (validFiles.length < selectedFiles.length) {
      toast.error('Some files were skipped. Only JPG, PNG, GIF up to 10MB allowed.');
    }

    const remainingSlots = 5 - files.length;
    const newFiles = validFiles.slice(0, remainingSlots);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to list your car');
      return;
    }

    const { make, model, year, price, description } = formData;
    if (!make || !model || !year || !price || !description || files.length === 0) {
      toast.error('Please fill all fields and upload at least one photo');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Your car has been listed successfully! 🚗', {
        duration: 6000,
        icon: 'Success',
      });

      // Reset form
      setFormData({ make: '', model: '', year: '', price: '', description: '' });
      setFiles([]);
      previews.forEach(URL.revokeObjectURL);
      setPreviews([]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-6 shadow-2xl"
          >
            <Car className="w-20 h-20 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
            Sell Your Car Fast & Easy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            List your vehicle in minutes. Reach thousands of buyers across Nigeria.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">List Your Vehicle</h2>
            <p className="mt-2 opacity-90">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
            {/* Make */}
            <div className="relative">
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Car className="inline w-6 h-6 mr-2 text-blue-600" />
                Make
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                placeholder="e.g. Toyota, Mercedes-Benz"
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                required
              />
            </div>

            {/* Model */}
            <div className="relative">
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <Car className="inline w-6 h-6 mr-2 text-blue-600" />
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g. Camry, C300, Land Cruiser"
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                required
              />
            </div>

            {/* Year & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Calendar className="inline w-6 h-6 mr-2 text-blue-600" />
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  placeholder="2023"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <DollarSign className="inline w-6 h-6 mr-2 text-green-600" />
                  Asking Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="100000"
                  placeholder="15,000,000"
                  className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                <FileText className="inline w-6 h-6 mr-2 text-blue-600" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                placeholder="Tell buyers about your car: condition, service history, upgrades, reason for selling..."
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all resize-none"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                <ImageIcon className="inline w-6 h-6 mr-2 text-blue-600" />
                Upload Photos (up to 5)
              </label>

              {previews.length === 0 ? (
                <label className="block">
                  <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-16 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all">
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
                    accept="image/png,image/jpeg,image/jpg,image/gif"
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
                        onClick={() => removeFile(index)}
                        className="absolute top-3 right-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {files.length < 5 && (
                    <label className="flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-48 cursor-pointer hover:border-blue-500 transition-all">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
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
                disabled={isLoading || !user}
                className={`w-full py-6 rounded-2xl font-black text-2xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4 ${
                  isLoading || !user
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin" />
                    Listing Your Car...
                  </>
                ) : (
                  <>
                    <Car className="w-10 h-10" />
                    List My Car Now
                  </>
                )}
              </button>

              {!user && (
                <p className="text-center mt-6 text-red-600 dark:text-red-400 font-medium">
                  Please log in to sell your car
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-green-500" />
              <span className="font-semibold">Secure Platform</span>
            </div>
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-10 h-10 text-blue-500" />
              <span className="font-semibold">Verified Buyers</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-10 h-10 text-green-600" />
              <span className="font-semibold">Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCar;