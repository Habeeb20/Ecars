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
    const amountInKobo = amountInNaira ;
    // const amountInKobo = amountInNaira * 100;

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






// // backend/controllers/paymentController.js
// import axios from 'axios';
// import crypto from 'crypto';
// import Subscription from '../models/subscriptionSchema.js';

// import User from '../models/user.js';
// import CarListing from '../models/carListing.js';

// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// // 1. Initialize Payment (called from frontend)
// export const initializePayment = async (req, res) => {
//   const { type, duration = 'monthly', listingId } = req.body;
//   const user = req.user;

//   try {
//     // Validate subscription type
//     const validTypes = [
//       'featured_listing',
//       'newest_listings_access',
//       'featured_dealer',
//       'featured_service_provider'
//     ];
//     if (!validTypes.includes(type)) {
//       return res.status(400).json({ success: false, message: 'Invalid subscription type' });
//     }

//     // Define prices (in Naira)
//     const prices = {
//       featured_listing: { monthly: 5000, yearly: 50000 },
//       newest_listings_access: { monthly: 2000, yearly: 20000 },
//       featured_dealer: { monthly: 15000, yearly: 150000 },
//       featured_service_provider: { monthly: 10000, yearly: 100000 },
//     };

//     const amountInNaira = prices[type][duration];
//     if (!amountInNaira) {
//       return res.status(400).json({ success: false, message: 'Invalid duration or type' });
//     }

//     const amountInKobo = amountInNaira * 100;

//     // Generate unique reference
//     const reference = `ecars_${type}_${Date.now()}_${user._id}`;

//     // Paystack payload
//     const payload = {
//       email: user.email,
//       amount: amountInKobo,
//       reference,
//       metadata: { userId: user._id.toString(), type, duration, listingId: listingId || null },
//       channels: ['card', 'bank_transfer'],
//       callback_url: `${process.env.FRONTEND_URL}/payment/success`, // frontend success page
//     };

//     const response = await axios.post(
//       `${PAYSTACK_BASE_URL}/transaction/initialize`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     // Create pending subscription
//     await Subscription.create({
//       user: user._id,
//       type,
//       package: duration, // monthly/yearly
//       subscriptionAmount: amountInNaira,
//       paymentRef: reference,
//       subscriptionStatus: 'pending',
//       startDate: new Date(),
//       endDate: new Date(
//         Date.now() + (duration === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
//       ),
//       listing: listingId || null,
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         authorization_url: response.data.data.authorization_url,
//         access_code: response.data.data.access_code,
//         reference: response.data.data.reference,
//         amount: amountInNaira,
//         currency: 'NGN'
//       }
//     });
//   } catch (err) {
//     console.error('Payment initialization error:', err.response?.data || err.message);
//     res.status(500).json({
//       success: false,
//       message: 'Payment initialization failed. Please try again.'
//     });
//   }
// };

// // 2. Webhook – Paystack calls this when payment succeeds/fails
// export const paystackWebhook = async (req, res) => {
//   try {
//     // Verify Paystack signature
//     const hash = crypto
//       .createHmac('sha512', PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (hash !== req.headers['x-paystack-signature']) {
//       return res.status(400).send('Invalid signature');
//     }

//     const event = req.body;

//     // Only handle successful charges
//     if (event.event === 'charge.success') {
//       const ref = event.data.reference;
//       const metadata = event.data.metadata || {};

//       const { userId, type, duration, listingId } = metadata;

//       if (!userId || !type) {
//         console.log('Missing metadata in webhook:', event);
//         return res.status(200).send('OK');
//       }

//       // Find pending subscription
//       const subscription = await Subscription.findOne({
//         paymentRef: ref,
//         user: userId,
//         subscriptionStatus: 'pending'
//       });

//       if (!subscription) {
//         console.log('No pending subscription found for ref:', ref);
//         return res.status(200).send('OK');
//       }

//       // Activate subscription
//       subscription.subscriptionStatus = 'active';
//       subscription.paymentVerifiedAt = new Date();
//       subscription.paymentResponse = event.data;
//       await subscription.save();

//       // Apply feature based on type
//       switch (type) {
//         case 'featured_listing':
//           if (listingId) {
//             await CarListing.findByIdAndUpdate(listingId, {
//               isFeatured: true,
//               featuredUntil: subscription.endDate
//             });
//             console.log(`Listing ${listingId} featured until ${subscription.endDate}`);
//           }
//           break;

//         case 'featured_dealer':
//           await User.findByIdAndUpdate(userId, {
//             'dealerInfo.isFeatured': true,
//             'dealerInfo.featuredUntil': subscription.endDate
//           });
//           console.log(`Dealer ${userId} featured until ${subscription.endDate}`);
//           break;

//         case 'featured_service_provider':
//           await User.findByIdAndUpdate(userId, {
//             'serviceProviderInfo.isFeatured': true,
//             'serviceProviderInfo.featuredUntil': subscription.endDate
//           });
//           console.log(`Service provider ${userId} featured until ${subscription.endDate}`);
//           break;

//         case 'newest_listings_access':
//           // No specific field → maybe add a user flag if needed
//           console.log(`User ${userId} granted newest listings access`);
//           break;

//         default:
//           console.log(`Unknown subscription type: ${type}`);
//       }

//       console.log(`Activated ${type} for user ${userId} until ${subscription.endDate}`);
//     }

//     // Always respond 200 to Paystack
//     res.status(200).send('OK');
//   } catch (err) {
//     console.error('Paystack webhook error:', err);
//     res.status(500).send('Error');
//   }
// };