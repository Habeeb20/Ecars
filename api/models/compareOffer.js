// models/Offer.js
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  }],
  dealerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  offerPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'negotiated'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Offer', offerSchema);