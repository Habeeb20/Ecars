// data/auctions.js

// Mock auction data (pure JavaScript)
export const mockAuctions = [
  {
    id: 'auction-1',
    title: '2019 Mercedes-Benz C300 AMG Line',
    brand: 'Mercedes-Benz',
    model: 'C300',
    year: 2019,
    imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg'
    ],
    currentBid: 18500000,
    reservePrice: 20000000,
    startingBid: 15000000,
    bidCount: 23,
    timeLeft: '2d 14h 32m',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    location: 'Lagos, Nigeria',
    mileage: 45000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Black',
    condition: 'Excellent',
    features: [
      'AMG Line Package',
      'Premium Sound System',
      'Navigation System',
      'Leather Seats',
      'Sunroof',
      'Parking Sensors',
      'Cruise Control',
      'Bluetooth Connectivity'
    ],
    description: 'Pristine 2019 Mercedes-Benz C300 with AMG Line package. Single owner, full service history, and immaculate condition throughout.',
    sellerId: 'seller-1',
    sellerName: 'Premium Motors Lagos',
    sellerRating: 4.8,
    isReserveMetStatus: false,
    auctionType: 'live',
    status: 'active',
    watchers: 156,
    vin: 'WDDWF4HB1KR123456',
    engineSize: '2.0L Turbo',
    drivetrain: 'RWD'
  },
  {
    id: 'auction-2',
    title: '2020 Toyota Camry XLE',
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    images: [
      'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg'
    ],
    currentBid: 12800000,
    reservePrice: 14000000,
    startingBid: 10000000,
    bidCount: 18,
    timeLeft: '1d 8h 15m',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    location: 'Abuja, Nigeria',
    mileage: 32000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Silver',
    condition: 'Excellent',
    features: [
      'XLE Premium Package',
      'JBL Audio System',
      'Wireless Phone Charger',
      'Heated Seats',
      'Dual Zone Climate Control',
      'Toyota Safety Sense 2.0',
      'Smart Key System'
    ],
    description: 'Low mileage 2020 Toyota Camry XLE with premium features. Excellent fuel economy and reliability.',
    sellerId: 'seller-2',
    sellerName: 'AutoHub Abuja',
    sellerRating: 4.6,
    isReserveMetStatus: false,
    auctionType: 'timed',
    status: 'active',
    watchers: 89,
    vin: 'JTNK4RBE5L3123456',
    engineSize: '2.5L',
    drivetrain: 'FWD'
  },
  {
    id: 'auction-3',
    title: '2018 BMW X5 xDrive35i',
    brand: 'BMW',
    model: 'X5',
    year: 2018,
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    images: [
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'
    ],
    currentBid: 22000000,
    reservePrice: 25000000,
    startingBid: 18000000,
    bidCount: 31,
    timeLeft: '4h 22m',
    endDate: new Date(Date.now() + 4 * 60 * 60 * 1000 + 22 * 60 * 1000),
    location: 'Port Harcourt, Nigeria',
    mileage: 58000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'White',
    condition: 'Good',
    features: [
      'xDrive All-Wheel Drive',
      'Premium Package',
      'Harman Kardon Sound',
      'Panoramic Sunroof',
      'Third Row Seating',
      'Navigation System',
      'Parking Assistant',
      'Adaptive Cruise Control'
    ],
    description: 'Well-maintained BMW X5 with excellent performance and luxury features. Perfect for families.',
    sellerId: 'seller-3',
    sellerName: 'Elite Cars PH',
    sellerRating: 4.7,
    isReserveMetStatus: false,
    auctionType: 'live',
    status: 'active',
    watchers: 203,
    vin: 'WBAKB8C59JB123456',
    engineSize: '3.0L Twin Turbo',
    drivetrain: 'AWD'
  },
  {
    id: 'auction-4',
    title: '2021 Honda Accord Sport',
    brand: 'Honda',
    model: 'Accord',
    year: 2021,
    imageUrl: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    images: [
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
      'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg'
    ],
    currentBid: 14500000,
    reservePrice: 16000000,
    startingBid: 12000000,
    bidCount: 15,
    timeLeft: '3d 2h 45m',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    location: 'Kano, Nigeria',
    mileage: 28000,
    fuelType: 'Petrol',
    transmission: 'CVT',
    bodyType: 'Sedan',
    color: 'Red',
    condition: 'Excellent',
    features: [
      'Sport Package',
      'Honda Sensing Suite',
      'Apple CarPlay/Android Auto',
      'Dual Zone Climate',
      'Sport Seats',
      'Alloy Wheels',
      'LED Headlights',
      'Remote Start'
    ],
    description: 'Nearly new Honda Accord Sport with advanced safety features and sporty styling.',
    sellerId: 'seller-4',
    sellerName: 'Northern Auto Sales',
    sellerRating: 4.5,
    isReserveMetStatus: false,
    auctionType: 'timed',
    status: 'active',
    watchers: 67,
    vin: 'JHMCV3F39MC123456',
    engineSize: '1.5L Turbo',
    drivetrain: 'FWD'
  },
  {
    id: 'auction-5',
    title: '2017 Lexus RX 350 F Sport',
    brand: 'Lexus',
    model: 'RX 350',
    year: 2017,
    imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg'
    ],
    currentBid: 19800000,
    reservePrice: 22000000,
    startingBid: 16000000,
    bidCount: 27,
    timeLeft: '6d 12h 18m',
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
    location: 'Ibadan, Nigeria',
    mileage: 62000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Gray',
    condition: 'Good',
    features: [
      'F Sport Package',
      'Mark Levinson Audio',
      'Navigation System',
      'Blind Spot Monitor',
      'Heated/Cooled Seats',
      'Power Tailgate',
      'Adaptive Headlights',
      'Lane Departure Alert'
    ],
    description: 'Luxury Lexus RX 350 with F Sport package. Exceptional build quality and reliability.',
    sellerId: 'seller-5',
    sellerName: 'Luxury Motors Ibadan',
    sellerRating: 4.9,
    isReserveMetStatus: false,
    auctionType: 'live',
    status: 'active',
    watchers: 134,
    vin: 'JTJBARBZ5H2123456',
    engineSize: '3.5L V6',
    drivetrain: 'AWD'
  },
  {
    id: 'auction-6',
    title: '2019 Ford Mustang GT',
    brand: 'Ford',
    model: 'Mustang',
    year: 2019,
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    images: [
      'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'
    ],
    currentBid: 25000000,
    reservePrice: 28000000,
    startingBid: 20000000,
    bidCount: 42,
    timeLeft: '12h 8m',
    endDate: new Date(Date.now() + 12 * 60 * 60 * 1000 + 8 * 60 * 1000),
    location: 'Lagos, Nigeria',
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Coupe',
    color: 'Blue',
    condition: 'Excellent',
    features: [
      'GT Performance Package',
      'Recaro Racing Seats',
      'Brembo Brakes',
      'Active Exhaust',
      'Track Apps',
      'Premium Audio',
      'Navigation',
      'Launch Control'
    ],
    description: 'Stunning Ford Mustang GT with performance package. Low miles and exceptional condition.',
    sellerId: 'seller-1',
    sellerName: 'Premium Motors Lagos',
    sellerRating: 4.8,
    isReserveMetStatus: true,
    auctionType: 'live',
    status: 'active',
    watchers: 298,
    vin: 'JFACP46E5K5123456',
    engineSize: '5.0L V8',
    drivetrain: 'RWD'
  }
];

export const mockAuctionSellers = [
  {
    id: 'seller-1',
    name: 'Premium Motors Lagos',
    type: 'dealer',
    rating: 4.8,
    totalSales: 156,
    location: 'Lagos, Nigeria',
    verified: true,
    memberSince: '2018'
  },
  {
    id: 'seller-2',
    name: 'AutoHub Abuja',
    type: 'dealer',
    rating: 4.6,
    totalSales: 89,
    location: 'Abuja, Nigeria',
    verified: true,
    memberSince: '2019'
  },
  {
    id: 'seller-3',
    name: 'Elite Cars PH',
    type: 'dealer',
    rating: 4.7,
    totalSales: 203,
    location: 'Port Harcourt, Nigeria',
    verified: true,
    memberSince: '2017'
  },
  {
    id: 'seller-4',
    name: 'Northern Auto Sales',
    type: 'dealer',
    rating: 4.5,
    totalSales: 67,
    location: 'Kano, Nigeria',
    verified: true,
    memberSince: '2020'
  },
  {
    id: 'seller-5',
    name: 'Luxury Motors Ibadan',
    type: 'dealer',
    rating: 4.9,
    totalSales: 134,
    location: 'Ibadan, Nigeria',
    verified: true,
    memberSince: '2016'
  }
];

export const mockBids = [
  {
    id: 'bid-1',
    auctionId: 'auction-1',
    bidderId: 'bidder-1',
    bidderName: 'John D.',
    amount: 18500000,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isWinning: true
  },
  {
    id: 'bid-2',
    auctionId: 'auction-1',
    bidderId: 'bidder-2',
    bidderName: 'Sarah M.',
    amount: 18200000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isWinning: false
  },
  {
    id: 'bid-3',
    auctionId: 'auction-2',
    bidderId: 'bidder-3',
    bidderName: 'Mike R.',
    amount: 12800000,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    isWinning: true
  }
];

// Utility functions (pure JS)
export const formatPrice = (price) => {
  if (!price) return '₦0';
  return '₦' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getTimeRemaining = (endDate) => {
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();

  if (timeLeft <= 0) return 'Ended';

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const getAuctionStatus = (auction) => {
  const timeLeft = new Date(auction.endDate).getTime() - new Date().getTime();
  const hoursLeft = timeLeft / (1000 * 60 * 60);

  if (hoursLeft <= 1) return 'ending-soon';
  if (auction.isReserveMetStatus) return 'reserve-met';
  if (!auction.reservePrice) return 'no-reserve';
  return 'active';
};