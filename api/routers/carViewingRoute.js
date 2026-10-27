// // routes/carViewingRoutes.js
// import express from 'express';
// import { protect } from '../middleware/verifyToken.js';
// import { bookCarViewing, getMyCarViewings, updateViewingStatus } from '../controllers/carViewingController.js';



// const router = express.Router();

// router.post('/book-viewing', protect, bookCarViewing);
// router.get('/my-viewings', protect, getMyCarViewings);
// router.patch('/viewing/:viewingId/status', protect, updateViewingStatus);

// export default router;


// routes/carViewingRoutes.js  →  app.use('/api/car-viewings', carViewingRoutes)
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { bookCarViewing, getMyCarViewings, updateViewingStatus } from '../controllers/carViewingController.js';



const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Car Viewings
 *   description: Viewing requests from buyers to dealers (mounted at /api/car-viewings)
 * components:
 *   schemas:
 *     CarViewing:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         car:
 *           description: Car id, or populated car (title, make, model, year, price, images)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         buyer:
 *           description: Buyer id, or populated buyer (firstName, lastName, email, phone)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         dealer: { type: string }
 *         preferredDate: { type: string, example: '2026-11-05' }
 *         preferredTime: { type: string, example: '10:30' }
 *         message: { type: string }
 *         phoneNumber: { type: string }
 *         status: { type: string, example: pending }
 *         dealerNotes: { type: string }
 *         requestedAt: { type: string, format: date-time }
 *         confirmedAt: { type: string, format: date-time }
 *         cancelledAt: { type: string, format: date-time }
 *     ViewingError:
 *       type: object
 *       properties:
 *         status: { type: boolean, example: false }
 *         message: { type: string }
 */

/**
 * @swagger
 * /api/car-viewings/book-viewing:
 *   post:
 *     summary: Request a viewing for a car
 *     description: You cannot book a viewing for your own car. If `phoneNumber` is omitted, the account's phone is used.
 *     tags: [Car Viewings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, preferredDate, preferredTime]
 *             properties:
 *               carId: { type: string }
 *               preferredDate: { type: string, example: '2026-11-05' }
 *               preferredTime: { type: string, example: '10:30' }
 *               message: { type: string }
 *               phoneNumber: { type: string }
 *     responses:
 *       201:
 *         description: Viewing request sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarViewing' }
 *       400:
 *         description: Booking your own car
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 */
router.post('/book-viewing', protect, bookCarViewing);

/**
 * @swagger
 * /api/car-viewings/my-viewings:
 *   get:
 *     summary: Viewing requests received on my cars (dealer)
 *     tags: [Car Viewings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Viewing requests, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarViewing' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 */
router.get('/my-viewings', protect, getMyCarViewings);

/**
 * @swagger
 * /api/car-viewings/viewing/{viewingId}/status:
 *   patch:
 *     summary: Update a viewing request's status (dealer)
 *     description: Setting `confirmed` stamps `confirmedAt`; setting `cancelled` stamps `cancelledAt`.
 *     tags: [Car Viewings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: viewingId, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, example: confirmed }
 *               dealerNotes: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarViewing' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Viewing request not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ViewingError' }
 */
router.patch('/viewing/:viewingId/status', protect, updateViewingStatus);

export default router;