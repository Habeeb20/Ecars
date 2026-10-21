// controllers/adminAgentController.js — superadmin view of the whole agent network
import mongoose from 'mongoose';

import User from '../models/user.js'; // ← adjust if your User model lives elsewhere
import AgentReferral from '../models/AgentReferral.js';
import AgentEarning from '../models/AgentEarning.js';
import AgentPayout from '../models/AgentPayout.js';
import { getAgentStats } from '../services/agentService.js';

const paging = (q, max = 100, def = 20) => {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(max, Math.max(1, Number(q.limit) || def));
  return { page, limit, skip: (page - 1) * limit };
};

// Network-wide totals
export const getNetworkOverview = async (_req, res) => {
  try {
    const [agents, refAgg, earnAgg, payoutAgg] = await Promise.all([
      User.countDocuments({ role: 'agent' }),
      AgentReferral.aggregate([{ $group: { _id: '$activated', count: { $sum: 1 } } }]),
      AgentEarning.aggregate([{ $group: { _id: '$status', total: { $sum: '$amount' } } }]),
      AgentPayout.aggregate([{ $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    ]);

    const referred = refAgg.reduce((s, r) => s + r.count, 0);
    const activated = refAgg.find((r) => r._id === true)?.count || 0;
    const byStatus = (arr, k) => arr.find((x) => x._id === k)?.total || 0;
    const payoutCount = (k) => payoutAgg.find((x) => x._id === k)?.count || 0;

    res.json({
      status: true,
      data: {
        agents,
        referred,
        activated,
        inactive: referred - activated,
        earned: earnAgg.reduce((s, e) => s + e.total, 0),
        unpaid: byStatus(earnAgg, 'available') + byStatus(earnAgg, 'requested'),
        paid: byStatus(earnAgg, 'paid'),
        pendingRequests: payoutCount('pending'),
        pendingRequestsAmount: byStatus(payoutAgg, 'pending'),
        approvedAwaitingPayment: payoutCount('approved'),
      },
    });
  } catch (err) {
    console.error('Network overview error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Every agent with their numbers
export const listAgents = async (req, res) => {
  try {
    const search = (req.query.search || '').trim().toLowerCase();

    const [agents, refs, earns, payouts] = await Promise.all([
      User.find({ role: 'agent' })
        .select('firstName lastName email phoneNumber isActive loyaltyPoints referralCode createdAt')
        .sort({ createdAt: -1 })
        .lean(),
      AgentReferral.aggregate([
        { $group: { _id: '$agent', total: { $sum: 1 }, activated: { $sum: { $cond: ['$activated', 1, 0] } } } },
      ]),
      AgentEarning.aggregate([{ $group: { _id: { agent: '$agent', status: '$status' }, total: { $sum: '$amount' } } }]),
      AgentPayout.aggregate([{ $group: { _id: { agent: '$agent', status: '$status' }, count: { $sum: 1 } } }]),
    ]);

    const map = new Map(
      agents.map((a) => [
        String(a._id),
        {
          ...a,
          referred: 0,
          activated: 0,
          inactive: 0,
          earned: 0,
          available: 0,
          requested: 0,
          paid: 0,
          requests: { pending: 0, approved: 0, rejected: 0, paid: 0 },
        },
      ])
    );

    refs.forEach((r) => {
      const a = map.get(String(r._id));
      if (a) {
        a.referred = r.total;
        a.activated = r.activated;
        a.inactive = r.total - r.activated;
      }
    });
    earns.forEach((e) => {
      const a = map.get(String(e._id.agent));
      if (a) {
        a.earned += e.total;
        a[e._id.status] += e.total;
      }
    });
    payouts.forEach((p) => {
      const a = map.get(String(p._id.agent));
      if (a) a.requests[p._id.status] = p.count;
    });

    let data = [...map.values()];
    if (search) {
      data = data.filter((a) => `${a.firstName} ${a.lastName} ${a.email} ${a.phoneNumber || ''}`.toLowerCase().includes(search));
    }
    res.json({ status: true, data });
  } catch (err) {
    console.error('List agents error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// One agent in full: stats, users they signed up, earnings ledger, payout history
export const getAgentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ status: false, message: 'Invalid agent id' });

    const agent = await User.findOne({ _id: id, role: 'agent' })
      .select('firstName lastName email phoneNumber isActive loyaltyPoints referralCode createdAt')
      .lean();
    if (!agent) return res.status(404).json({ status: false, message: 'Agent not found' });

    const [stats, referrals, earnings, payouts] = await Promise.all([
      getAgentStats(id),
      AgentReferral.find({ agent: id })
        .populate('user', 'firstName lastName email phoneNumber role emailVerified')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean(),
      AgentEarning.find({ agent: id }).populate('user', 'firstName lastName role').sort({ createdAt: -1 }).limit(200).lean(),
      AgentPayout.find({ agent: id }).sort({ requestedAt: -1 }).limit(100).lean(),
    ]);

    res.json({ status: true, data: { agent, stats, referrals, earnings, payouts } });
  } catch (err) {
    console.error('Agent detail error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// All payout requests, filterable: pending | approved | paid | rejected | unpaid (= pending + approved)
export const listPayouts = async (req, res) => {
  try {
    const { page, limit, skip } = paging(req.query);
    const filter = {};
    const s = req.query.status;
    if (['pending', 'approved', 'rejected', 'paid'].includes(s)) filter.status = s;
    if (s === 'unpaid') filter.status = { $in: ['pending', 'approved'] };
    if (req.query.agent && mongoose.isValidObjectId(req.query.agent)) filter.agent = req.query.agent;

    const [rows, total] = await Promise.all([
      AgentPayout.find(filter)
        .populate('agent', 'firstName lastName email phoneNumber')
        .populate('paidBy approvedBy rejectedBy', 'firstName lastName')
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AgentPayout.countDocuments(filter),
    ]);

    res.json({ status: true, data: rows, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('List payouts error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Grant
export const approvePayout = async (req, res) => {
  try {
    const payout = await AgentPayout.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { $set: { status: 'approved', approvedAt: new Date(), approvedBy: req.user._id } },
      { new: true }
    );
    if (!payout) return res.status(400).json({ status: false, message: 'Only pending requests can be approved' });
    res.json({ status: true, message: 'Payout approved', data: payout });
  } catch (err) {
    console.error('Approve payout error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Revoke — the earnings go back to the agent's available balance
export const rejectPayout = async (req, res) => {
  try {
    const reason = (req.body.reason || '').trim();
    if (!reason) return res.status(400).json({ status: false, message: 'Give a reason for rejecting this request' });

    const payout = await AgentPayout.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['pending', 'approved'] } },
      { $set: { status: 'rejected', rejectedAt: new Date(), rejectedBy: req.user._id, rejectionReason: reason } },
      { new: true }
    );
    if (!payout) return res.status(400).json({ status: false, message: 'Only pending or approved requests can be rejected' });

    await AgentEarning.updateMany(
      { payout: payout._id, status: 'requested' },
      { $set: { status: 'available' }, $unset: { payout: 1 } }
    );
    res.json({ status: true, message: 'Payout rejected. Earnings returned to the agent.', data: payout });
  } catch (err) {
    console.error('Reject payout error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Record that admin has actually sent the money
export const markPayoutPaid = async (req, res) => {
  try {
    const paymentReference = (req.body.paymentReference || '').trim();
    if (!paymentReference) {
      return res.status(400).json({ status: false, message: 'Enter the transfer reference or receipt number' });
    }

    const payout = await AgentPayout.findOneAndUpdate(
      { _id: req.params.id, status: 'approved' },
      { $set: { status: 'paid', paidAt: new Date(), paidBy: req.user._id, paymentReference } },
      { new: true }
    );
    if (!payout) return res.status(400).json({ status: false, message: 'Approve the request before marking it paid' });

    await AgentEarning.updateMany(
      { payout: payout._id, status: 'requested' },
      { $set: { status: 'paid', paidAt: new Date() } }
    );
    res.json({ status: true, message: 'Marked as paid', data: payout });
  } catch (err) {
    console.error('Mark paid error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};