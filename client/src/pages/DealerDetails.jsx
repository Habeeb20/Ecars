// src/pages/DealerDetails.tsx
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Star, ArrowLeft } from 'lucide-react';
import { featuredDealers } from '../data/dealers';
import { mockInventory } from '../data/cars';
import { CarCard } from '../components/car/CarCard';

const DealerDetails = () => {
  const { id } = useParams();
  const dealer = featuredDealers.find(d => d.id === id);
  const inventory = mockInventory[id ] || [];

  if (!dealer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dealer not found</h1>
        <Link to="/dealers" className="text-primary-600 dark:text-primary-400 hover:underline mt-4 inline-block">
          Back to dealers
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/dealers" 
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dealers
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={dealer.imageUrl} 
              alt={dealer.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{dealer.name}</h1>
              <div className="flex items-center bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="font-medium">{dealer.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                <span>{dealer.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                <span>{dealer.phone}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Brands Available</h3>
              <div className="flex flex-wrap gap-2">
                {dealer.brands.map((brand, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About This Dealer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {dealer.name} is a premier automotive dealership specializing in {dealer.brands.join(', ')} vehicles. 
                With a {dealer.rating} star rating, we pride ourselves on excellent customer service and 
                high-quality vehicles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Inventory ({inventory.length})</h2>
      
      {inventory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Inventory Available</h3>
          <p className="text-gray-600 dark:text-gray-400">This dealer currently has no vehicles listed.</p>
        </div>
      )}
    </div>
  );
};

export default DealerDetails;