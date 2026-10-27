// import express from 'express';
// import { protect } from '../middleware/verifyToken.js'; // use your existing auth middleware
// import {
//   createAppointment,
//   getCarAvailability,
//   getMyAppointments,
//   getReceivedAppointments,
//   updateAppointmentStatus,
// } from '../controllers/appointmentController.js';

// const router = express.Router();

// // Public: lets the booking modal grey out taken slots
// router.get('/car/:carId/availability', getCarAvailability);

// router.use(protect);

// router.post('/', createAppointment);
// router.get('/my', getMyAppointments);
// router.get('/received', getReceivedAppointments);
// router.patch('/:id/status', updateAppointmentStatus);

// export default router;


// routes/appointmentRoutes.js  →  app.use('/api/appointments', appointmentRoutes)
import express from 'express';
import { protect } from '../middleware/verifyToken.js'; // use your existing auth middleware
import {
  createAppointment,
  getCarAvailability,
  getMyAppointments,
  getReceivedAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Car viewing appointments (9:00 AM–5:00 PM Lagos time, 30-minute slots)
 */

/**
 * @swagger
 * /api/appointments/car/{carId}/availability:
 *   get:
 *     summary: Get booked slots for a car (public)
 *     description: Lets the booking modal grey out taken slots. The from/to range may be at most 2 days.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         required: true
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         required: true
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Booked slot start times
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookedSlots:
 *                       type: array
 *                       items: { type: string, format: date-time }
 *       400:
 *         description: Invalid car id or date range
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 */
// Public: lets the booking modal grey out taken slots
router.get('/car/:carId/availability', getCarAvailability);

router.use(protect);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book a viewing for a car
 *     description: |
 *       Rules: at least 2 hours ahead, at most 30 days ahead, on a :00 or :30 slot between 9:00 AM and 5:00 PM (Lagos time).
 *       One upcoming viewing per car per person, and you cannot book your own listing.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, scheduledAt]
 *             properties:
 *               carId: { type: string, example: 65f1c2a9e4b0a1b2c3d4e5f6 }
 *               scheduledAt: { type: string, format: date-time, example: '2026-11-03T09:30:00.000Z' }
 *               phoneNumber: { type: string, example: '08012345678' }
 *               note: { type: string }
 *     responses:
 *       201:
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment: { $ref: '#/components/schemas/Appointment' }
 *       400:
 *         description: Invalid slot, unavailable car, own listing, duplicate booking, or validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       409:
 *         description: That time slot was just taken
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 */
router.post('/', createAppointment);

/**
 * @swagger
 * /api/appointments/my:
 *   get:
 *     summary: Appointments I booked
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, declined, cancelled, completed, no-show]
 *     responses:
 *       200:
 *         description: My appointments, newest first
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
 *                     appointments:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Appointment' }
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 */
router.get('/my', getMyAppointments);

/**
 * @swagger
 * /api/appointments/received:
 *   get:
 *     summary: Viewings booked on my listings
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, declined, cancelled, completed, no-show]
 *     responses:
 *       200:
 *         description: Appointments received, newest first
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
 *                     appointments:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Appointment' }
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 */
router.get('/received', getReceivedAppointments);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update an appointment's status
 *     description: |
 *       Owners (and superadmins) can move pending → confirmed / declined / cancelled and confirmed → completed / no-show / cancelled.
 *       Clients can only cancel a pending or confirmed appointment.
 *       `completed` and `no-show` are only allowed once the viewing time has passed.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, declined, cancelled, completed, no-show]
 *               reason:
 *                 type: string
 *                 maxLength: 300
 *     responses:
 *       200:
 *         description: Appointment updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment: { $ref: '#/components/schemas/Appointment' }
 *       400:
 *         description: Invalid id, disallowed transition, or viewing not yet taken place
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not allowed to update this appointment
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AppointmentError' }
 */
router.patch('/:id/status', updateAppointmentStatus);

export default router;