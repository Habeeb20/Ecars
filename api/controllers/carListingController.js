// controllers/carController.js

import CarListing from '../models/carListing.js';
import Car from '../models/carListing.js';
import User from '../models/user.js';
import Subscription from '../models/subscriptionSchema.js';
import mongoose from 'mongoose';
export const createCarListing = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User must have verified email
    const user = await User.findById(userId);
    // if (!user.emailVerified) {
    //   return res.status(403).json({
    //     status: 'fail',
    //     message: 'Please verify your email first before posting a car',
    //   });
    // }

    // 2. Count current active listings by this user
    const userListingsCount = await CarListing.countDocuments({
      postedBy: userId,
      status: { $in: ['active', 'pending'] },
    });

    // 3. Apply limits
    const isDealer = user.role === 'dealer';
    const isVerifiedDealer = isDealer && user.dealerInfo?.verified;

    if (!isVerifiedDealer && userListingsCount >= 3) {
      return res.status(403).json({
        status: 'fail',
        message: isDealer
          ? 'Unverified dealers can only post 3 cars. Contact admin for verification.'
          : 'You can only post 3 cars. Upgrade to dealer to post more!',
      });
    }

    // 4. Validate images (at least 4)
    const { images } = req.body;
    if (!images || !Array.isArray(images) || images.length < 4) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please upload at least 4 clear photos of the car',
      });
    }

    // 5. Create listing
    const newCar = await CarListing.create({
      ...req.body,
      postedBy: userId,
      images, // cloudinary URLs
    });

    res.status(201).json({
      status: 'success',
      message: 'Car listed successfully!',
      data: { car: newCar },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Failed to list car',
    });
  }
};




export const getAllCars = async (req, res) => {
  try {
    const cars = await CarListing.find({ status: 'active' })
      .populate('postedBy', 'firstName lastName role dealerInfo.businessName dealerInfo.verified phoneNumber avatar')
      .sort('-createdAt') // newest first
      .limit(50); // optional: limit for performance

    res.status(200).json({
      status: 'success',
      results: cars.length,
      data: { cars },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to fetch cars',
    });
  }
};

// Get MY car listings (for user dashboard - protected)
export const getMyCars = async (req, res) => {
  try {
    const userId = req.user.id;

    const cars = await CarListing.find({ postedBy: userId })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: cars.length,
      data: { cars },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Failed to fetch your cars',
    });
  }
};


export const updateCarListing = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.id;

    // 1. Find the car
    const car = await CarListing.findById(carId);

    if (!car) {
      return res.status(404).json({
        status: 'fail',
        message: 'Car listing not found',
      });
    }

    // 2. Check if the logged-in user owns this car
    if (car.postedBy.toString() !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only edit your own car listings',
      });
    }

    // 3. Prevent editing if car is already sold
    if (car.status === 'sold') {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot edit a sold car',
      });
    }

    // 4. Allowed fields to update (prevent hacking)
    const allowedFields = [
      'title',
      'price',
      'make',
      'model',
      'year',
      'mileage',
      'transmission',
      'fuelType',
      'bodyType',
      'condition',
      'color',
      'vin',
      'location.state',
      'location.lga',
      'description',
      'images',        // Cloudinary URLs array
      'features',
      // array of strings
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      // Handle nested location
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (req.body[parent]?.[child]) {
          updates[`${parent}.${child}`] = req.body[parent][child];
        }
      } else if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 5. Validate at least 4 images
    if (updates.images && (!Array.isArray(updates.images) || updates.images.length < 4)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Car must have at least 4 images',
      });
    }

    // 6. Update the car
    const updatedCar = await CarListing.findByIdAndUpdate(
      carId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName role dealerInfo.businessName dealerInfo.verified phoneNumber');

    res.status(200).json({
      status: 'success',
      message: 'Car listing updated successfully',
      data: { car: updatedCar },
    });
  } catch (err) {
    console.log('Update car error →'.red, err);
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Failed to update car listing',
    });
  }
};





export const deleteCarListing = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.id;

    const car = await CarListing.findById(carId);

    if (!car) {
      return res.status(404).json({
        status: 'fail',
        message: 'Car not found',
      });
    }

    if (car.postedBy.toString() !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own listings',
      });
    }

    await CarListing.findByIdAndDelete(carId);

    res.status(200).json({
      status: 'success',
      message: 'Car listing deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete car',
    });
  }
};




// Backend: controllers/carController.js (Add this export for search)
export const searchCars = async (req, res) => {
  try {
    const {
      make, model, minPrice, maxPrice, minYear, maxYear, keywords, location,
      fuelType, minMileage, maxMileage, vehicleType, condition
    } = req.query;

    const query = {};

    if (make) query.make = { $regex: new RegExp(make, 'i') };
    if (model) query.model = { $regex: new RegExp(model, 'i') };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }
    if (keywords) {
      query.$or = [
        { make: { $regex: new RegExp(keywords, 'i') } },
        { model: { $regex: new RegExp(keywords, 'i') } },
        { description: { $regex: new RegExp(keywords, 'i') } }, // Assuming description field
      ];
    }
    if (location) query.location = { $regex: new RegExp(location, 'i') };
    if (condition) query.condition = { $regex: new RegExp(condition, 'i') };
    if (fuelType) query.fuelType = { $regex: new RegExp(fuelType, 'i') }; // Add fuelType to schema if needed
    if (minMileage || maxMileage) {
      query.mileage = {};
      if (minMileage) query.mileage.$gte = Number(minMileage);
      if (maxMileage) query.mileage.$lte = Number(maxMileage);
    }
    if (vehicleType) query.vehicleType = vehicleType;

    const cars = await Car.find(query).sort({ createdAt: -1 }).limit(100); // Limit for performance

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err.message });
  }
};



export const getNewestListings = async (req, res) => {
  try {
    // Find all users with active "newest_listings_access" subscription
    const activeSubscribers = await Subscription.find({
      type: 'newest_listings_access',
      status: 'active',
      endDate: { $gt: new Date() },
    }).distinct('user');

    // Find cars posted by these users
    const newestCars = await CarListing.find({
      postedBy: { $in: activeSubscribers },
      status: 'active',
    })
      .populate('postedBy', 'firstName lastName phoneNumber role dealerInfo')
      .sort({ createdAt: -1 })  // newest first
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: newestCars.length,
      data: { cars: newestCars },
    });
  } catch (err) {
    console.error('Error fetching newest listings:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch newest listings' });
  }
};



// Get single car details
export const getCarById = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params?.id)
      .populate('postedBy', 'firstName lastName phoneNumber role dealerInfo avatar')
      .populate('features', 'name'); 

    if (!car) {
      return res.status(404).json({
        status: 'fail',
        message: 'Car not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { car },
    });
  } catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch car details',
    });
  }
};






// controllers/carListingController.js
export const createListingForOthers = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      postedBy: req.user?._id || null, // Optional for guests
    };
    const listing = new CarListing(payload);
    await listing.save();
    res.status(201).json({ status: 'success', data: { listing } });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: 'Failed to create listing' });
  }
};





// 1. Record a view (called when someone opens the car detail page)
export const recordCarView = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await CarListing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ status: false, message: 'Car not found' });
    }

    res.status(200).json({ status: true, views: car.views });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// 2. Like / Unlike a car
export const toggleLikeCar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const car = await CarListing.findById(id);
    if (!car) {
      return res.status(404).json({ status: false, message: 'Car not found' });
    }

    const alreadyLiked = car.likes.some(like => like.user.toString() === userId.toString());

    if (alreadyLiked) {
      // Unlike
      car.likes = car.likes.filter(like => like.user.toString() !== userId.toString());
      car.likeCount = car.likes.length;
    } else {
      // Like
      car.likes.push({ user: userId });
      car.likeCount = car.likes.length;
    }

    await car.save();

    res.status(200).json({
      status: true,
      liked: !alreadyLiked,
      likeCount: car.likeCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// 3. Get like status & count (for frontend to show if current user liked it)
export const getCarLikeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // optional — if logged in

    const car = await CarListing.findById(id).select('likeCount likes');
    if (!car) {
      return res.status(404).json({ status: false, message: 'Car not found' });
    }

    const isLiked = userId && car.likes.some(like => like.user.toString() === userId.toString());

    res.status(200).json({
      status: true,
      likeCount: car.likeCount,
      isLiked: !!isLiked,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server error' });
  }
};












// Get all cars with advanced filtering
// export const getAllCarsForSearch = async (req, res) => {
//   try {
//     const { 
//       make, model, yearRange, priceRange, bodyType, 
//       condition, fuelType, transmission, state 
//     } = req.query;

//     let query = { status: 'active' };

//     if (make) query.make = { $regex: make, $options: 'i' };
//     if (model) query.model = { $regex: model, $options: 'i' };
//     if (bodyType) query.bodyType = bodyType.toLowerCase();
//     if (condition) query.condition = condition.toLowerCase();
//     if (fuelType) query.fuelType = fuelType.toLowerCase();
//     if (transmission) query.transmission = transmission.toLowerCase();
//     if (state) query['location.state'] = { $regex: state, $options: 'i' };

//     // Year Range
//     if (yearRange) {
//       const [min, max] = yearRange.split('-').map(Number);
//       if (min && max) query.year = { $gte: min, $lte: max };
//       else if (min) query.year = { $gte: min };
//     }

//     // Price Range
//     if (priceRange) {
//       const [min, max] = priceRange.split('-').map(Number);
//       if (min && max) query.price = { $gte: min, $lte: max };
//       else if (min) query.price = { $gte: min };
//       else if (max) query.price = { $lte: max };
//     }

//     const cars = await CarListing.find(query)
//       .populate('postedBy', 'firstName lastName phoneNumber avatar state lga dealerInfo')
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json({
//       status: 'success',
//       results: cars.length,
//       data: cars
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// };


// Get all cars with advanced filtering
export const getAllCarsForSearch = async (req, res) => {
  try {
    const {
      keyword, make, model, year, priceRange, bodyType,
      condition, fuelType, transmission, state
    } = req.query;

    let query = { status: 'active' };

    // Free-text keyword search — matches across multiple fields, partial match
    if (keyword && keyword.trim()) {
      const kw = keyword.trim();
      const kwRegex = { $regex: kw, $options: 'i' };
      const orConditions = [
        { title: kwRegex },
        { make: kwRegex },
        { model: kwRegex },
        { color: kwRegex },
        { vin: kwRegex },
        { description: kwRegex },
        { stockNumber: kwRegex },
        { bodyType: kwRegex },
        { 'location.state': kwRegex },
        { 'location.lga': kwRegex },
        { warehouseLocation: kwRegex },
      ];

      // If keyword looks numeric, also try matching year/price/mileage exactly
      const numericValue = Number(kw);
      if (!Number.isNaN(numericValue)) {
        orConditions.push({ year: numericValue });
        orConditions.push({ price: numericValue });
        orConditions.push({ mileage: numericValue });
      }

      query.$or = orConditions;
    }

    if (make) query.make = { $regex: make, $options: 'i' };
    if (model) query.model = { $regex: model, $options: 'i' };
    if (bodyType) query.bodyType = bodyType.toLowerCase();
    if (condition) query.condition = condition.toLowerCase();
    if (fuelType) query.fuelType = fuelType.toLowerCase();
    if (transmission) query.transmission = transmission.toLowerCase();
    if (state) query['location.state'] = { $regex: state, $options: 'i' };

    // Year Range — fixed to read `year`, matching what the frontend actually sends
    if (year) {
      const [min, max] = year.split('-').map(Number);
      if (min && max) query.year = { $gte: min, $lte: max };
      else if (min) query.year = { $gte: min };
      else if (!min && max) query.year = { $lte: max };
    }

    // Price Range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (min && max) query.price = { $gte: min, $lte: max };
      else if (min) query.price = { $gte: min };
      else if (!min && max) query.price = { $lte: max };
    }

    const cars = await CarListing.find(query)
      .populate('postedBy', 'firstName lastName phoneNumber avatar state lga dealerInfo')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      status: 'success',
      results: cars.length,
      data: cars
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};








// controllers/carController.js (add this alongside getAllCarsForSearch)

// Returns which filter values actually exist in the DB, given the filters
// currently selected — so the UI never offers a combination with zero results.
// Each field's own current selection is excluded from its own match, so
// switching that field is always possible (you're not locked into what you
// already picked).
export const getCarFilterOptions = async (req, res) => {
  try {
    const {
      make, bodyType, condition, fuelType, transmission, state,
      yearRange, priceRange,
    } = req.query;

    const buildMatch = (excludeField) => {
      const match = { status: 'active' };

      if (make && excludeField !== 'make') {
        match.make = { $regex: `^${make}$`, $options: 'i' };
      }
      if (bodyType && excludeField !== 'bodyType') match.bodyType = bodyType.toLowerCase();
      if (condition && excludeField !== 'condition') match.condition = condition.toLowerCase();
      if (fuelType && excludeField !== 'fuelType') match.fuelType = fuelType.toLowerCase();
      if (transmission && excludeField !== 'transmission') match.transmission = transmission.toLowerCase();
      if (state && excludeField !== 'state') {
        match['location.state'] = { $regex: state, $options: 'i' };
      }

      if (yearRange) {
        const [min, max] = yearRange.split('-').map(Number);
        if (min && max) match.year = { $gte: min, $lte: max };
        else if (min) match.year = { $gte: min };
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (min && max) match.price = { $gte: min, $lte: max };
        else if (min) match.price = { $gte: min };
        else if (max) match.price = { $lte: max };
      }

      return match;
    };

    const [makes, bodyTypes, conditions, fuelTypes, transmissions, states] = await Promise.all([
      CarListing.distinct('make', buildMatch('make')),
      CarListing.distinct('bodyType', buildMatch('bodyType')),
      CarListing.distinct('condition', buildMatch('condition')),
      CarListing.distinct('fuelType', buildMatch('fuelType')),
      CarListing.distinct('transmission', buildMatch('transmission')),
      CarListing.distinct('location.state', buildMatch('state')),
    ]);

    const clean = (arr) => arr.filter(Boolean).sort((a, b) => a.localeCompare(b));

    res.json({
      status: 'success',
      data: {
        makes: clean(makes),
        bodyTypes: clean(bodyTypes),
        conditions: clean(conditions),
        fuelTypes: clean(fuelTypes),
        transmissions: clean(transmissions),
        states: clean(states),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

















// GET /api/cars/:id — public detail fetch, increments views
export const getCarById1 = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid car ID' });
    }
 
    const car = await CarListing.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('postedBy', 'name businessProfile.businessName phoneNumber profilePicture email')
      .lean();
 
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car listing not found' });
    }
 console.log(car)
    res.status(200).json({ success: true, data: car });
  } catch (err) {
    console.error('getCarById error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch car listing' });
  }
};
 
// GET /api/cars/:id/similar — a few other active listings from the same make, excluding this one
export const getSimilarCars = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarListing.findById(id).select('make').lean();
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
 
    const similar = await CarListing.find({
      _id: { $ne: id },
      make: car.make,
      status: 'active',
    })
      .select('make model year price images mileage condition')
      .limit(4)
      .lean();
 
    res.status(200).json({ success: true, data: similar });
  } catch (err) {
    console.error('getSimilarCars error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch similar cars' });
  }
};
 
// PATCH /api/cars/:id/like — toggle like for the logged-in user
export const toggleLikeCar1 = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
 
    const car = await CarListing.findById(id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
 
    const alreadyLiked = car.likes.some((l) => l.user.toString() === userId.toString());
 
    if (alreadyLiked) {
      car.likes = car.likes.filter((l) => l.user.toString() !== userId.toString());
    } else {
      car.likes.push({ user: userId });
    }
    car.likeCount = car.likes.length;
    await car.save();
 
    res.status(200).json({ success: true, liked: !alreadyLiked, likeCount: car.likeCount });
  } catch (err) {
    console.error('toggleLikeCar error:', err);
    res.status(500).json({ success: false, message: 'Failed to update like' });
  }
};
 
// PATCH /api/cars/:id/share — bump shareCount (fire-and-forget from the share button)
export const incrementShareCount = async (req, res) => {
  try {
    const { id } = req.params;
    await CarListing.findByIdAndUpdate(id, { $inc: { shareCount: 1 } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update share count' });
  }
};
 






export const createSaleListing = async (req, res) => {
  try {
    const { saleType, originalPrice, saleReason, saleExpiresAt, ...carData } = req.body;

    if (!['distress', 'discount'].includes(saleType)) {
      return res.status(400).json({ message: 'saleType must be distress or discount' });
    }
    if (saleType === 'discount' && (!originalPrice || originalPrice <= carData.price)) {
      return res.status(400).json({ message: 'originalPrice must be greater than the sale price' });
    }

    const listing = await CarListing.create({
      ...carData,
      saleType,
      originalPrice: saleType === 'discount' ? originalPrice : undefined,
      saleReason,
      saleExpiresAt,
      postedBy: req.user._id,
    });

    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const convertListingToSale = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { saleType, price, saleReason, saleExpiresAt } = req.body;

    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: 'Only dealers can convert inventory listings' });
    }

    const listing = await CarListing.findOne({ _id: listingId, postedBy: req.user._id });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found in your inventory' });
    }
    if (!['distress', 'discount'].includes(saleType)) {
      return res.status(400).json({ message: 'saleType must be distress or discount' });
    }

    if (saleType === 'discount') {
      if (!price || price >= listing.price) {
        return res.status(400).json({ message: 'New price must be lower than current price' });
      }
      listing.originalPrice = listing.price;
      listing.price = price;
    }

    listing.saleType = saleType;
    listing.saleReason = saleReason;
    listing.saleExpiresAt = saleExpiresAt;

    await listing.save();
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const getMyInventory = async (req, res) => {
  const listings = await CarListing.find({
    postedBy: req.user._id,
    status: { $in: ['active', 'pending'] },
  }).select('title make model year price images status saleType');

  res.json({ success: true, listings });
};



export const getSaleListings = async (req, res) => {
  const { type } = req.query; // 'distress' | 'discount' | undefined
  const filter = {
    status: 'active',
    saleType: type ? type : { $in: ['distress', 'discount'] },
  };
  const listings = await CarListing.find(filter).sort('-createdAt');
  res.json({ success: true, listings });
};