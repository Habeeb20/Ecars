// controllers/paymentController.js
import axios from 'axios';
import crypto from 'crypto';
import Subscription from '../models/subscriptionSchema.js';
import User from '../models/user.js';
import CarListing from '../models/carListing.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';


// 1. Initialize Payment (Frontend calls this)
export const initializePayment = async (req, res) => {
  try {
    const { type, duration = 'monthly', listingId } = req.body;
    const user = req.user;

    // Fixed: Proper object syntax
    const prices = {
      featured_listing: { monthly: 5000, yearly: 50000 },
      newest_listings_access: { monthly: 2000, yearly: 20000 },
      featured_dealer: { monthly: 15000, yearly: 150000 },
      featured_service_provider: { monthly: 10000, yearly: 100000 },
    };

    if (!prices[type]) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid subscription type',
      });
    }

    const amountInNaira = prices[type][duration];
    const amountInKobo = amountInNaira * 100;

    const reference = `ecars_${type}_${Date.now()}_${user._id}`;
// In your initializePayment controller
const payload = {
  email: user.email,
  amount: amountInKobo,
  reference,
  metadata: { userId: user._id.toString(), type, duration },
  channels: ['card', 'bank_transfer'],
  callback_url: `${process.env.FRONTEND_URL}/payment/success`, // ← This one!
};
   

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save pending subscription
    await Subscription.create({
      user: user._id,
      type,
      reference,
      amount: amountInKobo,
      duration,
      listing: listingId || null,
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(
        Date.now() + (duration === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
      ),
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
    console.error('Paystack Init Error →'.red, err.response?.data || err.message);
    res.status(500).json({
      status: 'error',
      message: 'Payment initialization failed. Please try again.',
    });
  }
};
// 2. Paystack Webhook (CRITICAL – This activates the feature!)
// export const paystackWebhook = async (req, res) => {
//   try {
//     const hash = crypto
//       .createHmac('sha512', PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//       return res.status(400).send('Invalid signature');
//     }

//     const event = req.body;

//     if (event.event === 'charge.success') {
//       const ref = event.data.reference;
//       const metadata = event.data.metadata;

//       const subscription = await Subscription.findOneAndUpdate(
//         { reference: ref },
//         { status: 'active' },
//         { new: true }
//       ).populate('user');

//       if (!subscription) return res.status(200).send('OK');

//       const endDate = subscription.endDate;

//       // Activate the actual feature
//       switch (subscription.type) {
//         case 'featured_listing':
//           if (subscription.listing) {
//             await CarListing.findByIdAndUpdate(subscription.listing, {
//               isFeatured: true,
//               featuredUntil: endDate,
//             });
//           }
//           break;

//         case 'featured_dealer':
//           await User.findByIdAndUpdate(subscription.user._id, {
//             'dealerInfo.isFeatured': true,
//             'dealerInfo.featuredUntil': endDate,
//           });
//           break;

//         case 'featured_service_provider':
//           await User.findByIdAndUpdate(subscription.user._id, {
//             'serviceProviderInfo.isFeatured': true,
//             'serviceProviderInfo.featuredUntil': endDate,
//           });
//           break;

//         case 'newest_listings_access':
//           // Just active subscription gives access
//           break;
//       }
//     }

//     res.status(200).send('OK');
//   } catch (err) {
//     console.log('Webhook error:', err);
//     res.status(500).send('Error');
//   }
// };

// 3. Verify Payment (Frontend can call this after redirect)
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    res.status(200).json({
      status: response.data.status ? 'success' : 'fail',
      data: response.data.data,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Verification failed' });
  }
};







































export const paystackWebhook = async (req, res) => {
  try {
    // Verify signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    // Only handle successful payments
    if (event.event === 'charge.success') {
      const ref = event.data.reference;
      const metadata = event.data.metadata;

      // Find and activate subscription
      const subscription = await Subscription.findOneAndUpdate(
        { reference: ref },
        { status: 'active' },
        { new: true }
      ).populate('user');

      if (!subscription) {
        console.log('Subscription not found for ref:', ref);
        return res.status(200).send('OK');
      }

      const endDate = subscription.endDate;

      console.log(`Activating plan: ${subscription.type} for user ${subscription.user._id}`);

      // ACTIVATE THE FEATURES
      switch (subscription.type) {
        case 'featured_listing':
          if (subscription.listing) {
            await CarListing.findByIdAndUpdate(subscription.listing, {
              isFeatured: true,                    // THIS WAS MISSING IN YOUR DUPLICATE!
              featuredUntil: endDate,
            });
            console.log('Car boosted:', subscription.listing);
          }
          break;

        case 'featured_dealer':
          await User.findByIdAndUpdate(subscription.user._id, {
            'dealerInfo.isFeatured': true,
            'dealerInfo.featuredUntil': endDate,
          });
          console.log('Dealer featured:', subscription.user._id);
          break;

        case 'featured_service_provider':
          await User.findByIdAndUpdate(subscription.user._id, {
            'serviceProviderInfo.isFeatured': true,
            'serviceProviderInfo.featuredUntil': endDate,
          });
          console.log('Service provider featured:', subscription.user._id);
          break;

        case 'newest_listings_access':
          console.log('Newest listings access granted');
          break;
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Paystack webhook error:', err);
    res.status(500).send('Error');
  }
};