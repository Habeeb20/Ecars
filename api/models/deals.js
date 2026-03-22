// models/Deal.js
import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 10000,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  discountedPrice: {
    type: Number,
    required: false,
  },

  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  transmission: { type: String, enum: ['automatic', 'manual'], required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], required: true },
  bodyType: { type: String, required: true },
  condition: { type: String, enum: ['brand new', 'foreign used', 'nigerian used'], required: true },
  color: { type: String, required: true },

  description: {
    type: String,
    required: true,
    minlength: 50,
  },

  images: [{
    type: String,
    required: true,
  }], // Cloudinary URLs (frontend sends strings)

  features: [String],
  location: {
    state: { type: String, required: true },
    lga: { type: String, required: true },
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'sold', 'expired'],
    default: 'active',
  },

  views: { type: Number, default: 0 },
}, { timestamps: true });

// 🔥 Auto-calculate discounted price before saving
dealSchema.pre('save', function (next) {
  if (this.originalPrice && this.discountPercentage !== undefined) {
    const discountAmount = Math.round((this.originalPrice * this.discountPercentage) / 100);
    this.discountedPrice = this.originalPrice - discountAmount;
  }

});

export default mongoose.model('Deal', dealSchema);