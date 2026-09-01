// schemas/VideoCreditTransaction.js
import mongoose from 'mongoose';

const videoCreditTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { type: String, required: true, unique: true }, // paystack ref
  amount: { type: Number, required: true }, // in kobo
  creditsGranted: { type: Number, default: 10 },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('VideoCreditTransaction', videoCreditTransactionSchema);