// routes/cars.js (Full ES6: import/export, arrow functions)
import express from 'express';
import { createOrUpdateCar, revalueCar, getUserCars } from '../controllers/valueAssetsController.js';
import { protect } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', protect, createOrUpdateCar);

// GET /api/cars/:vin/revalue - Refresh Valuation
router.get('/:vin/revalue', protect, revalueCar);

// GET /api/cars - List User's Assets
router.get('/', protect, getUserCars);

export default router;