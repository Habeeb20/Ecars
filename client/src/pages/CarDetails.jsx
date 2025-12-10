import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Gauge, 
  Fuel, 
  Phone, 
  Building2, 
  Award,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  Shield,
  Clock,
  Car,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cars/${id}`);
      const data = await res.json();

      if (data.status === 'success') {
        setCar(data.data.car);
      } else {
        toast.error('Car not found');
      }
    } catch (err) {
      console.log(err)
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
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

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const toggleModal = () => setIsModalOpen(prev => !prev);

  const openChat = () => {
    if (!isLoggedIn) {
      toast.error('Please login to chat');
      window.location.href = '/login';
      return;
    }
    // You can open a chat modal here or redirect to chat page
    toast.success('Chat opened with seller');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center py-20">
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md">
          <Car className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Car Not Found</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find a vehicle with ID: <br />
            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-lg">{id}</code>
          </p>
          <Link 
            to="/cars" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/cars" 
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-lg transition"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Back to Search
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFavorite}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
            <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
              <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Images + Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={car.images?.[0] || '/placeholder-car.jpg'}
                  alt={car.title}
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
              <div className="p-8 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-4 gap-4">
                  {car.images?.map((img, i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer group"
                    >
                      <img 
                        src={img} 
                        alt={`View ${i+1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                <Car className="w-10 h-10 text-blue-600" />
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  { icon: Car, label: 'Transmission', value: car.transmission || 'N/A' },
                  { icon: Car, label: 'Body Type', value: car.bodyType || 'Sedan' },
                  { icon: Car, label: 'Color', value: car.color || 'Silver' },
                  { icon: Shield, label: 'Condition', value: car.condition },
                  { icon: Clock, label: 'Listed', value: '2 days ago' },
                ].map((spec, i) => (
                  <div key={i} className="text-center">
                    <spec.icon className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Features & Equipment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {car.features?.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Price & Actions */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 text-white sticky top-24">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold mb-4">{car.title}</h1>
                <div className="flex items-center justify-center gap-2 text-blue-100 mb-6">
                  <MapPin className="w-6 h-6" />
                  <span className="text-xl">
                    {car.location?.state ? `${car.location.state}, ${car.location.lga || ''}` : 'Location not specified'}
                  </span>
                </div>
                <div className="text-6xl font-black mb-6">
                  {formatPrice(car.price)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {renderStars(car.rating)}
                  <span className="text-2xl font-bold">({car.rating || 'N/A'})</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={openChat}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-8 h-8" />
                  Contact Seller
                </button>
                <button className="w-full bg-black/30 hover:bg-black/40 backdrop-blur font-bold text-xl py-5 rounded-2xl transition-all">
                  Schedule Test Drive
                </button>
                <button className="w-full border-4 border-white/50 hover:bg-white/10 font-bold text-xl py-5 rounded-2xl transition-all">
                  Get Financing Quote
                </button>
                <button 
                  onClick={toggleModal}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-5 rounded-2xl shadow-xl transition-all"
                >
                  Reserve This Car
                </button>
              </div>
            </div>

            {/* Seller Card */}
            {car.postedBy && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Information</h3>
                  <Shield className="w-10 h-10 text-green-500" />
                </div>

                <div className="text-center mb-6">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    {car.postedBy.firstName[0]}{car.postedBy.lastName[0]}
                  </div>
                  <h4 className="text-2xl font-bold mt-4">
                    {car.postedBy.firstName} {car.postedBy.lastName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {car.postedBy.role === 'dealer' ? 'Verified Dealer' : 'Private Seller'}
                  </p>
                </div>

                <div className="space-y-5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold">{car.postedBy.phoneNumber}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <span>{car.location?.state ? `${car.location.state}, ${car.location.lga || ''}` : 'Location not specified'}</span>
                  </div>
                  {car.postedBy.role === 'dealer' && car.postedBy.dealerInfo && (
                    <div className="flex items-center justify-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <span>{car.postedBy.dealerInfo.businessName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 pt-4">
                    {renderStars(car.rating)}
                    <span className="text-xl font-bold">({car.rating || 'N/A'})</span>
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
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 max-w-lg w-full">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reserve This Vehicle</h2>
            <div className="space-y-5 text-lg text-gray-700 dark:text-gray-300">
              <p>Reservations are valid for <strong>30 days</strong> only.</p>
              <p>To secure this vehicle, a deposit of <strong>30–50%</strong> of the price is required.</p>
              <p className="text-blue-600 dark:text-blue-400 font-bold">
                Terms & conditions apply based on seller policy.
              </p>
            </div>
            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={toggleModal}
                className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={toggleModal}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl transition"
              >
                Proceed to Reserve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;