import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String }, // e.g. "receipt-2026"
  seq: { type: Number, default: 0 },
});

export default mongoose.model('Counter', counterSchema);