// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Eye } from 'lucide-react';
// import { 
//   MapPin, 
//   Star, 
//   Calendar, 
//   Gauge, 
//   Fuel, 
//   Phone, 
//   Building2, 
//   Award,
//   ArrowLeft,
//   Heart,
//   Share2,
//   MessageCircle,
//   CheckCircle,
//   Shield,
//   Clock,
//   Car,
//   Loader2
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '../contexts/AuthContext';

// const CarDetails = () => {
//   const { id } = useParams();
//   const [car, setCar] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { isLoggedIn } = useAuth();
//     const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [viewCount, setViewCount] = useState(0);

//   useEffect(() => {
//     fetchCarDetails();
//   }, [id]);

//   const fetchCarDetails = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`);
//       const data = await res.json();

//       if (data.status === 'success') {
//         setCar(data.data.car);
//         setViewCount(data.data.views || 0);
//         fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/view`, { method: 'PUT' });
//       } else {
//         toast.error('Car not found');
//       }
//     } catch (err) {
//       console.log(err)
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//     // Check like status
//   useEffect(() => {
//     const checkLike = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/like-status`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.status) {
//           setLiked(data.isLiked);
//           setLikeCount(data.likeCount);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     checkLike();
//   }, [id]);

//   const handleLikeToggle = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Please login to like');
//         return;
//       }

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/like`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();
//       if (data.status) {
//         setLiked(data.liked);
//         setLikeCount(data.likeCount);
//       }
//     } catch (err) {
//       toast.error('Failed to update like');
//     }
//   };

  
//   const handleShare = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     toast.success('Link copied to clipboard!');
//     // Optional: increment share count on backend
//   };


//   const formatPrice = (price) => {
//     if (!price) return '₦0';
//     return '₦' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   };

//   const formatMileage = (mileage) => {
//     if (!mileage && mileage !== 0) return '0 km';
//     return mileage.toLocaleString() + ' km';
//   };

//   const renderStars = (rating) => {
//     const num = rating || 0;
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`w-5 h-5 ${i < Math.floor(num) 
//           ? 'fill-yellow-400 text-yellow-400' 
//           : 'text-gray-300 dark:text-gray-600'
//         }`}
//       />
//     ));
//   };

//   const toggleFavorite = () => setIsFavorite(!isFavorite);

//   const toggleModal = () => setIsModalOpen(prev => !prev);

//   const openChat = () => {
//     if (!isLoggedIn) {
//       toast.error('Please login to chat');
//       window.location.href = '/login';
//       return;
//     }
//     // You can open a chat modal here or redirect to chat page
//     toast.success('Chat opened with seller');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-16 w-16 text-primary-600 animate-spin" />
//       </div>
//     );
//   }

//   if (!car) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-20">
//         <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md">
//           <Car className="w-24 h-24 text-gray-400 mx-auto mb-6" />
//           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Car Not Found</h1>
//           <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
//             Sorry, we couldn't find a vehicle with ID: <br />
//             <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-lg">{id}</code>
//           </p>
//           <Link 
//             to="/cars" 
//             className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all"
//           >
//             <ArrowLeft className="w-6 h-6 mr-3" />
//             Back to Listings
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black">
//       {/* Sticky Header */}
//       <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <Link 
//             to="/cars" 
//             className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-lg transition"
//           >
//             <ArrowLeft className="w-6 h-6 mr-3" />
//             Back to Search
//           </Link>
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={toggleFavorite}
//               className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
//             >
//               <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
//             </button>
//             <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
//               <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//             </button>


//                <div className="flex gap-6 mb-6 text-sm">
//             <div className="flex items-center gap-2">
//               <Eye className="h-5 w-5 text-slate-500" />
//               <span>{viewCount} views</span>
//             </div>
//             <button onClick={handleLikeToggle} className="flex items-center gap-2">
//               <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
//               <span>{likeCount} likes</span>
//             </button>
//             <button onClick={handleShare} className="flex items-center gap-2">
//               <Share2 className="h-5 w-5 text-slate-500" />
//               <span>Share</span>
//             </button>
//           </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-10 max-w-7xl">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           {/* Left: Images + Specs */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Main Image */}
//             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
//               <div className="relative">
//                 <img
//                   src={car.images?.[0] || '/placeholder-car.jpg'}
//                   alt={car.title}
//                   className="w-full h-96 lg:h-[600px] object-cover"
//                 />
//                 <div className="absolute top-6 left-6 flex gap-3">
//                   <span className="px-5 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2">
//                     <CheckCircle className="w-5 h-5" />
//                     Available
//                   </span>
//                   {car.rating && (
//                     <span className="px-5 py-2 bg-black/70 backdrop-blur text-white font-bold rounded-full flex items-center gap-2">
//                       <Star className="w-5 h-5 fill-yellow-400" />
//                       {car.rating}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Thumbnail Gallery */}
//               <div className="p-8 bg-gray-50 dark:bg-gray-900">
//                 <div className="grid grid-cols-4 gap-4">
//                   {car.images?.map((img, i) => (
//                     <div 
//                       key={i} 
//                       className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer group"
//                     >
//                       <img 
//                         src={img} 
//                         alt={`View ${i+1}`}
//                         className="w-full h-full object-cover group-hover:scale-110 transition"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Specifications */}
//             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
//                 <Car className="w-10 h-10 text-blue-600" />
//                 Vehicle Specifications
//               </h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                 {[
//                   { icon: Calendar, label: 'Year', value: car.year },
//                   { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
//                   { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
//                   { icon: Car, label: 'Transmission', value: car.transmission || 'N/A' },
//                   { icon: Car, label: 'Body Type', value: car.bodyType || 'Sedan' },
//                   { icon: Car, label: 'Color', value: car.color || 'Silver' },
//                   { icon: Shield, label: 'Condition', value: car.condition },
//                   { icon: Clock, label: 'Listed', value: '2 days ago' },
//                 ].map((spec, i) => (
//                   <div key={i} className="text-center">
//                     <spec.icon className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</p>
//                     <p className="text-xl font-bold text-gray-900 dark:text-white">{spec.value}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Features */}
//             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//                 Features & Equipment
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {car.features?.map((feature, i) => (
//                   <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
//                     <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
//                     <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{feature}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-8">
       

//             {/* Seller Card */}
//             {car.postedBy && (
//               <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Information</h3>
//                   <Shield className="w-10 h-10 text-green-500" />
//                 </div>

//                 <div className="text-center mb-6">
//                   <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
//                     {car.postedBy.firstName[0]}{car.postedBy.lastName[0]}
//                   </div>
//                   <h4 className="text-2xl font-bold mt-4">
//                     {car.postedBy.firstName} {car.postedBy.lastName}
//                   </h4>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {car.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
//                   </p>
//                 </div>

//                 <div className="space-y-5 text-center">
//                   <div className="flex items-center justify-center gap-3">
//                     <Phone className="w-6 h-6 text-blue-600" />
//                     <span className="font-semibold">{car.postedBy.phoneNumber}</span>
//                   </div>
//                   <div className="flex items-center justify-center gap-3">
//                     <MapPin className="w-6 h-6 text-blue-600" />
//                     <span>{car.location?.state ? `${car.location.state}, ${car.location.lga || ''}` : 'Location not specified'}</span>
//                   </div>
//                   {car.postedBy.role === 'dealer' && car.postedBy.dealerInfo && (
//                     <div className="flex items-center justify-center gap-3">
//                       <Building2 className="w-6 h-6 text-blue-600" />
//                       <span>{car.postedBy.dealerInfo.businessName}</span>
//                     </div>
//                   )}
//                   <div className="flex items-center justify-center gap-2 pt-4">
//                     {renderStars(car.rating)}
//                     <span className="text-xl font-bold">({car.rating || 'N/A'})</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//                  {/* Price & Actions */}
//              <div className="bg-gradient-to-br from-blue-900 via-indigo-300 to-purple-800 rounded-3xl shadow-2xl p-10 text-white sticky top-24">
//               <div className="text-center mb-8">
//                 <h1 className="text-4xl font-extrabold mb-4">{car.title}</h1>
//                 <div className="flex items-center justify-center gap-2 text-blue-100 mb-6">
//                   <MapPin className="w-6 h-6" />
//                   <span className="text-xl">
//                     {car.location?.state ? `${car.location.state}, ${car.location.lga || ''}` : 'Location not specified'}
//                   </span>
//                 </div>
//                 <div className="text-6xl font-black mb-6">
//                   {formatPrice(car.price)}
//                 </div>
//                 <div className="flex items-center justify-center gap-2">
//                   {renderStars(car.rating)}
//                   <span className="text-2xl font-bold">({car.rating || 'N/A'})</span>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <button 
//                   onClick={openChat}
//                   className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
//                 >
//                   <MessageCircle className="w-8 h-8" />
//                   Contact Seller
//                 </button>
//                 {/* <button className="w-full bg-black/30 hover:bg-black/40 backdrop-blur font-bold text-xl py-5 rounded-2xl transition-all">
//                   Schedule Test Drive
//                 </button>
//                 <button className="w-full border-4 border-white/50 hover:bg-white/10 font-bold text-xl py-5 rounded-2xl transition-all">
//                   Get Financing Quote
//                 </button> */}
//                 <button 
//                   onClick={toggleModal}
//                   className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-5 rounded-2xl shadow-xl transition-all"
//                 >
//                   Reserve This Car
//                 </button>
//               </div>
//             </div> 
//           </div>
//         </div>
//       </div>

//       {/* Reservation Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-6">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-lg w-full">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reserve This Vehicle</h2>
//             <div className="space-y-5 text-lg text-gray-700 dark:text-gray-300">
//               <p>Reservations are valid for <strong>30 days</strong> only.</p>
//               <p>To secure this vehicle, a deposit of <strong>30–50%</strong> of the price is required.</p>
//               <p className="text-blue-600 dark:text-blue-400 font-bold">
//                 Terms & conditions apply based on seller policy.
//               </p>
//             </div>
//             <div className="flex justify-end gap-4 mt-10">
//               <button
//                 onClick={toggleModal}
//                 className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-2xl transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={toggleModal}
//                 className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl transition"
//               >
//                 Proceed to Reserve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CarDetails;

































































/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Eye, Heart, Share2, MessageCircle, MapPin, Star, Calendar, Gauge, 
  Fuel, Phone, Building2, Award, ArrowLeft, CheckCircle, Shield, Clock, 
  Car, Loader2, X 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Cog, Palette } from 'lucide-react';
const CarDetails = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewCount, setViewCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`);
      const data = await res.json();

      if (data.status === 'success') {
        setCar(data.data.car);
        setViewCount(data.data.car.views || 0);

        // Record view (non-blocking)
        fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/view`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => console.log("View recorded"));
      } else {
        setError(data.message || 'Car not found');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check like status for logged-in user
  useEffect(() => {
    const checkLikeStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token ) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/like-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status) {
          setLiked(data.isLiked);
          setLikeCount(data.likeCount);
        }
      } catch (err) {
        console.error('Failed to check like status:', err);
      }
    };

    checkLikeStatus();
  }, [id, isLoggedIn]);

  const handleLikeToggle = async () => {
          const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like this listing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.status) {
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        toast.success(data.liked ? 'Added to favorites!' : 'Removed from favorites');
      } else {
        toast.error(data.message || 'Failed to update like');
      }
    } catch (err) {
      toast.error('Network error');
      console.error(err);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const openChat = () => {
    if (!isLoggedIn) {
      toast.error('Please login to message the seller');
      return;
    }
    toast.success('Chat with seller opened');
    // Replace with actual chat modal/open logic
  };

  const formatPrice = (price) => {
    if (!price) return '₦0';
    return '₦' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatMileage = (mileage) => {
    if (!mileage && mileage !== 0) return '0 km';
    return mileage.toLocaleString() + ' km';
  };

  const renderStars = (rating) => {
    const num = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(num) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-20">
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md border border-gray-200 dark:border-gray-700">
          <Car className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Car Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {error || `Sorry, we couldn't find vehicle ID: ${id}`}
          </p>
          <Link 
            to="/cars" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/cars" 
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Cars
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFavorite}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Toggle favorite"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>

            <button 
              onClick={handleShare}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              aria-label="Share listing"
            >
              <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Images & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img
                  src={car.images?.[0] || '/placeholder-car.jpg'}
                  alt={car.title || `${car.make} ${car.model}`}
                  className="w-full h-96 lg:h-[600px] object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="px-5 py-2 bg-green-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Available
                  </span>
                  {car.rating && (
                    <span className="px-5 py-2 bg-black/70 backdrop-blur text-white font-bold rounded-full flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400" />
                      {car.rating}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {car.images?.length > 1 && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="grid grid-cols-5 gap-3 overflow-x-auto">
                    {car.images.map((img, i) => (
                      <div 
                        key={i} 
                        className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer group flex-shrink-0"
                      >
                        <img 
                          src={img} 
                          alt={`View ${i+1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-wrap gap-8 justify-center border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                  <p className="text-xl font-bold">{viewCount}</p>
                </div>
              </div>

              <button 
                onClick={handleLikeToggle}
                className="flex items-center gap-3 hover:scale-105 transition-transform"
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                  <p className="text-xl font-bold">{likeCount}</p>
                </div>
              </button>

              <button 
                onClick={handleShare}
                className="flex items-center gap-3 hover:scale-105 transition-transform"
                aria-label="Share"
              >
                <Share2 className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share</p>
                  <p className="text-xl font-bold">Link</p>
                </div>
              </button>
            </div>

            {/* Vehicle Specifications */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                <Car className="w-10 h-10 text-indigo-600" />
                Vehicle Details
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType?.toUpperCase() || 'N/A' },
                  { icon: Cog, label: 'Transmission', value: car.transmission?.toUpperCase() || 'N/A' },
                  { icon: Car, label: 'Body Type', value: car.bodyType?.toUpperCase() || 'N/A' },
                  { icon: Palette, label: 'Color', value: car.color || 'N/A' },
                  { icon: Shield, label: 'Condition', value: car.condition?.toUpperCase() || 'N/A' },
                  { icon: Clock, label: 'Listed', value: new Date(car.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map((spec, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <spec.icon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Description</h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {car.description || 'No description provided.'}
              </p>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Features & Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {/* Price & Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h3 className='text-3xl font-black mb-3'>{car.title}</h3>
                <h2 className="text-5xl font-black mb-3">{formatPrice(car.price)}</h2>
                <p className="text-indigo-200 text-lg">Fixed Price • Negotiable</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={openChat}
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-100 font-bold text-xl py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-8 h-8" />
                  Contact Seller
                </button>

                <button 
                  onClick={toggleModal}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-5 rounded-2xl shadow-xl transition-all"
                >
                  Reserve This Car
                </button>
              </div>
            </div>

            {/* Seller Info */}
            {car.postedBy && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seller</h3>
                  <Shield className="w-10 h-10 text-green-500" />
                </div>

                <div className="text-center mb-6">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                    {car.postedBy.firstName?.[0]}{car.postedBy.lastName?.[0]}
                  </div>
                  <h4 className="text-2xl font-bold mt-4">
                    {car.postedBy.firstName} {car.postedBy.lastName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {car.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
                  </p>
                </div>

                <div className="space-y-5 text-center">
                  {car.postedBy.phoneNumber && (
                    <p className="flex items-center justify-center gap-3 text-lg">
                      <Phone className="w-6 h-6 text-indigo-600" />
                      {car.postedBy.phoneNumber}
                    </p>
                  )}

                  {car.location?.state && (
                    <p className="flex items-center justify-center gap-3 text-lg">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                      {car.location.state}, {car.location.lga || 'N/A'}
                    </p>
                  )}

                  {car.postedBy.dealerInfo?.businessName && (
                    <p className="flex items-center justify-center gap-3 text-lg">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                      {car.postedBy.dealerInfo.businessName}
                    </p>
                  )}

                  <div className="pt-4 flex justify-center gap-2">
                    {renderStars(car.rating || 0)}
                    <span className="text-xl font-bold ml-2">({car.rating || 'New'})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-lg w-full relative">
            <button 
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <X className="h-8 w-8" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Reserve This Vehicle
            </h2>

            <div className="space-y-6 text-center text-lg text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-2xl text-indigo-600">
                Reservation Fee: 30–50% deposit required
              </p>
              <p>Reservation is valid for <strong>30 days</strong>.</p>
              <p className="text-sm opacity-80">
                Final payment and collection terms are agreed directly with the seller.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={toggleModal}
                className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleModal();
                  toast.success('Reservation request sent!');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl transition"
              >
                Proceed to Reserve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal Placeholder */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4">
          {/* Paste your chat modal UI here */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col">
            {/* Your chat content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;