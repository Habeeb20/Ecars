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

// Public: lets the booking modal grey out taken slots
router.get('/car/:carId/availability', getCarAvailability);

router.use(protect);

router.post('/', createAppointment);
router.get('/my', getMyAppointments);
router.get('/received', getReceivedAppointments);
router.patch('/:id/status', updateAppointmentStatus);

export default router;