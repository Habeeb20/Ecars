// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { Search, AlertTriangle, User, Building, Car, Loader2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const Blacklist = () => {
//   const [blacklistedUsers, setBlacklistedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     category: '',
//     location: '',
//     date: '',
//     status: '',
//   });

//   const categories = [
//     'Car Dealers',
//     'Private Sellers',
//     'Buyers',
//     'Service Providers',
//   ];

//   const statuses = [
//     'Active',
//     'Under Review',
//     'Resolved',
//     'Appealed',
//   ];

//   useEffect(() => {
//     fetchBlacklistedUsers();
//   }, []);

//   const fetchBlacklistedUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/blacklistedusers`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       if (data.status === 'success') {
//         setBlacklistedUsers(data.data.users || []);
//       } else {
//         toast.error('Failed to load blacklisted users');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   // Frontend filtering (works perfectly with your original filters)
//   const filteredUsers = blacklistedUsers.filter(user => {
//     const matchesCategory = !filters.category || 
//       (user.role === 'dealer' && filters.category === 'car dealers') ||
//       (user.role === 'private-seller' && filters.category === 'private sellers') ||
//       (user.role === 'buyer' && filters.category === 'buyers') ||
//       (user.role === 'service-provider' && filters.category === 'service providers');

//     const matchesLocation = !filters.location || 
//       user.location?.toLowerCase().includes(filters.location.toLowerCase());

//     const matchesDate = !filters.date || 
//       new Date(user.blacklistedAt).toISOString().split('T')[0] === filters.date;

//     const matchesStatus = !filters.status || 
//       (user.status || 'active').toLowerCase() === filters.status;

//     return matchesCategory && matchesLocation && matchesDate && matchesStatus;
//   });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center gap-3 mb-8">
//         <AlertTriangle className="h-8 w-8 text-red-500" />
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Blacklist Registry
//         </h1>
//       </div>

//       {/* Filters */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Category
//             </label>
//             <select
//               name="category"
//               className="input"
//               value={filters.category}
//               onChange={handleFilterChange}
//             >
//               <option value="">All Categories</option>
//               {categories.map(category => (
//                 <option key={category} value={category.toLowerCase()}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Location
//             </label>
//             <input
//               type="text"
//               name="location"
//               className="input"
//               placeholder="Enter location..."
//               value={filters.location}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Date Added
//             </label>
//             <input
//               type="date"
//               name="date"
//               className="input"
//               value={filters.date}
//               onChange={handleFilterChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               className="input"
//               value={filters.status}
//               onChange={handleFilterChange}
//             >
//               <option value="">Any Status</option>
//               {statuses.map(status => (
//                 <option key={status} value={status.toLowerCase()}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Results */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
//         </div>
//       ) : filteredUsers.length === 0 ? (
//         <div className="col-span-full text-center py-12">
//           <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//             No blacklist entries found
//           </h3>
//           <p className="text-gray-500 dark:text-gray-400">
//             Try adjusting your filters or search terms
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredUsers.map(user => (
//             <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center gap-2">
//                     {user.role === 'dealer' ? (
//                       <Building className="h-5 w-5 text-red-500" />
//                     ) : user.role === 'service-provider' ? (
//                       <Car className="h-5 w-5 text-red-500" />
//                     ) : (
//                       <User className="h-5 w-5 text-red-500" />
//                     )}
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                       {user.firstName} {user.lastName}
//                     </h3>
//                   </div>
//                   <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
//                     {user.status || 'Active'}
//                   </span>
//                 </div>
//                 <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
//                   <p><strong>Category:</strong> {user.role === 'dealer' ? 'Car Dealer' : user.role === 'service-provider' ? 'Service Provider' : 'Private User'}</p>
//                   <p><strong>Location:</strong> {user.location || 'N/A'}</p>
//                   <p><strong>Date Added:</strong> {new Date(user.blacklistedAt).toLocaleDateString()}</p>
//                   <p><strong>Reason:</strong> {user.blacklistedReason || 'No reason provided'}</p>
//                 </div>
//                 <button className="mt-4 w-full btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Blacklist;



/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, User, Building, Car, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Blacklist = () => {
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    status: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchBlacklistedUsers();
  }, [filters, searchQuery]);

  const fetchBlacklistedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const query = new URLSearchParams({
        search: searchQuery,
        ...(filters.category && { category: filters.category }),
        ...(filters.location && { location: filters.location }),
        ...(filters.date && { date: filters.date }),
        ...(filters.status && { status: filters.status }),
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/blacklistedusers/search?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.status === 'success') {
        setBlacklistedUsers(data.data.users || []);
      } else {
        toast.error('Failed to load blacklisted users');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Define filteredUsers here (this is what was missing)
  const filteredUsers = blacklistedUsers.filter(user => {
    const matchesCategory = !filters.category || 
      (user.role === 'dealer' && filters.category === 'car dealers') ||
      (user.role === 'private-seller' && filters.category === 'private sellers') ||
      (user.role === 'buyer' && filters.category === 'buyers') ||
      (user.role === 'service-provider' && filters.category === 'service providers');

    const matchesLocation = !filters.location || 
      user.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesDate = !filters.date || 
      new Date(user.blacklistedAt).toISOString().split('T')[0] === filters.date;

    const matchesStatus = !filters.status || 
      (user.status || 'active').toLowerCase() === filters.status;

    return matchesCategory && matchesLocation && matchesDate && matchesStatus;
  });

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

        {/* Search Bar */}
        <div className="mt-6 relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No blacklist entries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {user.role === 'dealer' ? (
                      <Building className="h-5 w-5 text-red-500" />
                    ) : user.role === 'service-provider' ? (
                      <Car className="h-5 w-5 text-red-500" />
                    ) : (
                      <User className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {user.status || 'Active'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Category:</strong> {user.role === 'dealer' ? 'Car Dealer' : user.role === 'service-provider' ? 'Service Provider' : 'Private User'}</p>
                  <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                  <p><strong>Date Added:</strong> {new Date(user.blacklistedAt).toLocaleDateString()}</p>
                  <p><strong>Reason:</strong> {user.blacklistedReason || 'No reason provided'}</p>
                </div>
                <button className="mt-4 w-full btn btn-outline text-red-600 border-red-600 hover:bg-red-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blacklist;