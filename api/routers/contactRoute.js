// // routes/contactRoutes.js
// import express from 'express';
// import { submitContact,  getAllContacts,
//   markContactAsRead, } from '../controllers/contactController.js';
// import { protect, restrictTo } from '../middleware/verifyToken.js';


// const router = express.Router();

// // Public route - anyone can send contact message
// router.post('/', submitContact);

// // // Admin-only routes
// // router.use(protect); // require login


// router.get('/', getAllContacts);
// router.patch('/:id/read', markContactAsRead);

// export default router;



// routes/contactRoutes.js  →  app.use('/api/contact', contactRoutes)
import express from 'express';
import { submitContact,  getAllContacts,
  markContactAsRead, } from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/verifyToken.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form messages (mounted at /api/contact)
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string, example: Ada Obi }
 *         email: { type: string, format: email }
 *         subject: { type: string }
 *         message: { type: string }
 *         read: { type: boolean }
 *         createdAt: { type: string, format: date-time }
 *     ContactError:
 *       type: object
 *       properties:
 *         status: { type: string, enum: [fail, error], example: fail }
 *         message: { type: string }
 */

// Public route - anyone can send contact message
/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact message (public)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact: { $ref: '#/components/schemas/Contact' }
 *       400:
 *         description: A required field is missing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactError' }
 *       500:
 *         description: Failed to send message
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactError' }
 *   get:
 *     summary: List all contact messages (intended for admins)
 *     description: Intended to be admin-only, but the auth middleware is currently commented out in the route file, so this endpoint is open.
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Messages, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer }
 *                 data:
 *                   type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Contact' }
 *       500:
 *         description: Failed to fetch messages
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactError' }
 */
router.post('/', submitContact);

// // Admin-only routes
// router.use(protect); // require login


router.get('/', getAllContacts);

/**
 * @swagger
 * /api/contact/{id}/read:
 *   patch:
 *     summary: Mark a contact message as read (intended for admins)
 *     description: Intended to be admin-only, but currently has no auth middleware.
 *     tags: [Contact]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Message marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact: { $ref: '#/components/schemas/Contact' }
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactError' }
 *       500:
 *         description: Failed to update
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactError' }
 */
router.patch('/:id/read', markContactAsRead);

export default router;