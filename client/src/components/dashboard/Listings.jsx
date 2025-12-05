import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const MyListings = () => {
  const [listings] = useState([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Listings</h1>
        <Link
          to="/sell-car"
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't listed any cars yet.
          </p>
          <Link
            to="/sell-car"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>List Your First Car</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Listings will be mapped here */}
        </div>
      )}
    </div>
  );
};

export default MyListings;