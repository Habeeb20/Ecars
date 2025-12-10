// routes/carRoutes.js (or main routes file)
import express from 'express';
import { activateSubscription, getAllSubscriptions, getFeaturedCars, getFeaturedDealers, getFeaturedServiceProviders, getMyActivePlan, getMySubscriptions, getNewestListings } from '../controllers/plansController.js';
import { protect, restrictTo } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/featured', getFeaturedCars);
router.get('/newest', getNewestListings);
router.get('/featured-dealers', getFeaturedDealers);

router.get('/featured-service-providers', getFeaturedServiceProviders);

router.get('/my', protect, getMySubscriptions);        // All subscriptions (active + past)
router.get('/active', protect, getMyActivePlan); 
router.get("/all", getAllSubscriptions)
router.put('/:id/activate', protect, restrictTo('superadmin'), activateSubscription);   
export default router;


