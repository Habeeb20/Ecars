// controllers/dealerController.js
import User from '../models/user.js';
import CarListing from '../models/carListing.js';

// GET /api/dealers/:slug  -> public dealer storefront page (used by /:slug dynamic route)
export const getDealerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const dealer = await User.findOne({
      slug,
      role: { $in: ['dealer', 'service-provider', 'carPart-seller'] },
      isActive: true,
    }).select('-password');

    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }

    const {
      page = 1,
      limit = 12,
      status = 'active',
      make,
      sortBy = '-isFeatured -createdAt',
      minPrice,
      maxPrice,
    } = req.query;

    const filter = { postedBy: dealer._id, status };
    if (make) filter.make = new RegExp(make, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [inventory, total] = await Promise.all([
      CarListing.find(filter).sort(sortBy).skip(skip).limit(Number(limit)),
      CarListing.countDocuments(filter),
    ]);

    // increment profile view count (fire and forget)
    User.findByIdAndUpdate(dealer._id, { $inc: { views: 1 } }).exec();

    res.status(200).json({
      success: true,
      data: {
        dealer,
        inventory,
        pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/dealers/check-slug/:slug -> used by frontend router to confirm a path segment is a dealer slug
// before falling back to a 404 page. Lightweight existence check only.
export const checkSlugExists = async (req, res) => {
  try {
    const exists = await User.exists({
      slug: req.params.slug,
      role: { $in: ['dealer', 'service-provider', 'carPart-seller'] },
    });
    res.status(200).json({ success: true, exists: !!exists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
