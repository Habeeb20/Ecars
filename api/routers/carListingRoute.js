import { protect } from '../middleware/verifyToken.js';
import { createCarListing, getMyCars, updateCarListing, deleteCarListing, getAllCars, searchCars, getCarById, createListingForOthers } from '../controllers/carListingController.js';
import express from "express"
import { getNewestListings } from '../controllers/plansController.js';

const router =express.Router()

router.post('/create', protect, createCarListing);
router.get('/my', protect, getMyCars);
router.get("/allcars", getAllCars)
router.post("/", createListingForOthers)
router.get('/search', searchCars);
router.patch('/:id', protect, updateCarListing);     
router.delete('/:id', protect, deleteCarListing);
router.get("/newest", getNewestListings)    
router.get("/:id", getCarById)

export default router 