// // routes/statsRoutes.js
// import express from 'express';
// import CarListing from '../models/carListing.js';
// import User from '../models/user.js';


// const router = express.Router();

// // GET platform stats (public or protected)
// router.get('/platform', async (req, res) => {
//   try {
//     const [cars, users] = await Promise.all([
//       CarListing.countDocuments({ status: 'active' }),
//       User.aggregate([
//         {
//           $group: {
//             _id: '$role',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//     ]);

//     const statsMap = users.reduce((acc, curr) => {
//       acc[curr._id] = curr.count;
//       return acc;
//     }, {});

//     res.json({
//       status: 'success',
//       data: {
//         totalCars: cars,
//         totalUsers: statsMap.user || 0,
//         totalDealers: statsMap.dealer || 0,
//         totalServiceProviders: statsMap['service-provider'] || 0,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
//   }
// });

// export default router;




// routes/statsRoutes.js  →  app.use('/api/stats', router)
import express from 'express';
import CarListing from '../models/carListing.js';
import User from '../models/user.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Platform-wide statistics (mounted at /api/stats)
 */

// GET platform stats (public or protected)
/**
 * @swagger
 * /api/stats/platform:
 *   get:
 *     summary: Platform totals — active cars and users by role
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Platform stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCars: { type: integer, description: Active listings }
 *                     totalUsers: { type: integer }
 *                     totalDealers: { type: integer }
 *                     totalServiceProviders: { type: integer }
 *       500:
 *         description: Failed to fetch stats
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
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