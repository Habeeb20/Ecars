import mongoose from 'mongoose';

const carPartListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    required: [true, 'Condition is required'],
  },
  partType: {
    type: String,
    enum: ['engine', 'body', 'electronics', 'tyres', 'interior', 'other'],
    required: [true, 'Part type is required'],
  },
  compatibleMakes: [String],
  images: [String], // Cloudinary URLs
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending'],
    default: 'active',
  },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('CarPartListing', carPartListingSchema);