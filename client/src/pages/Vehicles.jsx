/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react';

// Lazy load VehicleCard
const VehicleCard = React.lazy(() => import('../components/vehicle/VehicleCard'));

// Import data
import { vehicleInventory } from '../data/vehicles';
import { mockInventory } from '../data/cars';

// Import SearchFilters (no type import needed)
import SearchFilters from '../components/car/SearchFilters';

// Combine all vehicles
const allVehicles = [
  ...Object.values(vehicleInventory).flat(),
  ...Object.values(mockInventory).flat().map(car => ({
    ...car,
    vehicleType: 'car',
    rating: car.rating || 4.5,
    image: car.imageUrl || car.image || 'https://via.placeholder.com/800x600?text=No+Image',
  }))
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'mileage_low', label: 'Mileage: Low to High' },
];

const vehicleTypeOptions = [
  { value: 'car', label: 'Cars' },
  { value: 'motorbike', label: 'Motorbikes' },
  { value: 'truck', label: 'Trucks' },
  { value: 'van', label: 'Vans' },
  { value: 'trailer', label: 'Trailers' },
  { value: 'bus', label: 'Buses' },
  { value: 'rv', label: 'RVs' },
  { value: 'boat', label: 'Boats' },
  { value: 'atv', label: 'ATVs' },
  { value: 'snowmobile', label: 'Snowmobiles' },
  { value: 'jet_ski', label: 'Jet Skis' },
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(allVehicles);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
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
    conditionType: '',
  });

  // Sorting
  useEffect(() => {
    const sorted = [...vehicles];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'mileage_low':
        sorted.sort((a, b) => a.mileage - b.mileage);
        break;
    }
    setVehicles(sorted);
  }, [sortBy]);

  // Search & Filter
  const handleSearch = useCallback((filters) => {
    setCurrentFilters(filters);
    let results = [...allVehicles];

    if (filters.vehicleType) {
      results = results.filter(v => v.vehicleType === filters.vehicleType);
    }
    if (filters.make) {
      results = results.filter(v => v.make.toLowerCase() === filters.make.toLowerCase());
    }
    if (filters.model) {
      results = results.filter(v => v.model.toLowerCase() === filters.model.toLowerCase());
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter(v => (!min || v.price >= min) && (!max || v.price <= max));
    }
    if (filters.year) {
      const [minYear, maxYear] = filters.year.split('-').map(Number);
      results = results.filter(v => (!minYear || v.year >= minYear) && (!maxYear || v.year <= maxYear));
    }
    if (filters.keywords) {
      const kw = filters.keywords.toLowerCase();
      results = results.filter(v =>
        v.title.toLowerCase().includes(kw) ||
        v.location.toLowerCase().includes(kw) ||
        v.features.some(f => f.toLowerCase().includes(kw))
      );
    }
    if (filters.location) {
      results = results.filter(v => v.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.fuelType) {
      results = results.filter(v => v.fuelType.toLowerCase() === filters.fuelType.toLowerCase());
    }
    if (filters.mileage) {
      const [minMileage, maxMileage] = filters.mileage.split('-').map(Number);
      results = results.filter(v => 
        (!minMileage || v.mileage >= minMileage) && (!maxMileage || v.mileage <= maxMileage)
      );
    }

    setVehicles(results);
  }, []);

  const handleVehicleTypeFilter = useCallback((type) => {
    const newType = selectedVehicleType === type ? '' : type;
    setSelectedVehicleType(newType);
    handleSearch({ ...currentFilters, vehicleType: newType });
  }, [selectedVehicleType, currentFilters, handleSearch]);

  const resetFilters = useCallback(() => {
    setCurrentFilters({
      make: '', model: '', priceRange: '', year: '', bodyType: '',
      keywords: '', location: '', distance: '', vehicleType: '',
      category: '', mileage: '', fuelType: '', transmission: '',
      sellerType: '', doors: '', engineSize: '', colour: '', conditionType: ''
    });
    setSelectedVehicleType('');
    setVehicles(allVehicles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            All Vehicles in One Place
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Cars • Motorbikes • Trucks • Boats • RVs • Jet Skis & More
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Quick Vehicle Type Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {vehicleTypeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleVehicleTypeFilter(opt.value)}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 ${
                selectedVehicleType === opt.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Advanced Filters</h2>
              <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />}>
                <SearchFilters variant="sidebar" onSearch={handleSearch} />
              </Suspense>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters + Sort */}
            <div className="lg:hidden flex items-center justify-between mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl transition"
              >
                <SlidersHorizontal className="w-6 h-6" />
                Filters {showFilters && '(Open)'}
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-8 py-4 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-medium appearance-none focus:border-blue-500"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <Suspense fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />}>
                  <SearchFilters variant="sidebar" onSearch={handleSearch} />
                </Suspense>
              </div>
            )}

            {/* Results */}
            <div className="hidden lg:flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                <span className="text-5xl text-blue-600">{vehicles.length}</span> vehicles found
              </h2>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-8 py-4 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-medium appearance-none focus:border-blue-500"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Vehicle Grid */}
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {vehicles.map(vehicle => (
                  <Suspense key={vehicle.id} fallback={<div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />}>
                    <VehicleCard vehicle={vehicle} />
                  </Suspense>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-20 text-center">
                <Search className="w-32 h-32 text-gray-400 mx-auto mb-8" />
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">No vehicles found</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={resetFilters}
                  className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-2xl rounded-2xl shadow-xl transition-all transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {vehicles.length > 0 && (
              <div className="mt-16 flex justify-center">
                <div className="inline-flex rounded-2xl shadow-2xl overflow-hidden">
                  <button className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Previous</button>
                  <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">1</button>
                  <button className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">2</button>
                  <button className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;