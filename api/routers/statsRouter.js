// routes/statsRoutes.js
import express from 'express';
import CarListing from '../models/carListing.js';
import User from '../models/user.js';


const router = express.Router();

// GET platform stats (public or protected)
router.get('/platform', async (req, res) => {
  try {
    const [cars, users] = await Promise.all([
      CarListing.countDocuments({ status: 'active' }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statsMap = users.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: {
        totalCars: cars,
        totalUsers: statsMap.user || 0,
        totalDealers: statsMap.dealer || 0,
        totalServiceProviders: statsMap['service-provider'] || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
  }
});

export default router;