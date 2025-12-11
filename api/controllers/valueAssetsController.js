// controllers/carController.js (Full ES6: Arrow functions, destructuring, import/export)
import axios from 'axios';

import Car from "../models/valueAssest.js"
import User from '../models/user.js';

// Valuation Controller Functions
export const valueAsset = async (userId, carData) => {
  const { 
    vin, 
    make, 
    model, 
    carImage,
    year, 
    mileage, 
    condition, 
    type, 
    features = [], 
    images = [] 
  } = carData;
  const log = { success: true, data: {}, warnings: [], errors: [] };

  try {
    // Step 1: Validate Input
    const upperVin = vin.toUpperCase();
    // if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(upperVin)) {
    //   log.success = false;
    //   log.errors.push('Invalid VIN: Must be 17 alphanumeric characters (no I/O/Q)');
    //   return log;
    // }
    if (year > new Date().getFullYear() + 1) {
      log.warnings.push('Future year detected; capping at next year for valuation');
      year = new Date().getFullYear() + 1;
    }
    if (mileage < 0) {
      log.errors.push('Mileage cannot be negative');
      log.success = false;
      return log;
    }
    if (!['new', 'used', 'foreign'].includes(type)) {
      log.errors.push('Invalid type: Must be "new", "used", or "foreign"');
      log.success = false;
      return log;
    }
    images.forEach((img) => {
      if (!/^https:\/\/res\.cloudinary\.com\//.test(img)) {
        log.errors.push('Invalid Cloudinary URL in images');
      }
    });
    if (log.errors.length > 0) {
      log.success = false;
      return log;
    }

    // Step 2: Fetch External Data (Edmunds API fallback)
    let externalValue = null;
    try {
      const { data } = await axios.get(
        `https://api.edmunds.com/api/vehicle/v2/${make}/${model}/${year}?fmt=json&api_key=${process.env.EDMUNDS_API_KEY}`,
        { timeout: 5000 }
      );
      externalValue = data.styles?.[0]?.msrp || null; // Use MSRP as base
      log.warnings.push('Using external API for base value');
    } catch (apiErr) {
      log.warnings.push('External API unavailable; falling back to rules-based valuation');
    }

    // Step 3: Compute Valuation (Adjusted for type: new/foreign bonus)
    const baseValue = externalValue || getRuleBasedBase(make, model, year);
    const computedValue = computeAdjustedValue(baseValue, mileage, condition, features, year, type);

    // Step 4: Prepare for DB Persist
    const carUpdate = {
      userId,
      vin: upperVin,
      make,
      model,
      year,
      mileage,
      carImage,
      condition,
      type,
      features,
      images,
      valuation: computedValue,
      valuationDate: new Date(),
    };

    log.data = { 
      car: carUpdate, 
      valuation: computedValue, 
      source: externalValue ? 'api' : 'rules' 
    };
    return log;

  } catch (err) {
    log.success = false;
    log.errors.push(err.message);
    return log;
  }
};

// Helper: Rule-Based Base Value (Arrow function, destructuring)
const getRuleBasedBase = (make, model, year) => {
  const baseTable = {
    'Toyota': { 'Camry': 28000, 'Corolla': 22000 },
    'Honda': { 'Civic': 25000, 'Accord': 30000 },
    // Add more makes/models
  };
  const base = baseTable[make]?.[model] || 20000;
  // Adjust +3% per year since 2020 base (for inflation)
  return base * (1 + (year - 2020) * 0.03);
};

// Adjustments (Arrow function, destructuring; Updated for 'type')
const computeAdjustedValue = (base, mileage, condition, features, year, type) => {
  let value = base;

  // Type Premium: +10% for new/foreign
  if (type === 'new' || type === 'foreign') {
    value *= 1.10;
  }

  // Age Depreciation: 12% per year after 5 years (max 70% loss)
  const age = new Date().getFullYear() - year; // 2025 - year
  value *= Math.max(0, 1 - Math.min((age - 5) * 0.12, 0.7));

  // Mileage Penalty: 0.1% per excess mile over 12k/year
  const expectedMileage = age * 12000;
  if (mileage > expectedMileage) {
    const excess = mileage - expectedMileage;
    value *= (1 - (excess * 0.001));
  }

  // Condition Multiplier
  const multipliers = { excellent: 1.15, good: 1.0, fair: 0.75, poor: 0.5 };
  value *= multipliers[condition] || 1.0;

  // Features Bonus: +2% per feature, cap 15%
  value *= (1 + Math.min(features.length * 0.02, 0.15));

  // 2025 Market Adjustment: +5% boom (tune based on real data)
  value *= 1.05;

  return Math.max(0, Math.round(value / 100) * 100); // Round to nearest $100
};

// Create/Update Car (Arrow function)
export const createOrUpdateCar = async (req, res) => {
  try {
    const userId = req.user?.id; // Optional - only if authenticated
    const log = await valueAsset(userId, req.body);
    if (!log.success) return res.status(400).json(log);

    // Persist to DB
    let car = await Car.findOne({ vin: log.data.car.vin });

    const carData = {
      ...log.data.car,
      phoneNumber: req.body.phoneNumber || null, // Save phone number
      userId: userId || null, // Optional userId
    };

    if (car) {
      // Update existing car
      car = await Car.findByIdAndUpdate(car._id, carData, { new: true });
    } else {
      // Create new car
      car = new Car(carData);
      await car.save();

      // Only link to user if userId exists
      if (userId) {
        await User.findByIdAndUpdate(userId, { $addToSet: { assets: car._id } });
      }
    }

    res.json({ success: true, data: { car, ...log.data } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Revalue Car (Arrow function)
export const revalueCar = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;
    const car = await Car.findOne({ vin: req.params.vin.toUpperCase(), userId });
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

    const log = await valueAsset(userId, car.toObject());
    if (!log.success) return res.status(400).json(log);

    // Update DB
    car.valuation = log.data.valuation;
    car.valuationDate = new Date();
    await car.save();

    res.json(log);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get User's Cars (Arrow function)
export const getUserCars = async (req, res) => {
  try {
    const { user } = req;
    const cars = await Car.find({ userId: user.id }).sort({ year: -1 });
    res.json({ success: true, data: cars });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// // Get all valued cars (Superadmin only)
// export const getAllValuedCars = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,           // e.g. 'pending', 'completed', 'rejected'
//       userId,
//       make,
//       model,
//       year,
//       vin,
//     } = req.query;

//     const query = {};

//     if (status) query.status = status;
//     if (userId) query.userId = userId;
//     if (make) query.make = { $regex: make, $options: 'i' };
//     if (model) query.model = { $regex: model, $options: 'i' };
//     if (year) query.year = Number(year);
//     if (vin) query.vin = vin.toUpperCase();

//     const skip = (page - 1) * limit;

//     const cars = await Car.find(query)
//       .populate('userId', 'firstName lastName email phoneNumber') // User details
//       .sort({ valuationDate: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await Car.countDocuments(query);

//     res.status(200).json({
//       status: 'success',
//       results: cars.length,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       data: { cars },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to fetch valued cars',
//       error: err.message,
//     });
//   }
// };


// controllers/carController.js

// Get all valued cars (Superadmin only) - works with or without filters/search
export const getAllValuedCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,           // 'pending', 'completed', 'rejected'
      userId,
      make,
      model,
      year,
      vin,
      search,           // Optional: general search across multiple fields
    } = req.query;

    // Build dynamic query
    const query = {};

    // Status filter
    if (status) query.status = status;

    // User filter
    if (userId) query.userId = userId;

    // Make, Model, Year, VIN filters (case-insensitive)
    if (make) query.make = { $regex: make, $options: 'i' };
    if (model) query.model = { $regex: model, $options: 'i' };
    if (year) query.year = Number(year);
    if (vin) query.vin = vin.toUpperCase();

    // General search across multiple fields (if search param is provided)
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { vin: { $regex: search, $options: 'i' } },
        { 'userId.firstName': { $regex: search, $options: 'i' } },
        { 'userId.lastName': { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch cars with populated user data
    const cars = await Car.find(query)
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ valuationDate: -1 }) // Newest first
      .skip(skip)
      .limit(Number(limit));

    // Total count for pagination
    const total = await Car.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: cars.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { cars },
    });
  } catch (err) {
    console.error('Error fetching valued cars:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch valued cars',
      error: err.message,
    });
  }
};