import express from 'express';
import { createSighting,   getAllSightings,
  getSightingsByReport, } from '../controllers/reportSightingController.js';
import { protect } from '../middleware/verifyToken.js';
import { getStolenCars } from '../controllers/reportController.js';



const router = express.Router();

// Anyone can submit a sighting (public endpoint)
router.post('/sightings', createSighting);
router.get("/stolencars", getStolenCars)
// Admin-only routes
router.get('/sightings', protect,  getAllSightings);
router.get('/reports/:reportId/sightings', protect,  getSightingsByReport);

export default router;