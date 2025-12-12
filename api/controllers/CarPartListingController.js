import User from "../models/user.js"
import CarPartListing from '../models/CarPartListing.js';
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