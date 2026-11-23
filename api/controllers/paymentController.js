//  // controllers/paymentController.js
// import axios from 'axios';
// import crypto from 'crypto';
// import Subscription from '../models/subscriptionSchema.js';
// import User from '../models/user.js';
// import CarListing from '../models/carListing.js';

// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// const PAYSTACK_BASE_URL = 'https://api.paystack.co';


// // 1. Initialize Payment (Frontend calls this)
// export const initializePayment = async (req, res) => {
//   try {
//     const { type, duration = 'monthly', listingId } = req.body;
//     const user = req.user;

//     // Fixed: Proper object syntax
//     const prices = {
//       featured_listing: { monthly: 5000, yearly: 50000 },
//       newest_listings_access: { monthly: 2000, yearly: 20000 },
//       featured_dealer: { monthly: 15000, yearly: 150000 },
//       featured_service_provider: { monthly: 10000, yearly: 100000 },
//     };

//     if (!prices[type]) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Invalid subscription type',
//       });
//     }

//     const amountInNaira = prices[type][duration];
//     const amountInKobo = amountInNaira ;
//     // const amountInKobo = amountInNaira * 100;

//     const reference = `ecars_${type}_${Date.now()}_${user._id}`;
// // In your initializePayment controller
// const payload = {
//   email: user.email,
//   amount: amountInKobo,
//   reference,
//   metadata: { userId: user._id.toString(), type, duration },
//   channels: ['card', 'bank_transfer'],
//   callback_url: `${process.env.FRONTEND_URL}/payment/success`, // ← This one!
// };
   

//     const response = await axios.post(
//       'https://api.paystack.co/transaction/initialize',
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Save pending subscription
//     await Subscription.create({
//       user: user._id,
//       type,
//       reference,
//       amount: amountInKobo,
//       duration,
//       listing: listingId || null,
//       status: 'pending',
//       startDate: new Date(),
//       endDate: new Date(
//         Date.now() + (duration === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
//       ),
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         authorization_url: response.data.data.authorization_url,
//         access_code: response.data.data.access_code,
//         reference: response.data.data.reference,
//       },
//     });
//   } catch (err) {
//     console.error('Paystack Init Error →'.red, err.response?.data || err.message);
//     res.status(500).json({
//       status: 'error',
//       message: 'Payment initialization failed. Please try again.',
//     });
//   }
// };



// export const verifyPayment = async (req, res) => {
//   try {
//     const { reference } = req.query;

//     const response = await axios.get(
//       `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
//       { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
//     );

//     res.status(200).json({
//       status: response.data.status ? 'success' : 'fail',
//       data: response.data.data,
//     });
//   } catch (err) {
//     res.status(400).json({ status: 'fail', message: 'Verification failed' });
//   }
// };




// export const paystackWebhook = async (req, res) => {
//   try {
//     // Verify signature
//     const hash = crypto
//       .createHmac('sha512', PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//       return res.status(400).send('Invalid signature');
//     }

//     const event = req.body;

//     // Only handle successful payments
//     if (event.event === 'charge.success') {
//       const ref = event.data.reference;
//       const metadata = event.data.metadata;

//       // Find and activate subscription
//       const subscription = await Subscription.findOneAndUpdate(
//         { reference: ref },
//         { status: 'active' },
//         { new: true }
//       ).populate('user');

//       if (!subscription) {
//         console.log('Subscription not found for ref:', ref);
//         return res.status(200).send('OK');
//       }

//       const endDate = subscription.endDate;

//       console.log(`Activating plan: ${subscription.type} for user ${subscription.user._id}`);

//       // ACTIVATE THE FEATURES
//       switch (subscription.type) {
//         case 'featured_listing':
//           if (subscription.listing) {
//             await CarListing.findByIdAndUpdate(subscription.listing, {
//               isFeatured: true,                    // THIS WAS MISSING IN YOUR DUPLICATE!
//               featuredUntil: endDate,
//             });
//             console.log('Car boosted:', subscription.listing);
//           }
//           break;

//         case 'featured_dealer':
//           await User.findByIdAndUpdate(subscription.user._id, {
//             'dealerInfo.isFeatured': true,
//             'dealerInfo.featuredUntil': endDate,
//           });
//           console.log('Dealer featured:', subscription.user._id);
//           break;

//         case 'featured_service_provider':
//           await User.findByIdAndUpdate(subscription.user._id, {
//             'serviceProviderInfo.isFeatured': true,
//             'serviceProviderInfo.featuredUntil': endDate,
//           });
//           console.log('Service provider featured:', subscription.user._id);
//           break;

//         case 'newest_listings_access':
//           console.log('Newest listings access granted');
//           break;
//       }
//     }

//     res.status(200).send('OK');
//   } catch (err) {
//     console.error('Paystack webhook error:', err);
//     res.status(500).send('Error');
//   }
// };







// controllers/paymentController.js
import axios from 'axios';
import crypto from 'crypto';
import Subscription from '../models/subscriptionSchema.js';
import CarListing from '../models/carListing.js';
import { processSuccessfulPayment } from '../services/subscriptionService.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const PRICES = {
  featured_listing: { monthly: 5000, yearly: 50000 },
  newest_listings_access: { monthly: 2000, yearly: 20000 },
  featured_dealer: { monthly: 15000, yearly: 150000 },
  featured_service_provider: { monthly: 10000, yearly: 100000 },
};

/* ------------------------------------------------------------------
   1. Initialize payment (frontend calls this, then redirects to Paystack)
------------------------------------------------------------------- */
export const initializePayment = async (req, res) => {
  try {
    const { type, duration = 'monthly', listingId } = req.body;
    const user = req.user;

    const amountInNaira = PRICES[type]?.[duration];
    if (!amountInNaira) {
      return res.status(400).json({ status: 'fail', message: 'Invalid subscription type or duration' });
    }

    // A featured listing must point at a car that belongs to this user
    if (type === 'featured_listing') {
      if (!listingId) {
        return res.status(400).json({ status: 'fail', message: 'listingId is required' });
      }
      const listing = await CarListing.findOne({ _id: listingId, postedBy: user._id });
      if (!listing) {
        return res.status(404).json({ status: 'fail', message: 'Listing not found' });
      }
    }

    // Paystack amounts are in KOBO (₦1 = 100 kobo)
    const amountInKobo = amountInNaira * 100;
    const reference = `ecars_${type}_${Date.now()}_${user._id}`;

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: user.email,
        amount: amountInKobo,
        currency: 'NGN',
        reference,
        metadata: { userId: user._id.toString(), type, duration },
        channels: ['card', 'bank_transfer'],
        callback_url: `${process.env.FRONTEND_URL}/payment/success`,
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' } }
    );

    // Saved as pending. Dates are set again at the moment of payment.
    const days = duration === 'yearly' ? 365 : 30;
    await Subscription.create({
      user: user._id,
      type,
      reference,
      amount: amountInKobo,
      duration,
      listing: listingId || null,
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      status: 'success',
      data: {
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference,
      },
    });
  } catch (err) {
    console.error('Paystack init error:', err.response?.data || err.message);
    res.status(500).json({ status: 'error', message: 'Payment initialization failed. Please try again.' });
  }
};

/* ------------------------------------------------------------------
   2. Verify payment (the /payment/success page calls this with ?reference=)
   Verifies with Paystack and ACTIVATES the plan immediately.
------------------------------------------------------------------- */
export const verifyPayment = async (req, res) => {
  try {
    const reference = req.query.reference || req.query.trxref;
    if (!reference) {
      return res.status(400).json({ status: 'fail', message: 'Payment reference is required' });
    }

    // If the user is logged in, make sure this payment is theirs
    if (req.user) {
      const mine = await Subscription.findOne({ reference });
      if (mine && mine.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'fail', message: 'This payment belongs to another account' });
      }
    }

    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const result = await processSuccessfulPayment(response.data.data);

    if (!result.ok) {
      const messages = {
        not_successful: `Payment not completed (${result.paymentStatus}).`,
        not_found: 'No subscription found for this payment.',
        amount_mismatch: 'The amount paid does not match this plan. Please contact support.',
      };
      return res.status(200).json({
        status: 'fail',
        reason: result.reason,
        message: messages[result.reason] || 'Payment could not be verified.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and your plan is now active.',
      data: { subscription: result.subscription },
    });
  } catch (err) {
    console.error('Verify error:', err.response?.data || err.message);
    res.status(400).json({ status: 'fail', message: 'Verification failed' });
  }
};

/* ------------------------------------------------------------------
   3. Webhook (Paystack calls this itself, even if the user closes the tab)
   Needs the RAW body to check the signature. See the app.js note below.
------------------------------------------------------------------- */
export const paystackWebhook = async (req, res) => {
  try {
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));

    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(rawBody).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = Buffer.isBuffer(req.body) ? JSON.parse(rawBody.toString('utf8')) : req.body;

    if (event.event === 'charge.success') {
      const result = await processSuccessfulPayment(event.data);
      if (!result.ok) console.warn('Webhook not activated:', result.reason, event.data.reference);
    }

    // Always answer 200 quickly for events we handled or ignored
    res.status(200).send('OK');
  } catch (err) {
    console.error('Paystack webhook error:', err);
    res.status(500).send('Error'); // Paystack will retry
  }
};
