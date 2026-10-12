// import mongoose from 'mongoose';

// const vehicleRegistrationSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: [true, 'Full name is required'], trim: true },
//     email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
//     phone: { type: String, required: [true, 'Phone number is required'], trim: true },

//     make: { type: String, required: [true, 'Vehicle make is required'], trim: true },
//     model: { type: String, required: [true, 'Vehicle model is required'], trim: true },
//     year: { type: String, required: [true, 'Vehicle year is required'], trim: true },
//     plateNumber: { type: String, required: [true, 'Plate number is required'], trim: true, uppercase: true },

//     wantsToPay: { type: Boolean, default: false },
//     amount: { type: Number, default: 0 },

//     paid: { type: Boolean, default: false },
//     paidAt: { type: Date },
//     paystackReference: { type: String, index: true },

//     status: {
//       type: String,
//       enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
//       default: 'pending',
//     },

//     adminNote: { type: String, trim: true, maxlength: 500 },
//   },
//   { timestamps: true }
// );

// vehicleRegistrationSchema.index({ paid: 1, status: 1 });
// vehicleRegistrationSchema.index({ createdAt: -1 });

// export default mongoose.model('VehicleRegistration', vehicleRegistrationSchema);








import crypto from 'crypto';
import mongoose from 'mongoose';

const { Schema } = mongoose;

export const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
  'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];
export const VEHICLE_TYPES = ['car', 'suv', 'van', 'pickup', 'bus', 'truck', 'motorcycle', 'tricycle', 'other'];
export const USAGE_TYPES = ['private', 'commercial'];
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric', 'hybrid'];
export const DOC_TYPES = [
  'proof_of_ownership', 'vehicle_license', 'customs_papers', 'insurance', 'roadworthiness', 'owner_id', 'other',
];
export const STATUSES = ['pending', 'under_review', 'approved', 'rejected'];

const documentSchema = new Schema(
  {
    type: { type: String, enum: DOC_TYPES, required: true },
    url: { type: String, required: true },   // Cloudinary secure URL
    name: { type: String, trim: true },      // original file name
  },
  { _id: false }
);

const vehicleSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    registrationRef: {
      type: String,
      unique: true,
      default: () => `VR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    },

    // Owner details
    ownerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    state: { type: String, enum: NG_STATES, required: true }, // owner's state of residence

    // Vehicle details
    vehicleType: { type: String, enum: VEHICLE_TYPES, required: true },
    make: { type: String, required: true, trim: true },       // Toyota
    model: { type: String, required: true, trim: true },      // Camry
    year: { type: Number, required: true, min: 1980 },
    color: { type: String, required: true, trim: true },
    usage: { type: String, enum: USAGE_TYPES, default: 'private' },
    fuelType: { type: String, enum: FUEL_TYPES },

    // Number plate
    plateNumber: { type: String, uppercase: true, trim: true },   // current plate, if the vehicle has one
    plateState: { type: String, enum: NG_STATES },                // state the current plate was issued in
    preferredPlateNumber: { type: String, uppercase: true, trim: true }, // plate the owner would like

    // Identification
    chassisNumber: { type: String, required: true, uppercase: true, trim: true },
    engineNumber: { type: String, required: true, uppercase: true, trim: true },

    documents: { type: [documentSchema], default: [] },

    // Review workflow
    status: { type: String, enum: STATUSES, default: 'pending', index: true },
    reviewNote: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
  },
  { timestamps: true }
);

vehicleSchema.index({ chassisNumber: 1 }, { unique: true });
vehicleSchema.index({ engineNumber: 1 }, { unique: true });
vehicleSchema.index(
  { plateNumber: 1 },
  { unique: true, partialFilterExpression: { plateNumber: { $type: 'string' } } }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);