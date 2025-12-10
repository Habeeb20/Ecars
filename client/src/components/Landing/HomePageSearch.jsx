/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, X, MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const makeOptions = [
  { value: '', label: 'All Makes' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'ford', label: 'Ford' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
  { value: 'lexus', label: 'Lexus' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'tesla', label: 'Tesla' },
  { value: 'subaru', label: 'Subaru' },
  { value: 'jeep', label: 'Jeep' },
  { value: 'kia', label: 'Kia' },
  { value: 'hyundai', label: 'Hyundai' },
];

const modelOptions = {
  toyota: [
    { value: '', label: 'All Models' },
    { value: 'camry', label: 'Camry' },
    { value: 'corolla', label: 'Corolla' },
    { value: 'rav4', label: 'RAV4' },
  ],
  honda: [
    { value: '', label: 'All Models' },
    { value: 'civic', label: 'Civic' },
    { value: 'accord', label: 'Accord' },
    { value: 'crv', label: 'CR-V' },
  ],
  ford: [
    { value: '', label: 'All Models' },
    { value: 'f150', label: 'F-150' },
    { value: 'mustang', label: 'Mustang' },
    { value: 'escape', label: 'Escape' },
  ],
  bmw: [
    { value: '', label: 'All Models' },
    { value: '3series', label: '3 Series' },
    { value: '5series', label: '5 Series' },
    { value: 'x5', label: 'X5' },
  ],
  mercedes: [
    { value: '', label: 'All Models' },
    { value: 'cclass', label: 'C-Class' },
    { value: 'eclass', label: 'E-Class' },
    { value: 'gle', label: 'GLE' },
  ],
  audi: [
    { value: '', label: 'All Models' },
    { value: 'a4', label: 'A4' },
    { value: 'q5', label: 'Q5' },
    { value: 'etron', label: 'e-tron GT' },
  ],
  lexus: [
    { value: '', label: 'All Models' },
    { value: 'rx', label: 'RX' },
    { value: 'es', label: 'ES' },
    { value: 'nx', label: 'NX' },
  ],
  nissan: [
    { value: '', label: 'All Models' },
    { value: 'altima', label: 'Altima' },
    { value: 'rogue', label: 'Rogue' },
    { value: 'sentra', label: 'Sentra' },
  ],
  tesla: [
    { value: '', label: 'All Models' },
    { value: 'model3', label: 'Model 3' },
  ],
  subaru: [
    { value: '', label: 'All Models' },
    { value: 'outback', label: 'Outback' },
  ],
  jeep: [
    { value: '', label: 'All Models' },
    { value: 'grandcherokee', label: 'Grand Cherokee' },
  ],
  kia: [
    { value: '', label: 'All Models' },
    { value: 'telluride', label: 'Telluride' },
  ],
  hyundai: [
    { value: '', label: 'All Models' },
    { value: 'palisade', label: 'Palisade' },
  ],
  '': [{ value: '', label: 'All Models' }],
};

const priceRangeOptions = [
  { value: '', label: 'Any Price' },
  { value: '0-500000', label: 'Under ₦500,000' },
  { value: '500000-1000000', label: 'Under ₦1,000,000' },
  { value: '1000000-2000000', label: '₦1,000,000 - ₦2,000,000' },
  { value: '2000000-3000000', label: '₦2,000,000 - ₦3,000,000' },
  { value: '3000000-5000000', label: '₦3,000,000 - ₦5,000,000' },
  { value: '5000000-', label: 'Over ₦5,000,000' },
];

const conditionType = [
  { value: '', label: 'Any Condition' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'certified', label: 'Certified Pre-Owned' },
];

const yearOptions = [
  { value: '', label: 'Any Year' },
  { value: '2022-2024', label: '2022 - 2024' },
  { value: '2018-2021', label: '2018 - 2021' },
  { value: '2014-2017', label: '2014 - 2017' },
  { value: '2010-2013', label: '2010 - 2013' },
  { value: '2000-2009', label: '2000 - 2009' },
  { value: '-1999', label: 'Before 2000' },
];

const bodyTypeOptions = [
  { value: '', label: 'All Body Types' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'saloon', label: 'Saloon' },
  { value: 'estate', label: 'Estate' },
  { value: 'mpv', label: 'MPV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'suv', label: 'SUV' },
  { value: 'pickup', label: 'Pickup' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'cars', label: 'Cars' },
  { value: 'private_owner', label: 'Private Owner' },
];

const distanceOptions = [
  { value: '', label: 'Any Distance' },
  { value: '5', label: 'Within 5km' },
  { value: '10', label: 'Within 10km' },
  { value: '25', label: 'Within 25km' },
  { value: '50', label: 'Within 50km' },
  { value: '100', label: 'Within 100km' },
];

const mileageOptions = [
  { value: '', label: 'Any Mileage' },
  { value: '0-10000', label: 'Under 10,000 km' },
  { value: '10000-50000', label: '10,000 - 50,000 km' },
  { value: '50000-100000', label: '50,000 - 100,000 km' },
  { value: '100000-200000', label: '100,000 - 200,000 km' },
  { value: '200000-', label: 'Over 200,000 km' },
];

const fuelTypeOptions = [
  { value: '', label: 'Any Fuel Type' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

const transmissionOptions = [
  { value: '', label: 'Any Transmission' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

const sellerTypeOptions = [
  { value: '', label: 'Any Seller' },
  { value: 'private', label: 'Private Seller' },
  { value: 'dealer', label: 'Dealer' },
];

const doorsOptions = [
  { value: '', label: 'Any Doors' },
  { value: '2', label: '2 Doors' },
  { value: '3', label: '3 Doors' },
  { value: '4', label: '4 Doors' },
  { value: '5', label: '5 Doors' },
];

const engineSizeOptions = [
  { value: '', label: 'Any Engine Size' },
  { value: '0-1.5', label: 'Under 1.5L' },
  { value: '1.5-2.0', label: '1.5L - 2.0L' },
  { value: '2.0-3.0', label: '2.0L - 3.0L' },
  { value: '3.0-', label: 'Over 3.0L' },
];

const colourOptions = [
  { value: '', label: 'Any Colour' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'silver', label: 'Silver' },
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
  { value: 'grey', label: 'Grey' },
];

const vehicleOptions = [
  { value: '', label: 'Any Vehicle Type' },
  { value: 'car', label: 'Car' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus' },
];

function SearchFilters({ variant = 'hero', className = '', onSearch = () => {} }) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: '',
    year: '',
    bodyType: '',
    keywords: '',
    location: '',
    distance: '',
    conditionType: '',
    category: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    sellerType: '',
    doors: '',
    engineSize: '',
    colour: '',
    vehicleType: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset model when make changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, model: '' }));
  }, [filters.make]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);

    try {
      const query = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) query.append(key, filters[key]);
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/search?${query.toString()}`);
      const data = await res.json();

      if (data.status === 'success') {
        setSearchResults(data.data.cars || []);
      } else {
        toast.error('No cars found');
        setSearchResults([]);
      }
    } catch (err) {
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      make: '',
      model: '',
      priceRange: '',
      year: '',
      bodyType: '',
      keywords: '',
      location: '',
      distance: '',
      conditionType: '',
      category: '',
      mileage: '',
      fuelType: '',
      transmission: '',
      sellerType: '',
      doors: '',
      engineSize: '',
      colour: '',
      vehicleType: '',
    };
    setFilters(emptyFilters);
    setSearchResults([]);
    onSearch(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  const openChat = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to chat');
      window.location.href = '/login';
      return;
    }
    setShowChatModal(true);
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return toast.error('Message cannot be empty');

    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedCar.postedBy._id,
          message: chatMessage,
          carId: selectedCar._id,
        }),
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        setChatMessage('');
        setShowChatModal(false);
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setChatLoading(false);
    }
  };

  // ─── Hero Variant ───
  if (variant === 'hero') {
    return (
      <div className={`rounded-2xl shadow-xl dark:border-gray-700/50 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Find Your Perfect Car
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Vehicle Type */}
            <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Type
              </label>
              <div className="relative">
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={filters.vehicleType}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {vehicleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Make */}
            <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Make
              </label>
              <div className="relative">
                <select
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {makeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <div className="relative">
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Year */}
            <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Body Type */}
            <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Body Type
              </label>
              <div className="relative">
                <select
                  id="bodyType"
                  name="bodyType"
                  value={filters.bodyType}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
                >
                  {bodyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex-1 min-w-[180px] w-full">
              <button
                type="submit"
                className="w-full h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {searching && (
          <div className="mt-8 text-center">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin mx-auto" />
          </div>
        )}

        {searchResults?.length === 0 && !searching && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No cars found matching your search</p>
          </div>
        )}

        {searchResults?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((car) => (
              <div
                key={car._id}
                onClick={() => setSelectedCar(car)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={car.images?.[0] || '/placeholder-car.jpg'}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ₦{car.price?.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {car.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {car.year} • {car.mileage?.toLocaleString()} km
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Sidebar Variant ───
  return (
    <div className={`rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Keywords */}
        <div className="space-y-2">
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            placeholder="Search by keywords..."
            value={filters.keywords}
            onChange={handleChange}
            className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
          />
        </div>

        {/* Make */}
        <div className="space-y-2">
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Make
          </label>
          <div className="relative">
            <select
              id="make"
              name="make"
              value={filters.make}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
            >
              {makeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Model
          </label>
          <div className="relative">
            <select
              id="model"
              name="model"
              value={filters.model}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
            >
              {(modelOptions[filters.make] || modelOptions['']).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range
          </label>
          <div className="relative">
            <select
              id="priceRange"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
            >
              {priceRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Year
          </label>
          <div className="relative">
            <select
              id="year"
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Body Type */}
        <div className="space-y-2">
          <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Body Type
          </label>
          <div className="relative">
            <select
              id="bodyType"
              name="bodyType"
              value={filters.bodyType}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:border-gray-400 dark:hover:border-gray-500"
            >
              {bodyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}

export default SearchFilters;