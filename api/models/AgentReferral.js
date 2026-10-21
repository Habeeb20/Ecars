// models/AgentReferral.js — one row per user an agent signed up
import mongoose from 'mongoose';
const { Schema } = mongoose;

const agentReferralSchema = new Schema(
  {
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    userRole: { type: String, enum: ['user', 'dealer', 'service-provider', 'carPart-seller'], required: true },

    // Snapshot of the split at the time of signup, so later config changes don't rewrite history
    signupShare: { type: Number, required: true },
    activityShare: { type: Number, required: true },

    signupCredited: { type: Boolean, default: false },
    signupCreditedAt: Date,

    // Becomes true the first time the user does something that counts as "using the account"
    activated: { type: Boolean, default: false },
    activatedAt: Date,
    activatedBy: {
      source: String, // e.g. 'listing_verified' | 'car_sold' | 'credits_purchase'
      ref: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

agentReferralSchema.index({ agent: 1, activated: 1 });

export default mongoose.model('AgentReferral', agentReferralSchema);