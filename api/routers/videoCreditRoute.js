// routes/videoCreditRoutes.js
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { initializeVideoCreditPurchase, verifyVideoCreditPurchase, getVideoCreditBalance, paystackWebhook } from '../controllers/videoCreditController.js';

const router = express.Router();

router.get('/balance', protect, getVideoCreditBalance);
router.post('/initialize', protect, initializeVideoCreditPurchase);
router.get('/verify/:reference', protect, verifyVideoCreditPurchase);
router.post('/webhook', express.json(), paystackWebhook); // register raw route in app.js, not gated by protect

export default router;