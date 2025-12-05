import { useState } from 'react';
import { Search, AlertTriangle, User, Building, Car } from 'lucide-react';



const Blacklist = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    status: '',
  });

  const categories = [
    'Car Dealers',
    'Private Sellers',
    'Buyers',
    'Service Providers',
  ];

  const statuses = [
    'Active',
    'Under Review',
    'Resolved',
    'Appealed',
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Blacklist Registry
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              className="input"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              className="input"
              placeholder="Enter location..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Added
            </label>
            <input
              type="date"
              name="date"
              className="input"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              className="input"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Any Status</option>
              {statuses.map(status => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Blacklist Entry - Dealer */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Shady Motors LLC
                </h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Category:</strong> Car Dealer</p>
              <p><strong>Location:</strong> Car City, CC 12345</p>
              <p><strong>Date Added:</strong> March 15, 2024</p>
              <p><strong>Reason:</strong> Multiple reports of fraudulent practices</p>
            </div>
            <button className="mt-4 w-full btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
              View Details
            </button>
          </div>
        </div>

        {/* Sample Blacklist Entry - Seller */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  John D.
                </h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Under Review
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Category:</strong> Private Seller</p>
              <p><strong>Location:</strong> Metro City</p>
              <p><strong>Date Added:</strong> March 10, 2024</p>
              <p><strong>Reason:</strong> Misrepresentation of vehicle condition</p>
            </div>
            <button className="mt-4 w-full btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
              View Details
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="col-span-full text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No blacklist entries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blacklist;