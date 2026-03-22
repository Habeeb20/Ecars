import { createDeal, getAllDeals, getMyDeals, updateDeal, deleteDeal } from "../controllers/dealsController.js";
import express from "express"
import { protect } from "../middleware/verifyToken.js";

const router = express.Router()
router.post('/', protect, createDeal);           // Post new deal
router.get('/', getAllDeals);                           // Public deals
router.get('/my', protect, getMyDeals);          // My deals
router.put('/:id', protect, updateDeal);         // Update my deal
router.delete('/:id', protect, deleteDeal);      // Delete my deal


export default router