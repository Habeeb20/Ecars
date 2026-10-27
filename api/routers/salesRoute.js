// // routes/salesRoutes.js
// import express from 'express';
// import { protect, restrictTo } from '../middleware/verifyToken.js';
// import { getOverview,  getMonthlyBreakdown,
//   getTopCars,
//   getPaymentMethods,
//   getRecentSales,
//   recordSale,
//   getSales,
//   getSaleById, } from '../controllers/salesAnalyticController.js';
// import { getCustomerByPhone, getCustomers } from '../controllers/customerController.js';


// const router = express.Router();

// // All routes require a logged-in dealer
// router.use(protect);
// router.use(restrictTo('dealer', 'superadmin'));

// // ── Analytics ────────────────────────────────────────────────────────────────
// router.get('/analytics/overview',         getOverview);
// router.get('/analytics/monthly',          getMonthlyBreakdown);
// router.get('/analytics/top-cars',         getTopCars);
// router.get('/analytics/payment-methods',  getPaymentMethods)
// // ── Customers ─────────────────────────────────────────────────────────────────
// router.get('/customers',         getCustomers);
// router.get('/customers/:phone',  getCustomerByPhone);;
// router.get('/analytics/recent',           getRecentSales);




// // ── Sales CRUD ────────────────────────────────────────────────────────────────
// router.get('/',     getSales);
// router.post('/',    recordSale);
// router.get('/:id',  getSaleById);


// export default router;






// routes/salesRoutes.js  →  app.use('/api/sales', router)
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

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Dealer sales records, analytics and customers (mounted at /api/sales). Dealers and superadmins only. Responses on this router are not wrapped in a `status` envelope.
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         carListing: { type: string, description: Listing id, or populated listing (images, title) }
 *         dealer: { type: string }
 *         buyer: { type: string, nullable: true, description: Buyer id, or populated buyer }
 *         customerInfo: { type: object, description: 'name, phone and other customer details' }
 *         salePrice: { type: number }
 *         costPrice: { type: number }
 *         profit: { type: number }
 *         discount: { type: number }
 *         paymentMethod: { type: string }
 *         paymentStatus: { type: string }
 *         amountPaid: { type: number }
 *         notes: { type: string }
 *         receiptNumber: { type: string }
 *         saleDate: { type: string, format: date-time }
 *         carSnapshot:
 *           type: object
 *           properties:
 *             title: { type: string }
 *             make: { type: string }
 *             model: { type: string }
 *             year: { type: integer }
 *             color: { type: string }
 *             vin: { type: string }
 *             stockNumber: { type: string }
 *             condition: { type: string }
 *             mileage: { type: number }
 *     SalesError:
 *       type: object
 *       properties:
 *         message: { type: string }
 */

// All routes require a logged-in dealer
router.use(protect);
router.use(restrictTo('dealer', 'superadmin'));

// ── Analytics ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/sales/analytics/overview:
 *   get:
 *     summary: Dashboard overview — this month, all time, and inventory
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thisMonth:
 *                   type: object
 *                   properties:
 *                     revenue: { type: number }
 *                     count: { type: integer }
 *                     profit: { type: number }
 *                     revenueGrowth: { type: string, description: Percent vs last month }
 *                     countGrowth: { type: string, description: Percent vs last month }
 *                 allTime:
 *                   type: object
 *                   properties:
 *                     revenue: { type: number }
 *                     count: { type: integer }
 *                     profit: { type: number }
 *                 inventory:
 *                   type: object
 *                   properties:
 *                     active: { type: integer }
 *                     aging: { type: integer, description: Active listings older than 60 days }
 *                     pending: { type: integer }
 *                     value: { type: number }
 *                     avgPrice: { type: number }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 */
router.get('/analytics/overview',         getOverview);

/**
 * @swagger
 * /api/sales/analytics/monthly:
 *   get:
 *     summary: Month-by-month revenue, profit and sales count for a year
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: year, schema: { type: integer }, description: Defaults to the current year }
 *     responses:
 *       200:
 *         description: Twelve months of data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year: { type: integer }
 *                 months:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month: { type: integer, minimum: 1, maximum: 12 }
 *                       label: { type: string, example: Jan }
 *                       revenue: { type: number }
 *                       profit: { type: number }
 *                       count: { type: integer }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 */
router.get('/analytics/monthly',          getMonthlyBreakdown);

/**
 * @swagger
 * /api/sales/analytics/top-cars:
 *   get:
 *     summary: Top-selling makes by revenue
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 5, maximum: 20 } }
 *     responses:
 *       200:
 *         description: Makes ranked by revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   make: { type: string }
 *                   count: { type: integer }
 *                   revenue: { type: number }
 *                   avgPrice: { type: number }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 */
router.get('/analytics/top-cars',         getTopCars);

/**
 * @swagger
 * /api/sales/analytics/payment-methods:
 *   get:
 *     summary: Sales split by payment method
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Payment method breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   method: { type: string }
 *                   count: { type: integer }
 *                   revenue: { type: number }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 */
router.get('/analytics/payment-methods',  getPaymentMethods)
// ── Customers ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/sales/customers:
 *   get:
 *     summary: List my customers
 *     description: Response shape comes from customerController.js, which wasn't provided, so it is documented generically.
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Customers
 *         content:
 *           application/json:
 *             schema: { type: object }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 */
router.get('/customers',         getCustomers);

/**
 * @swagger
 * /api/sales/customers/{phone}:
 *   get:
 *     summary: Look up a customer by phone number
 *     description: Response shape comes from customerController.js, which wasn't provided, so it is documented generically.
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: phone, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema: { type: object }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 */
router.get('/customers/:phone',  getCustomerByPhone);;

/**
 * @swagger
 * /api/sales/analytics/recent:
 *   get:
 *     summary: Most recent sales
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 10, maximum: 50 } }
 *     responses:
 *       200:
 *         description: Recent sales, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Sale' }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 */
router.get('/analytics/recent',           getRecentSales);




// ── Sales CRUD ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: List my sales (paginated, filterable)
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *       - { in: query, name: search, schema: { type: string }, description: 'Matches car title/make/stock number, customer name/phone, or receipt number' }
 *       - { in: query, name: from, schema: { type: string, format: date } }
 *       - { in: query, name: to, schema: { type: string, format: date } }
 *       - { in: query, name: paymentMethod, schema: { type: string } }
 *       - { in: query, name: paymentStatus, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Paginated sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sales: { type: array, items: { $ref: '#/components/schemas/Sale' } }
 *                 total: { type: integer }
 *                 page: { type: integer }
 *                 pages: { type: integer }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 *   post:
 *     summary: Record a sale
 *     description: Looks up the listing among your inventory, snapshots the car details, marks the listing as sold, and increments your sold count.
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carListingId, salePrice]
 *             properties:
 *               carListingId: { type: string }
 *               buyerId: { type: string, description: Registered buyer, if any }
 *               customerInfo: { type: object, description: 'name, phone and other customer details' }
 *               salePrice: { type: number }
 *               discount: { type: number, default: 0 }
 *               paymentMethod: { type: string }
 *               paymentStatus: { type: string }
 *               amountPaid: { type: number, description: Defaults to salePrice }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Sale recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Sale recorded }
 *                 sale: { $ref: '#/components/schemas/Sale' }
 *       400:
 *         description: Car already marked as sold
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 */
router.get('/',     getSales);
router.post('/',    recordSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get one of my sales
 *     tags: [Sales]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Sale with listing and buyer populated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Sale' }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers and superadmins only }
 *       404:
 *         description: Sale not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesError' }
 */
router.get('/:id',  getSaleById);


export default router;