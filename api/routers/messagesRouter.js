// import express from 'express';
// import { protect, restrictTo } from '../middleware/verifyToken.js';
// import { getConversation, getMyConversations, getMyOffers, sendMessage, sendOffer } from '../controllers/MessageController.js';



// const router = express.Router();

// // Protected routes
// router.use(protect);

// router.post('/', sendMessage);
// router.get('/conversation/:userId', getConversation);
// router.get('/my-conversations', getMyConversations);

// // routes/messageRoutes.js
// router.post('/',  sendOffer);                    // Send normal message or offer
// router.get('/my-offers',  getMyOffers);         // Seller sees received offers

// export default router;




// routes/messageRoutes.js  →  app.use('/api/messages', messageRoutes)
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { getConversation, getMyConversations, getMyOffers, sendMessage, sendOffer } from '../controllers/MessageController.js';



const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Direct messages between users, and price offers on cars (mounted at /api/messages)
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         sender:
 *           description: Sender id, or populated sender (firstName, lastName)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         recipient:
 *           description: Recipient id, or populated recipient (firstName, lastName)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         content: { type: string }
 *         read: { type: boolean }
 *         type: { type: string, example: offer, description: Set to "offer" for offers }
 *         carId:
 *           description: Car id, or populated car (make, model, year, price, images, title)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         offerAmount: { type: number }
 *         preferredColor: { type: string }
 *         status: { type: string, example: pending, description: Offer status }
 *         createdAt: { type: string, format: date-time }
 *     MessageError:
 *       type: object
 *       properties:
 *         status: { type: string, example: error }
 *         message: { type: string }
 *     OfferError:
 *       type: object
 *       properties:
 *         status: { type: boolean, example: false }
 *         message: { type: string }
 */

// Protected routes
router.use(protect);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     description: Note — the route file also registers `sendOffer` on this same path, but Express runs the first matching handler (`sendMessage`), so offers sent here are treated as plain messages.
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipient, content]
 *             properties:
 *               recipient: { type: string, description: Recipient user id }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { $ref: '#/components/schemas/Message' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to send message
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageError' }
 */
router.post('/', sendMessage);

/**
 * @swagger
 * /api/messages/conversation/{userId}:
 *   get:
 *     summary: Get my conversation with a user
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string }, description: The other user's id }
 *     responses:
 *       200:
 *         description: Messages in chronological order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Message' }
 *                     sellerName: { type: string, example: Ada Obi }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to load conversation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageError' }
 */
router.get('/conversation/:userId', getConversation);

/**
 * @swagger
 * /api/messages/my-conversations:
 *   get:
 *     summary: Inbox — one entry per person I've messaged
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Conversations with last message and unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId: { type: string }
 *                           name: { type: string }
 *                           lastMessage: { type: string }
 *                           lastMessageTime: { type: string, format: date-time }
 *                           unreadCount: { type: integer }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to load conversations
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageError' }
 */
router.get('/my-conversations', getMyConversations);

// routes/messageRoutes.js
/**
 * @swagger
 * /api/messages/my-offers:
 *   get:
 *     summary: Offers I've received on my cars (seller)
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Offers, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 results: { type: integer }
 *                 data:
 *                   type: object
 *                   properties:
 *                     offers:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Message' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch offers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfferError' }
 */
router.post('/',  sendOffer);                    // Send normal message or offer
router.get('/my-offers',  getMyOffers);         // Seller sees received offers

export default router;