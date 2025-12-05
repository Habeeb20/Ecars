import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchFilters = ({ variant = 'sidebar', onSearch }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: '',
    year: '',
    bodyType: '',
    keywords: '',
    location: '',
    distance: '',
    vehicleType: '',
    category: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    sellerType: '',
    doors: '',
    engineSize: '',
    colour: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-5000', label: '$0 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-20000', label: '$10,000 - $20,000' },
    { value: '20000-40000', label: '$20,000 - $40,000' },
    { value: '40000-100000', label: '$40,000 - $100,000' },
    { value: '100000-', label: '$100,000+' },
  ];

  const yearRanges = [
    { value: '', label: 'Any Year' },
    { value: '2020-2025', label: '2020 - 2025' },
    { value: '2015-2020', label: '2015 - 2020' },
    { value: '2010-2015', label: '2010 - 2015' },
    { value: '2000-2010', label: '2000 - 2010' },
    { value: '-2000', label: 'Before 2000' },
  ];

  const mileageRanges = [
    { value: '', label: 'Any Mileage' },
    { value: '0-100 ilk', label: '0 - 10,000 miles' },
    { value: '10000-30000', label: '10,000 - 30,000 miles' },
    { value: '30000-60000', label: '30,000 - 60,000 miles' },
    { value: '60000-100000', label: '60,000 - 100,000 miles' },
    { value: '100000-', label: '100,000+ miles' },
  ];

  const fuelTypes = [
    { value: '', label: 'Any Fuel Type' },
    { value: 'Gasoline', label: 'Gasoline' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'N/A', label: 'N/A' },
  ];

  const transmissions = [
    { value: '', label: 'Any Transmission' },
    { value: 'Automatic', label: 'Automatic' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Jet Drive', label: 'Jet Drive' },
    { value: 'Inboard', label: 'Inboard' },
    { value: 'Outboard', label: 'Outboard' },
    { value: 'N/A', label: 'N/A' },
  ];

  const vehicleTypes = [
    { value: '', label: 'Any Vehicle Type' },
    { value: 'motorbike', label: 'Motorbike' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'bus', label: 'Bus' },
    { value: 'rv', label: 'RV' },
    { value: 'boat', label: 'Boat' },
    { value: 'atv', label: 'ATV' },
    { value: 'snowmobile', label: 'Snowmobile' },
    { value: 'jet_ski', label: 'Jet Ski' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${
        variant === 'sidebar' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
      }`}
    >
      {/* Keywords */}
      <div>
        <label htmlFor="keywords-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Keywords
        </label>
        <div className="relative">
          <input
            type="text"
            id="keywords-search"
            name="keywords"
            value={filters.keywords}
            onChange={handleChange}
            placeholder="Search by title, features..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Vehicle Type */}
      <div>
        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vehicle Type
        </label>
        <select
          id="vehicleType"
          name="vehicleType"
          value={filters.vehicleType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {vehicleTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Price Range
        </label>
        <select
          id="priceRange"
          name="priceRange"
          value={filters.priceRange}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {priceRanges.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Year
        </label>
        <select
          id="year"
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {yearRanges.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mileage */}
      <div>
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mileage
        </label>
        <select
          id="mileage"
          name="mileage"
          value={filters.mileage}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {mileageRanges.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fuel Type
        </label>
        <select
          id="fuelType"
          name="fuelType"
          value={filters.fuelType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {fuelTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Transmission
        </label>
        <select
          id="transmission"
          name="transmission"
          value={filters.transmission}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          {transmissions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="City, State, ZIP"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
        />
      </div>

      {/* Make */}
      <div>
        <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Make
        </label>
        <input
          type="text"
          id="make"
          name="make"
          value={filters.make}
          onChange={handleChange}
          placeholder="e.g. Toyota, Harley-Davidson"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
        />
      </div>

      {/* Model */}
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Model
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={filters.model}
          onChange={handleChange}
          placeholder="e.g. Camry, Sportster"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500"
        />
      </div>

      {/* Submit Button */}
      <div className={variant === 'sidebar' ? 'col-span-full' : 'md:col-span-2 lg:col-span-3'}>
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search Vehicles</span>
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;