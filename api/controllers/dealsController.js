// controllers/dealController.js
import Deal from '../models/deals.js';
import cache from '../utils/cache.js';

const DEALS_LIST_KEY = 'deals:all';
const MY_DEALS_KEY = (userId) => `deals:my:${userId}`;


export const createDeal = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      title,
      originalPrice,
      discountPercentage,
      make, model, year, mileage,
      transmission, fuelType, bodyType, condition, color,
      description, location, features,
      images, // ← Cloudinary URLs sent from frontend
    } = req.body;

    // Validation
    if (!images || images.length < 6) {
      return res.status(400).json({
        status: false,
        message: 'You must upload at least 6 images',
      });
    }

    const deal = new Deal({
      title,
      originalPrice,
      discountPercentage,
      make,
      model,
      year,
      mileage,
      transmission,
      fuelType,
      bodyType,
      condition,
      color,
      description,
      location,
      features: features || [],
      images,
      postedBy: userId,
    });

    await deal.save();

    cache.del(DEALS_LIST_KEY);

    res.status(201).json({
      status: true,
      message: 'Deal posted successfully!',
      deal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Error creating deal',
      error: error.message,
    });
  }
};







// ====================== GET ALL PUBLIC DEALS ======================
export const getAllDeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const deals = await Deal.find({ status: 'active' })
      .populate({
        path: 'postedBy',
        select: 'firstName lastName avatar phoneNumber dealerInfo',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Deal.countDocuments({ status: 'active' });

    res.status(200).json({
      status: true,
      results: deals.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { deals },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ====================== GET MY DEALS (Logged-in User) ======================
export const getMyDeals = async (req, res) => {
  try {
    const userId = req.user._id;

    const deals = await Deal.find({ postedBy: userId })
      .populate({
        path: 'postedBy',
        select: 'firstName lastName avatar phoneNumber dealerInfo',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      results: deals.length,
      data: { deals },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ====================== UPDATE DEAL ======================
export const updateDeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Only owner can update
    const deal = await Deal.findOne({ _id: id, postedBy: userId });
    if (!deal) {
      return res.status(404).json({ status: false, message: 'Deal not found or not yours' });
    }

    const updates = req.body;

    // Auto-recalculate discounted price if price or discount changes
    if (updates.originalPrice || updates.discountPercentage !== undefined) {
      const original = updates.originalPrice || deal.originalPrice;
      const percent = updates.discountPercentage !== undefined ? updates.discountPercentage : deal.discountPercentage;
      const discountAmount = Math.round((original * percent) / 100);
      updates.discountedPrice = original - discountAmount;
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Invalidate caches
    cache.del(`deal:${id}`);
    cache.del(DEALS_LIST_KEY);
    cache.del(MY_DEALS_KEY(userId));

    res.status(200).json({
      status: true,
      message: 'Deal updated successfully',
      deal: updatedDeal,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

// ====================== DELETE DEAL ======================
export const deleteDeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deal = await Deal.findOne({ _id: id, postedBy: userId });
    if (!deal) {
      return res.status(404).json({ status: false, message: 'Deal not found or not yours' });
    }

    await Deal.findByIdAndDelete(id);

    // Invalidate caches
    cache.del(`deal:${id}`);
    cache.del(DEALS_LIST_KEY);
    cache.del(MY_DEALS_KEY(userId));

    res.status(200).json({
      status: true,
      message: 'Deal deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};















