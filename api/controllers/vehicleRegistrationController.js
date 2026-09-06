import crypto from 'crypto';

import VehicleRegistration from '../models/vehicleRegistration.js';
import { initializeTransaction2, verifyTransaction2 } from '../utils/paystackService.js';

const REGISTRATION_FEE = 20000; // ₦20,000
const CLIENT_URL = process.env.CLIENT_URL || 'https://edrivers.ng';

// @desc    Create a new vehicle registration request
// @route   POST /api/vehicle-registrations
// @access  Public
export const createRegistration = async (req, res) => {
  try {
    const { fullName, email, phone, make, model, year, plateNumber, wantsToPay } = req.body;

    if (!fullName || !email || !phone || !make || !model || !year || !plateNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const registration = await VehicleRegistration.create({
      fullName,
      email,
      phone,
      make,
      model,
      year,
      plateNumber,
      wantsToPay: Boolean(wantsToPay),
      amount: wantsToPay ? REGISTRATION_FEE : 0,
    });

    return res.status(201).json({
      success: true,
      registrationId: registration._id,
      message: 'Registration request received',
    });
  } catch (err) {
    console.error('createRegistration error:', err);
    return res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// @desc    Initialize a Paystack payment for a registration
// @route   POST /api/vehicle-registrations/:id/initialize-payment
// @access  Public
export const initializePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const registration = await VehicleRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    if (registration.paid) {
      return res.status(400).json({ success: false, message: 'This registration has already been paid for' });
    }

    const reference = `VREG-${registration._id}-${Date.now()}`;

    const paystackData = await initializeTransaction2({
      email: email || registration.email,
      amountInKobo: REGISTRATION_FEE * 100,
      reference,
      callbackUrl: `${CLIENT_URL}/vehicle-registration/callback`,
      metadata: { registrationId: registration._id.toString() },
    });

    registration.paystackReference = reference;
    await registration.save();

    return res.status(200).json({
      success: true,
      authorization_url: paystackData.authorization_url,
    });
  } catch (err) {
    console.error('initializePayment error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Could not start payment' });
  }
};

// @desc    Verify a Paystack transaction (called by the frontend callback page)
// @route   GET /api/vehicle-registrations/verify-payment/:reference
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const registration = await VehicleRegistration.findOne({ paystackReference: reference });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found for this reference' });
    }

    if (registration.paid) {
      return res.status(200).json({ success: true, paid: true, registration });
    }

    const transaction = await verifyTransaction2(reference);

    if (transaction.status === 'success') {
      registration.paid = true;
      registration.paidAt = new Date();
      await registration.save();
    }

    return res.status(200).json({
      success: true,
      paid: registration.paid,
      registration,
    });
  } catch (err) {
    console.error('verifyPayment error:', err);
    return res.status(500).json({ success: false, message: 'Could not verify payment' });
  }
};

// @desc    Paystack webhook — backup confirmation in case the user closes the tab
//          before the callback page fires (register this URL in your Paystack dashboard)
// @route   POST /api/vehicle-registrations/webhook/paystack
// @access  Public (verified via signature)
export const paystackWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const expectedSignature = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference } = event.data;
      const registration = await VehicleRegistration.findOne({ paystackReference: reference });

      if (registration && !registration.paid) {
        registration.paid = true;
        registration.paidAt = new Date();
        await registration.save();
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('paystackWebhook error:', err);
    return res.sendStatus(500);
  }
};

// @desc    Get all registrations (with optional filters)
// @route   GET /api/admin/vehicle-registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const { paid, status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (paid === 'true') query.paid = true;
    if (paid === 'false') query.paid = false;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { plateNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [registrations, total] = await Promise.all([
      VehicleRegistration.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      VehicleRegistration.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: registrations,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('getAllRegistrations error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a single registration
// @route   GET /api/admin/vehicle-registrations/:id
// @access  Private/Admin
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await VehicleRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    return res.status(200).json({ success: true, data: registration });
  } catch (err) {
    console.error('getRegistrationById error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a registration's status/note
// @route   PATCH /api/admin/vehicle-registrations/:id/status
// @access  Private/Admin
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const registration = await VehicleRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (status) registration.status = status;
    if (adminNote !== undefined) registration.adminNote = adminNote;

    await registration.save();

    return res.status(200).json({ success: true, data: registration });
  } catch (err) {
    console.error('updateRegistrationStatus error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};