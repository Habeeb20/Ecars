import { protect } from '../middleware/verifyToken.js';
import { createCarListing, getMyCars, updateCarListing, deleteCarListing } from '../controllers/carListingController.js';
import express from "express"

const router =express.Router()

router.post('/create', protect, createCarListing);
router.get('/my', protect, getMyCars);

router.patch('/:id', protect, updateCarListing);     
router.delete('/:id', protect, deleteCarListing);    

export default router 