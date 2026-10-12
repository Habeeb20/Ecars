import mongoose from 'mongoose';

export const ACTIVE_STATUSES = ['pending', 'confirmed'];

const appointmentSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'CarListing', required: true, index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // car.postedBy (dealer/seller)

    scheduledAt: { type: Date, required: [true, 'Viewing date and time is required'] },
    durationMinutes: { type: Number, default: 30 },

    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'],
    },
    note: { type: String, trim: true, maxlength: 500 },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    statusReason: { type: String, trim: true, maxlength: 300 }, // decline / cancel reason
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date },

    // Only set while the appointment is pending/confirmed. The sparse unique index
    // guarantees two people can never hold the same car at the same time,
    // even if two requests arrive at the same instant.
    slotKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

appointmentSchema.index({ client: 1, scheduledAt: -1 });
appointmentSchema.index({ owner: 1, status: 1, scheduledAt: 1 });
appointmentSchema.index({ car: 1, scheduledAt: 1 });

appointmentSchema.pre('save', function () {
  if (ACTIVE_STATUSES.includes(this.status)) {
    this.slotKey = `${this.car}_${this.scheduledAt.getTime()}`;
  } else {
    this.slotKey = undefined; // cancelled/declined/etc. frees the slot
  }
});

export default mongoose.model('Appointment', appointmentSchema);