// routes/salesRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { getOverview,  getMonthlyBreakdown,
  getTopCars,
  getPaymentMethods,
  getRecentSales,
  recordSale,
  getSales,
  getSaleById, } from '../controllers/salesAnalyticController.js';
import { getCustomerByPhone, getCustomers } from '../controllers/customerController.js';


const router = express.Router();

// All routes require a logged-in dealer
router.use(protect);
router.use(restrictTo('dealer', 'superadmin'));

// ── Analytics ────────────────────────────────────────────────────────────────
router.get('/analytics/overview',         getOverview);
router.get('/analytics/monthly',          getMonthlyBreakdown);
router.get('/analytics/top-cars',         getTopCars);
router.get('/analytics/payment-methods',  getPaymentMethods)
// ── Customers ─────────────────────────────────────────────────────────────────
router.get('/customers',         getCustomers);
router.get('/customers/:phone',  getCustomerByPhone);;
router.get('/analytics/recent',           getRecentSales);




// ── Sales CRUD ────────────────────────────────────────────────────────────────
router.get('/',     getSales);
router.post('/',    recordSale);
router.get('/:id',  getSaleById);


export default router;