import { useState } from 'react';
import { Search, Star, MapPin, Phone, Mail } from 'lucide-react';



const ServiceProvider = () => {
  const [filters, setFilters] = useState({
    serviceType: '',
    location: '',
    rating: '',
    specialization: '',
  });

  const serviceTypes = [
    'Repair & Maintenance',
    'Body Shop',
    'Detailing',
    'Tire Services',
    'Oil Change',
    'Diagnostics',
    'Paint Shop',
    'Mobile Mechanic',
  ];

  const specializations = [
    'All Brands',
    'European Cars',
    'Japanese Cars',
    'American Cars',
    'Luxury Vehicles',
    'Classic Cars',
    'Electric Vehicles',
    'Hybrid Vehicles',
  ];

  const ratings = [
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
    { label: '2+ Stars', value: '2' },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Service Providers
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Type
            </label>
            <select
              name="serviceType"
              className="input"
              value={filters.serviceType}
              onChange={handleFilterChange}
            >
              <option value="">All Services</option>
              {serviceTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
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
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rating
            </label>
            <select
              name="rating"
              className="input"
              value={filters.rating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              {ratings.map(rating => (
                <option key={rating.value} value={rating.value}>
                  {rating.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <select
              name="specialization"
              className="input"
              value={filters.specialization}
              onChange={handleFilterChange}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec.toLowerCase()}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Provider Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Premium Auto Service
            </h3>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                (128 reviews)
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Auto Street, Car City, CC 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@premiumauto.example.com</span>
              </div>
            </div>
            <button className="mt-4 w-full btn btn-primary">
              Book Appointment
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="col-span-full text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No service providers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceProvider;