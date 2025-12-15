// controllers/offerController.js
import Offer from "../models/compareOffer.js";

export const createOffer = async (req, res) => {
  try {
    const { carIds, dealerIds, offerPrice } = req.body;
    if (!carIds?.length || !dealerIds?.length || !offerPrice) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const offer = new Offer({
      user: req.user._id,
      carIds,
      dealerIds,
      offerPrice,
    });
    await offer.save();

    // Optionally notify dealers via email/push
    res.status(201).json({
      status: 'success',
      message: 'Offer sent',
      data: { offer },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to send offer' });
  }
};

// NEW: Get offers for a dealer
export const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ dealerIds: req.user._id })
      .populate('user', 'firstName lastName email phoneNumber avatar')
      .populate('carIds', 'title make model year price images')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { offers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch offers' });
  }
};



// Accept offer
export const acceptOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
    if (!offer) return res.status(404).json({ status: 'fail', message: 'Offer not found' });
    res.json({ status: 'success', data: { offer } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to accept offer' });
  }
};

// Reject offer
export const rejectOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    if (!offer) return res.status(404).json({ status: 'fail', message: 'Offer not found' });
    res.json({ status: 'success', data: { offer } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to reject offer' });
  }
};