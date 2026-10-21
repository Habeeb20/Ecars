// models/AgentEarning.js — ledger of every naira an agent earns
import mongoose from 'mongoose';
const { Schema } = mongoose;

const agentEarningSchema = new Schema(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referral: { type: Schema.Types.ObjectId, ref: 'AgentReferral', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['signup', 'activity'], required: true },
    amount: { type: Number, required: true, min: 0 },
    source: String, // what triggered an activity earning
    ref: Schema.Types.ObjectId, // the listing / purchase that triggered it

    // available -> requested (payout asked) -> paid
    status: { type: String, enum: ['available', 'requested', 'paid'], default: 'available', index: true },
    payout: { type: Schema.Types.ObjectId, ref: 'AgentPayout' },
    paidAt: Date,
  },
  { timestamps: true }
);

// A referral can only ever earn one signup share and one activity share
agentEarningSchema.index({ referral: 1, type: 1 }, { unique: true });
agentEarningSchema.index({ agent: 1, status: 1 });

export default mongoose.model('AgentEarning', agentEarningSchema);