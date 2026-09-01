
// controllers/videoCreditController.js
import crypto from 'crypto';
import User from '../models/user.js';

import { initializeTransaction, verifyTransaction } from '../utils/paystackService.js';
import VideoCreditTransaction from '../models/videoPaymentModel.js';

const PACK_PRICE_NGN = 5000;
const PACK_CREDITS = 10;

// Dealer starts a purchase: ₦5,000 for 10 video credits
export const initializeVideoCreditPurchase = async (req, res) => {
  try {
    const reference = `vidcredit_${crypto.randomUUID()}`;
    const amountKobo = PACK_PRICE_NGN * 100;

    await VideoCreditTransaction.create({
      user: req.user._id,
      reference,
      amount: amountKobo,
      creditsGranted: PACK_CREDITS,
      status: 'pending',
    });

    const { authorization_url, access_code } = await initializeTransaction({
      email: req.user.email,
      amount: amountKobo,
      reference,
      callback_url: `${process.env.CLIENT_URL}/dashboard?ref=${reference}`,
    });

    res.json({
      success: true,
      authorization_url,
      access_code,
      reference,
      message: `₦${PACK_PRICE_NGN.toLocaleString()} gets you ${PACK_CREDITS} video posts`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Called after payment (from frontend redirect/callback, or webhook)
export const verifyVideoCreditPurchase = async (req, res) => {
  try {
    const { reference } = req.params;

    const txn = await VideoCreditTransaction.findOne({ reference, user: req.user._id });
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });
    if (txn.status === 'success') {
      const user = await User.findById(req.user._id).select('videoCredits');
      return res.json({ success: true, alreadyProcessed: true, videoCredits: user.videoCredits });
    }

    const paystackData = await verifyTransaction(reference);

    if (paystackData.status !== 'success' || paystackData.amount !== txn.amount) {
      txn.status = 'failed';
      await txn.save();
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    txn.status = 'success';
    await txn.save();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { videoCredits: txn.creditsGranted, totalVideoCreditsPurchased: txn.creditsGranted } },
      { new: true }
    ).select('videoCredits');

    res.json({ success: true, videoCredits: user.videoCredits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recommended: Paystack webhook as the source of truth (in addition to verify above)
export const paystackWebhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.sendStatus(401);
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, amount } = event.data;
    const txn = await VideoCreditTransaction.findOne({ reference });
    if (txn && txn.status !== 'success' && txn.amount === amount) {
      txn.status = 'success';
      await txn.save();
      await User.findByIdAndUpdate(txn.user, {
        $inc: { videoCredits: txn.creditsGranted, totalVideoCreditsPurchased: txn.creditsGranted },
      });
    }
  }

  res.sendStatus(200);
};

export const getVideoCreditBalance = async (req, res) => {
  const user = await User.findById(req.user._id).select('videoCredits');
  res.json({
    success: true,
    videoCredits: user.videoCredits,
    packPrice: PACK_PRICE_NGN,
    packCredits: PACK_CREDITS,
  });
};