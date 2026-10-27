// // routes/inventoryRoutes.js
// import express from 'express';
// import { protect, restrictTo } from '../middleware/verifyToken.js';
// import { createListing,  getMyInventory,
//   getInventoryStats,
//   updateListing,
//   markAsSold,
//   bulkUpdateStatus,
//   bulkDelete,
//   deleteListing,
//   getListingById,
//   getSimilarListings, } from '../controllers/inventoryController.js';


// const router = express.Router();

// // Public
// router.get('/listing/:id', getListingById);
// router.get('/listing/:id/similar', getSimilarListings);

// // Protected - dealers, service-providers & carPart-sellers manage their own stock
// router.use(protect);
// router.use(restrictTo('dealer', 'service-provider', 'carPart-seller', 'superadmin'));

// router.post('/', createListing);
// router.get('/', getMyInventory);
// router.get('/stats', getInventoryStats);
// router.patch('/bulk/status', bulkUpdateStatus);
// router.delete('/bulk', bulkDelete);
// router.patch('/:id', updateListing);
// router.patch('/:id/sold', markAsSold);
// router.delete('/:id', deleteListing);

// export default router;





// routes/inventoryRoutes.js  →  app.use('/api/inventory', inventoryRoutes)
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { createListing,  getMyInventory,
  getInventoryStats,
  updateListing,
  markAsSold,
  bulkUpdateStatus,
  bulkDelete,
  deleteListing,
  getListingById,
  getSimilarListings, } from '../controllers/inventoryController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Stock management for dealers, service providers and parts sellers (mounted at /api/inventory). Uses the CarListing schema defined in carRoutes.js.
 * components:
 *   schemas:
 *     InventoryError:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         message: { type: string }
 *     InventoryPagination:
 *       type: object
 *       properties:
 *         total: { type: integer }
 *         page: { type: integer }
 *         pages: { type: integer }
 *         limit: { type: integer }
 */

// Public
/**
 * @swagger
 * /api/inventory/listing/{id}:
 *   get:
 *     summary: Get a car's details (public)
 *     description: Increments the listing's view count each time it is fetched.
 *     tags: [Inventory]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Car details with seller info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 */
router.get('/listing/:id', getListingById);

/**
 * @swagger
 * /api/inventory/listing/{id}/similar:
 *   get:
 *     summary: Up to 6 similar active cars (same make or body type)
 *     tags: [Inventory]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Similar cars, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 */
router.get('/listing/:id/similar', getSimilarListings);

// Protected - dealers, service-providers & carPart-sellers manage their own stock
router.use(protect);
router.use(restrictTo('dealer', 'service-provider', 'carPart-seller', 'superadmin'));

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add a car to my inventory
 *     description: Requires 1–20 images. Updates the dealer's cached stock counters.
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CarInput'
 *             properties:
 *               images:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 20
 *                 items: { type: string, format: uri }
 *     responses:
 *       201:
 *         description: Car added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       400:
 *         description: Missing/too many images, or validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       401: { description: Not authenticated }
 *       403: { description: Role not allowed }
 *   get:
 *     summary: List my inventory (paginated, filterable)
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 12 } }
 *       - { in: query, name: status, schema: { type: string, enum: [active, sold, pending, rejected, draft, reserved] } }
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string }, description: Matches title, make, model, stock number or VIN }
 *       - { in: query, name: sortBy, schema: { type: string, default: '-createdAt' } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: transmission, schema: { type: string } }
 *       - { in: query, name: fuelType, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Inventory page (includes costPrice for the owner)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *                 pagination: { $ref: '#/components/schemas/InventoryPagination' }
 *       401: { description: Not authenticated }
 *       403: { description: Role not allowed }
 */
router.post('/', createListing);
router.get('/', getMyInventory);

/**
 * @swagger
 * /api/inventory/stats:
 *   get:
 *     summary: Dashboard stock statistics
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Stock stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     counts:
 *                       type: object
 *                       properties:
 *                         active: { type: integer }
 *                         sold: { type: integer }
 *                         pending: { type: integer }
 *                         rejected: { type: integer }
 *                         draft: { type: integer }
 *                         reserved: { type: integer }
 *                         total: { type: integer }
 *                     totalActiveValue: { type: number }
 *                     avgListingPrice: { type: number }
 *                     soldThisMonth: { type: integer }
 *                     revenueThisMonth: { type: number }
 *                     makeBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id: { type: string, description: Make }
 *                           count: { type: integer }
 *                     lowStockAlert: { type: boolean }
 *                     lowStockThreshold: { type: integer }
 *                     agingStockCount: { type: integer, description: Active listings older than 60 days }
 *       401: { description: Not authenticated }
 *       403: { description: Role not allowed }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 */
router.get('/stats', getInventoryStats);

/**
 * @swagger
 * /api/inventory/bulk/status:
 *   patch:
 *     summary: Bulk-update the status of several listings
 *     description: Non-superadmins can only update their own listings.
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, status]
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *               status: { type: string, enum: [active, sold, pending, rejected, draft, reserved] }
 *     responses:
 *       200:
 *         description: Listings updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 modifiedCount: { type: integer }
 *       400:
 *         description: Missing ids or invalid status
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       401: { description: Not authenticated }
 *       403: { description: Role not allowed }
 */
router.patch('/bulk/status', bulkUpdateStatus);

/**
 * @swagger
 * /api/inventory/bulk:
 *   delete:
 *     summary: Bulk-delete listings
 *     description: Non-superadmins can only delete their own listings.
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Listings deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *       400:
 *         description: Missing ids
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       401: { description: Not authenticated }
 *       403: { description: Role not allowed }
 */
router.delete('/bulk', bulkDelete);

/**
 * @swagger
 * /api/inventory/{id}:
 *   patch:
 *     summary: Edit a listing (owner or superadmin)
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarInput' }
 *     responses:
 *       200:
 *         description: Listing updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Not your listing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *   delete:
 *     summary: Remove a listing from inventory (owner or superadmin)
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Listing removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 */
router.patch('/:id', updateListing);

/**
 * @swagger
 * /api/inventory/{id}/sold:
 *   patch:
 *     summary: Mark a listing as sold
 *     description: Records the sale date and price. `soldPrice` defaults to the listing price.
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soldPrice: { type: number }
 *     responses:
 *       200:
 *         description: Marked as sold
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InventoryError' }
 */
router.patch('/:id/sold', markAsSold);
router.delete('/:id', deleteListing);

export default router;