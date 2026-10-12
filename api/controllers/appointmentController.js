import mongoose from 'mongoose';
import Appointment, { ACTIVE_STATUSES } from '../models/appointments.js';
import CarListing from '../models/carListing.js';

// ---- Booking rules (keep in sync with src/lib/appointments.js on the frontend) ----
const OPEN_HOUR = 9; // 9:00 AM Lagos time
const CLOSE_HOUR = 17; // last slot starts 4:30 PM
const WAT_OFFSET_HOURS = 1; // Lagos is UTC+1, no daylight saving
const MIN_LEAD_HOURS = 2;
const MAX_DAYS_AHEAD = 30;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const CAR_FIELDS = 'title price images make model year location status phoneNumber';
const OWNER_FIELDS =
  'firstName lastName avatar slug dealerInfo.businessName serviceProviderInfo.businessName carPartSellerInfo.businessName';
const CLIENT_FIELDS = 'firstName lastName email avatar';

const populateOptions = [
  { path: 'car', select: CAR_FIELDS },
  { path: 'owner', select: OWNER_FIELDS },
  { path: 'client', select: CLIENT_FIELDS },
];

const validateSlot = (date) => {
  if (Number.isNaN(date.getTime())) return 'A valid date and time is required';

  const now = Date.now();
  if (date.getTime() < now + MIN_LEAD_HOURS * HOUR) {
    return `Viewings must be booked at least ${MIN_LEAD_HOURS} hours in advance`;
  }
  if (date.getTime() > now + MAX_DAYS_AHEAD * DAY) {
    return `Viewings can only be booked up to ${MAX_DAYS_AHEAD} days ahead`;
  }

  const onSlotBoundary =
    [0, 30].includes(date.getUTCMinutes()) &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0;
  if (!onSlotBoundary) return 'Please choose one of the available time slots';

  const watHour = (date.getUTCHours() + WAT_OFFSET_HOURS) % 24;
  if (watHour < OPEN_HOUR || watHour >= CLOSE_HOUR) {
    return 'Viewings are available between 9:00 AM and 5:00 PM';
  }
  return null;
};

const fail = (res, code, message) => res.status(code).json({ status: 'fail', message });
const serverError = (res, err) => {
  console.error('Appointment error:', err);
  return res.status(500).json({ status: 'error', message: 'Something went wrong' });
};

// POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { carId, scheduledAt, phoneNumber, note } = req.body;

    if (!mongoose.isValidObjectId(carId)) return fail(res, 400, 'A valid car is required');

    const when = new Date(scheduledAt);
    const slotError = validateSlot(when);
    if (slotError) return fail(res, 400, slotError);

    const car = await CarListing.findById(carId).select('postedBy status title');
    if (!car) return fail(res, 404, 'Car not found');
    if (car.status !== 'active') return fail(res, 400, 'This car is no longer available for viewing');
    if (!car.postedBy) return fail(res, 400, 'This listing cannot accept bookings yet');
    if (String(car.postedBy) === String(req.user._id)) {
      return fail(res, 400, 'You cannot book a viewing for your own listing');
    }

    // One upcoming viewing per car per person
    const existing = await Appointment.findOne({
      car: car._id,
      client: req.user._id,
      status: { $in: ACTIVE_STATUSES },
      scheduledAt: { $gte: new Date() },
    });
    if (existing) return fail(res, 400, 'You already have an upcoming viewing booked for this car');

    let appointment;
    try {
      appointment = await Appointment.create({
        car: car._id,
        client: req.user._id,
        owner: car.postedBy,
        scheduledAt: when,
        phoneNumber,
        note,
      });
    } catch (err) {
      if (err.code === 11000) {
        return fail(res, 409, 'Sorry, that time slot was just taken. Please pick another one.');
      }
      if (err.name === 'ValidationError') {
        return fail(res, 400, Object.values(err.errors)[0].message);
      }
      throw err;
    }

    await appointment.populate(populateOptions);
    return res.status(201).json({ status: 'success', data: { appointment } });
  } catch (err) {
    return serverError(res, err);
  }
};

// GET /api/appointments/car/:carId/availability?from=ISO&to=ISO  (public)
export const getCarAvailability = async (req, res) => {
  try {
    const { carId } = req.params;
    if (!mongoose.isValidObjectId(carId)) return fail(res, 400, 'Invalid car id');

    const start = new Date(req.query.from);
    const end = new Date(req.query.to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start || end - start > 2 * DAY) {
      return fail(res, 400, 'A valid from/to range (max 2 days) is required');
    }

    const booked = await Appointment.find({
      car: carId,
      status: { $in: ACTIVE_STATUSES },
      scheduledAt: { $gte: start, $lte: end },
    })
      .select('scheduledAt -_id')
      .lean();

    return res.json({
      status: 'success',
      data: { bookedSlots: booked.map((b) => b.scheduledAt) },
    });
  } catch (err) {
    return serverError(res, err);
  }
};

// GET /api/appointments/my  (appointments I booked)
export const getMyAppointments = async (req, res) => {
  try {
    const filter = { client: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .sort('-scheduledAt')
      .populate(populateOptions);

    return res.json({ status: 'success', results: appointments.length, data: { appointments } });
  } catch (err) {
    return serverError(res, err);
  }
};

// GET /api/appointments/received  (viewings booked on MY listings)
export const getReceivedAppointments = async (req, res) => {
  try {
    const filter = { owner: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .sort('-scheduledAt')
      .populate(populateOptions);

    return res.json({ status: 'success', results: appointments.length, data: { appointments } });
  } catch (err) {
    return serverError(res, err);
  }
};

// PATCH /api/appointments/:id/status   body: { status, reason? }
const OWNER_TRANSITIONS = {
  pending: ['confirmed', 'declined', 'cancelled'],
  confirmed: ['completed', 'no-show', 'cancelled'],
};
const CLIENT_TRANSITIONS = {
  pending: ['cancelled'],
  confirmed: ['cancelled'],
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!mongoose.isValidObjectId(id)) return fail(res, 400, 'Invalid appointment id');

    const appointment = await Appointment.findById(id);
    if (!appointment) return fail(res, 404, 'Appointment not found');

    const userId = String(req.user._id);
    const isOwner = String(appointment.owner) === userId || req.user.role === 'superadmin';
    const isClient = String(appointment.client) === userId;
    if (!isOwner && !isClient) return fail(res, 403, 'You are not allowed to update this appointment');

    const allowed = isOwner ? OWNER_TRANSITIONS : CLIENT_TRANSITIONS;
    if (!allowed[appointment.status]?.includes(status)) {
      return fail(res, 400, `You cannot change a ${appointment.status} appointment to ${status}`);
    }

    if (['completed', 'no-show'].includes(status) && appointment.scheduledAt > new Date()) {
      return fail(res, 400, 'This viewing has not taken place yet');
    }

    appointment.status = status;
    if (reason) appointment.statusReason = String(reason).trim().slice(0, 300);
    if (status === 'cancelled') appointment.cancelledBy = req.user._id;
    if (isOwner && !appointment.respondedAt) appointment.respondedAt = new Date();

    await appointment.save(); // pre-save hook frees the slot when no longer active
    await appointment.populate(populateOptions);

    return res.json({ status: 'success', data: { appointment } });
  } catch (err) {
    return serverError(res, err);
  }
};