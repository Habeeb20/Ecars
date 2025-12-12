/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Eye, 
  DollarSign, 
  Package 
} from 'lucide-react';
import { toast } from 'sonner';

const MyCarPartListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.status === 'success') {
        setListings(data.data.listings || []);
      } else {
        toast.error('Failed to load listings');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (listingId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Listing updated successfully');
        fetchListings();
        setEditing(null);
      } else {
        toast.error('Failed to update listing');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success('Listing deleted successfully');
        fetchListings();
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Car Part Listings
          </h1>
          <div className="mt-4 md:mt-0 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your first car part!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <div key={listing._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <img 
                  src={listing.images[0] || '/placeholder-part.jpg'} 
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    ₦{listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Condition: {listing.condition.toUpperCase()} • Type: {listing.partType.toUpperCase()}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedListing(listing)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button 
                      onClick={() => setEditing(listing)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-xl flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View/Modal for details (expand as needed) */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold mb-4">{selectedListing.title}</h2>
            {/* Add more details here */}
            <button onClick={() => setSelectedListing(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCarPartListings;