import express from "express"
import User from "../models/user.js"
import { createSendToken } from "../utils/functions.js";


export const createSuperAdmin = async (req, res) => {
  try {
  
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    if (superAdminExists) {
      return res.status(403).json({
        status: 'fail',
        message: 'Superadmin already exists. This route is disabled.',
      });
    }

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const superadmin = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: 'superadmin',
      isActive: true,
    
    });

    superadmin.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Superadmin created successfully!',
      data: { user: superadmin },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Failed to create superadmin',
    });
  }
};




// controllers/authController.js

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }


    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

   
    if (!user || !(await user.comparePassword(password)) || user.role !== 'superadmin') {
      return res.status(401).json({
    
        status: 'fail',
        message: 'Invalid credentials or not an admin',
      });
    }

  
    createSendToken(user, 200, res);

   
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Login failed',
    });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
};

export const getPendingDealers = async (req, res) => {
  try {
    const dealers = await User.find({
      role: 'dealer',
      'dealerInfo.verified': false,
    }).select('-password');

    res.status(200).json({
      status: 'success',
      count: dealers.length,
      data: { dealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Approve a dealer
export const approveDealer = async (req, res) => {
  try {
    const dealer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'dealer' },
      {
        'dealerInfo.verified': true,
        'dealerInfo.verifiedAt': new Date(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!dealer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Dealer not found',
      });
    }

    // Optional: send email to dealer
    // await sendDealerApprovedEmail(dealer.email);

    res.status(200).json({
      status: 'success',
      message: 'Dealer verified successfully!',
      data: { dealer },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Reject a dealer (with reason)
export const rejectDealer = async (req, res) => {
  try {
    const { reason } = req.body; // e.g. "Invalid CAC document"

    const dealer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'dealer' },
      {
        role: 'user', // downgrade back to user
        'dealerInfo.verified': false,
        'dealerInfo.rejected': true,
        'dealerInfo.rejectionReason': reason || 'Incomplete information',
        'dealerInfo.rejectedAt': new Date(),
      },
      { new: true }
    );

    if (!dealer) {
      return res.status(404).json({
        status: 'fail',
        message: 'Dealer not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Dealer application rejected and downgraded to user',
      data: { dealer },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};





export const getPendingServiceProvider = async (req, res) => {
  try {
    const dealers = await User.find({
      role: 'service-provider',
      'serviceProviderInfo.verified': false,
    }).select('-password');

    res.status(200).json({
      status: 'success',
      count: dealers.length,
      data: { dealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Approve a dealer
export const approveServiceProvider = async (req, res) => {
  try {
    const dealer = await User.findOneAndUpdate(
      { _id: req.params.id, role   : 'service-provider', },
      {
 
      'serviceProviderInfo.verified': true,
        'serviceProviderInfo.verifiedAt': new Date(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!dealer) {
      return res.status(404).json({
        status: 'fail',
        message: 'service provider  not found',
      });
    }

    // Optional: send email to dealer
    // await sendDealerApprovedEmail(dealer.email);

    res.status(200).json({
      status: 'success',
      message: 'Dealer verified successfully!',
      data: { dealer },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Reject a dealer (with reason)
export const rejectserviceProvider = async (req, res) => {
  try {
    const { reason } = req.body; // e.g. "Invalid CAC document"

    const dealer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'service-provider' },
      {
        role: 'user', // downgrade back to user
        'serviceProviderInfo.verified': false,
        'serviceProviderInfo.rejected': true,
        'serviceProviderInfo.rejectionReason': reason || 'Incomplete information',
        'serviceProviderInfo.rejectedAt': new Date(),
      },
      { new: true }
    );

    if (!dealer) {
      return res.status(404).json({
        status: 'fail',
        message: 'service provider not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'service provider application rejected and downgraded to user',
      data: { dealer },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
// controllers/adminController.js

export const verifyUserEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is already verified',
      });
    }

    // Manually verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      
      status: 'success',
      message: `Email verified manually for ${user.email}`,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: true,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify email',
    });
  }
};

























// Get ALL cars (for admin)
export const getAllCarsAdmin = async (req, res) => {
  try {
    const cars = await CarListing.find({})
      .populate('postedBy', 'firstName lastName role dealerInfo')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: cars.length,
      data: { cars },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch cars' });
  }
};

// Get ALL dealers (for admin)
export const getAllDealersAdmin = async (req, res) => {
  try {
    const dealers = await User.find({ role: 'dealer' })
      .select('firstName lastName phoneNumber dealerInfo')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: dealers.length,
      data: { dealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch dealers' });
  }
};
// Get ALL service provider (for admin)
export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'service-provider' })
      .select('firstName lastName phoneNumber serviceProviderInfo')
      .sort('-createdAt');
      

    res.status(200).json({
      status: 'success',
      results: providers.length,
      data: { providers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch dealers' });
  }
};

// Make a car Featured
export const makeCarFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarListing.findByIdAndUpdate(
      id,
      {
        isFeatured: true,
        featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      { new: true }
    );

    if (!car) return res.status(404).json({ status: 'fail', message: 'Car not found' });

    res.status(200).json({
      status: 'success',
      message: 'Car is now featured!',
      data: { car },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to feature car' });
  }
};

// Make a car Newest (just reset createdAt)
export const makeCarNewest = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await CarListing.findByIdAndUpdate(
      id,
      { createdAt: new Date() },
      { new: true }
    );

    if (!car) return res.status(404).json({ status: 'fail', message: 'Car not found' });

    res.status(200).json({
      status: 'success',
      message: 'Car moved to newest listings!',
      data: { car },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to refresh car' });
  }
};

// Make a dealer Featured
export const makeDealerFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await User.findByIdAndUpdate(
      id,
      {
        'dealerInfo.isFeatured': true,
        'dealerInfo.featuredUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!dealer) return res.status(404).json({ status: 'fail', message: 'Dealer not found' });

    res.status(200).json({
      status: 'success',
      message: 'Dealer is now featured!',
      data: { dealer },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to feature dealer' });
  }
};

// Make a service provider Featured
export const makeServiceProviderFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await User.findByIdAndUpdate(
      id,
      {
        'serviceProviderInfo.isFeatured': true,
        'serviceProviderInfo.featuredUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!provider) return res.status(404).json({ status: 'fail', message: 'Provider not found' });

    res.status(200).json({
      status: 'success',
      message: 'Service provider is now featured!',
      data: { provider },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to feature provider' });
  }
};







// Blacklist a user (Superadmin only)
export const blacklistUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ status: 'fail', message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (user.blacklisted) {
      return res.status(400).json({ status: 'fail', message: 'User is already blacklisted' });
    }

    user.blacklisted = true;
    user.blacklistedAt = new Date();
    user.blacklistedBy = req.user?._id;
    user.blacklistedReason = reason || 'No reason provided';

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User has been blacklisted',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to blacklist user',
      error: err.message,
    });
  }
};

// Unblacklist a user (Superadmin only)
export const unblacklistUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (!user.blacklisted) {
      return res.status(400).json({ status: 'fail', message: 'User is not blacklisted' });
    }

    user.blacklisted = false;
    user.blacklistedAt = null;
    user.blacklistedBy = null;
    user.blacklistedReason = '';

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User has been unblacklisted',
      data: { user },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to unblacklist user',
      error: err.message,
    });
  }
};

// Get all blacklisted users (Superadmin only)
export const getBlacklistedUsers = async (req, res) => {
  try {
    const users = await User.find({ blacklisted: true })
      .select('firstName lastName email phoneNumber blacklistedAt blacklistedReason blacklistedBy')
      .populate('blacklistedBy', 'firstName lastName email');

    res.status(200).json({
      status: 'success',
      data: { blacklistedUsers: users },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blacklisted users',
      error: err.message,
    });
  }
};