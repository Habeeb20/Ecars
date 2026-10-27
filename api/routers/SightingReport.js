// import express from 'express';
// import { createSighting,   getAllSightings,
//   getSightingsByReport, } from '../controllers/reportSightingController.js';
// import { protect } from '../middleware/verifyToken.js';
// import { getStolenCars } from '../controllers/reportController.js';



// const router = express.Router();

// // Anyone can submit a sighting (public endpoint)
// router.post('/sightings', createSighting);
// router.get("/stolencars", getStolenCars)
// // Admin-only routes
// router.get('/sightings',   getAllSightings);
// router.get('/reports/:reportId/sightings', protect,  getSightingsByReport);

// export default router;



// routes/sightingRoutes.js  →  mounted alongside the report routes at /api/report
import express from 'express';
import { createSighting,   getAllSightings,
  getSightingsByReport, } from '../controllers/reportSightingController.js';
import { protect } from '../middleware/verifyToken.js';
import { getStolenCars } from '../controllers/reportController.js';



const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sightings
 *   description: Public sightings of stolen cars (mounted at /api/report)
 * components:
 *   schemas:
 *     Sighting:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         reportId:
 *           description: Stolen-car report id, or populated report (title, plateNumber, make, model, vin, location, status)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         reporter: { type: string, description: Logged-in user, when available }
 *         fullName: { type: string }
 *         phone: { type: string }
 *         locationSeen: { type: string }
 *         additionalInfo: { type: string }
 *         createdAt: { type: string, format: date-time }
 */

// Anyone can submit a sighting (public endpoint)
/**
 * @swagger
 * /api/report/sightings:
 *   post:
 *     summary: Report a sighting of a stolen car (public)
 *     tags: [Sightings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reportId, fullName, phone, locationSeen]
 *             properties:
 *               reportId: { type: string, description: Stolen-car report id }
 *               fullName: { type: string }
 *               phone: { type: string }
 *               locationSeen: { type: string }
 *               additionalInfo: { type: string }
 *     responses:
 *       201:
 *         description: Sighting reported
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
 *                     sighting: { $ref: '#/components/schemas/Sighting' }
 *       404:
 *         description: Stolen car report not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       500:
 *         description: Failed to report sighting
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *   get:
 *     summary: List all sightings (intended for admins)
 *     description: Intended to be admin-only, but the route currently has no auth middleware.
 *     tags: [Sightings]
 *     responses:
 *       200:
 *         description: Sightings, newest first
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
 *                     sightings:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Sighting' }
 *       500:
 *         description: Failed to fetch sightings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/sightings', createSighting);

/**
 * @swagger
 * /api/report/stolencars:
 *   get:
 *     summary: Search stolen-car reports (public)
 *     description: Also served by the report router at the same path.
 *     tags: [Sightings]
 *     parameters:
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: integer } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: color, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching stolen-car reports
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
 *                     reports:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Report' }
 *       500:
 *         description: Failed to fetch stolen cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get("/stolencars", getStolenCars)
// Admin-only routes
router.get('/sightings',   getAllSightings);

/**
 * @swagger
 * /api/report/reports/{reportId}/sightings:
 *   get:
 *     summary: Sightings for one stolen-car report
 *     tags: [Sightings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: reportId, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Sightings for the report, newest first
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
 *                     sightings:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Sighting' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch sightings for this report
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/reports/:reportId/sightings', protect,  getSightingsByReport);

export default router;