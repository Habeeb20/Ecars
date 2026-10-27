// // routes/cars.js (Full ES6: import/export, arrow functions)
// import express from 'express';
// import { createOrUpdateCar, revalueCar,  getUserCars, valueAsset, getAllValuedCars } from '../controllers/valueAssetsController.js';
// import { protect } from '../middleware/verifyToken.js';

// const router = express.Router();
// // 1. Create or Update a car (valuation happens automatically)
// router.post('/', createOrUpdateCar);

// // 2. Revalue an existing car by VIN
// router.put('/revalue/:vin', revalueCar);

// // 3. Get all cars belonging to the authenticated user
// router.get('/my-cars', getUserCars);
// router.get('/valued-cars', getAllValuedCars);

// // Optional: If you want a standalone valuation endpoint (without saving)
// router.post('/value', async (req, res) => {
//   const log = await valueAsset(req.user?._id || req.user?.id, req.body);
//   res.json(log);
// });

// export default router;




// routes/cars.js → saved here as routes/valueAssetRoutes.js  →  app.use('/api/valuations', router)
// (Full ES6: import/export, arrow functions)
import express from 'express';
import { createOrUpdateCar, revalueCar,  getUserCars, valueAsset, getAllValuedCars } from '../controllers/valueAssetsController.js';
import { protect } from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Valuations
 *   description: Car valuation — get an estimate, save a valued car, revalue it (mounted at /api/valuations)
 * components:
 *   schemas:
 *     ValuationInput:
 *       type: object
 *       required: [vin, make, model, year, mileage, condition, type]
 *       properties:
 *         vin: { type: string, example: 1HGCM82633A004352 }
 *         make: { type: string, example: Toyota }
 *         model: { type: string, example: Camry }
 *         year: { type: integer, example: 2018 }
 *         mileage: { type: number, example: 64000 }
 *         condition: { type: string, enum: [excellent, good, fair, poor] }
 *         type: { type: string, enum: [new, used, foreign] }
 *         features: { type: array, items: { type: string } }
 *         carImage: { type: string, format: uri }
 *         images:
 *           type: array
 *           description: Must be Cloudinary URLs (https://res.cloudinary.com/...)
 *           items: { type: string, format: uri }
 *         phoneNumber: { type: string }
 *     ValuedCar:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         userId:
 *           description: User id, or populated user (firstName, lastName, email, phoneNumber)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         vin: { type: string }
 *         make: { type: string }
 *         model: { type: string }
 *         year: { type: integer }
 *         mileage: { type: number }
 *         condition: { type: string }
 *         type: { type: string }
 *         features: { type: array, items: { type: string } }
 *         carImage: { type: string }
 *         images: { type: array, items: { type: string } }
 *         phoneNumber: { type: string }
 *         valuation: { type: number, example: 8500000 }
 *         valuationDate: { type: string, format: date-time }
 *     ValuationLog:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         data:
 *           type: object
 *           properties:
 *             car: { type: object, description: The normalized car data used for the valuation }
 *             valuation: { type: number }
 *             source: { type: string, enum: [api, rules], description: Whether the base value came from the external API or the built-in rules }
 *         warnings: { type: array, items: { type: string } }
 *         errors: { type: array, items: { type: string } }
 */

// 1. Create or Update a car (valuation happens automatically)
/**
 * @swagger
 * /api/valuations:
 *   post:
 *     summary: Value a car and save it (creates, or updates the car with the same VIN)
 *     description: Authentication is optional. When logged in, a new car is linked to your account. Currently there is no auth middleware on this route, so `req.user` is only set if an upstream middleware sets it.
 *     tags: [Valuations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ValuationInput' }
 *     responses:
 *       200:
 *         description: Valuation computed and car saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     car: { $ref: '#/components/schemas/ValuedCar' }
 *                     valuation: { type: number }
 *                     source: { type: string, enum: [api, rules] }
 *       400:
 *         description: Invalid input (negative mileage, invalid type, non-Cloudinary image URL)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValuationLog' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 error: { type: string }
 */
router.post('/', createOrUpdateCar);

// 2. Revalue an existing car by VIN
/**
 * @swagger
 * /api/valuations/revalue/{vin}:
 *   put:
 *     summary: Revalue one of my cars by VIN
 *     description: Requires a logged-in user, but the route has no `protect` middleware, so without an upstream auth step this fails with a 500.
 *     tags: [Valuations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: vin, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Fresh valuation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValuationLog' }
 *       400:
 *         description: Revaluation failed validation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValuationLog' }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 error: { type: string }
 */
router.put('/revalue/:vin', revalueCar);

// 3. Get all cars belonging to the authenticated user
/**
 * @swagger
 * /api/valuations/my-cars:
 *   get:
 *     summary: My valued cars
 *     description: Same note as revalue — the route has no `protect` middleware.
 *     tags: [Valuations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: My cars, newest model year first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ValuedCar' }
 *       500:
 *         description: Server error
 */
router.get('/my-cars', getUserCars);

/**
 * @swagger
 * /api/valuations/valued-cars:
 *   get:
 *     summary: List every valued car (intended for superadmin)
 *     description: Intended to be admin-only, but the route has no auth middleware, and the response includes owners' names, emails and phone numbers.
 *     tags: [Valuations]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: userId, schema: { type: string } }
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: integer } }
 *       - { in: query, name: vin, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string }, description: Matches make, model or VIN }
 *     responses:
 *       200:
 *         description: Paginated valued cars, newest valuation first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer }
 *                 total: { type: integer }
 *                 page: { type: integer }
 *                 pages: { type: integer }
 *                 data:
 *                   type: object
 *                   properties:
 *                     cars: { type: array, items: { $ref: '#/components/schemas/ValuedCar' } }
 *       500:
 *         description: Failed to fetch valued cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/valued-cars', getAllValuedCars);

// Optional: If you want a standalone valuation endpoint (without saving)
/**
 * @swagger
 * /api/valuations/value:
 *   post:
 *     summary: Get a valuation without saving anything
 *     tags: [Valuations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ValuationInput' }
 *     responses:
 *       200:
 *         description: Valuation log (check `success`; validation failures also return 200 here)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValuationLog' }
 */
router.post('/value', async (req, res) => {
  const log = await valueAsset(req.user?._id || req.user?.id, req.body);
  res.json(log);
});

export default router;