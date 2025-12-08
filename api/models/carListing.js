// models/carListing.js
import mongoose from 'mongoose';

const carListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Car title is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [10000, 'Price too low'],
  },
  make: {
    type: String,
    required: [true, 'Car make is required (e.g. Toyota)'],
  },
  model: {
    type: String,
    required: [true, 'Car model is required (e.g. Camry)'],
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1980],
    max: [new Date().getFullYear() + 1],
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    required: [true, 'Transmission is required'],
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Fuel type is required'],
  },
  bodyType: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback', 'truck', 'van', 'coupe', 'convertible'],
    required: true,
  },
  condition: {
    type: String,
    enum: ['brand new', 'foreign used', 'nigerian used'],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  vin: { type: String, trim: true }, // optional
  location: {
    state: { type: String, required: true },
    lga: { type: String, required: true },
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description too short'],
  },

  // Cloudinary URLs (frontend uploads → sends strings)
  images: [{
    type: String,
    required: [true, 'At least one image is required'],
  }],

  // At least 4 images, max 20
  features: [String], // e.g. ["AC", "Leather seats", "Reverse camera"]

  // Relations
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'pending', 'rejected'],
    default: 'active',
  },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// Index for search
carListingSchema.index({ make: 'text', model: 'text', title: 'text' });

export default mongoose.model('CarListing', carListingSchema);