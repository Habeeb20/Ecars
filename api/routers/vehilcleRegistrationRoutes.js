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

router.use(protect);
router.route('/').get(listMyVehicles).post(createVehicle);
router.route('/:id').get(getMyVehicle).patch(updateVehicle).delete(deleteVehicle);

export default router;

// In your app/server file:
//   import vehicleRoutes from './routes/vehicle.routes.js';
//   app.use('/api/vehicles', vehicleRoutes);