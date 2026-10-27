// // routes/paymentRoutes.js
// import express from 'express';
// import { protect } from '../middleware/verifyToken.js';
// import { initializePayment, paystackWebhook, verifyPayment } from '../controllers/paymentController.js';


// const router = express.Router();

// router.post('/paystack/initialize', protect, initializePayment);
// router.get('/paystack/verify', protect, verifyPayment);
// router.post('/paystack/webhook', paystackWebhook); 

// export default router;





// routes/paymentRoutes.js  →  app.use('/api/payments', router)
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { initializePayment, paystackWebhook, verifyPayment } from '../controllers/paymentController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Paystack payments for featured listings, featured profiles and newest-listings access (mounted at /api/payments)
 */

/**
 * @swagger
 * /api/payments/paystack/initialize:
 *   post:
 *     summary: Start a Paystack payment for a subscription
 *     description: |
 *       Creates a pending subscription and returns the Paystack checkout URL.
 *       Prices (NGN): featured_listing 5,000/month or 50,000/year; newest_listings_access 2,000 / 20,000;
 *       featured_dealer 15,000 / 150,000; featured_service_provider 10,000 / 100,000.
 *       `listingId` is needed for `featured_listing`.
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [featured_listing, newest_listings_access, featured_dealer, featured_service_provider]
 *               duration: { type: string, enum: [monthly, yearly], default: monthly }
 *               listingId: { type: string, description: Car to feature (featured_listing only) }
 *     responses:
 *       200:
 *         description: Payment initialized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url: { type: string, format: uri }
 *                     access_code: { type: string }
 *                     reference: { type: string }
 *       400:
 *         description: Invalid subscription type
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Payment initialization failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/paystack/initialize', protect, initializePayment);

/**
 * @swagger
 * /api/payments/paystack/verify:
 *   get:
 *     summary: Verify a Paystack transaction by reference
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: reference, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Paystack's transaction data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, enum: [success, fail] }
 *                 data: { type: object, description: Paystack transaction object }
 *       400:
 *         description: Verification failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 */
router.get('/paystack/verify', protect, verifyPayment);

/**
 * @swagger
 * /api/payments/paystack/webhook:
 *   post:
 *     summary: Paystack webhook (called by Paystack, not by clients)
 *     description: Verifies the `x-paystack-signature` HMAC. On `charge.success` it activates the matching subscription and applies the feature (featured listing, featured dealer, featured service provider or newest-listings access).
 *     tags: [Payments]
 *     parameters:
 *       - in: header
 *         name: x-paystack-signature
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event: { type: string, example: charge.success }
 *               data:
 *                 type: object
 *                 properties:
 *                   reference: { type: string }
 *                   metadata: { type: object }
 *     responses:
 *       200: { description: Event received }
 *       400: { description: Invalid signature }
 *       500: { description: Webhook processing error }
 */
router.post('/paystack/webhook', paystackWebhook); 

export default router;