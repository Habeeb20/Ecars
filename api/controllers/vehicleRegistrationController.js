// import crypto from 'crypto';

// import VehicleRegistration from '../models/vehicleRegistration.js';
// import { initializeTransaction2, verifyTransaction2 } from '../utils/paystackService.js';

// const REGISTRATION_FEE = 20000; // ₦20,000
// const CLIENT_URL = process.env.CLIENT_URL || 'https://edrivers.ng';

// // @desc    Create a new vehicle registration request
// // @route   POST /api/vehicle-registrations
// // @access  Public
// export const createRegistration = async (req, res) => {
//   try {
//     const { fullName, email, phone, make, model, year, plateNumber, wantsToPay } = req.body;

//     if (!fullName || !email || !phone || !make || !model || !year || !plateNumber) {
//       return res.status(400).json({ success: false, message: 'All fields are required' });
//     }

//     const registration = await VehicleRegistration.create({
//       fullName,
//       email,
//       phone,
//       make,
//       model,
//       year,
//       plateNumber,
//       wantsToPay: Boolean(wantsToPay),
//       amount: wantsToPay ? REGISTRATION_FEE : 0,
//     });

//     return res.status(201).json({
//       success: true,
//       registrationId: registration._id,
//       message: 'Registration request received',
//     });
//   } catch (err) {
//     console.error('createRegistration error:', err);
//     return res.status(500).json({ success: false, message: 'Server error, please try again' });
//   }
// };

// // @desc    Initialize a Paystack payment for a registration
// // @route   POST /api/vehicle-registrations/:id/initialize-payment
// // @access  Public
// export const initializePayment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email } = req.body;

//     const registration = await VehicleRegistration.findById(id);
//     if (!registration) {
//       return res.status(404).json({ success: false, message: 'Registration not found' });
//     }
//     if (registration.paid) {
//       return res.status(400).json({ success: false, message: 'This registration has already been paid for' });
//     }

//     const reference = `VREG-${registration._id}-${Date.now()}`;

//     const paystackData = await initializeTransaction2({
//       email: email || registration.email,
//       amountInKobo: REGISTRATION_FEE * 100,
//       reference,
//       callbackUrl: `${CLIENT_URL}/vehicle-registration/callback`,
//       metadata: { registrationId: registration._id.toString() },
//     });

//     registration.paystackReference = reference;
//     await registration.save();

//     return res.status(200).json({
//       success: true,
//       authorization_url: paystackData.authorization_url,
//     });
//   } catch (err) {
//     console.error('initializePayment error:', err);
//     return res.status(500).json({ success: false, message: err.message || 'Could not start payment' });
//   }
// };

// // @desc    Verify a Paystack transaction (called by the frontend callback page)
// // @route   GET /api/vehicle-registrations/verify-payment/:reference
// // @access  Public
// export const verifyPayment = async (req, res) => {
//   try {
//     const { reference } = req.params;

//     const registration = await VehicleRegistration.findOne({ paystackReference: reference });
//     if (!registration) {
//       return res.status(404).json({ success: false, message: 'Registration not found for this reference' });
//     }

//     if (registration.paid) {
//       return res.status(200).json({ success: true, paid: true, registration });
//     }

//     const transaction = await verifyTransaction2(reference);

//     if (transaction.status === 'success') {
//       registration.paid = true;
//       registration.paidAt = new Date();
//       await registration.save();
//     }

//     return res.status(200).json({
//       success: true,
//       paid: registration.paid,
//       registration,
//     });
//   } catch (err) {
//     console.error('verifyPayment error:', err);
//     return res.status(500).json({ success: false, message: 'Could not verify payment' });
//   }
// };

// // @desc    Paystack webhook — backup confirmation in case the user closes the tab
// //          before the callback page fires (register this URL in your Paystack dashboard)
// // @route   POST /api/vehicle-registrations/webhook/paystack
// // @access  Public (verified via signature)
// export const paystackWebhook = async (req, res) => {
//   try {
//     const signature = req.headers['x-paystack-signature'];
//     const expectedSignature = crypto
//       .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
//       .update(JSON.stringify(req.body))
//       .digest('hex');

//     if (signature !== expectedSignature) {
//       return res.status(401).send('Invalid signature');
//     }

//     const event = req.body;

//     if (event.event === 'charge.success') {
//       const { reference } = event.data;
//       const registration = await VehicleRegistration.findOne({ paystackReference: reference });

//       if (registration && !registration.paid) {
//         registration.paid = true;
//         registration.paidAt = new Date();
//         await registration.save();
//       }
//     }

//     return res.sendStatus(200);
//   } catch (err) {
//     console.error('paystackWebhook error:', err);
//     return res.sendStatus(500);
//   }
// };

// // @desc    Get all registrations (with optional filters)
// // @route   GET /api/admin/vehicle-registrations
// // @access  Private/Admin
// export const getAllRegistrations = async (req, res) => {
//   try {
//     const { paid, status, search, page = 1, limit = 20 } = req.query;

//     const query = {};
//     if (paid === 'true') query.paid = true;
//     if (paid === 'false') query.paid = false;
//     if (status) query.status = status;
//     if (search) {
//       query.$or = [
//         { fullName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { plateNumber: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [registrations, total] = await Promise.all([
//       VehicleRegistration.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
//       VehicleRegistration.countDocuments(query),
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: registrations,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//     });
//   } catch (err) {
//     console.error('getAllRegistrations error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // @desc    Get a single registration
// // @route   GET /api/admin/vehicle-registrations/:id
// // @access  Private/Admin
// export const getRegistrationById = async (req, res) => {
//   try {
//     const registration = await VehicleRegistration.findById(req.params.id);
//     if (!registration) {
//       return res.status(404).json({ success: false, message: 'Registration not found' });
//     }
//     return res.status(200).json({ success: true, data: registration });
//   } catch (err) {
//     console.error('getRegistrationById error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // @desc    Update a registration's status/note
// // @route   PATCH /api/admin/vehicle-registrations/:id/status
// // @access  Private/Admin
// export const updateRegistrationStatus = async (req, res) => {
//   try {
//     const { status, adminNote } = req.body;

//     const registration = await VehicleRegistration.findById(req.params.id);
//     if (!registration) {
//       return res.status(404).json({ success: false, message: 'Registration not found' });
//     }

//     if (status) registration.status = status;
//     if (adminNote !== undefined) registration.adminNote = adminNote;

//     await registration.save();

//     return res.status(200).json({ success: true, data: registration });
//   } catch (err) {
//     console.error('updateRegistrationStatus error:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };






import mongoose from 'mongoose';

import {
  Vehicle, NG_STATES, VEHICLE_TYPES, USAGE_TYPES, FUEL_TYPES, DOC_TYPES,
} from '../models/vehicleRegistration.js';

/* ------------------------------ helpers ------------------------------ */
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// Self-contained async wrapper: sends the error response itself, so it works with any error middleware
const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ success: false, message: err.message });
    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern || err.keyValue || {})[0];
      const msg = {
        chassisNumber: 'A vehicle with this chassis number is already registered',
        engineNumber: 'A vehicle with this engine number is already registered',
        plateNumber: 'A vehicle with this plate number is already registered',
      }[key] || 'This vehicle is already registered';
      return res.status(409).json({ success: false, message: msg });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: Object.values(err.errors)[0]?.message || 'Invalid data' });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

const FIELDS = [
  'ownerName', 'phone', 'address', 'state', 'vehicleType', 'make', 'model', 'year', 'color', 'usage',
  'fuelType', 'plateNumber', 'plateState', 'preferredPlateNumber', 'chassisNumber', 'engineNumber', 'documents',
];
const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj && obj[k] !== undefined).map((k) => [k, obj[k]]));
const str = (v) => String(v ?? '').trim();
const code = (v) => str(v).toUpperCase().replace(/\s+/g, '');
const orUndef = (v) => (v === '' ? undefined : v);

function normPhone(v) {
  let p = str(v).replace(/[\s-()]/g, '');
  if (p.startsWith('+234')) p = `0${p.slice(4)}`;
  else if (p.startsWith('234') && p.length === 13) p = `0${p.slice(3)}`;
  return p;
}

function cleanDocs(v) {
  if (!Array.isArray(v) || v.length === 0) throw new HttpError(400, 'Upload at least one vehicle document');
  if (v.length > 10) throw new HttpError(400, 'You can upload at most 10 documents');
  return v.map((d) => {
    const type = str(d?.type);
    const url = str(d?.url);
    if (!DOC_TYPES.includes(type)) throw new HttpError(400, 'Invalid document type');
    if (!/^https:\/\/\S+$/i.test(url)) throw new HttpError(400, 'Each document must be a valid https URL');
    return { type, url, name: str(d?.name).slice(0, 120) || undefined };
  });
}

/** Normalises and validates a complete vehicle payload. Throws HttpError(400) on the first problem. */
function clean(d) {
  const thisYear = new Date().getFullYear();
  const out = {
    ownerName: str(d.ownerName),
    phone: normPhone(d.phone),
    address: str(d.address),
    state: str(d.state),
    vehicleType: str(d.vehicleType).toLowerCase(),
    make: str(d.make),
    model: str(d.model),
    year: Number(d.year),
    color: str(d.color),
    usage: str(d.usage || 'private').toLowerCase(),
    fuelType: str(d.fuelType).toLowerCase(),
    plateNumber: code(d.plateNumber),
    plateState: str(d.plateState),
    preferredPlateNumber: code(d.preferredPlateNumber),
    chassisNumber: code(d.chassisNumber),
    engineNumber: code(d.engineNumber),
    documents: cleanDocs(d.documents),
  };

  if (out.ownerName.length < 2) throw new HttpError(400, 'Owner name is required');
  if (!/^0[789][01]\d{8}$/.test(out.phone)) throw new HttpError(400, 'Enter a valid Nigerian phone number');
  if (out.address.length < 5) throw new HttpError(400, 'Address is required');
  if (!NG_STATES.includes(out.state)) throw new HttpError(400, 'Choose a valid state');
  if (!VEHICLE_TYPES.includes(out.vehicleType)) throw new HttpError(400, 'Choose a valid vehicle type');
  if (!out.make) throw new HttpError(400, 'Vehicle make is required');
  if (!out.model) throw new HttpError(400, 'Vehicle model is required');
  if (!Number.isInteger(out.year) || out.year < 1980 || out.year > thisYear + 1) throw new HttpError(400, 'Enter a valid year');
  if (!out.color) throw new HttpError(400, 'Vehicle colour is required');
  if (!USAGE_TYPES.includes(out.usage)) throw new HttpError(400, 'Invalid vehicle usage');
  if (out.fuelType && !FUEL_TYPES.includes(out.fuelType)) throw new HttpError(400, 'Invalid fuel type');

  if (out.plateNumber) {
    if (!/^[A-Z0-9-]{5,10}$/.test(out.plateNumber)) throw new HttpError(400, 'Enter a valid plate number');
    if (!NG_STATES.includes(out.plateState)) throw new HttpError(400, 'Choose the state your plate was issued in');
  } else if (out.plateState) {
    throw new HttpError(400, 'Enter the plate number that goes with that plate state');
  }
  if (out.preferredPlateNumber && !/^[A-Z0-9-]{3,10}$/.test(out.preferredPlateNumber)) {
    throw new HttpError(400, 'Enter a valid preferred plate number (3 to 10 letters or digits)');
  }
  if (!/^[A-Z0-9]{5,25}$/.test(out.chassisNumber)) throw new HttpError(400, 'Chassis number must be 5 to 25 letters or digits');
  if (!/^[A-Z0-9-]{3,25}$/.test(out.engineNumber)) throw new HttpError(400, 'Engine number must be 3 to 25 letters or digits');

  // Empty optional fields become undefined so they are not stored (keeps the unique plate index clean)
  out.fuelType = orUndef(out.fuelType);
  out.plateNumber = orUndef(out.plateNumber);
  out.plateState = out.plateNumber ? out.plateState : undefined;
  out.preferredPlateNumber = orUndef(out.preferredPlateNumber);
  return out;
}

const validId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid vehicle id');
};
const EDITABLE = ['pending', 'rejected'];

/* ------------------------------ handlers ------------------------------ */

/** POST /vehicles */
export const createVehicle = wrap(async (req, res) => {
  const data = clean(pick(req.body, FIELDS));
  const vehicle = await Vehicle.create({ ...data, owner: req.user._id });
  res.status(201).json({ success: true, data: vehicle });
});

/** GET /vehicles   (the signed-in user's vehicles) */
export const listMyVehicles = wrap(async (req, res) => {
  const data = await Vehicle.find({ owner: req.user._id }).sort('-createdAt').lean();
  res.json({ success: true, data });
});

/** GET /vehicles/:id */
export const getMyVehicle = wrap(async (req, res) => {
  validId(req.params.id);
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id }).lean();
  if (!vehicle) throw new HttpError(404, 'Vehicle not found');
  res.json({ success: true, data: vehicle });
});

/**
 * PATCH /vehicles/:id
 * Only while the application is pending or rejected. Editing a rejected application resubmits it.
 */
export const updateVehicle = wrap(async (req, res) => {
  validId(req.params.id);
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
  if (!vehicle) throw new HttpError(404, 'Vehicle not found');
  if (!EDITABLE.includes(vehicle.status)) throw new HttpError(400, 'This registration is already being processed and can no longer be edited');

  const merged = { ...pick(vehicle.toObject(), FIELDS), ...pick(req.body, FIELDS) };
  vehicle.set(clean(merged));
  if (vehicle.status === 'rejected') {
    vehicle.status = 'pending';
    vehicle.reviewNote = undefined;
    vehicle.reviewedAt = undefined;
    vehicle.reviewedBy = undefined;
  }
  await vehicle.save();
  res.json({ success: true, data: vehicle });
});

/** DELETE /vehicles/:id   (withdraw an application that has not been approved) */
export const deleteVehicle = wrap(async (req, res) => {
  validId(req.params.id);
  const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
  if (!vehicle) throw new HttpError(404, 'Vehicle not found');
  if (!EDITABLE.includes(vehicle.status)) throw new HttpError(400, 'Only pending or rejected registrations can be withdrawn. Contact support for anything else.');
  await vehicle.deleteOne();
  res.json({ success: true });
});