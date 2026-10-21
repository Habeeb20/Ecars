// services/agentService.js
import mongoose from 'mongoose';
import User from '../models/user.js';

import AgentReferral from '../models/AgentReferral.js';
import AgentEarning from '../models/AgentEarning.js';
import AgentPayout from '../models/AgentPayout.js';
import {
  AGENT_SIGNUP_AMOUNT,
  AGENT_ACTIVITY_AMOUNT,
  PAYOUT_COOLDOWN_DAYS,
} from '../config/agent.js';

// Insert a ledger row; the unique (referral, type) index makes this idempotent
async function creditEarning({ referral, type, amount, source, ref }) {
  try {
    return await AgentEarning.create({
      agent: referral.agent,
      referral: referral._id,
      user: referral.user,
      type,
      amount,
      source,
      ref,
    });
  } catch (err) {
    if (err.code === 11000) return null; // already credited
    throw err;
  }
}

// 10% — credited once per referred user
export async function creditSignupShare(userId) {
  const referral = await AgentReferral.findOneAndUpdate(
    { user: userId, signupCredited: false },
    { $set: { signupCredited: true, signupCreditedAt: new Date() } },
    { new: true }
  );
  if (!referral) return null;
  return creditEarning({ referral, type: 'signup', amount: referral.signupShare });
}

// Called when a user is signed up under an agent (self signup with the agent's
// code, or created by the agent). Credits the 10% straight away by default.
// To pay it only after email verification instead, pass { creditSignup: false }
// and call creditSignupShare(user._id) from your verification handler.
export async function linkAgentToUser(agent, user, { creditSignup = true } = {}) {
  const referral = await AgentReferral.create({
    agent: agent._id,
    user: user._id,
    userRole: user.role,
    signupShare: AGENT_SIGNUP_AMOUNT,
    activityShare: AGENT_ACTIVITY_AMOUNT,
  });
  if (creditSignup) await creditSignupShare(user._id);
  return referral;
}

// 90% — credited the first time a referred user does something that counts as
// using their account. Safe to call repeatedly: only the first call pays.
//   source: short label stored on the ledger, ref: id of the listing/purchase
export async function recordAgentActivity(userId, { source, ref } = {}) {
  if (!userId) return null;
  const referral = await AgentReferral.findOneAndUpdate(
    { user: userId, activated: false },
    { $set: { activated: true, activatedAt: new Date(), activatedBy: { source, ref } } },
    { new: true }
  );
  if (!referral) return null; // not an agent's user, or already activated

  await creditSignupShare(userId); // in case the signup share was deferred
  return creditEarning({ referral, type: 'activity', amount: referral.activityShare, source, ref });
}

// Everything the dashboards need about one agent
export async function getAgentStats(agentId) {
  const id = new mongoose.Types.ObjectId(agentId);

  const [agent, refAgg, earnAgg, lastPayout] = await Promise.all([
    User.findById(id).select('firstName lastName email loyaltyPoints referralCode').lean(),
    AgentReferral.aggregate([{ $match: { agent: id } }, { $group: { _id: '$activated', count: { $sum: 1 } } }]),
    AgentEarning.aggregate([
      { $match: { agent: id } },
      { $group: { _id: { status: '$status', type: '$type' }, total: { $sum: '$amount' } } },
    ]),
    AgentPayout.findOne({ agent: id, status: { $in: ['pending', 'approved', 'paid'] } })
      .sort({ requestedAt: -1 })
      .select('requestedAt')
      .lean(),
  ]);

  let activated = 0;
  let inactive = 0;
  refAgg.forEach((r) => (r._id ? (activated = r.count) : (inactive = r.count)));

  const earned = { signup: 0, activity: 0, total: 0 };
  const balance = { available: 0, requested: 0, paid: 0 };
  earnAgg.forEach((e) => {
    earned[e._id.type] += e.total;
    earned.total += e.total;
    balance[e._id.status] += e.total;
  });

  const nextRequestAt = lastPayout
    ? new Date(lastPayout.requestedAt.getTime() + PAYOUT_COOLDOWN_DAYS * 86400000)
    : null;
  const cooldownOver = !nextRequestAt || nextRequestAt <= new Date();

  return {
    agent: agent && { firstName: agent.firstName, lastName: agent.lastName, email: agent.email },
    points: agent?.loyaltyPoints || 0,
    referralCode: agent?.referralCode,
    totalReferred: activated + inactive,
    activated,
    inactive,
    earned,
    balance,
    pendingPotential: inactive * AGENT_ACTIVITY_AMOUNT,
    nextRequestAt,
    canRequest: balance.available > 0 && cooldownOver,
  };
}