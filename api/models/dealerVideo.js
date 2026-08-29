// schemas/DealerVideo.js
import mongoose from 'mongoose';

const dealerVideoSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  videoUrl: { type: String, required: [true, 'Video URL is required'] },
  thumbnailUrl: { type: String }, // Cloudinary auto-generates one for videos
  duration: { type: Number }, // seconds, from Cloudinary response
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['active', 'hidden'],
    default: 'active',
  },
}, { timestamps: true });

dealerVideoSchema.index({ postedBy: 1, status: 1 });
dealerVideoSchema.index({ createdAt: -1 });

export default mongoose.model('DealerVideo', dealerVideoSchema);