// // routes/offerRoutes.js
// import express from 'express';
// import { protect } from '../middleware/verifyToken.js';
// import { acceptOffer, createOffer, getMyOffers, rejectOffer } from '../controllers/offerController.js';


// const offerRouter = express.Router();

// offerRouter.post('/', protect, createOffer);


// offerRouter.get('/my', protect, getMyOffers);


// offerRouter.put('/:id/accept', protect, acceptOffer);
// offerRouter.put('/:id/reject', protect, rejectOffer);

// export default offerRouter;







// routes/offerRoutes.js  →  app.use('/api/offers', offerRouter)
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { acceptOffer, createOffer, getMyOffers, rejectOffer } from '../controllers/offerController.js';


const offerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Buyer price offers sent to dealers while comparing cars (mounted at /api/offers)
 * components:
 *   schemas:
 *     CompareOffer:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user:
 *           description: Buyer id, or populated buyer (firstName, lastName, email, phoneNumber, avatar)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         carIds:
 *           type: array
 *           description: Car ids, or populated cars (title, make, model, year, price, images)
 *           items:
 *             oneOf:
 *               - { type: string }
 *               - { type: object }
 *         dealerIds: { type: array, items: { type: string } }
 *         offerPrice: { type: number, example: 7500000 }
 *         status: { type: string, enum: [pending, accepted, rejected] }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Send an offer on one or more cars to one or more dealers
 *     tags: [Offers]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carIds, dealerIds, offerPrice]
 *             properties:
 *               carIds: { type: array, items: { type: string } }
 *               dealerIds: { type: array, items: { type: string } }
 *               offerPrice: { type: number }
 *     responses:
 *       201:
 *         description: Offer sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string, example: Offer sent }
 *                 data:
 *                   type: object
 *                   properties:
 *                     offer: { $ref: '#/components/schemas/CompareOffer' }
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to send offer
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
offerRouter.post('/', protect, createOffer);


/**
 * @swagger
 * /api/offers/my:
 *   get:
 *     summary: Offers sent to me (dealer)
 *     tags: [Offers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Offers, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     offers:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CompareOffer' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch offers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
offerRouter.get('/my', protect, getMyOffers);


/**
 * @swagger
 * /api/offers/{id}/accept:
 *   put:
 *     summary: Accept an offer
 *     description: The handler only requires a logged-in user and does not check that the caller is one of the offer's dealers.
 *     tags: [Offers]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Offer accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     offer: { $ref: '#/components/schemas/CompareOffer' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Offer not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 * /api/offers/{id}/reject:
 *   put:
 *     summary: Reject an offer
 *     description: Same authorization caveat as accept.
 *     tags: [Offers]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Offer rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     offer: { $ref: '#/components/schemas/CompareOffer' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Offer not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
offerRouter.put('/:id/accept', protect, acceptOffer);
offerRouter.put('/:id/reject', protect, rejectOffer);

export default offerRouter;