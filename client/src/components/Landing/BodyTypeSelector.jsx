

// // src/components/BodyTypeSelector.jsx
// import React, { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import car2 from "../../assets/Car.png"
// import bus from "../../assets/Bus.png"
// import hatchback from "../../assets/Hatchback.png"
// import truck from "../../assets/Truck.png"
// import suv from "../../assets/SUV.png"
// import tanker from "../../assets/tanker.jpeg"
// import plant from "../../assets/plant.jpeg"
// import generator from "../../assets/generator.jpeg"
// import trailer from "../../assets/trailer.jpeg"
// const API_URL = `${import.meta.env.VITE_BACKEND_URL}/cars/allcars`;

// const BODY_TYPES = [
//   { value: 'sedan', label: 'Cars', image: car2 },
//   { value: 'suv', label: 'SUV', image: suv },
//   { value: 'hatchback', label: 'Hatchback', image: hatchback },
//   { value: 'truck', label: 'Truck', image: truck },
//   { value: 'bus', label: 'Bus', image: bus },
//   { value: 'bikes', label: 'Bikes', emoji: '🏍️' },
//   { value: 'tanker', label: 'Tanker', image: tanker },
//   { value: 'trailer', label: 'Trailer', image: trailer },
//   { value: 'plant', label: 'Plant', image: plant },
//   { value: 'generator', label: 'Generator', image: generator },
// ];

// const BodyTypeSelector = () => {
//   const navigate = useNavigate();
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchCars = async () => {
//       try {
//         const res = await fetch(API_URL, { signal: controller.signal });
//         const json = await res.json();
//         setCars(json?.data?.cars ?? []);
//       } catch (err) {
//         if (err.name !== 'AbortError') {
//           console.error('Failed to fetch cars:', err);
//         }
//       } finally {
//         if (!controller.signal.aborted) setLoading(false);
//       }
//     };

//     fetchCars();
//     return () => controller.abort();
//   }, []);

//   // { sedan: 5, suv: 3, ... }
//   const counts = useMemo(() => {
//     return cars.reduce((acc, c) => {
//       const key = (c.bodyType || '').trim().toLowerCase();
//       if (key) acc[key] = (acc[key] || 0) + 1;
//       return acc;
//     }, {});
//   }, [cars]);

//   return (
//     <div className="w-full mt-20 py-8 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
//           Browse Vehicles by Body Type
//         </h2>

//         {/* Horizontal scrollable list */}
//         <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
//           {BODY_TYPES.map((type) => {
//             const count = counts[type.value.toLowerCase()] || 0;

//             return (
//               <div
//                 key={type.value}
//                 onClick={() => navigate(`/vehicles/body-type/${type.value}`)}
//                 className="min-w-[140px] sm:min-w-[180px] flex-shrink-0 snap-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 text-center cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
//               >
//                 <div className="w-20 h-25 mx-auto mb-3 flex items-center justify-center">
//                   {type.image ? (
//                     <img
//                       src={type.image}
//                       alt={type.label}
//                       className="w-full h-full object-contain"
//                     />
//                   ) : (
//                     <span className="text-5xl leading-none">{type.emoji}</span>
//                   )}
//                 </div>
//                 <h3 className="font-bold text-lg mb-1">{type.label}</h3>

//                 {loading ? (
//                   <div className="h-4 w-16 mx-auto rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
//                 ) : (
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     {count} {count === 1 ? 'car' : 'cars'}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
//           Scroll horizontally • Tap any type to see available vehicles
//         </p>
//       </div>
//     </div>
//   );
// };

// export default BodyTypeSelector;




// src/components/BodyTypeSelector.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import car2 from "../../assets/Car.png"
import bus from "../../assets/Bus.png"
import hatchback from "../../assets/Hatchback.png"
import truck from "../../assets/Truck.png"
import suv from "../../assets/SUV.png"
import tanker from "../../assets/tanker.jpeg"
import plant from "../../assets/plant.jpeg"
import generator from "../../assets/generator.jpeg"
import trailer from "../../assets/trailer.jpeg"
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/cars/allcars`;

const BODY_TYPES = [
  { value: 'sedan', label: 'Cars', image: car2 },
  { value: 'suv', label: 'SUV', image: suv },
  { value: 'hatchback', label: 'Hatchback', image: hatchback },
  { value: 'truck', label: 'Truck', image: truck },
  { value: 'bus', label: 'Bus', image: bus },
  { value: 'bikes', label: 'Bikes', emoji: '🏍️' },
  { value: 'tanker', label: 'Tanker', image: tanker },
  { value: 'trailer', label: 'Trailer', image: trailer },
  { value: 'plant', label: 'Plant', image: plant },
  { value: 'generator', label: 'Generator', image: generator },
];

const BodyTypeSelector = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCars = async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        const json = await res.json();
        setCars(json?.data?.cars ?? []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch cars:', err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchCars();
    return () => controller.abort();
  }, []);

  // { sedan: 5, suv: 3, ... }
  const counts = useMemo(() => {
    return cars.reduce((acc, c) => {
      const key = (c.bodyType || '').trim().toLowerCase();
      if (key) acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [cars]);

  return (
    <div className="w-full mt-20 py-8 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Browse Vehicles by Body Type
        </h2>

        {/* Horizontal scrollable list */}
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
          {BODY_TYPES.map((type) => {
            const count = counts[type.value.toLowerCase()] || 0;

            return (
              <div
                key={type.value}
                onClick={() => navigate(`/vehicles/body-type/${type.value}`)}
                className="flex w-[140px] sm:w-[180px] flex-shrink-0 snap-center flex-col items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 text-center cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Fixed-size image box: every image (or emoji) sits in the same space,
                    so the labels below always start at the same height */}
                <div className="mb-3 flex h-20 w-full items-center justify-center">
                  {type.image ? (
                    <img
                      src={type.image}
                      alt={type.label}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl leading-none">{type.emoji}</span>
                  )}
                </div>

                {/* Fixed-height label and count rows */}
                <h3 className="mb-1 flex h-7 items-center text-lg font-bold text-slate-900 dark:text-white">
                  {type.label}
                </h3>

                <div className="flex h-5 items-center">
                  {loading ? (
                    <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {count} {count === 1 ? 'car' : 'cars'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          Scroll horizontally • Tap any type to see available vehicles
        </p>
      </div>
    </div>
  );
};

export default BodyTypeSelector;