import { useState } from 'react';
import { Search, Star, MapPin, Tag, DollarSign, Package } from 'lucide-react';
import { CarPart, mockCarParts, formatPrice, filterParts } from '../data/carParts';



const CarParts = () => {
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    condition: '',
    priceRange: '',
    location: '',
  });

  const categories = [
    'Engine Parts',
    'Transmission',
    'Brakes',
    'Suspension',
    'Body Parts',
    'Interior',
    'Electrical',
    'Wheels & Tires',
  ];

  const conditions = [
    'New',
    'Used - Like New',
    'Used - Good',
    'Used - Fair',
    'Remanufactured',
  ];

  const priceRanges = [
    { label: 'Under ₦100,000', value: '0-100000' },
    { label: '₦100,000 - ₦500,000', value: '100000-500000' },
    { label: '₦500,000 - ₦1,000,000', value: '500000-1000000' },
    { label: '₦1,000,000 - ₦5,000,000', value: '1000000-5000000' },
    { label: 'Over ₦5,000,000', value: '5000000-' },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredParts = filterParts(mockCarParts, filters);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Car Parts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse our wide selection of car parts for all makes and models in Nigeria.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Brand */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brand
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Search brands..."
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="">Any Condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition.toLowerCase()}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="">Any Price</option>
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-6">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter location..."
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Parts Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search terms to find the right parts.
              </p>
            </div>
          ) : (
            filteredParts.map((part) => (
              <div
                key={part.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={part.imageUrl}
                  alt={part.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      {part.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {part.condition}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {part.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {part.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(part.price)}
                    </div>
                    <div className="flex items-center">
                      {renderStars(part.seller.rating)}
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                        ({part.seller.rating})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {part.location}
                  </div>
                  <button
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarParts;