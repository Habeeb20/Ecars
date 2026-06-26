// controllers/inventoryController.js\
import CarListing from '../models/carListing.js';
import User from '../models/user.js';


const VALID_STATUSES = ['active', 'sold', 'pending', 'rejected', 'draft', 'reserved'];

// Helper: keep the dealer's cached stock counters in sync
const syncDealerStockCount = async (dealerId) => {
  const totalStock = await CarListing.countDocuments({ postedBy: dealerId, status: 'active' });
  const totalSoldCount = await CarListing.countDocuments({ postedBy: dealerId, status: 'sold' });
  await User.findByIdAndUpdate(dealerId, {
    'dealerInfo.totalStock': totalStock,
    'dealerInfo.totalSoldCount': totalSoldCount,
  });
};

// =====================================================
// CREATE - Add a car to inventory
// =====================================================
export const createListing = async (req, res) => {
  try {
    const payload = { ...req.body, postedBy: req.user._id };

    if (!payload.images || payload.images.length < 1) {
      return res.status(400).json({ success: false, message: 'At least one image is required.' });
    }
    if (payload.images.length > 20) {
      return res.status(400).json({ success: false, message: 'Maximum 20 images allowed.' });
    }

    const listing = await CarListing.create(payload);
    await syncDealerStockCount(req.user._id);

    res.status(201).json({ success: true, message: 'Car added to inventory', data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================================================
// READ - Get paginated/filterable inventory for the logged-in dealer
// Query params: page, limit, status, make, search, sortBy, minPrice, maxPrice, condition
// =====================================================
export const getMyInventory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      make,
      search,
      sortBy = '-createdAt',
      minPrice,
      maxPrice,
      condition,
      transmission,
      fuelType,
    } = req.query;

    const filter = { postedBy: req.user._id };

    if (status && VALID_STATUSES.includes(status)) filter.status = status;
    if (make) filter.make = new RegExp(make, 'i');
    if (condition) filter.condition = condition;
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { make: new RegExp(search, 'i') },
        { model: new RegExp(search, 'i') },
        { stockNumber: new RegExp(search, 'i') },
        { vin: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [listings, total] = await Promise.all([
      CarListing.find(filter).sort(sortBy).skip(skip).limit(Number(limit)).select('+costPrice'),
      CarListing.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================================
// READ - Dashboard stock statistics for the dealer
// =====================================================
export const getInventoryStats = async (req, res) => {
  try {
    const dealerId = req.user._id;

    const [statusCounts, totalValueAgg, soldThisMonthAgg, makeBreakdown, dealer] = await Promise.all([
      CarListing.aggregate([
        { $match: { postedBy: dealerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      CarListing.aggregate([
        { $match: { postedBy: dealerId, status: 'active' } },
        { $group: { _id: null, totalValue: { $sum: '$price' }, avgPrice: { $avg: '$price' } } },
      ]),
      CarListing.aggregate([
        {
          $match: {
            postedBy: dealerId,
            status: 'sold',
            soldAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$soldPrice' } } },
      ]),
      CarListing.aggregate([
        { $match: { postedBy: dealerId, status: 'active' } },
        { $group: { _id: '$make', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      User.findById(dealerId).select('dealerInfo.lowStockThreshold'),
    ]);

    const counts = statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    const activeCount = counts.active || 0;
    const lowStockThreshold = dealer?.dealerInfo?.lowStockThreshold ?? 3;

    // Aging stock: active listings older than 60 days
    const agingThresholdDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const agingStockCount = await CarListing.countDocuments({
      postedBy: dealerId,
      status: 'active',
      dateAcquired: { $lte: agingThresholdDate },
    });

    res.status(200).json({
      success: true,
      data: {
        counts: {
          active: activeCount,
          sold: counts.sold || 0,
          pending: counts.pending || 0,
          rejected: counts.rejected || 0,
          draft: counts.draft || 0,
          reserved: counts.reserved || 0,
          total: statusCounts.reduce((sum, s) => sum + s.count, 0),
        },
        totalActiveValue: totalValueAgg[0]?.totalValue || 0,
        avgListingPrice: Math.round(totalValueAgg[0]?.avgPrice || 0),
        soldThisMonth: soldThisMonthAgg[0]?.count || 0,
        revenueThisMonth: soldThisMonthAgg[0]?.revenue || 0,
        makeBreakdown,
        lowStockAlert: activeCount <= lowStockThreshold,
        lowStockThreshold,
        agingStockCount,
      },
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================================
// UPDATE - Edit a listing (owner only)
// =====================================================
export const updateListing = async (req, res) => {
  try {
    const listing = await CarListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (String(listing.postedBy) !== String(req.user._id) && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'You can only edit your own listings' });
    }

    Object.assign(listing, req.body);
    await listing.save();
    await syncDealerStockCount(listing.postedBy);

    res.status(200).json({ success: true, message: 'Listing updated', data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================================================
// UPDATE - Mark as sold (dedicated action, captures sold price/date)
// =====================================================
export const markAsSold = async (req, res) => {
  try {
    const { soldPrice } = req.body;
    const listing = await CarListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (String(listing.postedBy) !== String(req.user._id) && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    listing.status = 'sold';
    listing.soldAt = new Date();
    listing.soldPrice = soldPrice || listing.price;
    await listing.save();
    await syncDealerStockCount(listing.postedBy);

    res.status(200).json({ success: true, message: 'Marked as sold', data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================================================
// UPDATE - Bulk status update (e.g. select 5 cars -> mark pending)
// =====================================================
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ success: false, message: 'Provide an array of listing ids' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const filter = { _id: { $in: ids } };
    if (req.user.role !== 'superadmin') filter.postedBy = req.user._id;

    const result = await CarListing.updateMany(filter, { status, ...(status === 'sold' ? { soldAt: new Date() } : {}) });
    await syncDealerStockCount(req.user._id);

    res.status(200).json({ success: true, message: `${result.modifiedCount} listing(s) updated`, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// =====================================================
// DELETE - Remove a listing (owner only)
// =====================================================
export const deleteListing = async (req, res) => {
  try {
    const listing = await CarListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    if (String(listing.postedBy) !== String(req.user._id) && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await listing.deleteOne();
    await syncDealerStockCount(listing.postedBy);

    res.status(200).json({ success: true, message: 'Listing removed from inventory' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================================
// DELETE - Bulk delete
// =====================================================
export const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ success: false, message: 'Provide an array of listing ids' });
    }
    const filter = { _id: { $in: ids } };
    if (req.user.role !== 'superadmin') filter.postedBy = req.user._id;

    const result = await CarListing.deleteMany(filter);
    await syncDealerStockCount(req.user._id);

    res.status(200).json({ success: true, message: `${result.deletedCount} listing(s) deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================================
// PUBLIC - Single car details (by id) with view increment
// =====================================================
export const getListingById = async (req, res) => {
  try {
    const listing = await CarListing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('postedBy', 'firstName lastName dealerInfo avatar slug phoneNumber role');

    if (!listing) return res.status(404).json({ success: false, message: 'Car not found' });

    res.status(200).json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =====================================================
// PUBLIC - Similar / related cars (same make or body type, excluding current)
// =====================================================
export const getSimilarListings = async (req, res) => {
  try {
    const current = await CarListing.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: 'Car not found' });

    const similar = await CarListing.find({
      _id: { $ne: current._id },
      status: 'active',
      $or: [{ make: current.make }, { bodyType: current.bodyType }],
    })
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({ success: true, data: similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
