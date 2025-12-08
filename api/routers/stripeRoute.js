// routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { initializePayment, paystackWebhook, verifyPayment } from '../controllers/paymentController.js';


const router = express.Router();

router.post('/paystack/initialize', protect, initializePayment);
router.get('/paystack/verify', protect, verifyPayment);
router.post('/paystack/webhook', paystackWebhook); 

export default router;