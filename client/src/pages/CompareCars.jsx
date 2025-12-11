// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Loader2, 
//   X, 

//   Car as CarIcon, 



//   GitCompareIcon
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const CompareCars = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedCars, setSelectedCars] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [comparing, setComparing] = useState(false);
//   const [comparisonData, setComparisonData] = useState(null);

//   const CARAPI_KEY = import.meta.env.VITE_CARAPI_KEY; // Add this to your .env

//   const searchCars = async (query) => {
//     if (!query || query.length < 3) return;
//     setLoading(true);
//     try {
//      const res = await fetch(
//       `${import.meta.env.VITE_BACKEND_URL}/cars/carapi/vehicles?search=${encodeURIComponent(query)}`
//     );
//       const data = await res.json();
//       if (data.data) {
//         setSearchResults(data.data.slice(0, 10));
//       }
//     } catch (err) {
//       toast.error('Failed to search cars');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCompare = (car) => {
//     if (selectedCars.length >= 4) {
//       toast.error('You can compare up to 4 cars');
//       return;
//     }
//     if (selectedCars.some(c => c.id === car.id)) return;
//     setSelectedCars([...selectedCars, car]);
//     setSearchTerm('');
//     setSearchResults([]);
//   };

//   const removeCar = (id) => {
//     setSelectedCars(selectedCars.filter(c => c.id !== id));
//   };

//   const compare = async () => {
//     if (selectedCars.length < 2) {
//       toast.error('Select at least 2 cars to compare');
//       return;
//     }
//     setComparing(true);
//     try {
//       const ids = selectedCars.map(c => c.id).join(',');
//       const res = await fetch(
//         `https://carapi.app/api/vehicles?ids=${ids}&api_key=${CARAPI_KEY}`
//       );
//       const data = await res.json();
//       if (data.data) {
//         setComparisonData(data.data);
//         toast.success('Comparison ready!');
//       }
//     } catch (err) {
//       toast.error('Failed to compare cars');
//     } finally {
//       setComparing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-block p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-6 shadow-2xl">
//             <GitCompareIcon className="w-20 h-20 text-white" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Compare Cars
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
//             Find the perfect car by comparing specs, performance, and features side-by-side
//           </p>
//         </div>

//         {/* Selected Cars */}
//         {selectedCars.length > 0 && (
//           <div className="mb-10">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//               Selected Cars ({selectedCars.length}/4)
//             </h2>
//             <div className="flex flex-wrap gap-4">
//               {selectedCars.map(car => (
//                 <div key={car.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl shadow-lg">
//                   <img 
//                     src={car.image_url || '/placeholder-car.jpg'} 
//                     alt={car.model}
//                     className="w-12 h-12 object-cover rounded-lg"
//                   />
//                   <div>
//                     <p className="font-medium">{car.make} {car.model}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{car.year}</p>
//                   </div>
//                   <button onClick={() => removeCar(car.id)} className="text-red-500 hover:text-red-700">
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>
//               ))}
//               {selectedCars.length >= 2 && (
//                 <button
//                   onClick={compare}
//                   disabled={comparing}
//                   className="ml-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
//                 >
//                   {comparing ? (
//                     <Loader2 className="h-6 w-6 animate-spin" />
//                   ) : (
//                     'Compare Now'
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Search */}
//         <div className="relative max-w-2xl mx-auto mb-12">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               searchCars(e.target.value);
//             }}
//             placeholder="Search by make or model (e.g. Toyota Camry, BMW X5)..."
//             className="w-full h-14 pl-14 pr-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-xl"
//           />
//           <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
//         </div>

//         {/* Search Results */}
//         {searchResults.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             {searchResults.map(car => (
//               <div 
//                 key={car.id}
//                 className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
//               >
//                 <img 
//                   src={car.image_url || '/placeholder-car.jpg'} 
//                   alt={`${car.make} ${car.model}`}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                     {car.make} {car.model}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">{car.year}</p>
//                   <button
//                     onClick={() => addToCompare(car)}
//                     disabled={selectedCars.some(c => c.id === car.id)}
//                     className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50"
//                   >
//                     {selectedCars.some(c => c.id === car.id) ? 'Selected' : 'Add to Compare'}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Comparison Table */}
//         {comparisonData && (
//           <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
//             <div className="p-8">
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
//                 Side-by-Side Comparison
//               </h2>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 dark:bg-gray-700">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Feature</th>
//                       {comparisonData.map(car => (
//                         <th key={car.id} className="px-6 py-4 text-center">
//                           <img 
//                             src={car.image_url || '/placeholder-car.jpg'} 
//                             alt={car.model}
//                             className="w-24 h-16 object-cover mx-auto rounded-lg mb-2"
//                           />
//                           <p className="font-bold text-gray-900 dark:text-white">{car.make} {car.model}</p>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">{car.year}</p>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Price</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center text-lg font-bold text-indigo-600 dark:text-indigo-400">
//                           ${car.msrp?.toLocaleString() || 'N/A'}
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Horsepower</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.horsepower || 'N/A'} hp
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Torque</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.torque || 'N/A'} lb-ft
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Fuel Economy (City/Hwy)</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.fuel_economy_city || 'N/A'} / {car.fuel_economy_hwy || 'N/A'} mpg
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Transmission</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.transmission || 'N/A'}
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">0-60 mph</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.acceleration_0_60 || 'N/A'} sec
//                         </td>
//                       ))}
//                     </tr>
//                     <tr>
//                       <td className="px-6 py-4 font-medium">Safety Rating</td>
//                       {comparisonData.map(car => (
//                         <td key={car.id} className="px-6 py-4 text-center">
//                           {car.safety_rating ? `${car.safety_rating}/5` : 'N/A'}
//                         </td>
//                       ))}
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CompareCars;




/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
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
  X 
} from 'lucide-react';
import { toast } from 'sonner';

const CompareCars = () => {
  const [allCars, setAllCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCars, setSelectedCars] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/allcars`); 
      const data = await res.json();

      if (data.status === 'success') {
        setAllCars(data.data.cars || []);
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

    // Prepare comparison data (you can expand with more fields)
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
    };

    setComparisonData(comparison);
  };

  const filteredCars = allCars.filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.year?.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              Try different search terms
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
                  <button
                    onClick={() => handleSelectCar(car)}
                    disabled={selectedCars.some(c => c._id === car._id)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50"
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
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Comparison Results
            </h2>
            <table className="w-full min-w-max table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4">Feature</th>
                  {comparisonData.cars.map((car, i) => (
                    <th key={i} className="px-6 py-4">
                      {car.make} {car.model}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareCars;