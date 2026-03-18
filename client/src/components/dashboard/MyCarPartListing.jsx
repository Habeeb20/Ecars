// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { 
//   Loader2, 
//   Search, 
//   Edit, 
//   Trash2, 
//   X, 
//   Eye, 
//   DollarSign, 
//   Package 
// } from 'lucide-react';
// import { toast } from 'sonner';

// const MyCarPartListings = () => {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedListing, setSelectedListing] = useState(null);
//   const [editing, setEditing] = useState(null);

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/my`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       if (data.status === 'success') {
//         setListings(data.data.listings || []);
//       } else {
//         toast.error('Failed to load listings');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = async (listingId, updatedData) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/${listingId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });
//       const data = await res.json();

//       if (data.status === 'success') {
//         toast.success('Listing updated successfully');
//         fetchListings();
//         setEditing(null);
//       } else {
//         toast.error('Failed to update listing');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     }
//   };

//   const handleDelete = async (listingId) => {
//     if (!window.confirm('Are you sure you want to delete this listing?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/${listingId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.ok) {
//         toast.success('Listing deleted successfully');
//         fetchListings();
//       } else {
//         toast.error('Failed to delete listing');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     }
//   };

//   const filteredListings = listings.filter(listing =>
//     listing.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-10">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             My Car Part Listings
//           </h1>
//           <div className="mt-4 md:mt-0 relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by title..."
//               className="w-full md:w-80 h-12 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//           </div>
//         </div>

//         {/* Listings Grid */}
//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
//           </div>
//         ) : filteredListings.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
//             <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               No listings found
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Upload your first car part!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredListings.map(listing => (
//               <div key={listing._id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
//                 <img 
//                   src={listing.images[0] || '/placeholder-part.jpg'} 
//                   alt={listing.title}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                     {listing.title}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     ₦{listing.price.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                     Condition: {listing.condition.toUpperCase()} • Type: {listing.partType.toUpperCase()}
//                   </p>
//                   <div className="flex gap-3">
//                     <button 
//                       onClick={() => setSelectedListing(listing)}
//                       className="flex-1 py-2 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-1"
//                     >
//                       <Eye className="h-4 w-4" /> View
//                     </button>
//                     <button 
//                       onClick={() => setEditing(listing)}
//                       className="flex-1 py-2 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-1"
//                     >
//                       <Edit className="h-4 w-4" /> Edit
//                     </button>
//                     <button 
//                       onClick={() => handleDelete(listing._id)}
//                       className="flex-1 py-2 bg-red-600 text-white rounded-xl flex items-center justify-center gap-1"
//                     >
//                       <Trash2 className="h-4 w-4" /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* View/Modal for details (expand as needed) */}
//       {/* {selectedListing && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8">
//             <h2 className="text-2xl font-bold mb-4">{selectedListing.title}</h2>
        
//             <button onClick={() => setSelectedListing(null)}>Close</button>
//           </div>
//         </div>
//       )} */}
//       {/* View Modal */}
// {selectedListing && (
//   <div 
//     className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//     onClick={() => setSelectedListing(null)} // close on backdrop click
//   >
//     <div 
//       className="bg-white dark:bg-gray-850 rounded-2xl md:rounded-3xl max-w-2xl lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
//       onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//     >
//       {/* Header */}
//       <div className="sticky top-0 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl md:rounded-t-3xl">
//         <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           {selectedListing.title}
//         </h2>
//         <button
//           onClick={() => setSelectedListing(null)}
//           className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//         >
//           <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-6 md:p-8 space-y-8">
//         {/* Images Carousel / Gallery (simple version) */}
//         {selectedListing.images?.length > 0 ? (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
//               {selectedListing.images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`${selectedListing.title} - image ${index + 1}`}
//                   className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
//                 />
//               ))}
//             </div>
//             {selectedListing.images.length > 1 && (
//               <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                 {selectedListing.images.length} photos available
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
//             <p className="text-gray-500 dark:text-gray-400">No images available</p>
//           </div>
//         )}

//         {/* Main Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Price</h3>
//               <p className="text-3xl font-bold text-green-600 dark:text-green-400">
//                 ₦{selectedListing.price.toLocaleString()}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Condition</h3>
//               <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
//                 selectedListing.condition === 'new'     ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
//                 selectedListing.condition === 'refurbished' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
//                 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
//               }`}>
//                 {selectedListing.condition.toUpperCase()}
//               </span>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Part Type</h3>
//               <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
//                 {selectedListing.partType.toUpperCase()}
//               </span>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Status</h3>
//               <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
//                 selectedListing.status === 'active'  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
//                 selectedListing.status === 'sold'    ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
//                 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
//               }`}>
//                 {selectedListing.status.toUpperCase()}
//               </span>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Compatible Makes</h3>
//               {selectedListing.compatibleMakes?.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {selectedListing.compatibleMakes.map((make, idx) => (
//                     <span 
//                       key={idx}
//                       className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
//                     >
//                       {make}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 dark:text-gray-400">Not specified</p>
//               )}
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Views / Inquiries</h3>
//               <p className="text-gray-700 dark:text-gray-300">
//                 👀 {selectedListing.views || 0} views • 💬 {selectedListing.inquiries || 0} inquiries
//               </p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Listed on</h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {new Date(selectedListing.createdAt).toLocaleDateString('en-GB', {
//                   year: 'numeric', month: 'long', day: 'numeric'
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//           <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
//           <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
//             {selectedListing.description}
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="sticky bottom-0 bg-white dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 px-6 py-5 flex justify-end gap-4 rounded-b-2xl md:rounded-b-3xl">
//         <button
//           onClick={() => setSelectedListing(null)}
//           className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
//         >
//           Close
//         </button>
//         <button
//           onClick={() => {
//             setSelectedListing(null);
//             setEditing(selectedListing);
//           }}
//           className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
//         >
//           <Edit className="h-4 w-4" /> Edit Listing
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default MyCarPartListings;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Loader2, Search, Edit, Trash2, X, Eye, DollarSign, Package, Save, 
} from 'lucide-react';
import { toast } from 'sonner';

const MyCarPartListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isEditing, setIsEditing] = useState(false);        // ← NEW: controls edit/view mode
  const [formData, setFormData] = useState({});             // ← NEW: controlled form state

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
        toast.error(data.message || 'Failed to load listings');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (listing) => {
    setSelectedListing(listing);
    setFormData({
      title: listing.title || '',
      description: listing.description || '',
      price: listing.price || '',
      condition: listing.condition || 'used',
      partType: listing.partType || 'other',
      compatibleMakes: listing.compatibleMakes?.join(', ') || '', // comma separated for input
      status: listing.status || 'active',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Keep selectedListing so we stay in view mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    // Basic client-side validation
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.description.trim()) return toast.error('Description is required');
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      return toast.error('Valid price is required');
    }

    try {
      const token = localStorage.getItem('token');
      
      // Prepare payload
      const payload = {
        ...formData,
        price: Number(formData.price),
        compatibleMakes: formData.compatibleMakes
          ? formData.compatibleMakes.split(',').map(m => m.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/carparts/${selectedListing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success('Listing updated successfully');
        fetchListings();
        setIsEditing(false);           // switch back to view mode
        // update local selectedListing to reflect changes immediately
        setSelectedListing(prev => ({ ...prev, ...payload }));
      } else {
        toast.error(data.message || 'Failed to update listing');
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
        if (selectedListing?._id === listingId) {
          setSelectedListing(null);
          setIsEditing(false);
        }
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
                  src={listing.images?.[0] || '/placeholder-part.jpg'} 
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 font-semibold">
                    ₦{listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                    {listing.condition.toUpperCase()} • {listing.partType.toUpperCase()}
                  </p>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => setSelectedListing(listing)}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button 
                      onClick={() => startEditing(listing)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
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

      {/* Modal – View OR Edit mode */}
      {selectedListing && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedListing(null);
            setIsEditing(false);
          }}
        >
          <div 
            className="bg-white dark:bg-gray-850 rounded-2xl md:rounded-3xl max-w-2xl lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl md:rounded-t-3xl">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate max-w-[80%]">
                {isEditing ? 'Edit Listing' : selectedListing.title}
              </h2>
              <button
                onClick={() => {
                  setSelectedListing(null);
                  setIsEditing(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {isEditing ? (
              /* ────────────────────────────────────────
                 EDIT MODE
              ──────────────────────────────────────── */
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price (₦) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Part Type
                    </label>
                    <select
                      name="partType"
                      value={formData.partType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="engine">Engine</option>
                      <option value="body">Body</option>
                      <option value="electronics">Electronics</option>
                      <option value="tyres">Tyres</option>
                      <option value="interior">Interior</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Compatible Makes (comma separated)
                    </label>
                    <input
                      name="compatibleMakes"
                      value={formData.compatibleMakes}
                      onChange={handleInputChange}
                      placeholder="Toyota, Honda, BMW, Mercedes"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Images preview (not editable here) */}
                {selectedListing.images?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Images
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedListing.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Image ${i+1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 font-medium transition-colors"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* ────────────────────────────────────────
                 VIEW MODE (your previous nice layout)
              ──────────────────────────────────────── */
              <div className="p-6 md:p-8 space-y-8">
                {/* Images */}
                {selectedListing.images?.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      {selectedListing.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${selectedListing.title} - image ${index + 1}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ))}
                    </div>
                    {selectedListing.images.length > 1 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        {selectedListing.images.length} photos
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Price</h3>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ₦{selectedListing.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Condition</h3>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                        selectedListing.condition === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                        selectedListing.condition === 'refurbished' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {selectedListing.condition.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Part Type</h3>
                      <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {selectedListing.partType.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Status</h3>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                        selectedListing.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                        selectedListing.status === 'sold' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                      }`}>
                        {selectedListing.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Compatible Makes</h3>
                      {selectedListing.compatibleMakes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedListing.compatibleMakes.map((make, i) => (
                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm border border-gray-300 dark:border-gray-600">
                              {make}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Not specified</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Engagement</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        👀 {selectedListing.views || 0} • 💬 {selectedListing.inquiries || 0}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Listed</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(selectedListing.createdAt).toLocaleDateString('en-GB', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedListing.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer – View mode */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 px-6 py-5 flex justify-end gap-4 rounded-b-2xl md:rounded-b-3xl">
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setIsEditing(false);
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => startEditing(selectedListing)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 font-medium transition-colors"
                  >
                    <Edit className="h-4 w-4" /> Edit Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCarPartListings;