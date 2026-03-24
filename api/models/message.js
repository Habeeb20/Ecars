import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'CarListing' },
  content: {
    type: String,
    required: true,
  },
  type: { 
    type: String, 
    enum: ['message', 'offer', 'inquiry'], 
    default: 'message' 
  },
  offerAmount: { type: Number },
  preferredColor: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'countered'], 
    default: 'pending' 
  },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast conversation lookup
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, sender: 1 });

export default mongoose.model('Message', messageSchema);