// routes/carViewingRoutes.js
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { bookCarViewing, getMyCarViewings, updateViewingStatus } from '../controllers/carViewingController.js';



const router = express.Router();

router.post('/book-viewing', protect, bookCarViewing);
router.get('/my-viewings', protect, getMyCarViewings);
router.patch('/viewing/:viewingId/status', protect, updateViewingStatus);

export default router;