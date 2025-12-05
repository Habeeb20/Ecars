/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { CarCard } from '../components/car/CarCard';
import SearchFilters from '../components/car/SearchFilters';
import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { mockInventory } from '../data/cars';

const allCars = Object.values(mockInventory).flat();

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'mileage_low', label: 'Mileage: Low to High' },
];

const conditionOptions = [
  { value: 'used', label: 'Used Cars' },
  { value: 'new', label: 'New Cars' },
  { value: 'other', label: 'Others' },
];

const Listings = () => {
  const [cars, setCars] = useState(allCars);
  const [filteredCars, setFilteredCars] = useState(allCars);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [currentFilters, setCurrentFilters] = useState({
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

  useEffect(() => {
    const sortedCars = [...filteredCars];
    switch (sortBy) {
      case 'newest':
        sortedCars.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        sortedCars.sort((a, b) => a.year - b.year);
        break;
      case 'price_low':
        sortedCars.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sortedCars.sort((a, b) => b.price - a.price);
        break;
      case 'mileage_low':
        sortedCars.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        break;
    }
    setCars(sortedCars);
  }, [sortBy, filteredCars]);

  const handleConditionFilter = (condition) => {
    const newCondition = selectedCondition === condition ? '' : condition;
    setSelectedCondition(newCondition);
    setCurrentFilters(prev => ({ ...prev, conditionType: newCondition }));
    handleSearch({ ...currentFilters, conditionType: newCondition });
  };

  const handleSearch = (filters) => {
    setCurrentFilters(filters);
    let results = [...allCars];

    if (filters.conditionType) {
      results = results.filter(car => 
        car.condition.toLowerCase() === filters.conditionType.toLowerCase()
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (min && max) {
        results = results.filter(car => car.price >= min && car.price <= max);
      } else if (min) {
        results = results.filter(car => car.price >= min);
      } else if (max) {
        results = results.filter(car => car.price <= max);
      }
    }

    if (filters.year) {
      const [minYear, maxYear] = filters.year.split('-').map(Number);
      if (minYear && maxYear) {
        results = results.filter(car => car.year >= minYear && car.year <= maxYear);
      } else if (minYear) {
        results = results.filter(car => car.year >= minYear);
      } else if (maxYear) {
        results = results.filter(car => car.year <= maxYear);
      }
    }

    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      results = results.filter(car => 
        car.title.toLowerCase().includes(keywords) || 
        car.location.toLowerCase().includes(keywords) ||
        car.fuelType.toLowerCase().includes(keywords) ||
        car.features.some(feature => feature.toLowerCase().includes(keywords))
      );
    }

    if (filters.location) {
      results = results.filter(car => 
        car.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.fuelType) {
      results = results.filter(car => 
        car.fuelType.toLowerCase() === filters.fuelType.toLowerCase()
      );
    }

    if (filters.mileage) {
      const [minMileage, maxMileage] = filters.mileage.split('-').map(Number);
      if (minMileage && maxMileage) {
        results = results.filter(car => car.mileage >= minMileage && car.mileage <= maxMileage);
      } else if (minMileage) {
        results = results.filter(car => car.mileage >= minMileage);
      } else if (maxMileage) {
        results = results.filter(car => car.mileage <= maxMileage);
      }
    }

    setFilteredCars(results);
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-black text-white mb-4">Browse All Vehicles</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore thousands of verified cars, trucks, SUVs, and more from trusted dealers across Nigeria.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Quick Condition Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {conditionOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleConditionFilter(option.value)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105 ${
                selectedCondition === option.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <SlidersHorizontal className="w-8 h-8 text-blue-600" />
                Advanced Filters
              </h2>
              <SearchFilters variant="sidebar" onSearch={handleSearch} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle + Sort */}
            <div className="lg:hidden flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
              >
                <SlidersHorizontal className="w-6 h-6" />
                Filters {showFilters && '(Open)'}
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-4 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-medium appearance-none focus:border-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="lg:hidden mb-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <SearchFilters variant="sidebar" onSearch={handleSearch} />
              </div>
            )}

            {/* Results Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                <span className="text-4xl text-blue-600">{cars.length}</span> vehicles found
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-6 py-3 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-medium appearance-none focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Car Grid */}
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-16 text-center">
                <Search className="w-24 h-24 text-gray-400 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No vehicles found</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to see more results.
                </p>
                <button
                  onClick={() => {
                    setCurrentFilters({
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
                    setSelectedCondition('');
                    setFilteredCars(allCars);
                    setCars(allCars);
                  }}
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl transition-all transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {cars.length > 0 && (
              <div className="mt-16 flex justify-center">
                <nav className="inline-flex rounded-2xl shadow-2xl overflow-hidden">
                  <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    Previous
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                    1
                  </button>
                  <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    2
                  </button>
                  <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    3
                  </button>
                  <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;