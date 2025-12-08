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





export const upgradeToDealer = async (req, res) => {
  try {
    const userId = req.user.id; 

    const {
      businessName,
      businessRegistrationNumber,
      businessAddress,
      state,
      lga,
      phoneNumber,
      website,
      description,
      logo,
      yearEstablished,
    } = req.body;

    // 1. Prevent already dealers or higher roles
    const user = await User.findById(userId);
    if (user.role === 'dealer') {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already a registered dealer.',
      });
    }

    if (user.role === 'service-provider' || user.role === 'superadmin') {
      return res.status(403).json({
        status: 'fail',
        message: 'This account type cannot be converted to dealer.',
      });
    }

    // 2. Validate required dealer fields
    if (!businessName || !businessRegistrationNumber || !businessAddress || !state || !lga || !phoneNumber) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required dealer information: business name, registration number, address, state, LGA, and phone number.',
      });
    }

    // 3. Check if businessRegistrationNumber is already taken
    const existingDealer = await User.findOne({
      'dealerInfo.businessRegistrationNumber': businessRegistrationNumber,
    });

    if (existingDealer) {
      return res.status(409).json({
        status: 'fail',
        message: 'This business registration number is already registered.',
      });
    }

    // 4. Update user: change role + add dealerInfo
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: 'dealer',
        phoneNumber,
        dealerInfo: {
          businessName: businessName.trim(),
          businessRegistrationNumber: businessRegistrationNumber.trim(),
          businessAddress: businessAddress.trim(),
          state: state.trim(),
          lga: lga.trim(),
          website: website?.trim() || '',
          description: description?.trim() || '',
          logo: logo || user.avatar || '', // fallback to profile avatar
          yearEstablished: yearEstablished ? Number(yearEstablished) : undefined,
          verified: false, // admin must approve (optional)
          verificationRequestedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    // Optional: Send notification/email to admin
    // await sendDealerVerificationRequestEmail(updatedUser);

    res.status(200).json({
      status: 'success',
      message: 'Congratulations! You are now a verified car dealer.',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.log('Upgrade to dealer error →'.red, err);

    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'This business registration number is already in use.',
      });
    }

    res.status(400).json({
      status:  'fail',
      message: err.message || 'Failed to upgrade account to dealer. Please try again.',
    });
  }
};








// controllers/authController.js

export const upgradeToServiceProvider = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      businessName,
      businessAddress,
      state,
      lga,
      phoneNumber,
      whatsappNumber,
      servicesOffered,
      workshopPhotos,
      yearsOfExperience
    } = req.body;

    const user = await User.findById(userId);

    if (user.role === 'service-provider') {
      return res.status(400).json({ status: 'fail', message: 'Already a service provider' });
    }

    if (user.role === 'dealer' || user.role === 'superadmin') {
      return res.status(403).json({ status: 'fail', message: 'Cannot convert this account type' });
    }

    if (!type || !businessName || !state || !lga || !phoneNumber) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please fill all required service provider fields',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: 'service-provider',
        phoneNumber,
        'serviceProviderInfo': {
          type,
          businessName: businessName.trim(),
          businessAddress: businessAddress?.trim(),
          state: state.trim(),
          lga: lga.trim(),
          whatsappNumber: whatsappNumber || phoneNumber,
          servicesOffered: servicesOffered || [],
          workshopPhotos: workshopPhotos || [],
          yearsOfExperience: yearsOfExperience || 0,
          verified: false,
          verificationRequestedAt: new Date(),
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'You are now a registered service provider! Awaiting admin approval.',
      data: { user: updatedUser }
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'fail', message: err.message || 'Upgrade failed' });
  }
};






export const getAllDealers = async (req, res) => {
  try {
    const dealers = await User.find({
      role: 'dealer',
      'dealerInfo.verified': true
    })
    .select('firstName dealerInfo.businessName dealerInfo.logo dealerInfo.state dealerInfo.lga dealerInfo.verified phoneNumber')
    .sort('-dealerInfo.verifiedAt');

    res.status(200).json({
      status: 'success',
      results: dealers.length,
      data: { dealers }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get all verified service providers
export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: 'service-provider',
      'serviceProviderInfo.verified': true
    })
    .select('firstName serviceProviderInfo.businessName serviceProviderInfo.type serviceProviderInfo.state serviceProviderInfo.lga serviceProviderInfo.workshopPhotos serviceProviderInfo.rating phoneNumber')
    .sort('-serviceProviderInfo.verifiedAt');

    res.status(200).json({
      status: 'success',
      results: providers.length,
      data: { providers }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};





// Search dealers & service providers
export const searchServiceAndDealers = async (req, res) => {
  try {
    const {
      q,           // search term (business name)
      state,
      lga,
      type,        // for service providers only
      role = 'dealer,service-provider', // default both
      verified = 'true',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Role filter
    const roles = role.split(',');
    query.role = { $in: roles };

    // Verified filter
    if (verified === 'true') {
      if (roles.includes('dealer')) query['dealerInfo.verified'] = true;
      if (roles.includes('service-provider')) query['serviceProviderInfo.verified'] = true;
    }

    // Text search in business name
    if (q) {
      query.$or = [
        { 'dealerInfo.businessName': { $regex: q, $options: 'i' } },
        { 'serviceProviderInfo.businessName': { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } }
      ];
    }

    // Location
    if (state) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'dealerInfo.state': { $regex: state, $options: 'i' } },
        { 'serviceProviderInfo.state': { $regex: state, $options: 'i' } }
      );
    }

    if (lga) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'dealerInfo.lga': { $regex: lga, $options: 'i' } },
        { 'serviceProviderInfo.lga': { $regex: lga, $options: 'i' } }
      );
    }

    // Service type
    if (type) {
      query['serviceProviderInfo.type'] = type;
    }

    const skip = (page - 1) * limit;

    const results = await User.find(query)
      .select('role firstName phoneNumber dealerInfo serviceProviderInfo')
      .skip(skip)
      .limit(Number(limit))
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: results.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { results }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};











// controllers/authController.js  ← Add this function
