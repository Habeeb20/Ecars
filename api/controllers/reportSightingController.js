
import Sighting from "../models/reportSighing.js"
import StolenCarReport from "../models/reportSchema.js"
export const createSighting = async (req, res) => {
  try {
    const { reportId, fullName, phone, locationSeen, additionalInfo } = req.body;

    // Validate that the report exists
    const report = await StolenCarReport.findById(reportId);
    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Stolen car report not found',
      });
    }

    const sighting = await Sighting.create({
      reportId,
      reporter: req.user?._id, // optional - if using authentication
      fullName,
      phone,
      locationSeen,
      additionalInfo: additionalInfo || '',
    });

    res.status(201).json({
      status: 'success',
      message: 'Sighting reported successfully',
      data: { sighting },
    });
  } catch (error) {
    console.error('Create sighting error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to report sighting',
      error: error.message,
    });
  }
};

export const getAllSightings = async (req, res) => {
  try {
    // You can add role-based access control here if needed
    // if (!req.user?.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

    const sightings = await Sighting.find()
      .populate({
        path: 'reportId',
        select: 'title plateNumber make model vin location status',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: sightings.length,
      data: { sightings },
    });
  } catch (error) {
    console.error('Get sightings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sightings',
    });
  }
};

export const getSightingsByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const sightings = await Sighting.find({ reportId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: sightings.length,
      data: { sightings },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sightings for this report',
    });
  }
};