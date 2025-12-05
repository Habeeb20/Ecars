

export const mockBlogPosts = [
  {
    id: 'post-1',
    slug: 'protecting-your-vehicle-from-theft',
    title: 'Protecting Your Vehicle: Top Tips to Prevent Car Theft',
    excerpt: 'Learn essential strategies to safeguard your car from theft in Nigeria, including modern security systems and practical precautions.',
    content: `
# Protecting Your Vehicle: Top Tips to Prevent Car Theft

Car theft is a growing concern in Nigeria, with thousands of vehicles stolen annually. Here are some practical tips to protect your vehicle:

## 1. Install Modern Security Systems
- **GPS Trackers**: Real-time tracking helps recover stolen vehicles quickly.
- **Immobilizers**: Prevent the engine from starting without the correct key.
- **Alarm Systems**: Loud alarms deter thieves and alert nearby people.

## 2. Park Smart
- Choose well-lit, busy areas for parking.
- Use secure parking lots with CCTV when possible.
- Avoid leaving your car in isolated areas overnight.

## 3. Secure Your Keys
- Never leave spare keys in or near the vehicle.
- Use keyless entry systems with strong encryption.
- Store keys in a signal-blocking pouch to prevent relay attacks.

## 4. Additional Precautions
- Etch your VIN on windows to make the car less appealing to thieves.
- Use steering wheel locks as a visible deterrent.
- Remove valuables from plain sight to avoid attracting attention.

By implementing these measures, you can significantly reduce the risk of car theft and keep your vehicle safe.
    `,
    author: 'Chidi Okonkwo',
    date: '2025-06-10',
    category: 'Car Safety',
    tags: ['car theft', 'vehicle security', 'safety tips'],
    imageUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
    readTime: 5,
  },
  {
    id: 'post-2',
    slug: 'new-cars-2025',
    title: 'Top New Cars to Watch in 2025',
    excerpt: 'Explore the most exciting new car releases hitting the Nigerian market in 2025, from electric vehicles to luxury SUVs.',
    content: `
# Top New Cars to Watch in 2025

The automotive industry is buzzing with innovation, and 2025 brings a wave of exciting new cars to Nigeria. Here's our top picks:

## 1. Toyota Corolla Cross Hybrid
- **Price**: ₦25M (est.)
- **Features**: Hybrid powertrain, advanced safety suite, premium interior.
- **Why It Stands Out**: Fuel efficiency and reliability for urban driving.

## 2. Mercedes-Benz EQE SUV
- **Price**: ₦65M (est.)
- **Features**: Fully electric, 400km range, cutting-edge tech.
- **Why It Stands Out**: Luxury meets sustainability for eco-conscious buyers.

## 3. Ford Ranger Raptor
- **Price**: ₦40M (est.)
- **Features**: Off-road capability, twin-turbo engine, rugged design.
- **Why It Stands Out**: Perfect for adventure seekers and tough terrains.

## 4. Honda Civic Type R
- **Price**: ₦35M (est.)
- **Features**: High-performance engine, sporty styling, track-ready suspension.
- **Why It Stands Out**: A thrill for performance car enthusiasts.

These models promise to redefine driving in Nigeria with advanced technology and style. Keep an eye out for their official launches!
    `,
    author: 'Aisha Bello',
    date: '2025-06-05',
    category: 'New Cars',
    tags: ['new cars', '2025 models', 'electric vehicles', 'luxury cars'],
    imageUrl: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
    readTime: 6,
  },
  {
    id: 'post-3',
    slug: 'maintaining-your-car-in-nigeria',
    title: 'Maintaining Your Car in Nigeria: A Complete Guide',
    excerpt: 'Discover how to keep your car in top condition despite Nigeria’s challenging roads and climate.',
    content: `
# Maintaining Your Car in Nigeria: A Complete Guide

Nigeria’s roads and weather can be tough on vehicles, but proper maintenance can extend your car's life. Here’s how:

## 1. Regular Servicing
- Schedule oil changes every 5,000km or 3 months.
- Check air filters frequently due to dust and pollution.
- Inspect brakes and suspension for wear from potholes.

## 2. Protect Against Climate
- Use UV-protectant on dashboards to prevent cracking.
- Apply anti-rust coating to combat humidity and rain.
- Park in shaded areas to reduce heat damage.

## 3. Tire Care
- Check tire pressure weekly, especially during rainy seasons.
- Rotate tires every 10,000km for even wear.
- Keep a spare tire and tools for roadside emergencies.

## 4. Work with Trusted Mechanics
- Choose certified service centers or reputable local mechanics.
- Keep a maintenance log to track repairs and services.
- Avoid counterfeit parts by buying from authorized dealers.

With these tips, your car can handle Nigeria’s challenges while staying reliable and efficient.
    `,
    author: 'Emeka Nwosu',
    date: '2025-05-28',
    category: 'Car Maintenance',
    tags: ['car maintenance', 'vehicle care', 'Nigeria roads'],
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    readTime: 7,
  },
  {
    id: 'post-4',
    slug: 'electric-vehicles-nigeria',
    title: 'The Future of Electric Vehicles in Nigeria',
    excerpt: 'Can electric vehicles thrive in Nigeria? We explore the challenges and opportunities for EVs in the country.',
    content: `
# The Future of Electric Vehicles in Nigeria

Electric vehicles (EVs) are gaining global traction, but what’s their potential in Nigeria? Let’s dive in:

## Opportunities
- **Cost Savings**: Lower fuel and maintenance costs compared to petrol cars.
- **Government Support**: Potential incentives for green energy adoption.
- **Solar Power**: Nigeria’s abundant sunlight could power EV charging.

## Challenges
- **Infrastructure**: Limited charging stations in urban and rural areas.
- **Power Supply**: Unreliable electricity grid complicates home charging.
- **High Costs**: Import duties make EVs expensive for most buyers.

## What’s Happening Now
- Companies like **Jet Motor Company** are introducing affordable EVs.
- Solar-powered charging stations are being piloted in Lagos and Abuja.
- Training programs for EV mechanics are emerging.

## The Road Ahead
For EVs to succeed, Nigeria needs investment in charging infrastructure and policy support. With the right steps, EVs could transform transportation in the coming decade.
    `,
    author: 'Fatima Adebayo',
    date: '2025-05-20',
    category: 'Electric Vehicles',
    tags: ['electric cars', 'Nigeria', 'sustainability'],
    imageUrl: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg',
    readTime: 6,
  },
];

// Utility function to convert markdown to HTML (simplified)
export const markdownToHtml = (markdown) => {
  // Basic markdown parsing (can be enhanced with a library like marked)
  return markdown
    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/^- (.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>');
};