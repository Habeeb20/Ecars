// Example: pages/Listings.jsx or components/SearchWithResultsModal.jsx
import React, { useState } from 'react';
import SearchFilters from './SearchFilters'; // your search component
import { CarCard } from './CarCard';        // ← your provided CarCard
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CarsSearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // Build query parameters based on your filters
      const params = new URLSearchParams();

      if (filters.make)          params.append('make', filters.make);
      if (filters.model)         params.append('model', filters.model);
      if (filters.priceRange)    params.append('priceRange', filters.priceRange);
      if (filters.year)          params.append('yearRange', filters.year);
      if (filters.bodyType)      params.append('bodyType', filters.bodyType);
      if (filters.keywords)      params.append('keywords', filters.keywords);
      if (filters.conditionType) params.append('condition', filters.conditionType);
      if (filters.fuelType)      params.append('fuelType', filters.fuelType);
      if (filters.transmission)  params.append('transmission', filters.transmission);
      if (filters.location)      params.append('location', filters.location);
      // Add more if your backend supports them

      const queryString = params.toString();
      const url = `${import.meta.env.VITE_BACKEND_URL}/cars/allcars${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch cars');
      }

      const data = await response.json();

      // Adjust according to your actual API response structure
      const cars = data.cars || data.data || data.results || data || [];

      setSearchResults(cars);
      setIsModalOpen(true);

      if (cars.length === 0) {
        toast.info('No cars found matching your criteria');
      } else {
        toast.success(`Found ${cars.length} cars`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to load search results');
      toast.error('Something went wrong while searching');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Find Your Dream Car
        </h1>

        {/* Your beautiful search filters */}
        <SearchFilters 
          variant="hero" 
          className="max-w-5xl mx-auto mb-12 shadow-2xl" 
          onSearch={handleSearch}
        />

        {/* Results Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
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
                  onClick={closeModal}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body - Scrollable results */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Searching for the best matches...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-xl font-medium text-red-600 dark:text-red-400">
                      {error}
                    </p>
                    <button
                      onClick={closeModal}
                      className="mt-6 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-xl font-medium"
                    >
                      Close
                    </button>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                      No matching cars found
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Try adjusting your search filters or browse all available cars
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                    >
                      Close & Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((car) => (
                      <CarCard 
                        key={car._id} 
                        car={car} 
                        showDealerInfo={true} // optional - show dealer if you want
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}