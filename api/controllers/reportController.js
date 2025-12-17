
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






export const getStolenCars = async (req, res) => {
  try {
    const { make, model, year, location, color, status } = req.query;

    // Build query for stolen reports
    const query = { type: 'stolen' };

    // Powerful search: Regex for make/model in title (case-insensitive, partial match)
    if (make) {
      query.title = { ...query.title, $regex: new RegExp(make, 'i') };
    }
    if (model) {
      const modelRegex = { ...query.title, $regex: new RegExp(model, 'i') };
      query.title = modelRegex;
    }
    if (make && model) {
      // Combined regex for make and model
      query.$and = [
        { title: { $regex: new RegExp(make, 'i') } },
        { title: { $regex: new RegExp(model, 'i') } }
      ];
      delete query.title;
    }

    // Exact match for year (Number)
    if (year) {
      query.year = Number(year);
    }

    // Regex partial match for location (case-insensitive)
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    // Exact match for color (case-insensitive)
    if (color) {
      query.color = { $regex: new RegExp(`^${color}$`, 'i') };
    }

    // Exact match for status
    if (status) {
      query.status = status;
    }

    // Fetch with populate for reportedBy (basic user info if needed)
    const reports = await Report.find(query)
      .sort('-createdAt')
      .populate('reportedBy', 'name email')
      .lean(); // Use lean for performance

    // If no filters, return all; else filtered results
    res.status(200).json({
      status: 'success',
      results: reports.length,
      data: { reports },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch stolen cars' });
  }
};




// controllers/reportController.js

export const getAllReports = async (req, res) => {
  try {
    const {
      type,       // 'scam' | 'request' | 'stolen' | undefined (all)
      search,     // general search in title or description
      make,
      model,
      year,
      location,
      color,
      budget,
      page = 1,
      limit = 20
    } = req.query;

    // Base query
    let query = {};

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // General search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }

    // Filters for 'stolen' reports (or all if no type specified)
    if (!type || type === 'stolen') {
      if (make || model) {
        const titleConditions = [];
        if (make) titleConditions.push({ title: { $regex: new RegExp(make, 'i') } });
        if (model) titleConditions.push({ title: { $regex: new RegExp(model, 'i') } });
        query.$and = titleConditions.length > 0 ? titleConditions : undefined;
      }
      if (year) query.year = Number(year);
      if (location) query.location = { $regex: new RegExp(location, 'i') };
      if (color) query.color = { $regex: new RegExp(`^${color}$`, 'i') };
    }

    // Filters for 'request' reports (or all if no type specified)
    if (!type || type === 'request') {
      if (make) query.desiredMake = { $regex: new RegExp(make, 'i') };
      if (model) query.desiredModel = { $regex: new RegExp(model, 'i') };
      if (budget) query.budget = { $lte: Number(budget) }; // max budget
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch reports with relevant population
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('reportedBy', 'name email phone')
      .populate('car', 'title images price make model year')
      .populate('seller', 'name phone')
      .lean();

    // Total count for pagination
    const total = await Report.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: reports.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: { reports }
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reports'
    });
  }
};