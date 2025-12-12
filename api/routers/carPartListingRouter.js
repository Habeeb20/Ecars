import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { createCarPartListing, deleteCarPartListing, editCarPartListing, getAllCarParts, getMyCarPartListings, searchCarParts } from '../controllers/CarPartListingController.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createCarPartListing);
router.put('/:id', protect, editCarPartListing);
router.delete('/:id', protect, deleteCarPartListing);
router.get('/search', searchCarParts); 
router.get('/', getAllCarParts);

router.get('/my', protect, getMyCarPartListings); 
export default router;
