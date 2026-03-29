
import CarViewing from '../models/CarViewing.js';
import carListing from '../models/carListing.js';
// Book a viewing for a car
export const bookCarViewing = async (req, res) => {
  try {
    const { carId, preferredDate, preferredTime, message, phoneNumber } = req.body;
    const buyerId = req.user.id;

    // Check if car exists
    const car = await CarListing.findById(carId);
    if (!car) {
      return res.status(404).json({ status: false, message: "Car not found" });
    }

    // Prevent booking own car
    if (car.postedBy.toString() === buyerId) {
      return res.status(400).json({ status: false, message: "You cannot book viewing for your own car" });
    }

    const viewing = new CarViewing({
      car: carId,
      buyer: buyerId,
      dealer: car.postedBy,
      preferredDate,
      preferredTime,
      message: message || '',
      phoneNumber: phoneNumber || req.user.phone
    });

    await viewing.save();

    res.status(201).json({
      status: true,
      message: "Viewing request sent successfully! The dealer will respond soon.",
      data: viewing
    });

  } catch (error) {
    console.error("Book viewing error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Get all viewing requests for a dealer (My Car Viewings)
export const getMyCarViewings = async (req, res) => {
  try {
    const dealerId = req.user.id;

    const viewings = await CarViewing.find({ dealer: dealerId })
      .populate('car', 'title make model year price images')
      .populate('buyer', 'firstName lastName email phone')
      .sort({ requestedAt: -1 });

    res.status(200).json({
      status: true,
      count: viewings.length,
      data: viewings
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// Update viewing status (Dealer action)
export const updateViewingStatus = async (req, res) => {
  try {
    const { viewingId } = req.params;
    const { status, dealerNotes } = req.body;
    const dealerId = req.user.id;

    const viewing = await CarViewing.findOne({ _id: viewingId, dealer: dealerId });

    if (!viewing) {
      return res.status(404).json({ status: false, message: "Viewing request not found" });
    }

    viewing.status = status;
    if (dealerNotes) viewing.dealerNotes = dealerNotes;

    if (status === 'confirmed') viewing.confirmedAt = new Date();
    if (status === 'cancelled') viewing.cancelledAt = new Date();

    await viewing.save();

    res.status(200).json({
      status: true,
      message: `Viewing request ${status} successfully`,
      data: viewing
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
};