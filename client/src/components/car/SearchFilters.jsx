























import React, { useState } from 'react';
import { Search, ChevronDown, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const makeOptions = [
  { value: '', label: ' Makes' },
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

 

const yearOptions = [
  { value: '', label: 'Any Year' },
  { value: '2022-2024', label: '2022 - 2024' },
  { value: '2018-2021', label: '2018 - 2021' },
  { value: '2014-2017', label: '2014 - 2017' },
  { value: '2010-2013', label: '2010 - 2013' },
  { value: '2000-2009', label: '2000 - 2009' },
  { value: '-1999', label: 'Before 2000' },
];

const vehicleOptions = [
  { value: '', label: 'Vehicle Type' },
  { value: 'car', label: 'Car' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus' },
];
const conditionType= [
  { value: '', label: 'condition' },
  { value: 'brand new', label: 'brand new' },
  { value: 'foreign used', label: 'foreign used' },
  { value: 'nigerian used', label: 'nigerian used' },

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

// Very simple car card (replace later with your beautiful CarCard component)
const SimpleCarCard = ({ car }) => (
  <div className="border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-bold text-lg">
      {car.make} {car.model || ''}
    </h3>
    <p className="text-xl font-semibold text-green-600 mt-1">
      ₦{car.price ? Number(car.price).toLocaleString() : '—'}
    </p>
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap gap-x-4">
      <span>{car.year || '—'}</span>
      <span>{car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—'}</span>
      <span>{car.fuelType || '—'}</span>
    </div>
  </div>
);

function SearchFilters({ variant = 'hero', className = '' }) {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    priceRange: '',
    year: '',
    bodyType: '',
    condition:'',
    // you can add more fields here later
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset model when make changes
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, model: '' }));
  }, [filters.make]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const params = new URLSearchParams();

      // Only add parameters that have values
      if (filters.make) params.append('make', filters.make);
      if (filters.model) params.append('model', filters.model);
      if (filters.priceRange) params.append('priceRange', filters.priceRange);
      if (filters.year) params.append('yearRange', filters.year);
      if (filters.bodyType) params.append('bodyType', filters.bodyType);
      if (filters.condition) params.append('condition', filters.condition);

      const queryString = params.toString();
      const url = `${import.meta.env.VITE_BACKEND_URL}/cars/allcars${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('Fetching:', url); // ← for debugging

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Uncomment if your endpoint requires authentication
          // Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // Adjust this line depending on your API response structure
      const cars = data.cars || data.data || data.results || data || [];
console.log(cars.cars)
      setSearchResults(cars.cars);
      setIsModalOpen(true);

      if (cars.length === 0) {
        toast.info('No cars found matching your criteria');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load cars. Please try again.');
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      priceRange: '',
      year: '',
      bodyType: '',
      condition:''
    });
  };

  return (
    <>
      {/* Filter Form */}
      <div className={`rounded-2xl shadow-xl p-6 ${className}`}>
        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Find Your Perfect Car
            </h3>
          </div>

          {Object.values(filters).some((v) => v !== '') && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div> */}

        <form onSubmit={handleSubmit}>
          {/* Mobile layout */}
          <div className=" hidden  grid grid-cols-4 gap-4 items-end">
            {/* Vehicle Type */}
            <div className="flex-1 min-w-[100px] w-full">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-black dark:text-white mb-1">
                Vehicle Type
              </label>
              <div className="relative">
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={filters.vehicleType}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {vehicleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Make */}
            <div className="flex-1 min-w-[100px] w-full">
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Make
              </label>
              <div className="relative">
                <select
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {makeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            {/* <div className="flex-1 min-w-[100px] w-full">
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <div className="relative">
                <select
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div> */}

            {/* Year */}
            <div className="flex-1 min-w-[100px] w-full">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Body Type - centered */}
             {/* <div className="col-span-2 flex justify-center">
              <div className="w-full max-w-md">
                <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Body Type
                </label>
                <div className="relative">
                  <select
                    id="bodyType"
                    name="bodyType"
                    value={filters.bodyType}
                    onChange={handleChange}
                    className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                  >
                    {bodyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>  */}
            {/* Condition- centered */}
             <div className="col-span-2 flex justify-center">
              <div className="w-full max-w-md">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condition
                </label>
                <div className="relative">
                  <select
                    id="condition"
                    name="condition"
                    value={filters.condition}
                    onChange={handleChange}
                    className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                  >
                    {conditionType.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div> 

            {/* Search Button - centered */}
            <div className="col-span-2 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 ${
                    loading ? 'cursor-not-allowed' : 'hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-row gap-4 items-end">
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
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {vehicleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {makeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Year */}
            {/* <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div> */}

            {/* Body Type */}
            {/* <div className="flex-1 min-w-[180px] w-full">
              <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Body Type
              </label>
              <div className="relative">
                <select
                  id="bodyType"
                  name="bodyType"
                  value={filters.bodyType}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                >
                  {bodyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div> */}

                {/* Condition- centered */}
             <div className=" flex justify-center">
              <div className="w-full ">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condition
                </label>
                <div className="relative">
                  <select
                    id="condition"
                    name="condition"
                    value={filters.condition}
                    onChange={handleChange}
                    className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
                  >
                    {conditionType.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div> 

            {/* Search Button */}
            <div className="flex-1 min-w-[180px] w-full">
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 ${
                  loading ? 'cursor-not-allowed' : 'hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ──────────────────────────────────────── */}
      {/*               RESULTS MODAL              */}
      {/* ──────────────────────────────────────── */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {searchResults.length} {searchResults.length === 1 ? 'car' : 'cars'} found
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Loading results...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-600 dark:text-red-400">
                  <p className="text-xl font-medium">{error}</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                    No cars match your search
                  </p>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults?.map((car) => (
                    <SimpleCarCard key={car._id || Math.random()} car={car} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchFilters;



































































































































// import React, { useState } from 'react';
// import { Search, ChevronDown, X, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';



// const makeOptions = [
//   { value: '', label: 'All Makes' },
//   { value: 'toyota', label: 'Toyota' },
//   { value: 'honda', label: 'Honda' },
//   { value: 'ford', label: 'Ford' },
//   { value: 'bmw', label: 'BMW' },
//   { value: 'mercedes', label: 'Mercedes-Benz' },
//   { value: 'audi', label: 'Audi' },
//   { value: 'lexus', label: 'Lexus' },
//   { value: 'nissan', label: 'Nissan' },
//   { value: 'tesla', label: 'Tesla' },
//   { value: 'subaru', label: 'Subaru' },
//   { value: 'jeep', label: 'Jeep' },
//   { value: 'kia', label: 'Kia' },
//   { value: 'hyundai', label: 'Hyundai' },
// ];

// const modelOptions = {
//   toyota: [
//     { value: '', label: 'All Models' },
//     { value: 'camry', label: 'Camry' },
//     { value: 'corolla', label: 'Corolla' },
//     { value: 'rav4', label: 'RAV4' },
//   ],
//   honda: [
//     { value: '', label: 'All Models' },
//     { value: 'civic', label: 'Civic' },
//     { value: 'accord', label: 'Accord' },
//     { value: 'crv', label: 'CR-V' },
//   ],
//   ford: [
//     { value: '', label: 'All Models' },
//     { value: 'f150', label: 'F-150' },
//     { value: 'mustang', label: 'Mustang' },
//     { value: 'escape', label: 'Escape' },
//   ],
//   bmw: [
//     { value: '', label: 'All Models' },
//     { value: '3series', label: '3 Series' },
//     { value: '5series', label: '5 Series' },
//     { value: 'x5', label: 'X5' },
//   ],
//   mercedes: [
//     { value: '', label: 'All Models' },
//     { value: 'cclass', label: 'C-Class' },
//     { value: 'eclass', label: 'E-Class' },
//     { value: 'gle', label: 'GLE' },
//   ],
//   audi: [
//     { value: '', label: 'All Models' },
//     { value: 'a4', label: 'A4' },
//     { value: 'q5', label: 'Q5' },
//     { value: 'etron', label: 'e-tron GT' },
//   ],
//   lexus: [
//     { value: '', label: 'All Models' },
//     { value: 'rx', label: 'RX' },
//     { value: 'es', label: 'ES' },
//     { value: 'nx', label: 'NX' },
//   ],
//   nissan: [
//     { value: '', label: 'All Models' },
//     { value: 'altima', label: 'Altima' },
//     { value: 'rogue', label: 'Rogue' },
//     { value: 'sentra', label: 'Sentra' },
//   ],
//   tesla: [
//     { value: '', label: 'All Models' },
//     { value: 'model3', label: 'Model 3' },
//   ],
//   subaru: [
//     { value: '', label: 'All Models' },
//     { value: 'outback', label: 'Outback' },
//   ],
//   jeep: [
//     { value: '', label: 'All Models' },
//     { value: 'grandcherokee', label: 'Grand Cherokee' },
//   ],
//   kia: [
//     { value: '', label: 'All Models' },
//     { value: 'telluride', label: 'Telluride' },
//   ],
//   hyundai: [
//     { value: '', label: 'All Models' },
//     { value: 'palisade', label: 'Palisade' },
//   ],
//   '': [{ value: '', label: 'All Models' }],
// };

// const priceRangeOptions = [
//   { value: '', label: 'Any Price' },
//   { value: '0-500000', label: 'Under ₦500,000' },
//   { value: '500000-1000000', label: 'Under ₦1,000,000' },
//   { value: '1000000-2000000', label: '₦1,000,000 - ₦2,000,000' },
//   { value: '2000000-3000000', label: '₦2,000,000 - ₦3,000,000' },
//   { value: '3000000-5000000', label: '₦3,000,000 - ₦5,000,000' },
//   { value: '5000000-', label: 'Over ₦5,000,000' },
// ];

 

// const yearOptions = [
//   { value: '', label: 'Any Year' },
//   { value: '2022-2024', label: '2022 - 2024' },
//   { value: '2018-2021', label: '2018 - 2021' },
//   { value: '2014-2017', label: '2014 - 2017' },
//   { value: '2010-2013', label: '2010 - 2013' },
//   { value: '2000-2009', label: '2000 - 2009' },
//   { value: '-1999', label: 'Before 2000' },
// ];

// const vehicleOptions = [
//   { value: '', label: 'Vehicle Type' },
//   { value: 'car', label: 'Car' },
//   { value: 'motorcycle', label: 'Motorcycle' },
//   { value: 'truck', label: 'Truck' },
//   { value: 'bus', label: 'Bus' },
// ];


// const bodyTypeOptions = [
//   { value: '', label: 'All Body Types' },
//   { value: 'hatchback', label: 'Hatchback' },
//   { value: 'saloon', label: 'Saloon' },
//   { value: 'estate', label: 'Estate' },
//   { value: 'mpv', label: 'MPV' },
//   { value: 'coupe', label: 'Coupe' },
//   { value: 'convertible', label: 'Convertible' },
//   { value: 'suv', label: 'SUV' },
//   { value: 'pickup', label: 'Pickup' },
// ];

// // Very simple car card (replace later with your beautiful CarCard component)
// const SimpleCarCard = ({ car }) => (
//   <div className="border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
//     <h3 className="font-bold text-lg">
//       {car.make} {car.model || ''}
//     </h3>
//     <p className="text-xl font-semibold text-green-600 mt-1">
//       ₦{car.price ? Number(car.price).toLocaleString() : '—'}
//     </p>
//     <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap gap-x-4">
//       <span>{car.year || '—'}</span>
//       <span>{car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—'}</span>
//       <span>{car.fuelType || '—'}</span>
//     </div>
//   </div>
// );
// function SearchFilters({ variant = 'hero', className = '' }) {
//   const [filters, setFilters] = useState({
//     make: '',
//     model: '',
//     priceRange: '',
//     year: '',
//     bodyType: '',
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));

//     // Reset model when make changes
//     if (name === 'make') {
//       setFilters((prev) => ({ ...prev, model: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSearchResults([]);

//     try {
//       const params = new URLSearchParams();

//       if (filters.make) params.append('make', filters.make);
//       if (filters.model) params.append('model', filters.model);
//       if (filters.priceRange) params.append('priceRange', filters.priceRange);
//       if (filters.year) params.append('yearRange', filters.year);
//       if (filters.bodyType) params.append('bodyType', filters.bodyType);

//       const queryString = params.toString();
//       const url = `${import.meta.env.VITE_BACKEND_URL}/cars/allcars${queryString ? `?${queryString}` : ''}`;

//       const response = await fetch(url, { method: 'GET' });

//       if (!response.ok) throw new Error(`Server error: ${response.status}`);

//       const data = await response.json();
//       const cars = data.cars || data.data || data.results || data || [];

//       setSearchResults(cars);
//       setIsModalOpen(true);

//       if (cars.length === 0) {
//         toast.info('No cars found matching your criteria');
//       }
//     } catch (err) {
//       console.error('Search failed:', err);
//       setError('Failed to load cars. Please try again.');
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       make: '',
//       model: '',
//       priceRange: '',
//       year: '',
//       bodyType: '',
//     });
//   };

//   return (
//     <>
//       <div className={`rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-900 ${className}`}>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Find Your Perfect Car
//             </h3>
//             {Object.values(filters).some((v) => v !== '') && (
//               <button
//                 type="button"
//                 onClick={clearFilters}
//                 className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <X className="h-4 w-4" />
//                 Clear
//               </button>
//             )}
//           </div>

//           {/* 3-Filter Layout */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             {/* 1. Make & Model */}
//             <div className="space-y-1.5">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Make & Model
//               </label>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="relative">
//                   <select
//                     name="make"
//                     value={filters.make}
//                     onChange={handleChange}
//                     className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
//                   >
//                     {makeOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>

//                 <div className="relative">
//                   <select
//                     name="model"
//                     value={filters.model}
//                     onChange={handleChange}
//                     disabled={!filters.make}
//                     className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none disabled:opacity-50"
//                   >
//                     {(modelOptions[filters.make] || modelOptions['']).map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>

//             {/* 2. Price Range */}
//             <div className="space-y-1.5">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Price Range
//               </label>
//               <div className="relative">
//                 <select
//                   name="priceRange"
//                   value={filters.priceRange}
//                   onChange={handleChange}
//                   className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
//                 >
//                   {priceRangeOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* 3. Year & Body Type */}
//             <div className="space-y-1.5">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Year & Body Type
//               </label>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="relative">
//                   <select
//                     name="year"
//                     value={filters.year}
//                     onChange={handleChange}
//                     className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
//                   >
//                     {yearOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>

//                 <div className="relative">
//                   <select
//                     name="bodyType"
//                     value={filters.bodyType}
//                     onChange={handleChange}
//                     className="w-full h-12 pl-4 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white appearance-none"
//                   >
//                     {bodyTypeOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 ${
//               loading ? 'cursor-not-allowed' : 'hover:scale-[1.01]'
//             }`}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="h-6 w-6 animate-spin" />
//                 <span>Searching Cars...</span>
//               </>
//             ) : (
//               <>
//                 <Search className="h-6 w-6" />
//                 <span>Search Cars</span>
//               </>
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Results Modal - Keep as you had it (or improve later) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
//             {/* Header, Body, Footer - same as before */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Results</h2>
//                 <p className="text-gray-600 dark:text-gray-400 mt-1">
//                   {searchResults.length} {searchResults.length === 1 ? 'car' : 'cars'} found
//                 </p>
//               </div>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6">
//               {searchResults.length === 0 ? (
//                 <div className="text-center py-20">
//                   <p className="text-2xl font-medium text-gray-700 dark:text-gray-300">No cars found</p>
//                   <p className="mt-3 text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {searchResults.map((car) => (
//                     <SimpleCarCard key={car._id || Math.random()} car={car} />
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default SearchFilters;