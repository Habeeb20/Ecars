import mongoose from 'mongoose';

const vehicleRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },

    make: { type: String, required: [true, 'Vehicle make is required'], trim: true },
    model: { type: String, required: [true, 'Vehicle model is required'], trim: true },
    year: { type: String, required: [true, 'Vehicle year is required'], trim: true },
    plateNumber: { type: String, required: [true, 'Plate number is required'], trim: true, uppercase: true },

    wantsToPay: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },

    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paystackReference: { type: String, index: true },

    status: {
      type: String,
      enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },

    adminNote: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

vehicleRegistrationSchema.index({ paid: 1, status: 1 });
vehicleRegistrationSchema.index({ createdAt: -1 });

export default mongoose.model('VehicleRegistration', vehicleRegistrationSchema);