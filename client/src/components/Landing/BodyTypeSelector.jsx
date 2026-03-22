// src/components/BodyTypeSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BODY_TYPES = [
  { value: 'sedan', label: 'Cars', emoji: '🚗' },
  { value: 'suv', label: 'SUV', emoji: '🚙' },
  { value: 'hatchback', label: 'Hatchback', emoji: '🏎️' },
  { value: 'truck', label: 'Truck', emoji: '🛻' },
  { value: 'bus', label: 'Bus', emoji: '🚌' },
  { value: 'bikes', label: 'Bikes', emoji: '🏍️' },
];

const BodyTypeSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-8 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Browse Vehicles by Body Type
        </h2>

        {/* Horizontal scrollable list */}
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
          {BODY_TYPES.map((type) => (
            <div
              key={type.value}
              onClick={() => navigate(`/vehicles/body-type/${type.value}`)}
              className="min-w-[140px] sm:min-w-[180px] flex-shrink-0 snap-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 text-center cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-5xl mb-3">{type.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{type.label}</h3>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-sm">
          Scroll horizontally • Tap any type to see available vehicles
        </p>
      </div>
    </div>
  );
};

export default BodyTypeSelector;