// import express from 'express';
// import { protect } from '../middleware/verifyToken.js';
// import { createCarPartListing, deleteCarPartListing, editCarPartListing, getAllCarParts,  getCarPartsByTitle,  getCarPartsCategories,  getCarsByBodyType,  getMyCarPartListings, getMyGalleryImages, searchCarParts } from '../controllers/CarPartListingController.js';

// const router = express.Router();

// // Protected routes
// router.post('/', protect, createCarPartListing);
// router.put('/:id', protect, editCarPartListing);
// router.delete('/:id', protect, deleteCarPartListing);
// router.get('/search', searchCarParts); 
// router.get('/', getAllCarParts);

// router.get('/my', protect, getMyCarPartListings); 
// router.get('/categories', getCarPartsCategories);
// router.get('/by-title/:title', getCarPartsByTitle);
// // router.get('/gallery/images', getGalleryImages);
// router.get('/mygallery/images', protect, getMyGalleryImages)


// export default router;



// routes/carPartRoutes.js  →  app.use('/api/car-parts', carPartRoutes)
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { createCarPartListing, deleteCarPartListing, editCarPartListing, getAllCarParts,  getCarPartsByTitle,  getCarPartsCategories,  getCarsByBodyType,  getMyCarPartListings, getMyGalleryImages, searchCarParts } from '../controllers/CarPartListingController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Car Parts
 *   description: Car part listings — browse, search, and seller management (mounted at /api/car-parts)
 * components:
 *   schemas:
 *     CarPart:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string, example: Brake pads }
 *         price: { type: number, example: 15000 }
 *         partType: { type: string }
 *         condition: { type: string, example: new }
 *         compatibleMakes: { type: array, items: { type: string } }
 *         images: { type: array, items: { type: string, format: uri } }
 *         status: { type: string, example: active }
 *         seller:
 *           description: Seller id, or populated seller (firstName, lastName, email, phoneNumber, carPartSellerInfo)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         createdAt: { type: string, format: date-time }
 *     CarPartInput:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         price: { type: number }
 *         partType: { type: string }
 *         condition: { type: string }
 *         compatibleMakes: { type: array, items: { type: string } }
 *         images: { type: array, items: { type: string, format: uri } }
 *         description: { type: string }
 *     PartError:
 *       type: object
 *       properties:
 *         status: { type: string, enum: [fail, error], example: error }
 *         message: { type: string }
 *     PartPagedResponse:
 *       type: object
 *       properties:
 *         status: { type: string, example: success }
 *         results: { type: integer }
 *         total: { type: integer }
 *         page: { type: integer }
 *         pages: { type: integer }
 *         data:
 *           type: object
 *           properties:
 *             parts:
 *               type: array
 *               items: { $ref: '#/components/schemas/CarPart' }
 */

// Protected routes
/**
 * @swagger
 * /api/car-parts:
 *   post:
 *     summary: Create a car part listing
 *     tags: [Car Parts]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarPartInput' }
 *     responses:
 *       201:
 *         description: Listing created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     listing: { $ref: '#/components/schemas/CarPart' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to create listing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 *   get:
 *     summary: List all car parts (public)
 *     tags: [Car Parts]
 *     parameters:
 *       - { in: query, name: title, schema: { type: string }, description: Case-insensitive partial match on title }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated car parts
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartPagedResponse' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.post('/', protect, createCarPartListing);

/**
 * @swagger
 * /api/car-parts/{id}:
 *   put:
 *     summary: Edit my car part listing
 *     description: Only the seller who created the listing can edit it.
 *     tags: [Car Parts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarPartInput' }
 *     responses:
 *       200:
 *         description: Listing updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     listing: { $ref: '#/components/schemas/CarPart' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Listing not found or not yours
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 *       500:
 *         description: Failed to edit listing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 *   delete:
 *     summary: Delete my car part listing
 *     tags: [Car Parts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Listing deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string, example: Listing deleted }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Listing not found or not yours
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 *       500:
 *         description: Failed to delete listing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.put('/:id', protect, editCarPartListing);
router.delete('/:id', protect, deleteCarPartListing);

/**
 * @swagger
 * /api/car-parts/search:
 *   get:
 *     summary: Search car parts
 *     tags: [Car Parts]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: Full-text search }
 *       - { in: query, name: businessName, schema: { type: string } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: address, schema: { type: string } }
 *       - { in: query, name: partType, schema: { type: string } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: priceMin, schema: { type: number } }
 *       - { in: query, name: priceMax, schema: { type: number } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated search results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartPagedResponse' }
 *       500:
 *         description: Failed to search car parts
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.get('/search', searchCarParts); 
router.get('/', getAllCarParts);

/**
 * @swagger
 * /api/car-parts/my:
 *   get:
 *     summary: Get my car part listings (seller)
 *     tags: [Car Parts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: My listings, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     listings:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CarPart' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch listings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.get('/my', protect, getMyCarPartListings); 

/**
 * @swagger
 * /api/car-parts/categories:
 *   get:
 *     summary: Top part categories (grouped by title)
 *     tags: [Car Parts]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 5 } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: compatibleMakes, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Categories ordered by listing count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title: { type: string }
 *                       count: { type: integer }
 *                       sampleImage: { type: string }
 *                       condition: { type: string }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.get('/categories', getCarPartsCategories);

/**
 * @swagger
 * /api/car-parts/by-title/{title}:
 *   get:
 *     summary: Active listings for an exact part title (case-insensitive)
 *     tags: [Car Parts]
 *     parameters:
 *       - { in: path, name: title, required: true, schema: { type: string, example: Brake pads } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: compatibleMakes, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarPart' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PartError' }
 */
router.get('/by-title/:title', getCarPartsByTitle);
// router.get('/gallery/images', getGalleryImages);

/**
 * @swagger
 * /api/car-parts/mygallery/images:
 *   get:
 *     summary: My gallery — images from my active cars and car parts, merged
 *     tags: [Car Parts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type: { type: string, enum: [car, part] }
 *                       title: { type: string }
 *                       price: { type: number }
 *                       condition: { type: string }
 *                       images: { type: array, items: { type: string } }
 *                       createdAt: { type: string, format: date-time }
 *                       make: { type: string, description: Cars only }
 *                       model: { type: string, description: Cars only }
 *                       year: { type: integer, description: Cars only }
 *                       partType: { type: string, description: Parts only }
 *                       compatibleMakes: { type: array, items: { type: string }, description: Parts only }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     pages: { type: integer }
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string }
 *       500: { description: Server error }
 */
router.get('/mygallery/images', protect, getMyGalleryImages)


export default router;