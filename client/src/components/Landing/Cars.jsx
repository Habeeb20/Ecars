// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
// import { toast } from 'sonner';
// import { CarCard } from '../car/CarCard';
// import SearchFilters from '../car/SearchFilters';
// import { Loader2 } from 'lucide-react';
// const sortOptions = [
//   { value: 'newest', label: 'Newest First' },
//   { value: 'oldest', label: 'Oldest First' },
//   { value: 'price_low', label: 'Price: Low to High' },
//   { value: 'price_high', label: 'Price: High to Low' },
//   { value: 'mileage_low', label: 'Mileage: Low to High' },
// ];

// const conditionOptions = [
//   { value: 'foreignUsed', label: 'foreign used' },
//   { value: 'brandNew', label: 'New Cars' },
//   { value: 'nigerianUsed', label: 'nigerian used' },
// ];

// const Listings = () => {
//   const [cars, setCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState('newest');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedCondition, setSelectedCondition] = useState('');

//   const [currentFilters, setCurrentFilters] = useState({
//     make: '',
//     model: '',
//     priceRange: '',
//     year: '',
//     bodyType: '',
//     keywords: '',
//     location: '',
//     distance: '',
//     condition: '',
//     category: '',
//     mileage: '',
//     fuelType: '',
//     transmission: '',
//     sellerType: '',
//     doors: '',
//     engineSize: '',
//     colour: '',
//     vehicleType: '',
//   });

//   // Fetch all cars on mount
//   useEffect(() => {
//     fetchAllCars();
//   }, []);

//   // Re-sort when sortBy changes
//   useEffect(() => {
//     const sorted = [...filteredCars];
//     switch (sortBy) {
//       case 'newest':
//         sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       case 'oldest':
//         sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case 'price_low':
//         sorted.sort((a, b) => a.price - b.price);
//         break;
//       case 'price_high':
//         sorted.sort((a, b) => b.price - a.price);
//         break;
//       case 'mileage_low':
//         sorted.sort((a, b) => a.mileage - b.mileage);
//         break;
//       default:
//         break;
//     }
//     setCars(sorted);
//   }, [sortBy, filteredCars]);

//   const fetchAllCars = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/allcars`);
//       const data = await res.json();

//       if (data.status === 'success') {
//         setCars(data.data.cars);
//         console.log(data.data)
//         setFilteredCars(data.data.cars);
//       } else {
//         toast.error('Failed to load cars');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConditionFilter = (condition) => {
//     const newCondition = selectedCondition === condition ? '' : condition;
//     setSelectedCondition(newCondition);
//     handleSearch({ ...currentFilters, condition: newCondition });
//   };

//   const handleSearch = async (filters) => {
//     setCurrentFilters(filters);
//     setLoading(true);

//     try {
//       const queryParams = new URLSearchParams();
      
//       // Only add non-empty filters
//       Object.keys(filters).forEach(key => {
//         if (filters[key]) {
//           queryParams.append(key, filters[key]);
//         }
//       });

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/search?${queryParams}`);
//       const data = await res.json();
//       setFilteredCars(data.data);
   
//     } catch (err) {
//       console.log(err)
//       toast.error('Search failed');
//       setFilteredCars([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-16 min-h-screen">
//       <div className="bg-primary-600 :bg-primary-800 py-12">
//         <div className="container mx-auto px-4">
//           <h1 className="text-3xl font-bold text-white mb-4">Browse Cars</h1>
//           <p className="text-primary-100 max-w-3xl">
//             Explore our extensive collection of quality vehicles. Use the filters to find exactly what you're looking for.
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-6 flex flex-wrap gap-4">
//           {conditionOptions.map(option => (
//             <button
//               key={option.value}
//               onClick={() => handleConditionFilter(option.value)}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//                 selectedCondition === option.value
//                   ? 'bg-primary-600 text-white'
//                   : 'bg-gray-200 :bg-gray-700 text-gray-800 :text-gray-200 hover:bg-gray-300 :hover:bg-gray-600'
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>

//         <div className="lg:flex">
//           <div className="hidden lg:block w-64 flex-shrink-0 mr-8">
//             <div className="sticky top-24">
//               <h2 className="text-xl font-semibold text-gray-900 :text-white mb-4">Filters</h2>
//               <SearchFilters 
//                 variant="sidebar" 
//                 onSearch={handleSearch} 
//               />
//             </div>
//           </div>

//           <div className="lg:hidden mb-4 flex items-center justify-between">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="btn btn-outline flex items-center space-x-2"
//             >
//               <SlidersHorizontal className="h-4 w-4" />
//               <span>Filters</span>
//             </button>
            
//             <div className="relative">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="input appearance-none pr-8"
//               >
//                 {sortOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//             </div>
//           </div>

//           {showFilters && (
//             <div className="lg:hidden mb-4">
//               <SearchFilters 
//                 variant="sidebar" 
//                 onSearch={handleSearch} 
//               />
//             </div>
//           )}

//           <div className="flex-1">
//             <div className="hidden lg:flex items-center justify-between mb-6">
//               <h2 className="text-gray-700 :text-gray-300">
//                 <span className="font-semibold">{filteredCars?.length}</span> cars found
//               </h2>
              
//               <div className="relative">
//                 <label htmlFor="sort" className="text-sm mr-2 text-gray-600 :text-gray-400">
//                   Sort by:
//                 </label>
//                 <select
//                   id="sort"
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="input appearance-none inline-block w-48"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//               </div>
//             </div>

//             {loading ? (
//               <div className="text-center py-20">
//                 <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto" />
//               </div>
//             ) : filteredCars.length === 0 ? (
//               <div className="bg-white :bg-gray-800 rounded-lg shadow-md p-8 text-center">
//                 <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 :text-white mb-2">No cars found</h3>
//                 <p className="text-gray-600 :text-gray-400 mb-4">
//                   Please try adjusting your filters to find what you're looking for.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setCurrentFilters({
//                       make: '',
//                       model: '',
//                       priceRange: '',
//                       year: '',
//                       bodyType: '',
//                       keywords: '',
//                       location: '',
//                       distance: '',
//                       condition: '',
//                       category: '',
//                       mileage: '',
//                       fuelType: '',
//                       transmission: '',
//                       sellerType: '',
//                       doors: '',
//                       engineSize: '',
//                       colour: '',
//                       vehicleType: '',
//                     });
//                     setSelectedCondition('');
//                     fetchAllCars();
//                   }}
//                   className="btn btn-primary"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 mt-20  lg:grid-cols-3 gap-6  mt-40">
//                 {cars.map((car) => (
//                   <CarCard key={car._id} car={car} />
//                 ))}
//               </div>
//             )}

//             {/* Pagination placeholder */}
//             {cars.length > 0 && (
//               <div className="mt-8 flex justify-center">
//                 <nav className="inline-flex rounded-md shadow">
//                   <button className="px-3 py-2 rounded-l-md border border-gray-300 :border-gray-600 bg-white :bg-gray-800 text-gray-700 :text-gray-300 hover:bg-gray-50 :hover:bg-gray-700">
//                     Previous
//                   </button>
//                   <button className="px-3 py-2 border-t border-b border-gray-300 :border-gray-600 bg-primary-50 :bg-primary-900 text-primary-600 :text-primary-400">
//                     1
//                   </button>
//                   <button className="px-3 py-2 border-t border-b border-gray-300 :border-gray-600 bg-white :bg-gray-800 text-gray-700 :text-gray-300 hover:bg-gray-50 :hover:bg-gray-700">
//                     2
//                   </button>
//                   <button className="px-3 py-2 border-t border-b border-gray-300 :border-gray-600 bg-white :bg-gray-800 text-gray-800 text-gray-700 :text-gray-300 hover:bg-gray-50 :hover:bg-gray-700">
//                     3
//                   </button>
//                   <button className="px-3 py-2 rounded-r-md border border-gray-300 :border-gray-600 bg-white :bg-gray-800 text-gray-700 :text-gray-300 hover:bg-gray-50 :hover:bg-gray-700">
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Listings;









/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { CarCard } from '../car/CarCard';
import SearchFilters from '../car/SearchFilters';
import { Loader2 } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'mileage_low', label: 'Mileage: Low to High' },
];

const conditionOptions = [
  { value: 'foreignUsed', label: 'Foreign Used' },
  { value: 'brandNew', label: 'Brand New' },
  { value: 'nigerianUsed', label: 'Nigerian Used' },
];

const Listings = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
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
    condition: '',
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

  // Fetch all cars on mount
  useEffect(() => {
    fetchAllCars();
  }, []);

  // Re-sort when sortBy or filteredCars changes
  useEffect(() => {
    const sorted = [...filteredCars];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
      default:
        break;
    }
    setCars(sorted);
  }, [sortBy, filteredCars]);

  const fetchAllCars = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/allcars`);
      const data = await res.json();

      if (data.status === 'success') {
        setCars(data.data.cars);
        setFilteredCars(data.data.cars);
      } else {
        toast.error('Failed to load cars');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleConditionFilter = (condition) => {
    const newCondition = selectedCondition === condition ? '' : condition;
    setSelectedCondition(newCondition);
    handleSearch({ ...currentFilters, condition: newCondition });
  };

  const handleSearch = async (filters) => {
    setCurrentFilters(filters);
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/search?${queryParams}`);
      const data = await res.json();
      setFilteredCars(data.data);
    } catch (err) {
      console.log(err);
      toast.error('Search failed');
      setFilteredCars([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-x-hidden">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 mt-10 text-white py-16 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Browse Cars
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl opacity-90">
            Discover quality vehicles from trusted sellers. Filter by make, price, condition, and more.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter & Sort Controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Mobile Filter Toggle + Sort */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 font-medium"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {Object.values(currentFilters).some(v => v) && (
                <span className="ml-1.5 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 dark:text-slate-200"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Condition Pills (always visible) */}
          <div className="flex flex-wrap gap-3">
            {conditionOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleConditionFilter(option.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCondition === option.value
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {showFilters && (
          <div className="lg:hidden mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SearchFilters variant="mobile" onSearch={handleSearch} />
          </div>
        )}

        {/* Sidebar Filters (Desktop) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
    

          {/* Cars Grid */}
          <div className="flex-1">
                  <div className="hidden lg:block w-80 flex-shrink-0">
            {/* <div className="sticky top-24 dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                Advanced Filters
              </h2>
           
            </div> */}
               <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center ">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                Advanced Filters
              </h2>
               <SearchFilters variant="sidebar" onSearch={handleSearch} />
          </div>
            {/* Results count */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} found
              </h2>

              {filteredCars.length > 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {filteredCars.length} results
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="h-14 w-14 text-indigo-600 animate-spin" />
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center border border-slate-200 dark:border-slate-700">
                <Search className="mx-auto h-16 w-16 text-slate-400 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  No cars found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find available vehicles.
                </p>
                <button
                  onClick={() => {
                    setCurrentFilters({
                      make: '', model: '', priceRange: '', year: '', bodyType: '',
                      keywords: '', location: '', distance: '', condition: '',
                      category: '', mileage: '', fuelType: '', transmission: '',
                      sellerType: '', doors: '', engineSize: '', colour: '', vehicleType: '',
                    });
                    setSelectedCondition('');
                    fetchAllCars();
                  }}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {cars.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-xl shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button className="px-5 py-3 rounded-l-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    Previous
                  </button>
                  <button className="px-5 py-3 border-l border-slate-200 dark:border-slate-700 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium">
                    1
                  </button>
                  <button className="px-5 py-3 border-l border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    2
                  </button>
                  <button className="px-5 py-3 border-l border-slate-200 dark:border-slate-700 rounded-r-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
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