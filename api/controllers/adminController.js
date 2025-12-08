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