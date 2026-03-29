// models/CarViewing.js
import mongoose from 'mongoose';

const carViewingSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarListing',
    required: true,
    index: true
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Booking Details
  preferredDate: {
    type: Date,
    required: true
  },

  preferredTime: {
    type: String,
    required: true,   // e.g. "10:00 AM", "02:30 PM"
  },

  message: {
    type: String,
    trim: true,
    maxlength: 500
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },

  // Additional contact info (in case buyer wants to provide)
  phoneNumber: {
    type: String,
    trim: true
  },

  // Timeline
  requestedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,

  // Admin / Dealer notes
  dealerNotes: String,

}, { timestamps: true });

// Indexes for fast queries
carViewingSchema.index({ car: 1, status: 1 });
carViewingSchema.index({ buyer: 1, status: 1 });
carViewingSchema.index({ dealer: 1, status: 1 });

const CarViewing = mongoose.model('CarViewing', carViewingSchema);
export default CarViewing;