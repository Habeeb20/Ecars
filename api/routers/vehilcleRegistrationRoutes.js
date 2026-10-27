


// import express from 'express';
// import {
//   createVehicle, listMyVehicles, getMyVehicle, updateVehicle, deleteVehicle,
// } from '../controllers/vehicleRegistrationController.js';
// import { protect } from '../middleware/verifyToken.js';


// const router = express.Router();

// router.use(protect);
// router.route('/').get(listMyVehicles).post(createVehicle);
// router.route('/:id').get(getMyVehicle).patch(updateVehicle).delete(deleteVehicle);

// export default router;

// // In your app/server file:
// //   import vehicleRoutes from './routes/vehicle.routes.js';
// //   app.use('/api/vehicles', vehicleRoutes);


// routes/vehicle.routes.js → saved here as routes/vehicleRoutes.js  →  app.use('/api/vehicles', vehicleRoutes)

// import express from 'express';

// import {
//   createRegistration,
//   initializePayment,
//   verifyPayment,
//   paystackWebhook,
//   getAllRegistrations,
//   getRegistrationById,
//   updateRegistrationStatus,
// } from '../controllers/vehicleRegistrationController.js';

// import { protect } from '../middleware/verifyToken.js';

// const router = express.Router();

// // Public
// router.post('/', createRegistration);
// router.post('/:id/initialize-payment', initializePayment);
// router.get('/verify-payment/:reference', verifyPayment);
// router.post('/webhook/paystack', express.json({ type: '*/*' }), paystackWebhook);

// // Admin
// router.get('/admin/all', protect,  getAllRegistrations);
// router.get('/admin/:id', protect,  getRegistrationById);
// router.patch('/admin/:id/status', protect,  updateRegistrationStatus);

// export default router;




import express from 'express';
import {
  createVehicle, listMyVehicles, getMyVehicle, updateVehicle, deleteVehicle,
} from '../controllers/vehicleRegistrationController.js';
import { protect } from '../middleware/verifyToken.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle registration applications for the signed-in owner (mounted at /api/vehicles)
 * components:
 *   schemas:
 *     VehicleDocument:
 *       type: object
 *       required: [type, url]
 *       properties:
 *         type: { type: string, description: One of the allowed document types, example: proof_of_ownership }
 *         url: { type: string, format: uri, description: Must be an https URL }
 *         name: { type: string, maxLength: 120 }
 *     VehicleInput:
 *       type: object
 *       required: [ownerName, phone, address, state, vehicleType, make, model, year, color, chassisNumber, engineNumber, documents]
 *       properties:
 *         ownerName: { type: string, minLength: 2 }
 *         phone: { type: string, example: '08012345678', description: 'Nigerian number; +234 and 234 prefixes are normalized' }
 *         address: { type: string, minLength: 5 }
 *         state: { type: string, example: Lagos, description: A Nigerian state }
 *         vehicleType: { type: string, description: One of the allowed vehicle types }
 *         make: { type: string }
 *         model: { type: string }
 *         year: { type: integer, minimum: 1980 }
 *         color: { type: string }
 *         usage: { type: string, default: private, description: One of the allowed usage types }
 *         fuelType: { type: string }
 *         plateNumber: { type: string, description: 5–10 letters, digits or hyphens }
 *         plateState: { type: string, description: Required when plateNumber is set }
 *         preferredPlateNumber: { type: string, description: 3–10 letters, digits or hyphens }
 *         chassisNumber: { type: string, description: 5–25 letters or digits }
 *         engineNumber: { type: string, description: 3–25 letters or digits }
 *         documents:
 *           type: array
 *           minItems: 1
 *           maxItems: 10
 *           items: { $ref: '#/components/schemas/VehicleDocument' }
 *     Vehicle:
 *       allOf:
 *         - $ref: '#/components/schemas/VehicleInput'
 *         - type: object
 *           properties:
 *             _id: { type: string }
 *             owner: { type: string }
 *             status: { type: string, example: pending, description: 'Pending and rejected applications can be edited or withdrawn' }
 *             reviewNote: { type: string }
 *             reviewedAt: { type: string, format: date-time }
 *             reviewedBy: { type: string }
 *             createdAt: { type: string, format: date-time }
 *     VehicleError:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         message: { type: string }
 */

router.use(protect);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: List my vehicle registrations
 *     tags: [Vehicles]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: My vehicles, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Vehicle' }
 *       401: { description: Not authenticated }
 *   post:
 *     summary: Submit a vehicle registration
 *     tags: [Vehicles]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VehicleInput' }
 *     responses:
 *       201:
 *         description: Registration submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Vehicle' }
 *       400:
 *         description: Validation failed (first problem is returned)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *       401: { description: Not authenticated }
 *       409:
 *         description: Chassis, engine or plate number already registered
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 */
router.route('/').get(listMyVehicles).post(createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get one of my vehicle registrations
 *     tags: [Vehicles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: The registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Vehicle' }
 *       400:
 *         description: Invalid vehicle id
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *   patch:
 *     summary: Edit a registration
 *     description: Only while the status is pending or rejected. Editing a rejected application resubmits it as pending and clears the review note. Send only the fields you want to change.
 *     tags: [Vehicles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of the VehicleInput fields
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Registration updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Vehicle' }
 *       400:
 *         description: Invalid id, validation failed, or already being processed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *       409:
 *         description: Chassis, engine or plate number already registered
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *   delete:
 *     summary: Withdraw a registration
 *     description: Only pending or rejected registrations can be withdrawn.
 *     tags: [Vehicles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Registration withdrawn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       400:
 *         description: Invalid id, or the registration can no longer be withdrawn
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VehicleError' }
 */
router.route('/:id').get(getMyVehicle).patch(updateVehicle).delete(deleteVehicle);

export default router;

// In your app/server file:
//   import vehicleRoutes from './routes/vehicle.routes.js';
//   app.use('/api/vehicles', vehicleRoutes);