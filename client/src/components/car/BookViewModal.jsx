import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const BookViewingModal = ({ car, isOpen, onClose, token }) => {
  const [form, setForm] = useState({
    preferredDate: '',
    preferredTime: '',
    message: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.preferredDate || !form.preferredTime) {
      toast.error("Please select date and time");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/car-viewings/book-viewing`,
        {
          carId: car._id,
          ...form
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Viewing request sent successfully! The dealer will contact you soon.");
      onClose();
      setForm({ preferredDate: '', preferredTime: '', message: '', phoneNumber: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book a Viewing</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule a test drive</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-6 custom-scrollbar">
          {/* Car Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{car.title}</h3>
            <p className="text-green-600 dark:text-green-500 font-medium mt-1">
              ₦{car.price?.toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="080xxxxxxxx"
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message to Dealer <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows="4"
                placeholder="I'm very interested in this car. Please let me know if this time works..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                       text-white font-semibold rounded-2xl transition-all duration-200 
                       flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Send Viewing Request"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BookViewingModal;