

export const mockCarParts = [
  {
    id: 'part-1',
    title: 'Toyota Camry Engine Block',
    brand: 'Toyota',
    category: 'Engine Parts',
    condition: 'Remanufactured',
    price: 2500000,
    location: 'Lagos, Nigeria',
    imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    description: 'Fully remanufactured V6 engine block for Toyota Camry 2015-2020 models. Comes with a 6-month warranty.',
    compatibility: ['Toyota Camry 2015-2020', 'Lexus ES350 2016-2019'],
    seller: { name: 'AutoPartsNG', rating: 4.8 },
  },
  {
    id: 'part-2',
    title: 'Honda Civic Brake Pads',
    brand: 'Honda',
    category: 'Brakes',
    condition: 'New',
    price: 150000,
    location: 'Abuja, Nigeria',
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    description: 'OEM brake pads for Honda Civic 2016-2022. High-performance ceramic material for improved stopping power.',
    compatibility: ['Honda Civic 2016-2022'],
    seller: { name: 'CivicSpares', rating: 4.5 },
  },
  {
    id: 'part-3',
    title: 'Mercedes-Benz Headlight Assembly',
    brand: 'Mercedes-Benz',
    category: 'Electrical',
    condition: 'Used - Like New',
    price: 800000,
    location: 'Port Harcourt, Nigeria',
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    description: 'Genuine LED headlight assembly for Mercedes-Benz C-Class W205. Lightly used, no scratches or damage.',
    compatibility: ['Mercedes-Benz C-Class W205 2014-2021'],
    seller: { name: 'LuxuryAutoParts', rating: 4.7 },
  },
  {
    id: 'part-4',
    title: 'BMW X5 Suspension Kit',
    brand: 'BMW',
    category: 'Suspension',
    condition: 'New',
    price: 1200000,
    location: 'Ibadan, Nigeria',
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
    description: 'Complete suspension kit for BMW X5, including shocks and struts. Brand new, sealed in original packaging.',
    compatibility: ['BMW X5 2014-2018'],
    seller: { name: 'BMWSpares', rating: 4.6 },
  },
  {
    id: 'part-5',
    title: 'Nissan Altima Front Bumper',
    brand: 'Nissan',
    category: 'Body Parts',
    condition: 'Used - Good',
    price: 350000,
    location: 'Kano, Nigeria',
    imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    description: 'OEM front bumper for Nissan Altima 2019-2022. Minor scratches but fully functional.',
    compatibility: ['Nissan Altima 2019-2022'],
    seller: { name: 'NissanPartsHub', rating: 4.3 },
  },
];

// Format price in Naira
export const formatPrice = (price)=> {
  return price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
};

// Filter parts based on user input
export const filterParts = (parts, filters)=> {
  return parts.filter((part) => {
    const matchesBrand = filters.brand
      ? part.brand.toLowerCase().includes(filters.brand.toLowerCase())
      : true;
    const matchesCategory = filters.category
      ? part.category.toLowerCase() === filters.category.toLowerCase()
      : true;
    const matchesCondition = filters.condition
      ? part.condition.toLowerCase() === filters.condition.toLowerCase()
      : true;
    const matchesLocation = filters.location
      ? part.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    const matchesPrice = filters.priceRange
      ? (() => {
          const [min, max] = filters.priceRange.split('-').map(Number);
          if (!max) return part.price >= min;
          return part.price >= min && part.price <= max;
        })()
      : true;

    return matchesBrand && matchesCategory && matchesCondition && matchesLocation && matchesPrice;
  });
};