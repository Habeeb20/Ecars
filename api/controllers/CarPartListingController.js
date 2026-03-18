import User from "../models/user.js"
import CarPartListing from '../models/CarPartListing.js';
import CarListing from "../models/carListing.js";


export const createCarPartListing = async (req, res) => {
  try {
    const listing = new CarPartListing({
      ...req.body,
      seller: req.user._id,
    });
    await listing.save();
    res.status(201).json({ status: 'success', data: { listing } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to create listing' });
  }
};



export const editCarPartListing = async (req, res) => {
  try {
    const listing = await CarPartListing.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      req.body,
      { new: true }
    );
    if (!listing) return res.status(404).json({ status: 'fail', message: 'Listing not found or not yours' });
    res.json({ status: 'success', data: { listing } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to edit listing' });
  }
};

export const deleteCarPartListing = async (req, res) => {
  try {
    const listing = await CarPartListing.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
    if (!listing) return res.status(404).json({ status: 'fail', message: 'Listing not found or not yours' });
    res.json({ status: 'success', message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to delete listing' });
  }
};

export const searchCarParts = async (req, res) => {
  try {
    const { search, businessName, location, address, partType, condition, priceMin, priceMax, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (businessName) query['seller.carPartSellerInfo.businessName'] = { $regex: businessName, $options: 'i' };
    if (location) query['seller.carPartSellerInfo.businessAddress'] = { $regex: location, $options: 'i' };
    if (address) query['seller.carPartSellerInfo.businessAddress'] = { $regex: address, $options: 'i' };
    if (partType) query.partType = partType;
    if (condition) query.condition = condition;
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const parts = await CarPartListing.find(query)
      .populate('seller', 'firstName lastName carPartSellerInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CarPartListing.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: parts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { parts },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to search car parts' });
  }
};




// Get my car part listings (for seller)
export const getMyCarPartListings = async (req, res) => {
  try {
    const listings = await CarPartListing.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: { listings },
    });
  
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch listings' });
  }
};

// Get all car parts (public, with search by title)
export const getAllCarParts = async (req, res) => {
  try {
    const { title, page = 1, limit = 20 } = req.query;
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const parts = await CarPartListing.find(query)
      .populate({
        path: 'seller',
        select: 'firstName lastName email phoneNumber carPartSellerInfo',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CarPartListing.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: parts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { parts },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch car parts' });
  }
};






export const getCarPartsCategories = async (req, res) => {
  try {
    const { limit = 5, condition, compatibleMakes } = req.query;

    const match = { status: 'active' };
    if (condition) match.condition = condition;
    if (compatibleMakes) match.compatibleMakes = compatibleMakes;

    const categories = await CarPartListing.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
          sampleImage: { $first: { $arrayElemAt: ["$images", 0] } },
          condition: { $first: "$condition" }, // optional - first one
        },
      },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      {
        $project: {
          title: "$_id",
          count: 1,
          sampleImage: 1,
          condition: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};





export const getCarPartsByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const { condition, compatibleMakes } = req.query;

    const query = {
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      status: 'active',
    };

    if (condition) query.condition = condition;
    if (compatibleMakes) query.compatibleMakes = compatibleMakes;

    const parts = await CarPartListing.find(query)
      .populate({
        path: 'seller',
        select: 'firstName lastName email phoneNumber carPartSellerInfo avatar state lga',
      })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: parts,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};




// controllers/galleryController.js  (or wherever this lives)c

export const getMyGalleryImages = async (req, res) => {
  try {
    // Make sure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const userId = req.user._id; // from JWT middleware

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const pipeline = [
      // ── Cars posted by current user ────────────────────────────────
      {
        $match: {
          postedBy: userId,               // ← important filter
          status: 'active',
          images: { $exists: true, $ne: [] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'seller',
        },
      },
      { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          type: { $literal: 'car' },
          title: 1,
          price: 1,
          make: 1,
          model: 1,
          year: 1,
          condition: 1,
          images: 1,
          createdAt: 1,
          'seller.name': 1,
          'seller.profilePicture': 1,
        },
      },

      // ── Union with Car Parts posted by current user ────────────────
      {
        $unionWith: {
          coll: 'carpartlistings',
          pipeline: [
            {
              $match: {
                seller: userId,               // ← important filter
                status: 'active',
                images: { $exists: true, $ne: [] },
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'seller',
                foreignField: '_id',
                as: 'seller',
              },
            },
            { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                type: { $literal: 'part' },
                title: 1,
                price: 1,
                partType: 1,
                condition: 1,
                compatibleMakes: 1,
                images: 1,
                createdAt: 1,
                'seller.name': 1,
                'seller.profilePicture': 1,
              },
            },
          ],
        },
      },

      // ── Final sorting & pagination ────────────────────────────────
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const items = await CarListing.aggregate(pipeline);

    // Count total for pagination (only current user's items)
    const totalPipeline = [
      // Cars count
      {
        $match: {
          postedBy: userId,
          status: 'active',
          images: { $exists: true, $ne: [] },
        },
      },
      { $count: 'count' },

      // Union with parts count
      {
        $unionWith: {
          coll: 'carpartlistings',
          pipeline: [
            {
              $match: {
                seller: userId,
                status: 'active',
                images: { $exists: true, $ne: [] },
              },
            },
            { $count: 'count' },
          ],
        },
      },

      // Sum all counts
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
        },
      },
    ];

    const totalResult = await CarListing.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};