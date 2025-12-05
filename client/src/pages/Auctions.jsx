/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  Eye, 
  Gavel, 
  Heart,
  Filter,
  MapPin,
  Star,
  Shield,
  TrendingUp,
  Calendar,
  Gauge,
  Fuel,
  Users,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  mockAuctions, 
  mockAuctionSellers, 
  formatPrice, 
  getTimeRemaining, 
  getAuctionStatus 
} from '../data/auctions';

const Auctions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions);
  const [showFilters, setShowFilters] = useState(false);

  // Real-time countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredAuctions(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter + Search + Sort
  useEffect(() => {
    let filtered = mockAuctions.filter(auction => {
      const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           auction.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'luxury' && ['Mercedes-Benz', 'BMW', 'Lexus', 'Audi'].includes(auction.brand)) ||
        (selectedCategory === 'sports' && ['Mustang', 'Camaro'].includes(auction.model)) ||
        (selectedCategory === 'suv' && auction.bodyType === 'SUV') ||
        (selectedCategory === 'sedan' && auction.bodyType === 'Sedan');

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ending-soon':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'highest-bid':
          return b.currentBid - a.currentBid;
        case 'most-watched':
          return b.watchers - a.watchers;
        case 'newest':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    setFilteredAuctions(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  // Fixed: Now accepts auction as parameter
  const getStatusBadge = (auction) => {
    const status = getAuctionStatus(auction);
    const badges = {
      'ending-soon': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: Clock, text: 'Ending Soon' },
      'reserve-met': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, text: 'Reserve Met' },
      'no-reserve': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: TrendingUp, text: 'No Reserve' },
      'active': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Gavel, text: 'Active' },
    };

    const { color, icon: Icon, text } = badges[status] || badges.active;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {text}
      </span>
    );
  };

  // Fixed: Now accepts rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            PREMIUM CAR AUCTIONS
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto">
            Bid on verified luxury and performance vehicles from trusted dealers across Nigeria
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-5 pr-16 text-lg rounded-2xl shadow-2xl focus:ring-4 focus:ring-white/30 outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Live Auctions</h2>
            <span className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-bold">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              LIVE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:shadow-lg transition"
            >
              <Filter className="w-5 h-5" />
              Filters {showFilters && '(Showing)'}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="highest-bid">Highest Bid</option>
              <option value="most-watched">Most Watched</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-10">
            <h3 className="text-xl font-bold mb-6">Browse by Category</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'all', label: 'All Auctions' },
                { value: 'luxury', label: 'Luxury Cars' },
                { value: 'sports', label: 'Sports & Performance' },
                { value: 'suv', label: 'SUVs & Crossovers' },
                { value: 'sedan', label: 'Sedans' },
              ].map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAuctions.map((auction) => {
            const seller = mockAuctionSellers.find(s => s.id === auction.sellerId);

            return (
              <Link key={auction.id} to={`/auctions/${auction.id}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={auction.imageUrl}
                      alt={auction.title}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(auction)}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:scale-110 transition">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                      <div className="px-3 py-2 bg-black/70 backdrop-blur text-white rounded-full flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{auction.watchers}</span>
                      </div>
                    </div>

                    {/* Time Left */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-red-400" />
                          <span className="text-xl font-bold">{getTimeRemaining(auction.endDate)}</span>
                        </div>
                        <span className="text-sm opacity-90">{auction.bidCount} bids</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition">
                      {auction.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-5 h-5" />
                      <span>{auction.location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                        <p className="text-sm font-bold">{auction.year}</p>
                      </div>
                      <div>
                        <Gauge className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                        <p className="text-sm font-bold">{(auction.mileage).toLocaleString()} km</p>
                      </div>
                      <div>
                        <Fuel className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                        <p className="text-sm font-bold">{auction.fuelType}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Bid</span>
                        <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          ₦{formatPrice(auction.currentBid)}
                        </span>
                      </div>
                      {!auction.isReserveMetStatus && auction.reservePrice && (
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          Reserve not met
                        </p>
                      )}
                    </div>

                    {/* Seller */}
                    {seller && (
                      <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {seller.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{seller.name}</p>
                            <div className="flex items-center gap-1">
                              {renderStars(seller.rating)}
                              <span className="text-xs text-gray-500">({seller.rating})</span>
                            </div>
                          </div>
                        </div>
                        {seller.verified && <Shield className="w-6 h-6 text-green-500" />}
                      </div>
                    )}

                    <button className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                      <Gavel className="w-6 h-6" />
                      Place Bid Now
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAuctions.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Auctions Found</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('ending-soon');
              }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;