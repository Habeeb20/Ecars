// // routes/agentRoutes.js  →  app.use('/api/agent', agentRoutes)
// import express from 'express';

// import { protect } from '../middleware/verifyToken.js'; // ← use your own auth middleware (must set req.user)
// import {
//   getOverview,
//   listReferrals,
//   listEarnings,
//   requestPayout,
//   listMyPayouts,
//   createUserByAgent,
// } from '../controllers/agentController.js';

// const router = express.Router();

// const agentOnly = (req, res, next) =>
//   req.user?.role === 'agent' ? next() : res.status(403).json({ status: false, message: 'Agents only' });

// router.use(protect, agentOnly);

// router.get('/overview', getOverview);
// router.get('/referrals', listReferrals);
// router.get('/earnings', listEarnings);
// router.get('/payouts', listMyPayouts);
// router.post('/payouts', requestPayout);

// // Agent signs up a buyer, dealer, service provider or parts seller
// router.post('/users', createUserByAgent);

// export default router;






// routes/agentRoutes.js  →  app.use('/api/agent', agentRoutes)
import express from 'express';

import { protect } from '../middleware/verifyToken.js'; // ← use your own auth middleware (must set req.user)
import {
  getOverview,
  listReferrals,
  listEarnings,
  requestPayout,
  listMyPayouts,
  createUserByAgent,
} from '../controllers/agentController.js';

const router = express.Router();

const agentOnly = (req, res, next) =>
  req.user?.role === 'agent' ? next() : res.status(403).json({ status: false, message: 'Agents only' });

router.use(protect, agentOnly);

/**
 * @swagger
 * tags:
 *   name: Agent
 *   description: Agent dashboard — referrals, earnings, payouts and account sign-ups (agents only)
 */

/**
 * @swagger
 * /api/agent/overview:
 *   get:
 *     summary: Get the agent's dashboard stats
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 data: { type: object, description: Stats returned by getAgentStats }
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Agents only
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 */
router.get('/overview', getOverview);

/**
 * @swagger
 * /api/agent/referrals:
 *   get:
 *     summary: List every user this agent signed up
 *     description: Includes active / not-yet-active status and what each referral has earned.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15, minimum: 1, maximum: 50 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *         description: Filter by activation status
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Matches first name, last name, email or phone number
 *     responses:
 *       200:
 *         description: Paginated referrals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/AgentReferral' }
 *                 meta: { $ref: '#/components/schemas/PageMeta' }
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Agents only
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 */
router.get('/referrals', listReferrals);

/**
 * @swagger
 * /api/agent/earnings:
 *   get:
 *     summary: Ledger of the agent's earnings
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15, minimum: 1, maximum: 50 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [available, requested, paid] }
 *     responses:
 *       200:
 *         description: Paginated earnings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/AgentEarning' }
 *                 meta: { $ref: '#/components/schemas/PageMeta' }
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Agents only
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 */
router.get('/earnings', listEarnings);

/**
 * @swagger
 * /api/agent/payouts:
 *   get:
 *     summary: List the agent's payout requests
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1, maximum: 50 }
 *     responses:
 *       200:
 *         description: Paginated payouts, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/AgentPayout' }
 *                 meta: { $ref: '#/components/schemas/PageMeta' }
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Agents only
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 *   post:
 *     summary: Request a payout of all available earnings
 *     description: Allowed once per rolling cooldown window (PAYOUT_COOLDOWN_DAYS, 7 days). All earnings with status `available` are bundled into one payout.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BankDetails'
 *             required: [bankName, accountNumber, accountName]
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 description: Exactly 10 digits
 *     responses:
 *       201:
 *         description: Payout requested
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string, example: Payout requested. Admin will review it shortly. }
 *                 data: { $ref: '#/components/schemas/AgentPayout' }
 *       400:
 *         description: Invalid bank details, or no available earnings
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 *       403:
 *         description: Agents only
 *       409:
 *         description: Balance changed while processing — retry
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 *       429:
 *         description: Cooldown still active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: false }
 *                 message: { type: string }
 *                 nextRequestAt: { type: string, format: date-time }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 */
router.get('/payouts', listMyPayouts);
router.post('/payouts', requestPayout);

/**
 * @swagger
 * /api/agent/users:
 *   post:
 *     summary: Sign up a buyer, dealer, service provider or parts seller
 *     description: Either `email` or `phoneNumber` is required. The password is hashed by the User model.
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, password, role]
 *             properties:
 *               firstName: { type: string, example: Ada }
 *               lastName: { type: string, example: Obi }
 *               email: { type: string, format: email }
 *               phoneNumber: { type: string, example: '08012345678' }
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 8+ characters with uppercase, lowercase, a number and a symbol
 *               role:
 *                 type: string
 *                 enum: [user, dealer, service-provider, carPart-seller]
 *               state: { type: string }
 *               lga: { type: string }
 *               address: { type: string }
 *               dealerInfo: { type: object, description: Used when role is dealer }
 *               serviceProviderInfo: { type: object, description: Used when role is service-provider }
 *               carPartSellerInfo: { type: object, description: Used when role is carPart-seller }
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 message: { type: string, example: Account created }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     email: { type: string }
 *                     phoneNumber: { type: string }
 *                     role: { type: string }
 *       400:
 *         description: Validation failed, or email / phone number already exists
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 *       403:
 *         description: Agents only
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentError' }
 */
// Agent signs up a buyer, dealer, service provider or parts seller
router.post('/users', createUserByAgent);

export default router;