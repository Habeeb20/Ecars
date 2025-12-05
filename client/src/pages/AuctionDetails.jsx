/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Gavel, 
  Heart, 
  MapPin, 
  Star, 
  Shield, 
  Calendar, 
  Gauge, 
  Fuel, 
  Car, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  List,
  Users,
  FileText,
} from 'lucide-react';

import { 
  mockAuctions, 
  mockAuctionSellers, 
  mockBids, 
  formatPrice, 
  getTimeRemaining, 
  getAuctionStatus 
} from '../data/auctions';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [seller, setSeller] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Load auction data
  useEffect(() => {
    const foundAuction = mockAuctions.find(a => a.id === id);
    if (foundAuction) {
      setAuction(foundAuction);
      setSelectedImage(foundAuction.imageUrl);
      setBidAmount(foundAuction.currentBid + 100000); // Minimum increment

      const foundSeller = mockAuctionSellers.find(s => s.id === foundAuction.sellerId);
      setSeller(foundSeller || null);

      const auctionBids = mockBids.filter(b => b.auctionId === foundAuction.id);
      setBids(auctionBids);
    }
  }, [id]);

  // Real-time countdown every second
  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      setTimeLeft(getTimeRemaining(auction.endDate));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Auction Not Found</h2>
          <Link 
            to="/auctions" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Auctions
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const status = getAuctionStatus(auction);
    const badges = {
      'ending-soon': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: Clock, text: 'Ending Soon' },
      'reserve-met': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, text: 'Reserve Met' },
      'no-reserve': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Gavel, text: 'No Reserve' },
      'active': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Gavel, text: 'Active' },
    };

    const badge = badges[status] || badges.active;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${badge.color}`}>
        <Icon className="w-5 h-5 mr-2" />
        {badge.text}
      </span>
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (bidAmount < auction.currentBid + 100000) {
      alert('Your bid must be at least ₦100,000 higher than the current bid.');
      return;
    }
    alert(`Bid of ₦${formatPrice(bidAmount)} successfully placed!`);
    // In real app: send to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Link
          to="/auctions"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Back to Auctions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={auction.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
                <div className="absolute top-6 left-6">{getStatusBadge()}</div>
                <div className="absolute top-6 right-6 flex gap-3">
                  <button className="p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-full shadow-lg hover:scale-110 transition">
                    <Heart className="w-6 h-6 text-red-500" />
                  </button>
                  <div className="px-4 py-3 bg-black/70 backdrop-blur text-white rounded-full flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-bold">{auction.watchers}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {auction.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded-xl overflow-hidden border-4 transition-all ${
                        selectedImage === img ? 'border-indigo-600 shadow-lg' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-24 object-cover hover:opacity-80 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {auction.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: Calendar, label: 'Year', value: auction.year },
                  { icon: Gauge, label: 'Mileage', value: `${(auction.mileage).toLocaleString()} km` },
                  { icon: Fuel, label: 'Fuel', value: auction.fuelType },
                  { icon: Car, label: 'Transmission', value: auction.transmission },
                  { icon: Car, label: 'Body Type', value: auction.bodyType },
                  { icon: Car, label: 'Color', value: auction.color },
                  { icon: Award, label: 'Condition', value: auction.condition },
                  { icon: FileText, label: 'VIN', value: auction.vin || 'Not Provided' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <item.icon className="w-8 h-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    <p className="font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <List className="w-6 h-6 text-indigo-600" />
                  Key Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {auction.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {auction.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Bidding Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-red-500 animate-pulse" />
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {timeLeft}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{auction.bidCount} bids placed</p>
              </div>

              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Bid</p>
                <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  ₦{formatPrice(auction.currentBid)}
                </p>
                {!auction.isReserveMetStatus && auction.reservePrice && (
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                    Reserve not met
                  </p>
                )}
              </div>

              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600">₦</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={auction.currentBid + 100000}
                    step="100000"
                    className="w-full pl-12 pr-4 py-5 text-2xl font-bold text-center border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter bid amount"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl py-5 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Gavel className="w-8 h-8" />
                  Place Your Bid
                </button>
              </form>

              <button className="w-full mt-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-3 font-medium">
                <Eye className="w-6 h-6" />
                Watch This Auction
              </button>
            </div>

            {/* Seller Card */}
            {seller && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-indigo-200 dark:border-indigo-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seller</h3>
                  {seller.verified && <Shield className="w-8 h-8 text-green-500" />}
                </div>

                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {seller.name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold mt-4">{seller.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{seller.type} Seller</p>
                </div>

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>{seller.totalSales} vehicles sold</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Member since {seller.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 pt-4">
                    {renderStars(seller.rating)}
                    <span className="ml-2 font-bold text-lg">({seller.rating})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bid History */}
        {bids.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Gavel className="w-8 h-8 text-indigo-600" />
              Bid History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left">
                    <th className="pb-4 font-bold">Bidder</th>
                    <th className="pb-4 font-bold">Amount</th>
                    <th className="pb-4 font-bold">Time</th>
                    <th className="pb-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map(bid => (
                    <tr key={bid.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 font-medium">{bid.bidderName}</td>
                      <td className="py-4 font-bold text-indigo-600 dark:text-indigo-400">
                        ₦{formatPrice(bid.amount)}
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-400">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-4">
                        {bid.isWinning ? (
                          <span className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-bold">
                            Winning
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Outbid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionDetails;