// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, MessageCircle, X, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { useAuth } from '../../contexts/AuthContext';


// const FeaturedCar = () => {
//   const [featuredCars, setFeaturedCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCar, setSelectedCar] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [chatMessage, setChatMessage] = useState('');
//   const [chatLoading, setChatLoading] = useState(false);

//   const { user, isLoggedIn } = useAuth(); // Assume this gives user and login status

//   useEffect(() => {
//     fetchFeaturedCars();
//   }, []);

//   const fetchFeaturedCars = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/featured`);
//       const data = await res.json();
//       console.log(data)
//       if (data.status === 'success') {
//         setFeaturedCars(data.data.cars);
//       } else {
//         toast.error('Failed to load featured cars');
//       }
//     } catch (err) {
//       console.log(err)
//       toast.error('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openDetailsModal = (car) => {
//     setSelectedCar(car);
//     setShowDetailsModal(true);
//   };

//   const openChat = () => {
//     if (!isLoggedIn) {
//       toast.error('Please login to chat');
//       window.location.href = '/login';
//       return;
//     }
//     setShowDetailsModal(false);
//     setShowChatModal(true);
//   };

//   const sendMessage = async () => {
//     if (!chatMessage.trim()) return toast.error('Message cannot be empty');

//     setChatLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/send`, { // Assume messages endpoint
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           receiverId: selectedCar.postedBy._id,
//           message: chatMessage,
//           carId: selectedCar._id,
//         }),
//       });
//       if (res.ok) {
//         toast.success('Message sent!');
//         setChatMessage('');
//         setShowChatModal(false);
//       } else {
//         toast.error('Failed to send message');
//       }
//     } catch (err) {
//       toast.error('Network error');
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   return (
//     <>
//       <section className="py-16 bg-gray-50 dark:bg-gray-900">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Cars</h2>
//             <Link to="/cars" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center group">
//               <span>View all</span>
//               <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-20">
//               <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {featuredCars.slice(0, 6).map((car) => (
//                 <div
//                   key={car._id}
//                   onClick={() => openDetailsModal(car)}
//                   className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl cursor-pointer transition-all"
//                 >
//                   <img src={car.images[0]} alt={car.title} className="w-full h-48 object-cover" />
//                   <div className="p-6">
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{car.title}</h3>
//                     <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">₦{car.price.toLocaleString()}</p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{car.make} {car.model} • {car.year}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* DETAILS MODAL */}
//       {showDetailsModal && selectedCar && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between flex-shrink-0">
//               <h2 className="text-2xl font-bold">Car Details</h2>
//               <button onClick={() => setShowDetailsModal(false)} className="text-gray-600 hover:text-gray-800 dark:text-gray-400">
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Scrollable Body */}
//             <div className="flex-1 overflow-y-auto p-8 space-y-8">
//               {/* Car Image Carousel */}
//               <div className="relative">
//                 <img src={selectedCar.images[0]} alt="" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
//                 <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full flex items-center gap-2">
//                   <img src={selectedCar.images[1]} alt="" className="h-8 w-8 object-cover rounded-full" />
//                   +{selectedCar.images.length - 1} photos
//                 </div>
//               </div>

//               {/* Car Details */}
//               <div>
//                 <h3 className="text-3xl font-bold mb-4">{selectedCar.title}</h3>
//                 <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-6">₦{selectedCar.price.toLocaleString()}</p>
//                 <div className="grid grid-cols-2 gap-6 text-sm">
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Make</p>
//                     <p className="font-bold">{selectedCar.make}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Model</p>
//                     <p className="font-bold">{selectedCar.model}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Year</p>
//                     <p className="font-bold">{selectedCar.year}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Mileage</p>
//                     <p className="font-bold">{selectedCar.mileage.toLocaleString()} km</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Location</p>
//                     <p className="font-bold">{selectedCar.location.lga}, {selectedCar.location.state}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600 dark:text-gray-400">Condition</p>
//                     <p className="font-bold">{selectedCar.condition}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <h4 className="text-xl font-bold mb-4">Description</h4>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedCar.description}</p>
//               </div>

//               {/* Seller Details */}
//               <div>
//                 <h4 className="text-xl font-bold mb-4">Seller Details</h4>
//                 <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                       {selectedCar.postedBy.firstName[0]}{selectedCar.postedBy.lastName[0]}
//                     </div>
//                     <div>
//                       <p className="font-bold text-lg">{selectedCar.postedBy.firstName} {selectedCar.postedBy.lastName}</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {selectedCar.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
//                       </p>
//                     </div>
//                   </div>
//                   {selectedCar.postedBy.role === 'dealer' && (
//                     <div className="mt-4 space-y-2 text-sm">
//                       <p><strong>Business:</strong> {selectedCar.postedBy.dealerInfo.businessName}</p>
//                       <p><strong>Location:</strong> {selectedCar.postedBy.dealerInfo.lga}, {selectedCar.postedBy.dealerInfo.state}</p>
//                       <p><strong>Verified:</strong> {selectedCar.postedBy.dealerInfo.verified ? 'Yes' : 'No'}</p>
//                     </div>
//                   )}
//                   <p className="mt-4 text-sm"><strong>Phone:</strong> {selectedCar.postedBy.phoneNumber}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Fixed Footer */}
//             <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
//               <button
//                 onClick={openChat}
//                 className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg transition"
//               >
//                 <MessageCircle className="h-6 w-6" />
//                 Chat with Seller
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHAT MODAL */}
//       {showChatModal && selectedCar && (
//         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full my-8 shadow-2xl max-h-[90vh] flex flex-col">
//             <div className="p-6 border-b flex justify-between flex-shrink-0">
//               <h3 className="text-2xl font-bold">Chat with Seller</h3>
//               <button onClick={() => setShowChatModal(false)}><X className="h-6 w-6" /></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-8 space-y-6">
//               <p className="text-gray-600 dark:text-gray-300">Send a message to the seller about this car.</p>
//               <textarea
//                 rows="6"
//                 value={chatMessage}
//                 onChange={e => setChatMessage(e.target.value)}
//                 placeholder="Hi, I'm interested in your car. Is it available?"
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
//               />
//             </div>
//             <div className="p-6 border-t flex-shrink-0">
//               <button
//                 onClick={sendMessage}
//                 disabled={chatLoading}
//                 className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-3"
//               >
//                 {chatLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <MessageCircle className="h-6 w-6" />}
//                 {chatLoading ? 'Sending...' : 'Send Message'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FeaturedCar;




/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, X, Loader2, MapPin, Gauge, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { buildCarSlug } from '../../utils/carSlug';

const navy = '#2563eb';
const rust = '#2563eb';

const FeaturedCar = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscriptions/featured`);
      const data = await res.json();
      if (data.status === 'success') {
        setFeaturedCars(data.data.cars);
      } else {
        toast.error('Failed to load featured cars');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Navigates to the car's detail page instead of opening a modal.
  // Falls back to plain _id if buildCarSlug isn't applicable to this data shape.
  const goToCarDetails = (car) => {
    const slugOrId = typeof buildCarSlug === 'function' ? buildCarSlug(car) : car._id;
    navigate(`/cars/${car._id}`);
  };

  // Quick "message seller" action from the card itself, without leaving the page.
  const openChat = (e, car) => {
    e.stopPropagation(); // prevent the card's own onClick (navigation) from also firing
    if (!isLoggedIn) {
      toast.error('Please login to chat');
      navigate('/login');
      return;
    }
    setSelectedCar(car);
    setShowChatModal(true);
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return toast.error('Message cannot be empty');

    setChatLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedCar.postedBy._id,
          message: chatMessage,
          carId: selectedCar._id,
        }),
      });
      if (res.ok) {
        toast.success('Message sent!');
        setChatMessage('');
        setShowChatModal(false);
      } else {
        toast.error('Failed to send message');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Featured Cars</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hand-picked listings from top sellers</p>
            </div>
            <Link
              to="/cars"
              className="flex items-center gap-1 text-sm font-semibold group shrink-0"
              style={{ color: navy }}
            >
              <span>View all</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No featured cars right now — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.slice(0, 6).map((car) => (
                <div
                  key={car._id}
                  onClick={() => goToCarDetails(car)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') goToCarDetails(car); }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={car.images?.[0] || '/placeholder-car.jpg'}
                      alt={car.title || `${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white shadow-sm"
                      style={{ background: rust }}
                    >
                      Featured
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-1 mb-1 group-hover:text-[#0B1B3E] dark:group-hover:text-white transition-colors">
                      {car.title || `${car.make} ${car.model}`}
                    </h3>
                    <p className="text-xl font-black mb-3" style={{ color: rust }}>
                      ₦{Number(car.price).toLocaleString()}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {car.year}</span>
                      {car.mileage != null && (
                        <span className="flex items-center gap-1"><Gauge size={12} /> {Number(car.mileage).toLocaleString()} km</span>
                      )}
                      {car.location?.state && (
                        <span className="flex items-center gap-1"><MapPin size={12} /> {car.location.state}</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => openChat(e, car)}
                      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ background: navy }}
                    >
                      <MessageCircle className="h-4 w-4" /> Message seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CHAT MODAL */}
      {showChatModal && selectedCar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowChatModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chat with seller</h3>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{selectedCar.title || `${selectedCar.make} ${selectedCar.model}`}</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Send a message to the seller about this car.</p>
              <textarea
                rows="6"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Hi, I'm interested in your car. Is it available?"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white resize-none focus:ring-4 focus:ring-[#0B1B3E]/5 focus:border-[#0B1B3E] outline-none transition-all"
              />
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-700 shrink-0">
              <button
                onClick={sendMessage}
                disabled={chatLoading || !chatMessage.trim()}
                className="w-full py-3.5 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
                style={{ background: navy }}
              >
                {chatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                {chatLoading ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedCar;