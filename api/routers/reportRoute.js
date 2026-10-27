// import express from 'express';
// import { protect } from '../middleware/verifyToken.js';
// import { reportScam, requestCar, reportStolenCar, getMyReports, getStolenCars, getAllReports } from '../controllers/reportController.js';


// const reportRouter = express.Router();
// reportRouter.get('/reports', getAllReports);
// reportRouter.get("/stolencars", getStolenCars)
// reportRouter.use(protect); // All require login

// reportRouter.post('/scam', reportScam);
// reportRouter.post('/request', requestCar);
// reportRouter.post('/stolen', reportStolenCar);
// // routes/reportRoutes.js

// reportRouter.get('/my', getMyReports);

// export default reportRouter;




// routes/reportRoutes.js  →  app.use('/api/report', reportRouter)
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { reportScam, requestCar, reportStolenCar, getMyReports, getStolenCars, getAllReports } from '../controllers/reportController.js';


const reportRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Scam reports, car requests and stolen-car reports (mounted at /api/report)
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       description: One schema for all three report types; which fields are set depends on `type`.
 *       properties:
 *         _id: { type: string }
 *         type: { type: string, enum: [scam, request, stolen] }
 *         title: { type: string }
 *         description: { type: string }
 *         status: { type: string }
 *         reportedBy:
 *           description: User id, or populated user (name, email, phone)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         car: { type: object, description: 'Scam reports — populated car (title, images, price, make, model, year)' }
 *         seller: { type: object, description: Scam reports — reported seller }
 *         evidence: { type: array, items: { type: string }, description: Scam reports — evidence URLs }
 *         phone: { type: string }
 *         location: { type: string }
 *         desiredMake: { type: string, description: Car requests }
 *         desiredModel: { type: string, description: Car requests }
 *         budget: { type: number, description: Car requests }
 *         preferredLocation: { type: string, description: Car requests }
 *         vin: { type: string, description: Stolen reports }
 *         plateNumber: { type: string, description: Stolen reports }
 *         color: { type: string, description: Stolen reports }
 *         year: { type: integer, description: Stolen reports }
 *         stolenDate: { type: string, format: date, description: Stolen reports }
 *         policeReport: { type: string, description: Stolen reports }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @swagger
 * /api/report/reports:
 *   get:
 *     summary: List all reports with filters (public)
 *     description: The response populates reporters' email and phone, and no auth middleware is applied.
 *     tags: [Reports]
 *     parameters:
 *       - { in: query, name: type, schema: { type: string, enum: [scam, request, stolen] } }
 *       - { in: query, name: search, schema: { type: string }, description: Matches title or description }
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: integer } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: color, schema: { type: string } }
 *       - { in: query, name: budget, schema: { type: number }, description: Maximum budget (car requests) }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer }
 *                 total: { type: integer }
 *                 page: { type: integer }
 *                 totalPages: { type: integer }
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports: { type: array, items: { $ref: '#/components/schemas/Report' } }
 *       500:
 *         description: Failed to fetch reports
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
reportRouter.get('/reports', getAllReports);

/**
 * @swagger
 * /api/report/stolencars:
 *   get:
 *     summary: Search stolen-car reports (public)
 *     tags: [Reports]
 *     parameters:
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: integer } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: color, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching stolen-car reports, newest first
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
 *                     reports: { type: array, items: { $ref: '#/components/schemas/Report' } }
 *       500:
 *         description: Failed to fetch stolen cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
reportRouter.get("/stolencars", getStolenCars)
reportRouter.use(protect); // All require login

/**
 * @swagger
 * /api/report/scam:
 *   post:
 *     summary: Report a scam
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carId: { type: string }
 *               sellerId: { type: string }
 *               title: { type: string }
 *               description: { type: string }
 *               evidence: { type: array, items: { type: string } }
 *               phone: { type: string }
 *               location: { type: string }
 *     responses:
 *       201:
 *         description: Scam reported
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
 *                     report: { $ref: '#/components/schemas/Report' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 */
reportRouter.post('/scam', reportScam);

/**
 * @swagger
 * /api/report/request:
 *   post:
 *     summary: Request a car you're looking for
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               desiredMake: { type: string }
 *               desiredModel: { type: string }
 *               budget: { type: number }
 *               preferredLocation: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Request submitted
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
 *                     report: { $ref: '#/components/schemas/Report' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 */
reportRouter.post('/request', requestCar);

/**
 * @swagger
 * /api/report/stolen:
 *   post:
 *     summary: Report a stolen car
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vin: { type: string }
 *               plateNumber: { type: string }
 *               make: { type: string }
 *               model: { type: string }
 *               color: { type: string }
 *               stolenDate: { type: string, format: date }
 *               policeReport: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Stolen car reported
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
 *                     report: { $ref: '#/components/schemas/Report' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 */
reportRouter.post('/stolen', reportStolenCar);
// routes/reportRoutes.js

/**
 * @swagger
 * /api/report/my:
 *   get:
 *     summary: My reports
 *     tags: [Reports]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Reports I filed, newest first
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
 *                     reports: { type: array, items: { $ref: '#/components/schemas/Report' } }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch reports
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
reportRouter.get('/my', getMyReports);

export default reportRouter;