// models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['scam', 'request', 'stolen'],
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // For scam reports
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarListing',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Common fields
  title: { type: String, required: true },
  description: { type: String, required: true },
  evidence: [String], // Cloudinary URLs
  phone: String,
  location: String,

  // For requests
  desiredMake: String,
  desiredModel: String,
  budget: Number,
  preferredLocation: String,

  // For stolen cars
  vin: String,
  plateNumber: String,
  color: String,
  stolenDate: Date,
  policeReport: String, // file URL

  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'rejected'],
    default: 'pending',
  },
  adminNote: String,
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);