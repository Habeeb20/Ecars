// routes/adminAgentRoutes.js  →  app.use('/api/admin/agent-network', adminAgentRoutes)
import express from 'express';
import { protect } from '../middleware/verifyToken.js'; // ← your auth middleware
import {
  getNetworkOverview,
  listAgents,
  getAgentDetail,
  listPayouts,
  approvePayout,
  rejectPayout,
  markPayoutPaid,
} from '../controllers/adminAgentController.js';

const router = express.Router();

const adminOnly = (req, res, next) =>
  req.user?.role === 'superadmin' ? next() : res.status(403).json({ status: false, message: 'Admins only' });

router.use(protect, adminOnly);

router.get('/overview', getNetworkOverview);
router.get('/payouts', listPayouts);
router.patch('/payouts/:id/approve', approvePayout);
router.patch('/payouts/:id/reject', rejectPayout);
router.patch('/payouts/:id/paid', markPayoutPaid);
router.get('/', listAgents);
router.get('/:id', getAgentDetail); // keep last so it doesn't swallow the routes above

export default router;