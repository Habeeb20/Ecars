// controllers/salesAnalyticsController.js
import Sale from '../models/sales.js';
import CarListing from '../models/carListing.js';
import User from '../models/user.js';

import mongoose from 'mongoose';

// ─── helpers ────────────────────────────────────────────────────────────────

const startOf = (unit, date = new Date()) => {
  const d = new Date(date);
  if (unit === 'day')   { d.setHours(0,0,0,0); }
  if (unit === 'month') { d.setDate(1); d.setHours(0,0,0,0); }
  if (unit === 'year')  { d.setMonth(0,1); d.setHours(0,0,0,0); }
  return d;
};

const dealerId = (req) => new mongoose.Types.ObjectId(req.user._id);

// ─── GET /api/sales/analytics/overview ──────────────────────────────────────
export const getOverview = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const now    = new Date();
    const som    = startOf('month');           // start of this month
    const lsom   = startOf('month', new Date(now.getFullYear(), now.getMonth() - 1)); // last month start
    const leom   = new Date(som - 1);          // end of last month

    // --- sales this month ---
    const [thisMonth, lastMonth, allTime] = await Promise.all([
      Sale.aggregate([
        { $match: { dealer, saleDate: { $gte: som } } },
        { $group: { _id: null, revenue: { $sum: '$salePrice' }, count: { $sum: 1 }, profit: { $sum: '$profit' } } },
      ]),
      Sale.aggregate([
        { $match: { dealer, saleDate: { $gte: lsom, $lte: leom } } },
        { $group: { _id: null, revenue: { $sum: '$salePrice' }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { dealer } },
        { $group: { _id: null, revenue: { $sum: '$salePrice' }, count: { $sum: 1 }, profit: { $sum: '$profit' } } },
      ]),
    ]);

    const cur  = thisMonth[0]  || { revenue: 0, count: 0, profit: 0 };
    const prev = lastMonth[0]  || { revenue: 0, count: 1 };  // avoid /0
    const all  = allTime[0]    || { revenue: 0, count: 0, profit: 0 };

    const revenueGrowth = prev.revenue
      ? (((cur.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
      : 0;
    const countGrowth = prev.count
      ? (((cur.count - prev.count) / prev.count) * 100).toFixed(1)
      : 0;

    // --- active inventory ---
    const [activeCount, agingCount, pendingCount] = await Promise.all([
      CarListing.countDocuments({ postedBy: dealer, status: 'active' }),
      CarListing.countDocuments({
        postedBy: dealer,
        status: 'active',
        dateAcquired: { $lte: new Date(now - 60 * 24 * 60 * 60 * 1000) },
      }),
      CarListing.countDocuments({ postedBy: dealer, status: 'pending' }),
    ]);

    const inventoryValue = await CarListing.aggregate([
      { $match: { postedBy: dealer, status: 'active' } },
      { $group: { _id: null, total: { $sum: '$price' }, avg: { $avg: '$price' } } },
    ]);
    const inv = inventoryValue[0] || { total: 0, avg: 0 };

    res.json({
      thisMonth: { revenue: cur.revenue, count: cur.count, profit: cur.profit, revenueGrowth, countGrowth },
      allTime:   { revenue: all.revenue, count: all.count, profit: all.profit },
      inventory: { active: activeCount, aging: agingCount, pending: pendingCount, value: inv.total, avgPrice: inv.avg },
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales/analytics/monthly?year=2026 ─────────────────────────────
export const getMonthlyBreakdown = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const year   = parseInt(req.query.year) || new Date().getFullYear();

    const data = await Sale.aggregate([
      {
        $match: {
          dealer,
          saleDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
        },
      },
      {
        $group: {
          _id:     { $month: '$saleDate' },
          revenue: { $sum: '$salePrice' },
          profit:  { $sum: '$profit' },
          count:   { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const found = data.find((d) => d._id === i + 1);
      return {
        month: i + 1,
        label: new Date(year, i).toLocaleString('default', { month: 'short' }),
        revenue: found?.revenue || 0,
        profit:  found?.profit  || 0,
        count:   found?.count   || 0,
      };
    });

    res.json({ year, months });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales/analytics/top-cars?limit=5 ──────────────────────────────
export const getTopCars = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const limit  = Math.min(parseInt(req.query.limit) || 5, 20);

    const data = await Sale.aggregate([
      { $match: { dealer } },
      {
        $group: {
          _id:      '$carSnapshot.make',
          count:    { $sum: 1 },
          revenue:  { $sum: '$salePrice' },
          avgPrice: { $avg: '$salePrice' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: limit },
      { $project: { make: '$_id', count: 1, revenue: 1, avgPrice: 1, _id: 0 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales/analytics/payment-methods ────────────────────────────────
export const getPaymentMethods = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const data = await Sale.aggregate([
      { $match: { dealer } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$salePrice' } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map((d) => ({ method: d._id, count: d.count, revenue: d.revenue })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales/analytics/recent?limit=10 ───────────────────────────────
export const getRecentSales = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const limit  = Math.min(parseInt(req.query.limit) || 10, 50);

    const sales = await Sale.find({ dealer })
      .sort({ saleDate: -1 })
      .limit(limit)
      .select('carSnapshot customerInfo salePrice paymentMethod paymentStatus saleDate receiptNumber discount')
      .lean();

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/sales ─────────────────────────────────────────────────────────
export const recordSale = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const {
      carListingId, customerInfo, buyerId,
      salePrice, discount, paymentMethod, paymentStatus,
      amountPaid, notes,
    } = req.body;

    const listing = await CarListing.findOne({ _id: carListingId, postedBy: dealer }).select('+costPrice');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status === 'sold') return res.status(400).json({ message: 'Car already marked as sold' });

    const sale = await Sale.create({
      carListing:  carListingId,
      dealer,
      buyer:       buyerId || null,
      customerInfo,
      salePrice,
      costPrice:   listing.costPrice,
      discount:    discount || 0,
      paymentMethod,
      paymentStatus,
      amountPaid:  amountPaid ?? salePrice,
      notes,
      carSnapshot: {
        title:       listing.title,
        make:        listing.make,
        model:       listing.model,
        year:        listing.year,
        color:       listing.color,
        vin:         listing.vin,
        stockNumber: listing.stockNumber,
        condition:   listing.condition,
        mileage:     listing.mileage,
      },
      saleDate: new Date(),
    });

    // Mark listing as sold
    listing.status    = 'sold';
    listing.soldAt    = new Date();
    listing.soldPrice = salePrice;
    await listing.save();

    // Update dealer sold count
    await User.findByIdAndUpdate(dealer, { $inc: { 'dealerInfo.totalSoldCount': 1 } });

    res.status(201).json({ message: 'Sale recorded', sale });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales ──────────────────────────────────────────────────────────
export const getSales = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const { page = 1, limit = 20, search, from, to, paymentMethod, paymentStatus } = req.query;

    const filter = { dealer };
    if (from || to) {
      filter.saleDate = {};
      if (from) filter.saleDate.$gte = new Date(from);
      if (to)   filter.saleDate.$lte = new Date(to);
    }
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { 'carSnapshot.title':    { $regex: search, $options: 'i' } },
        { 'carSnapshot.make':     { $regex: search, $options: 'i' } },
        { 'carSnapshot.stockNumber': { $regex: search, $options: 'i' } },
        { 'customerInfo.name':    { $regex: search, $options: 'i' } },
        { 'customerInfo.phone':   { $regex: search, $options: 'i' } },
        { receiptNumber:          { $regex: search, $options: 'i' } },
      ];
    }

    const [sales, total] = await Promise.all([
      Sale.find(filter)
        .sort({ saleDate: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Sale.countDocuments(filter),
    ]);

    res.json({ sales, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/sales/:id ──────────────────────────────────────────────────────
export const getSaleById = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const sale = await Sale.findOne({ _id: req.params.id, dealer })
      .populate('carListing', 'images title')
      .populate('buyer', 'firstName lastName email phoneNumber')
      .lean();
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};