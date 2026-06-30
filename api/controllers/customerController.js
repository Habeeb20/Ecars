// controllers/customerController.js
import Sale from '../models/sales.js';
import mongoose from 'mongoose';

const dealerId = (req) => new mongoose.Types.ObjectId(req.user._id);

// ─── GET /api/customers ──────────────────────────────────────────────────────
// Aggregates unique customers from sales records
export const getCustomers = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const { page = 1, limit = 20, search, sort = 'recent' } = req.query;

    const matchStage = { dealer };
    const searchFilter = search
      ? {
          $or: [
            { 'customerInfo.name':  { $regex: search, $options: 'i' } },
            { 'customerInfo.phone': { $regex: search, $options: 'i' } },
            { 'customerInfo.email': { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const sortMap = {
      recent:  { lastPurchase: -1 },
      spend:   { totalSpend: -1 },
      name:    { name: 1 },
      count:   { totalPurchases: -1 },
    };

    const pipeline = [
      { $match: { ...matchStage, ...searchFilter } },
      {
        $group: {
          _id:            '$customerInfo.phone',
          name:           { $first: '$customerInfo.name' },
          email:          { $first: '$customerInfo.email' },
          phone:          { $first: '$customerInfo.phone' },
          state:          { $first: '$customerInfo.state' },
          lga:            { $first: '$customerInfo.lga' },
          totalSpend:     { $sum: '$salePrice' },
          totalPurchases: { $sum: 1 },
          lastPurchase:   { $max: '$saleDate' },
          firstPurchase:  { $min: '$saleDate' },
          carsBought:     { $push: '$carSnapshot' },
        },
      },
      { $sort: sortMap[sort] || sortMap.recent },
    ];

    // Count total before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const [countResult, customers] = await Promise.all([
      Sale.aggregate(countPipeline),
      Sale.aggregate([
        ...pipeline,
        { $skip: (page - 1) * Number(limit) },
        { $limit: Number(limit) },
      ]),
    ]);

    const total = countResult[0]?.total || 0;

    res.json({
      customers,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/customers/:phone ───────────────────────────────────────────────
export const getCustomerByPhone = async (req, res) => {
  try {
    const dealer = dealerId(req);
    const { phone } = req.params;

    const sales = await Sale.find({
      dealer,
      'customerInfo.phone': phone,
    })
      .sort({ saleDate: -1 })
      .select('carSnapshot salePrice discount paymentMethod paymentStatus saleDate receiptNumber notes')
      .lean();

    if (!sales.length) return res.status(404).json({ message: 'Customer not found' });

    const info = {
      name:           sales[0].customerInfo?.name,
      email:          sales[0].customerInfo?.email,
      phone,
      state:          sales[0].customerInfo?.state,
      lga:            sales[0].customerInfo?.lga,
      totalSpend:     sales.reduce((s, x) => s + x.salePrice, 0),
      totalPurchases: sales.length,
      lastPurchase:   sales[0].saleDate,
      firstPurchase:  sales[sales.length - 1].saleDate,
      purchases:      sales,
    };

    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};