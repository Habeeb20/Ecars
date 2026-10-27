// // routes/dealerVideoRoutes.js
// import express from 'express';
// import {protect, restrictTo} from "../middleware/verifyToken.js"
// import { createDealerVideo, getDealerVideos, getDealerVideosByUser, recordVideoView, deleteDealerVideo, getDealerProfile } from '../controllers/dealerVideoController.js';

// const router = express.Router();

// router.post('/', protect, restrictTo('dealer'), createDealerVideo);
// router.get('/', getDealerVideos);
// router.get('/dealer/:dealerId', getDealerVideosByUser);
// router.put('/:id/view', recordVideoView);
// router.delete('/:id', protect, deleteDealerVideo);
// router.get('/dealer-profile/:dealerId', getDealerProfile);

// export default router;




// routes/dealerVideoRoutes.js  →  app.use('/api/dealer-videos', dealerVideoRoutes)
import express from 'express';
import {protect, restrictTo} from "../middleware/verifyToken.js"
import { createDealerVideo, getDealerVideos, getDealerVideosByUser, recordVideoView, deleteDealerVideo, getDealerProfile } from '../controllers/dealerVideoController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dealer Videos
 *   description: Dealer video posts and public dealer profile (mounted at /api/dealer-videos)
 * components:
 *   schemas:
 *     DealerVideo:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         videoUrl: { type: string, format: uri }
 *         thumbnailUrl: { type: string, format: uri }
 *         duration: { type: number, description: Length of the video }
 *         status: { type: string, example: active }
 *         views: { type: integer }
 *         createdAt: { type: string, format: date-time }
 *         postedBy:
 *           description: Dealer id, or populated dealer (firstName, lastName, avatar, business name, verified)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *     VideoError:
 *       type: object
 *       properties:
 *         message: { type: string }
 */

/**
 * @swagger
 * /api/dealer-videos:
 *   post:
 *     summary: Post a dealer video (dealers only)
 *     description: Costs one video credit, deducted atomically. When credits run out the API returns 402 with the price of a new pack.
 *     tags: [Dealer Videos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [videoUrl]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               videoUrl: { type: string, format: uri }
 *               thumbnailUrl: { type: string, format: uri }
 *               duration: { type: number }
 *     responses:
 *       201:
 *         description: Video posted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 video: { $ref: '#/components/schemas/DealerVideo' }
 *                 videoCreditsRemaining: { type: integer }
 *       400:
 *         description: videoUrl is required
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 *       401: { description: Not authenticated }
 *       402:
 *         description: No video credits left
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 code: { type: string, example: NO_VIDEO_CREDITS }
 *                 packPrice: { type: number, example: 5000 }
 *                 packCredits: { type: integer, example: 10 }
 *       403:
 *         description: Only dealers can post videos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 *   get:
 *     summary: Public feed of all active dealer videos
 *     tags: [Dealer Videos]
 *     responses:
 *       200:
 *         description: Videos, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 videos:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/DealerVideo' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 */
router.post('/', protect, restrictTo('dealer'), createDealerVideo);
router.get('/', getDealerVideos);

/**
 * @swagger
 * /api/dealer-videos/dealer/{dealerId}:
 *   get:
 *     summary: Active videos for one dealer's profile page
 *     tags: [Dealer Videos]
 *     parameters:
 *       - { in: path, name: dealerId, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: The dealer's videos, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 videos:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/DealerVideo' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 */
router.get('/dealer/:dealerId', getDealerVideosByUser);

/**
 * @swagger
 * /api/dealer-videos/{id}/view:
 *   put:
 *     summary: Record a video view
 *     tags: [Dealer Videos]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       204: { description: View recorded }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 */
router.put('/:id/view', recordVideoView);

/**
 * @swagger
 * /api/dealer-videos/{id}:
 *   delete:
 *     summary: Delete one of my videos
 *     description: Only the dealer who posted the video can delete it.
 *     tags: [Dealer Videos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Video deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 */
router.delete('/:id', protect, deleteDealerVideo);

/**
 * @swagger
 * /api/dealer-videos/dealer-profile/{dealerId}:
 *   get:
 *     summary: Public dealer profile by id
 *     tags: [Dealer Videos]
 *     parameters:
 *       - { in: path, name: dealerId, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Dealer profile (password excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 dealer: { type: object }
 *       404:
 *         description: Dealer not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VideoError' }
 */
router.get('/dealer-profile/:dealerId', getDealerProfile);

export default router;