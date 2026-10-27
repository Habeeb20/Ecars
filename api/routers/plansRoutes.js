// // routes/carRoutes.js (or main routes file)
// import express from 'express';
// import { activateSubscription, getAllSubscriptions, getFeaturedCars, getFeaturedDealers, getFeaturedServiceProviders, getMyActivePlan, getMySubscriptions, getNewestListings } from '../controllers/plansController.js';
// import { protect, restrictTo } from '../middleware/verifyToken.js';

// const router = express.Router();

// router.get('/featured', getFeaturedCars);
// router.get('/newest', getNewestListings);
// router.get('/featured-dealers', getFeaturedDealers);

// router.get('/featured-service-providers', getFeaturedServiceProviders);

// router.get('/my', protect, getMySubscriptions);        // All subscriptions (active + past)
// router.get('/active', protect, getMyActivePlan); 
// router.get("/all", getAllSubscriptions)
// router.put('/:id/activate', protect, restrictTo('superadmin'), activateSubscription);   
// export default router;





// routes/plansRoutes.js  →  app.use('/api/plans', router)
import express from 'express';
import { activateSubscription, getAllSubscriptions, getFeaturedCars, getFeaturedDealers, getFeaturedServiceProviders, getMyActivePlan, getMySubscriptions, getNewestListings } from '../controllers/plansController.js';
import { protect, restrictTo } from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Featured listings/profiles and subscriptions (mounted at /api/plans)
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user:
 *           description: User id, or populated user (firstName, lastName, email, role)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         type: { type: string, enum: [featured_listing, newest_listings_access, featured_dealer, featured_service_provider] }
 *         duration: { type: string, enum: [monthly, yearly] }
 *         amount: { type: number }
 *         reference: { type: string }
 *         listing:
 *           description: Featured car id, or populated car (title, images, price, make, model)
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         status: { type: string, enum: [pending, active] }
 *         startDate: { type: string, format: date-time }
 *         endDate: { type: string, format: date-time }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @swagger
 * /api/plans/featured:
 *   get:
 *     summary: Featured cars (public)
 *     description: Up to 20 active cars flagged as featured, most recently featured first. The response currently also includes a `debug` object.
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Featured cars
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
 *                     cars:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/CarListing' }
 *                 debug:
 *                   type: object
 *                   properties:
 *                     totalCars: { type: integer }
 *                     featuredFlagTrue: { type: integer }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 */
router.get('/featured', getFeaturedCars);

/**
 * @swagger
 * /api/plans/newest:
 *   get:
 *     summary: Latest 50 active cars (public)
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Newest listings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarListResponse' }
 *       500:
 *         description: Failed to fetch newest listings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/newest', getNewestListings);

/**
 * @swagger
 * /api/plans/featured-dealers:
 *   get:
 *     summary: Dealers with an unexpired featured subscription (public)
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Up to 20 featured dealers
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
 *                     dealers: { type: array, items: { $ref: '#/components/schemas/User' } }
 *       500:
 *         description: Failed to fetch featured dealers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/featured-dealers', getFeaturedDealers);

/**
 * @swagger
 * /api/plans/featured-service-providers:
 *   get:
 *     summary: Service providers with an unexpired featured subscription (public)
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Up to 20 featured service providers
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
 *                     providers: { type: array, items: { $ref: '#/components/schemas/User' } }
 *       500:
 *         description: Failed to fetch featured service providers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/featured-service-providers', getFeaturedServiceProviders);

/**
 * @swagger
 * /api/plans/my:
 *   get:
 *     summary: All my subscriptions (active and past)
 *     tags: [Plans]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: My subscriptions
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
 *                     subscriptions: { type: array, items: { $ref: '#/components/schemas/Subscription' } }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to fetch subscriptions
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/my', protect, getMySubscriptions);        // All subscriptions (active + past)

/**
 * @swagger
 * /api/plans/active:
 *   get:
 *     summary: My current active subscription, if any
 *     tags: [Plans]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: The latest-expiring active plan, or `null`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     activePlan:
 *                       nullable: true
 *                       allOf:
 *                         - $ref: '#/components/schemas/Subscription'
 *       401: { description: Not authenticated }
 *       500:
 *         description: Failed to check active plan
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/active', protect, getMyActivePlan); 

/**
 * @swagger
 * /api/plans/all:
 *   get:
 *     summary: List every subscription (intended for superadmin)
 *     description: Intended to be admin-only, but the route has no auth middleware, and the response includes users' emails.
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: All subscriptions, newest first
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
 *                     subscriptions: { type: array, items: { $ref: '#/components/schemas/Subscription' } }
 *       500:
 *         description: Failed to fetch subscriptions
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get("/all", getAllSubscriptions)

/**
 * @swagger
 * /api/plans/{id}/activate:
 *   put:
 *     summary: Manually activate a subscription (superadmin)
 *     description: Marks the subscription active and applies its feature (featured listing, dealer or service provider).
 *     tags: [Plans]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Subscription activated
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
 *                     subscription: { $ref: '#/components/schemas/Subscription' }
 *       401: { description: Not authenticated }
 *       403: { description: Superadmin only }
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       500:
 *         description: Activation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.put('/:id/activate', protect, restrictTo('superadmin'), activateSubscription);   
export default router;