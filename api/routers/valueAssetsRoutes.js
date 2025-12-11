// routes/cars.js (Full ES6: import/export, arrow functions)
import express from 'express';
import { createOrUpdateCar, revalueCar,  getUserCars, valueAsset, getAllValuedCars } from '../controllers/valueAssetsController.js';
import { protect } from '../middleware/verifyToken.js';

const router = express.Router();
// 1. Create or Update a car (valuation happens automatically)
router.post('/', createOrUpdateCar);

// 2. Revalue an existing car by VIN
router.put('/revalue/:vin', revalueCar);

// 3. Get all cars belonging to the authenticated user
router.get('/my-cars', getUserCars);
router.get('/valued-cars', getAllValuedCars);

// Optional: If you want a standalone valuation endpoint (without saving)
router.post('/value', async (req, res) => {
  const log = await valueAsset(req.user?._id || req.user?.id, req.body);
  res.json(log);
});

export default router;

