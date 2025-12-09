// controllers/carController.js
import CarListing from '../models/carListing.js';
import User from '../models/user.js';
import Subscription from '../models/subscriptionSchema.js';

// Get Featured Cars (active featured subscriptions)
export const getFeaturedCars = async (req, res) => {
  try {
    console.log('Fetching featured cars...');

    const cars = await CarListing.find({}).populate('postedBy');
    console.log('All cars in DB:', cars.length);

    const featured = await CarListing.find({
      isFeatured: true,
      status: 'active',
    });

    console.log('Cars with isFeatured=true:', featured.length);
    featured.forEach(c => {
      console.log(`Car: ${c.title}, isFeatured: ${c.isFeatured}, featuredUntil: ${c.featuredUntil}`);
    });

    const result = await CarListing.find({
      isFeatured: true,
      status: 'active',
      // featuredUntil: { $gt: new Date() },
    })
      .populate('postedBy', 'firstName lastName role dealerInfo')
      .sort('-featuredUntil')
      .limit(20);

    console.log('FINAL RESULT:', result.length, 'cars');

    res.json({
      status: 'success',
      results: result.length,
      data: { cars: result },
      debug: {
        totalCars: cars.length,
        featuredFlagTrue: featured.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get Newest Listings (latest 50 active cars)
export const getNewestListings = async (req, res) => {
  try {
    const newestCars = await CarListing.find({ status: 'active' })
      .populate('postedBy', 'firstName lastName role dealerInfo')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: newestCars.length,
      data: { cars: newestCars },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch newest listings' });
  }
};




export const getFeaturedDealers = async (req, res) => {
  try {
    const featuredDealers = await User.find({
      role: 'dealer',
      'dealerInfo.isFeatured': true,
      'dealerInfo.featuredUntil': { $gt: new Date() },
    })
      .select('firstName lastName dealerInfo phoneNumber avatar')
      .sort('-dealerInfo.featuredUntil')
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: featuredDealers.length,
      data: { dealers: featuredDealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch featured dealers' });
  }
};

// Get Featured Service Providers
export const getFeaturedServiceProviders = async (req, res) => {
  try {
    const featuredProviders = await User.find({
      role: 'service-provider',
      'serviceProviderInfo.isFeatured': true,
      'serviceProviderInfo.featuredUntil': { $gt: new Date() },
    })
      .select('firstName lastName serviceProviderInfo phoneNumber avatar')
      .sort('-serviceProviderInfo.featuredUntil')
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: featuredProviders.length,
      data: { providers: featuredProviders },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch featured service providers' });
  }
};

// Get all subscriptions for logged-in user (active + expired)
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('listing', 'title images price make model')
      .sort("-createdAt: -1");

    res.status(200).json({
      status: 'success',
      results: subscriptions.length,
      data: { subscriptions },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch subscriptions',
    });
  }
};

// Get only the CURRENT active subscription (if any)
export const getMyActivePlan = async (req, res) => {
  try {
    const activeSub = await Subscription.findOne({
      user: req.user?._id || req.user.id,
      status: 'active',
      endDate: { $gt: new Date() },
    })
      .populate('listing', 'title images')
      .sort({ endDate: -1 }); // most recent first

    if (!activeSub) {
      return res.status(200).json({
        status: 'success',
        data: { activePlan: null },
      });
    }

    res.status(200).json({
      status: 'success',
      data: { activePlan: activeSub },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'error',
      message: 'Failed to check active plan',
    });
  }
};