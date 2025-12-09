// models/Car.js (Already ES6 compatible; no changes needed beyond minor tweaks)
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vin: { 
    type: String, 
    required: true, 
    unique: true, // Global uniqueness for VIN
    uppercase: true,
    match: /^[A-HJ-NPR-Z0-9]{17}$/ // Standard VIN regex
  },
  make: { 
    type: String, 
    required: true,
    trim: true
  },
  model: { 
    type: String, 
    required: true,
    trim: true
  },
  year: { 
    type: Number, 
    required: true, 
    min: 1900, 
    max: () => new Date().getFullYear() + 1 
  },
  mileage: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  condition: { 
    type: String, 
    enum: ['excellent', 'good', 'fair', 'poor'], 
    default: 'good' 
  },
  type: { 
    type: String, 
    enum: ['new', 'used', 'foreign'], 
    required: true,
    default: 'used' 
  }, // Added: 'new', 'used', 'foreign' for car type
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String, // Cloudinary URL strings
    validate: {
      validator: (v) => /^https:\/\/res\.cloudinary\.com\/.+/.test(v),
      message: 'Invalid Cloudinary URL'
    }
  }],
  valuation: { 
    type: Number, 
    default: 0,
    min: 0
  },
  valuationDate: { 
    type: Date 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: (doc) => doc.userId 
  },
  soldDate: Date
}, { 
  timestamps: true 
});

export default mongoose.model('Car', carSchema);