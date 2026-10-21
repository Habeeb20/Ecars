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

router.get('/overview', getOverview);
router.get('/referrals', listReferrals);
router.get('/earnings', listEarnings);
router.get('/payouts', listMyPayouts);
router.post('/payouts', requestPayout);

// Agent signs up a buyer, dealer, service provider or parts seller
router.post('/users', createUserByAgent);

export default router;