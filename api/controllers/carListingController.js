// controllers/carController.js

import CarListing from '../models/carListing.js';
import User from '../models/user.js';

export const createCarListing = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User must have verified email
    const user = await User.findById(userId);
    if (!user.emailVerified) {
      return res.status(403).json({
        status: 'fail',
        message: 'Please verify your email first before posting a car',
      });
    }

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

// Advanced Search for Cars (public - with filters)
export const searchCars = async (req, res) => {
  try {
    const {
      bodyType,
      make,
      year,
      minMileage,
      maxMileage,
      minPrice,
      maxPrice,
      fuelType,
      transmission,
      sort = '-createdAt', // default newest
      limit = 20, // default page size
      page = 1,
    } = req.query;

    // Build query object
    const query = { status: 'active' };

    if (bodyType) query.bodyType = bodyType.toLowerCase();
    if (make) query.make = { $regex: make, $options: 'i' }; // case-insensitive
    if (year) query.year = Number(year);
    if (fuelType) query.fuelType = fuelType.toLowerCase();
    if (transmission) query.transmission = transmission.toLowerCase();

    // Ranges
    if (minMileage || maxMileage) {
      query.mileage = {};
      if (minMileage) query.mileage.$gte = Number(minMileage);
      if (maxMileage) query.mileage.$lte = Number(maxMileage);
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    const cars = await CarListing.find(query)
      .populate('postedBy', 'firstName lastName role dealerInfo.businessName dealerInfo.verified phoneNumber avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await CarListing.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: cars.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { cars },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Search failed',
    });
  }
};


// controllers/carController.js

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