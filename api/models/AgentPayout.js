// models/AgentPayout.js — an agent's withdrawal request and its history
import mongoose from 'mongoose';
const { Schema } = mongoose;

const agentPayoutSchema = new Schema(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    earningsCount: { type: Number, default: 0 },

    // Snapshot at request time so admin always pays the account the agent submitted
    bank: {
      bankName: { type: String, required: true, trim: true },
      accountNumber: { type: String, required: true, trim: true },
      accountName: { type: String, required: true, trim: true },
    },

    // pending -> approved -> paid   |   pending/approved -> rejected
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending', index: true },
    requestedAt: { type: Date, default: Date.now },

    approvedAt: Date,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: Date,
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String, trim: true, maxlength: 300 },
    paidAt: Date,
    paidBy: { type: Schema.Types.ObjectId, ref: 'User' },
    paymentReference: { type: String, trim: true, maxlength: 100 },
  },
  { timestamps: true }
);

export default mongoose.model('AgentPayout', agentPayoutSchema);