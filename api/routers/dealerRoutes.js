// // routes/dealerRoutes.js
// import express from 'express';
// import { getDealerBySlug, checkSlugExists } from '../controllers/dealerController.js';


// const router = express.Router();

// router.get('/check-slug/:slug', checkSlugExists);
// router.get('/:slug', getDealerBySlug);

// export default router;





// routes/dealerRoutes.js  →  app.use('/api/dealers', dealerRoutes)
import express from 'express';
import { getDealerBySlug, checkSlugExists } from '../controllers/dealerController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dealers
 *   description: Public dealer storefronts (mounted at /api/dealers)
 */

/**
 * @swagger
 * /api/dealers/check-slug/{slug}:
 *   get:
 *     summary: Check whether a slug belongs to a dealer, service provider or parts seller
 *     description: Lightweight existence check used by the frontend router before falling back to a 404 page.
 *     tags: [Dealers]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string, example: prime-motors } }
 *     responses:
 *       200:
 *         description: Whether the slug exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 exists: { type: boolean }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string }
 */
router.get('/check-slug/:slug', checkSlugExists);

/**
 * @swagger
 * /api/dealers/{slug}:
 *   get:
 *     summary: Get a dealer's public storefront (profile + inventory)
 *     description: Returns the dealer and a paginated slice of their inventory. Also increments the dealer's view count.
 *     tags: [Dealers]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string, example: prime-motors } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 12 } }
 *       - { in: query, name: status, schema: { type: string, default: active }, description: Listing status to show }
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: sortBy, schema: { type: string, default: '-isFeatured -createdAt' } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *     responses:
 *       200:
 *         description: Dealer and inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dealer: { type: object, description: The dealer's user document (password and walletResponse excluded) }
 *                     inventory:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CarListing' }
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         page: { type: integer }
 *                         pages: { type: integer }
 *       400:
 *         description: Slug is required
 *       404:
 *         description: Dealer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: Dealer not found }
 *                 searchedSlug: { type: string }
 *       500:
 *         description: Server error
 */
router.get('/:slug', getDealerBySlug);

export default router;