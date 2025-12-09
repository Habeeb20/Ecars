// 1. New Subscription Model (models/subscription.js)
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['featured_listing', 'newest_listings_access', 'featured_dealer', 'featured_service_provider'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', "pending"],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true, // e.g., 30 days from start
  },
  paymentId: String, // Stripe payment ID
  amount: Number,
  duration: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  },
  autoRenew: { type: Boolean, default: false },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarListing',
    required: [function() { return this.type === 'featured_listing'; }, 'Listing ID required for featured listing'],
  },
}, { timestamps: true });

// Auto-expire logic (optional, use TTL index)
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Subscription', subscriptionSchema);