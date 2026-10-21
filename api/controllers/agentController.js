// controllers/agentController.js — endpoints used by the agent dashboard
 // ← adjust if your User model lives elsewhere
import User from '../models/user.js';
import AgentReferral from '../models/AgentReferral.js';
import AgentEarning from '../models/AgentEarning.js';
import AgentPayout from '../models/AgentPayout.js';
import { getAgentStats, linkAgentToUser } from '../services/agentService.js'
import { PAYOUT_COOLDOWN_DAYS } from '../config/agent.js';

const paging = (q, max = 50, def = 15) => {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(max, Math.max(1, Number(q.limit) || def));
  return { page, limit, skip: (page - 1) * limit };
};
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getOverview = async (req, res) => {
  try {
    const stats = await getAgentStats(req.user._id);
    res.json({ status: true, data: stats });
  } catch (err) {
    console.error('Agent overview error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Every user this agent signed up, with active / not-yet-active status
export const listReferrals = async (req, res) => {
  try {
    const { page, limit, skip } = paging(req.query);
    const filter = { agent: req.user._id };
    if (req.query.status === 'active') filter.activated = true;
    if (req.query.status === 'inactive') filter.activated = false;

    const search = (req.query.search || '').trim();
    if (search) {
      const rx = new RegExp(escapeRx(search), 'i');
      const ids = await User.distinct('_id', {
        signedUpByAgent: req.user._id,
        $or: [{ firstName: rx }, { lastName: rx }, { email: rx }, { phoneNumber: rx }],
      });
      filter.user = { $in: ids };
    }

    const [rows, total] = await Promise.all([
      AgentReferral.find(filter)
        .populate('user', 'firstName lastName email phoneNumber role emailVerified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AgentReferral.countDocuments(filter),
    ]);

    const data = rows.map((r) => {
      const signupEarned = r.signupCredited ? r.signupShare : 0;
      const activityEarned = r.activated ? r.activityShare : 0;
      return {
        _id: r._id,
        user: r.user,
        userRole: r.userRole,
        signedUpAt: r.createdAt,
        activated: r.activated,
        activatedAt: r.activatedAt,
        signupEarned,
        activityEarned,
        totalEarned: signupEarned + activityEarned,
        stillToUnlock: r.activated ? 0 : r.activityShare,
      };
    });

    res.json({ status: true, data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Agent referrals error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Ledger of earnings (money) for the points & earnings page
export const listEarnings = async (req, res) => {
  try {
    const { page, limit, skip } = paging(req.query);
    const filter = { agent: req.user._id };
    if (['available', 'requested', 'paid'].includes(req.query.status)) filter.status = req.query.status;

    const [rows, total] = await Promise.all([
      AgentEarning.find(filter)
        .populate('user', 'firstName lastName role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AgentEarning.countDocuments(filter),
    ]);

    res.json({ status: true, data: rows, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Agent earnings error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Request everything currently available — once per rolling 7 days
export const requestPayout = async (req, res) => {
  try {
    const { bankName, accountNumber, accountName } = req.body;
    if (!bankName?.trim() || !accountName?.trim() || !/^\d{10}$/.test(String(accountNumber || '').trim())) {
      return res.status(400).json({
        status: false,
        message: 'Enter a bank name, account name and a 10-digit account number',
      });
    }

    const since = new Date(Date.now() - PAYOUT_COOLDOWN_DAYS * 86400000);
    const recent = await AgentPayout.findOne({
      agent: req.user._id,
      status: { $in: ['pending', 'approved', 'paid'] },
      requestedAt: { $gte: since },
    }).sort({ requestedAt: -1 });

    if (recent) {
      const next = new Date(recent.requestedAt.getTime() + PAYOUT_COOLDOWN_DAYS * 86400000);
      return res.status(429).json({
        status: false,
        message: `You can request a payout once a week. Next request: ${next.toDateString()}`,
        nextRequestAt: next,
      });
    }

    const available = await AgentEarning.find({ agent: req.user._id, status: 'available' }).select('_id amount').lean();
    const amount = available.reduce((s, e) => s + e.amount, 0);
    if (amount <= 0) {
      return res.status(400).json({ status: false, message: 'You have no available earnings to withdraw yet' });
    }

    const payout = await AgentPayout.create({
      agent: req.user._id,
      amount,
      earningsCount: available.length,
      bank: { bankName: bankName.trim(), accountNumber: String(accountNumber).trim(), accountName: accountName.trim() },
    });

    const ids = available.map((e) => e._id);
    const result = await AgentEarning.updateMany(
      { _id: { $in: ids }, status: 'available' },
      { $set: { status: 'requested', payout: payout._id } }
    );

    // Another request grabbed some of these rows first — undo and ask the agent to retry
    if (result.modifiedCount !== ids.length) {
      await AgentEarning.updateMany({ payout: payout._id }, { $set: { status: 'available' }, $unset: { payout: 1 } });
      await AgentPayout.deleteOne({ _id: payout._id });
      return res.status(409).json({ status: false, message: 'Your balance changed. Please try again.' });
    }

    res.status(201).json({ status: true, message: 'Payout requested. Admin will review it shortly.', data: payout });
  } catch (err) {
    console.error('Request payout error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

export const listMyPayouts = async (req, res) => {
  try {
    const { page, limit, skip } = paging(req.query, 50, 20);
    const filter = { agent: req.user._id };
    const [rows, total] = await Promise.all([
      AgentPayout.find(filter).sort({ requestedAt: -1 }).skip(skip).limit(limit).lean(),
      AgentPayout.countDocuments(filter),
    ]);
    res.json({ status: true, data: rows, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Agent payouts error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// ─── Agent signs up a buyer / dealer / service provider / parts seller ───────
const SIGNUP_ROLES = ['user', 'dealer', 'service-provider', 'carPart-seller'];
const strongPassword = (p = '') =>
  p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);

export const createUserByAgent = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, phoneNumber, role, state, lga, address,
      dealerInfo, serviceProviderInfo, carPartSellerInfo,
    } = req.body;

    if (!SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ status: false, message: 'Choose a valid account type' });
    }
    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ status: false, message: 'First name, last name  are required' });
    }
    if (!strongPassword(password)) {
      return res.status(400).json({
        status: false,
        message: 'Password needs 8+ characters with uppercase, lowercase, a number and a symbol',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: cleanEmail })) {
      return res.status(400).json({ status: false, message: 'Email already exists' });
    }

    // The password is hashed by the User model's pre-save hook, so pass it as plain text
    const doc = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password,
      role,
      phoneNumber,
      state,
      lga,
      address,
      signedUpByAgent: req.user._id,
    };
    if (role === 'dealer') doc.dealerInfo = dealerInfo;
    if (role === 'service-provider') doc.serviceProviderInfo = serviceProviderInfo;
    if (role === 'carPart-seller') doc.carPartSellerInfo = carPartSellerInfo;

    const user = await User.create(doc);

    try {
      await linkAgentToUser(req.user, user);
    } catch (err) {
      console.error('Agent link failed:', err.message);
    }

    res.status(201).json({
      status: true,
      message: 'Account created',
      data: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ status: false, message: Object.values(err.errors).map((e) => e.message).join('. ') });
    }
    if (err.code === 11000) {
      return res.status(400).json({ status: false, message: 'That email or business registration number is already in use' });
    }
    console.error('Agent create user error:', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};