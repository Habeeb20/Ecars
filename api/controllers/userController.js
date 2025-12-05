// controllers/authController.js
import User from '../models/user.js';
import crypto from "crypto"
import jwt from 'jsonwebtoken';
import { createSendToken,  } from '../utils/functions.js';
import { signToken } from '../utils/functions.js';
import 'colors';
import { protect } from '../middleware/verifyToken.js';

import { sendPasswordResetEmail } from '../utils/functions.js';
// REGISTER → returns token so user logs in immediately
// controllers/authController.js

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

  
    const newUser = await User.create({
      firstName,
      lastName,
      email:email.toLowerCase(), 
      password,
      role: role || 'user',
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err)
    if (err.code === 11000 || err.message.includes('duplicate key')) {
      return res.status(409).json({
        status: 'fail',
        message: 'This email is already registered. Please login instead.',
      });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        status: 'fail',
        message: messages.join(', '),
      });
    }

    // Any other error
    res.status(400).json({
      status: 'fail',
      message: 'Registration failed. Please try again.',
    });
  }
};

// LOGIN
export const login = async (req, res) => {
    try {
         const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }
     const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
  } 
    createSendToken(user, 200, res);
    } catch (error) {
           res.status(400).json({
      status: 'fail',
      message: err.message,
    });
   } 
};




// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user with that email address',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    // or for frontend: `https://yourapp.com/reset-password/${resetToken}`

    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      status: 'success',
      message: 'Reset link sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: 'error',
      message: 'Error sending email. Try again later.',
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or has expired',
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log user in after reset
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password reset successful',
  });
};






export const getDashboard = async (req, res) => {
  try {
    const user = req.user; 

    const stats = {
   
      totalCustomers: await User.countDocuments({ role: 'user' }),
      pendingOrders: 12, 
      revenueThisMonth: 89400,
      welcomeMessage: `Welcome back, ${user.firstName}!`,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        uniqueNumber: user.uniqueNumber,
        joinedDate: user.createdAt,
      },
    };

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};



// Get currently logged in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};








// UPDATE USER PROFILE (name, phone, address, etc — NOT password)
export const updateMe = async (req, res) => {
  try {
    // 1. Prevent updating password here
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates',
      });
    }

    // 2. Allowed fields
    const allowedFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'state',
      'lga',
      'address',
      'bio',
      'avatar',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 3. Update user
    const updatedUser = await User.findByIdAndUpdate(req.user?.id || req.user?._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Update failed',
    });
  }
};

// CHANGE PASSWORD (separate route)
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide current and new password',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Password update failed',
    });
  }
};