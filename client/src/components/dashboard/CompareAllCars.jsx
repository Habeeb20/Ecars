


/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  ChevronDown, 
  Car, 
  DollarSign, 
  Fuel, 
  Settings, 
  Gauge, 
  Zap, 
  Wind, 
  Battery, 
  Star, 
  Plus, 
  X, 
  Calendar, 
  AlertCircle, 
  Send 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

import { MapPin, User } from 'lucide-react';
const CompareCars = () => {
  const { user } = useAuth(); // Get logged-in user
  const [allCars, setAllCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCars, setSelectedCars] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparisonMode, setComparisonMode] = useState('different'); // 'same' or 'different'
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [comparisonMode, selectedModel, selectedBrand, yearFrom, yearTo, searchQuery]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        search: searchQuery,
        mode: comparisonMode,
        ...(selectedModel && { model: selectedModel }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(yearFrom && { yearFrom }),
        ...(yearTo && { yearTo }),
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/allcars?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setAllCars(data.data.cars || []);
        console.log(data?.data?.cars)
      } else {
        toast.error('Failed to load cars');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCar = (car) => {
    if (selectedCars.length >= 4) {
      toast.error('You can compare up to 4 cars');
      return;
    }
    if (selectedCars.some(c => c._id === car._id)) {
      toast.error('This car is already selected');
      return;
    }
    setSelectedCars([...selectedCars, car]);
  };

  const removeSelectedCar = (id) => {
    setSelectedCars(selectedCars.filter(c => c._id !== id));
  };

  const handleCompare = () => {
    if (selectedCars.length < 2) {
      toast.error('Select at least 2 cars to compare');
      return;
    }

    const comparison = {
      cars: selectedCars,
      makes: selectedCars.map(c => c.make),
      models: selectedCars.map(c => c.model),
      years: selectedCars.map(c => c.year),
      prices: selectedCars.map(c => c.price),
      mileages: selectedCars.map(c => c.mileage),
      fuelTypes: selectedCars.map(c => c.fuelType || 'N/A'),
      transmissions: selectedCars.map(c => c.transmission || 'N/A'),
      engineSizes: selectedCars.map(c => c.engineSize || 'N/A'),
      horsepowers: selectedCars.map(c => c.horsepower || 'N/A'),
      torques: selectedCars.map(c => c.torque || 'N/A'),
      fuelEconomies: selectedCars.map(c => c.fuelEconomy || 'N/A'),
      safetyRatings: selectedCars.map(c => c.safetyRating || 'N/A'),
      features: selectedCars.map(c => c.features || []),
      images: selectedCars.map(c => c.images?.[0] || '/placeholder-car.jpg'),
      dealers: selectedCars.map(c => c.dealer || c.seller), // Assuming dealer/seller field
    };

    setComparisonData(comparison);
  };
const handleSendOffer = async () => {
  if (!user) {
    toast.error('You must be logged in to send an offer');
    return;
  }
  if (!offerPrice || parseFloat(offerPrice) <= 0) {
    toast.error('Enter a valid offer price');
    return;
  }
  if (sendingOffer) return;

  setSendingOffer(true);
  try {
    const token = localStorage.getItem('token');

    // Get unique dealer IDs from the selected cars
    const dealerIds = [...new Set(
      selectedCars.map(car => car.postedBy?._id || car.seller?._id).filter(Boolean)
    )];

    if (dealerIds.length === 0) {
      toast.error('No dealer found for selected cars');
      setSendingOffer(false);
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        carIds: selectedCars.map(c => c._id),
        dealerIds, // ← Now guaranteed to have valid IDs
        offerPrice: parseFloat(offerPrice),
        userId: user._id,
      }),
    });

    const data = await res.json();
    if (data.status === 'success') {
      toast.success('Offer sent to dealers! They can now chat with you.');
      setOfferPrice('');
    } else {
      toast.error(data.message || 'Failed to send offer');
    }
  } catch (err) {
    toast.error('Network error');
  } finally {
    setSendingOffer(false);
  }
};
  const filteredCars = allCars.filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.year?.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Compare Cars
          </h1>

          {selectedCars.length >= 2 && (
            <button
              onClick={handleCompare}
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <Car className="h-5 w-5" />
              Compare {selectedCars.length} Cars
            </button>
          )}
        </div>

        {/* Comparison Mode Selection */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Select Comparison Mode
          </h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setComparisonMode('different')}
              className={`flex-1 py-3 rounded-xl font-semibold ${
                comparisonMode === 'different'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Different Models/Brands
            </button>
            <button
              onClick={() => setComparisonMode('same')}
              className={`flex-1 py-3 rounded-xl font-semibold ${
                comparisonMode === 'same'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Same Model/Brand
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {comparisonMode === 'same' && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    placeholder="Brand (e.g. Toyota)"
                    className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="Model (e.g. Camry)"
                    className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
            <div className="relative flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="From Year (e.g. 2018)"
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="To Year (e.g. 2023)"
                className="w-full h-12 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, or year..."
            className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Selected Cars */}
        {selectedCars.length > 0 && (
          <div className="mb-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Selected Cars ({selectedCars.length}/4)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {selectedCars.map(car => (
                <div key={car._id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 relative">
                  <button
                    onClick={() => removeSelectedCar(car._id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {car.make} {car.model}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {car.year} • ₦{car.price?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Car Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No cars found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different search terms or adjust filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <div 
                key={car._id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <img 
                  src={car.images?.[0] || '/placeholder-car.jpg'} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {car.year} • ₦{car.price?.toLocaleString() || 'N/A'}
                  </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
  <MapPin className="h-4 w-4" />
  {car.location && typeof car.location === 'object'
    ? `${car.location.state || ''}${car.location.lga ? ', ' + car.location.lga : ''}`.trim() || 'Location not specified'
    : car.location || 'Location not specified'}
</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dealer: {car.dealer?.businessName || 'N/A'}
                    {car.dealer?.verified && <ShieldCheck className="h-4 w-4 text-green-500 ml-1" />}
                  </p>
                  <button
                    onClick={() => handleSelectCar(car)}
                    disabled={selectedCars.some(c => c._id === car._id)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50 hover:shadow-lg transform hover:scale-105 transition-all disabled:cursor-not-allowed"
                  >
                    {selectedCars.some(c => c._id === car._id) ? 'Selected' : 'Add to Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {comparisonData && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-x-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Comparison Results
              </h2>
              <table className="w-full min-w-max table-auto text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Feature</th>
                    {comparisonData.cars.map((car, i) => (
                      <th key={i} scope="col" className="px-6 py-3">
                        <div className="flex flex-col items-center">
                          <img src={comparisonData.images[i]} alt={car.model} className="w-32 h-20 object-cover rounded-md mb-2" />
                          {car.make} {car.model} ({car.year})
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-600 dark:text-gray-400">
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <DollarSign className="h-4 w-4" /> Price
                                 </td>
                                 {comparisonData.prices.map((price, i) => (
                                   <td key={i} className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                                     ₦{price?.toLocaleString() || 'N/A'}
                                   </td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Car className="h-4 w-4" /> Year
                                 </td>
                                 {comparisonData.years.map((year, i) => (
                                   <td key={i} className="px-6 py-4">{year}</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Gauge className="h-4 w-4" /> Mileage
                                 </td>
                                 {comparisonData.mileages.map((mileage, i) => (
                                   <td key={i} className="px-6 py-4">{mileage?.toLocaleString()} km</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Fuel className="h-4 w-4" /> Fuel Type
                                 </td>
                                 {comparisonData.fuelTypes.map((type, i) => (
                                   <td key={i} className="px-6 py-4 capitalize">{type}</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Settings className="h-4 w-4" /> Transmission
                                 </td>
                                 {comparisonData.transmissions.map((trans, i) => (
                                   <td key={i} className="px-6 py-4 capitalize">{trans}</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Zap className="h-4 w-4" /> Horsepower
                                 </td>
                                 {comparisonData.horsepowers.map((hp, i) => (
                                   <td key={i} className="px-6 py-4">{hp} hp</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Wind className="h-4 w-4" /> Torque
                                 </td>
                                 {comparisonData.torques.map((tq, i) => (
                                   <td key={i} className="px-6 py-4">{tq} Nm</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Battery className="h-4 w-4" /> Engine Size
                                 </td>
                                 {comparisonData.engineSizes.map((size, i) => (
                                   <td key={i} className="px-6 py-4">{size} L</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Star className="h-4 w-4" /> Safety Rating
                                 </td>
                                 {comparisonData.safetyRatings.map((rating, i) => (
                                   <td key={i} className="px-6 py-4">{rating}/5</td>
                                 ))}
                               </tr>
                               <tr>
                                 <td className="px-6 py-4 font-medium flex items-center gap-2">
                                   <Plus className="h-4 w-4" /> Features
                                 </td>
                                 {comparisonData.features.map((feats, i) => (
                                   <td key={i} className="px-6 py-4">{feats.length} features</td>
                                 ))}
                               </tr>
                             </tbody>
              </table>

              {/* Offer Price Section (only if logged in) */}
              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#09a353]" />
                  Make an Offer to All Dealers
                </h3>
                {user ? (
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter your offer price (₦)"
                      className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#09a353]"
                    />
                    <button
                      onClick={handleSendOffer}
                      disabled={sendingOffer || !offerPrice}
                      className="px-6 py-3 bg-[#09a353] text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      {sendingOffer ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      Send Offer
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
                    <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-red-600">Please log in to make an offer</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareCars;