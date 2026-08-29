
import DealerVideo from '../models/dealerVideo.js';
import User from "../models/user.js"
// Dealer only: post a new video
export const createDealerVideo = async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ message: 'Only dealers can post videos' });
    }

    const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: 'videoUrl is required' });
    }

    const video = await DealerVideo.create({
      postedBy: req.user._id,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public feed of all dealer videos
export const getDealerVideos = async (req, res) => {
  try {
    const videos = await DealerVideo.find({ status: 'active' })
      .populate('postedBy', 'firstName lastName avatar dealerInfo.businessName dealerInfo.verified')
      .sort('-createdAt');

    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Videos for one dealer's profile page
export const getDealerVideosByUser = async (req, res) => {
  try {
    const videos = await DealerVideo.find({ postedBy: req.params.dealerId, status: 'active' })
      .sort('-createdAt');
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment view count
export const recordVideoView = async (req, res) => {
  try {
    await DealerVideo.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dealer-only delete
export const deleteDealerVideo = async (req, res) => {
  try {
    const video = await DealerVideo.findOne({ _id: req.params.id, postedBy: req.user._id });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    await video.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dealer public profile (used by /dealers/:id)
export const getDealerProfile = async (req, res) => {
  try {
    const dealer = await User.findOne({ _id: req.params.dealerId, role: 'dealer' })
      .select('-password');
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
    res.json({ success: true, dealer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};