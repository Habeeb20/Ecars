// routes/carRoutes.js (or main routes file)
import express from 'express';
import { getFeaturedCars, getFeaturedDealers, getFeaturedServiceProviders, getMyActivePlan, getMySubscriptions, getNewestListings } from '../controllers/plansController.js';
import { protect } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/featured', getFeaturedCars);
router.get('/newest', getNewestListings);
router.get('/featured-dealers', getFeaturedDealers);

router.get('/featured-service-providers', getFeaturedServiceProviders);

router.get('/my', protect, getMySubscriptions);        // All subscriptions (active + past)
router.get('/active', protect, getMyActivePlan);    
export default router;


