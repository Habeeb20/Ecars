// src/pages/CarSearchPage.jsx
import React, { useState, useEffect } from 'react';

import { 
  Search, 
  Loader2, 
  X, 
  Send, 
  Car 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import CarDetailModal from './CarDetailsModal';
const CarSearchPage = () => {
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
const [showDetailModal, setShowDetailModal] = useState(false);
const [selectedDetailCar, setSelectedDetailCar] = useState(null);
  // Offer form state
  const [offerAmount, setOfferAmount] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);

  const openDetailModal = (car) => {
  setSelectedDetailCar(car);
  setShowDetailModal(true);
};

  const commonMakes = ['Toyota', 'Honda', 'Lexus', 'Mercedes-Benz', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'BMW', 'Audi'];

  const performSearch = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/cars/search?`;

      const params = new URLSearchParams();
      if (searchTerm) params.append('keywords', searchTerm);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (selectedMake) params.append('make', selectedMake);

      const res = await fetch(url + params.toString());
      const data = await res.json();
  setCars(data.data || []);
     console.log(data.data)
    } catch (err) {
      toast.error('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openOfferModal = (car) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error('Please login to make an offer');
      return;
    }
    setSelectedCar(car);
    setOfferAmount('');
    setOfferNote('');
    setPreferredColor('');
    setShowOfferModal(true);
  };

  const sendOffer = async () => {
    if (!offerAmount || !selectedCar) {
      toast.error("Please enter an offer amount");
      return;
    }

    setSendingOffer(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: selectedCar.postedBy,
          content: `I am interested in your ${selectedCar.make} ${selectedCar.model} (${selectedCar.year}). 
                    My offer: ₦${Number(offerAmount).toLocaleString()}\n\nNote: ${offerNote}\nPreferred Color: ${preferredColor || 'Any'}`,
          offerAmount: Number(offerAmount),
          carId: selectedCar._id,
          type: 'offer'
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success("Offer sent successfully! The seller will be notified.");
        setShowOfferModal(false);
      } else {
        toast.error(data.message || "Failed to send offer");
      }
    } catch (err) {
      toast.error("Network error while sending offer");
    } finally {
      setSendingOffer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Dream Car
        </h1>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              onClick={performSearch}
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Min Price (₦)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Max Price (₦)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input"
            />
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="input"
            >
              <option value="">Any Make</option>
              {['Toyota', 'Honda', 'Lexus', 'Mercedes-Benz', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'BMW', 'Audi'].map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            No cars found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-48 bg-slate-100 dark:bg-slate-700 relative">
                  {car.images?.[0] && (
                    <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{car.title || `${car.make} ${car.model}`}</h3>
                  <p className="text-2xl font-semibold text-emerald-600 mb-3">
                    ₦{car.price.toLocaleString()}
                  </p>

                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {car.make} {car.model} • {car.year} • {car.mileage.toLocaleString()} km
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openDetailModal(car)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openOfferModal(car)}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Make Offer Modal */}
      {showOfferModal && selectedCar && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold mb-6">Make an Offer</h2>

            <div className="mb-6">
              <p className="font-medium">For: {selectedCar.make} {selectedCar.model} ({selectedCar.year})</p>
              <p className="text-emerald-600 text-xl font-bold">Asking: ₦{selectedCar.price.toLocaleString()}</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Your Offer (₦)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl"
                  placeholder="Enter your offer amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preferred Color (optional)</label>
                <input
                  type="text"
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl"
                  placeholder="e.g. Black, White, Red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Note to Seller</label>
                <textarea
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl"
                  placeholder="I'm interested in this car. Is the price negotiable?"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={sendOffer}
                disabled={sendingOffer || !offerAmount}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingOffer ? <Loader2 className="animate-spin" /> : 'Send Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CarDetailModal
  car={selectedDetailCar}
  isOpen={showDetailModal}
  onClose={() => setShowDetailModal(false)}
  onMakeOffer={(car) => {
    setShowDetailModal(false);
    // Open your offer modal here
    openOfferModal(car);
  }}
/>
    </div>
  );
};

export default CarSearchPage;


























