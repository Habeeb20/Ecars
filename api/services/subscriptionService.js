// services/subscriptionService.js
import Subscription from '../models/subscriptionSchema.js';
import User from '../models/user.js';
import CarListing from '../models/carListing.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Turns on the feature that the subscription pays for.
 * Safe to run more than once (it only sets flags and dates).
 */
export const activateFeatures = async (subscription) => {
  const endDate = new Date(subscription.endDate);
  const userId = subscription.user?._id ?? subscription.user;
  const listingId = subscription.listing?._id ?? subscription.listing;

  switch (subscription.type) {
    case 'featured_listing':
      if (listingId) {
        await CarListing.findByIdAndUpdate(listingId, {
          isFeatured: true,
          featuredUntil: endDate,
        });
      }
      break;

    case 'featured_dealer':
      await User.findByIdAndUpdate(userId, {
        'dealerInfo.isFeatured': true,
        'dealerInfo.featuredUntil': endDate,
      });
      break;

    case 'featured_service_provider':
      await User.findByIdAndUpdate(userId, {
        'serviceProviderInfo.isFeatured': true,
        'serviceProviderInfo.featuredUntil': endDate,
      });
      break;

    case 'newest_listings_access':
      // Nothing to flip: access is checked from the active subscription itself
      break;
  }
};

/**
 * Called by BOTH the webhook and the verify endpoint with Paystack's transaction data.
 * Whichever runs first activates the plan; the other one finds it already active.
 *
 * Returns { ok, subscription, alreadyActive?, reason? }
 */
export const processSuccessfulPayment = async (paystackData) => {
  const { reference, status, amount, currency } = paystackData;

  if (status !== 'success') {
    return { ok: false, reason: 'not_successful', paymentStatus: status };
  }

  const subscription = await Subscription.findOne({ reference });
  if (!subscription) return { ok: false, reason: 'not_found' };

  // Make sure the customer really paid for THIS plan at THIS price
  if (amount !== subscription.amount || currency !== 'NGN') {
    console.error('Payment mismatch', { reference, paid: amount, expected: subscription.amount, currency });
    return { ok: false, reason: 'amount_mismatch' };
  }

  if (subscription.status === 'active') {
    return { ok: true, subscription, alreadyActive: true };
  }

  // Count the plan from the moment of payment, not from when checkout was opened
  const startDate = new Date();
  const days = subscription.duration === 'yearly' ? 365 : 30;
  const endDate = new Date(startDate.getTime() + days * DAY_MS);

  // Atomic claim: only ONE caller can flip pending -> active
  const claimed = await Subscription.findOneAndUpdate(
    { _id: subscription._id, status: 'pending' },
    { status: 'active', startDate, endDate },
    { new: true }
  ).populate('user');

  if (!claimed) {
    // The webhook/verify call that ran at the same time won the race
    const latest = await Subscription.findById(subscription._id);
    return { ok: true, subscription: latest, alreadyActive: true };
  }

  try {
    await activateFeatures(claimed);
  } catch (err) {
    // Put it back to pending so Paystack's webhook retry (or a re-verify) can try again
    await Subscription.findByIdAndUpdate(claimed._id, { status: 'pending' });
    throw err;
  }

  return { ok: true, subscription: claimed };
};