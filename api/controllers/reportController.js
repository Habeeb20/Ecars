
import Report from '../models/reportSchema.js';
export const reportScam = async (req, res) => {
  try {
    const { carId, sellerId, title, description, evidence, phone } = req.body;

    const report = await Report.create({
      type: 'scam',
      reportedBy: req.user._id,
      car: carId,
      seller: sellerId,
      title,
      description,
      evidence: evidence || [],
      phone,
      location: req.body.location,
    });

    res.status(201).json({
      status: 'success',
      message: 'Scam reported. Admin will review.',
      data: { report },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const requestCar = async (req, res) => {
  try {
    const { desiredMake, desiredModel, budget, preferredLocation, description } = req.body;

    const report = await Report.create({
      type: 'request',
      reportedBy: req.user._id,
      title: `Looking for ${desiredMake} ${desiredModel}`,
      description,
      desiredMake,
      desiredModel,
      budget,
      preferredLocation,
    });

    res.status(201).json({
      status: 'success',
      message: 'Request submitted! Dealers will contact you.',
      data: { report },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const reportStolenCar = async (req, res) => {
  try {
    const { vin, plateNumber, make, model, color, stolenDate, policeReport, description } = req.body;

    const report = await Report.create({
      type: 'stolen',
      reportedBy: req.user._id,
      title: `Stolen: ${make} ${model} - ${plateNumber}`,
      description,
      vin,
      plateNumber,
      color,
      stolenDate,
      policeReport,
    });

    res.status(201).json({
      status: 'success',
      message: 'Stolen car reported. We’ll alert dealers.',
      data: { report },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort('-createdAt')
      .populate('car', 'title images price');

    res.status(200).json({
      status: 'success',
      results: reports.length,
      data: { reports },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch reports' });
  }
};