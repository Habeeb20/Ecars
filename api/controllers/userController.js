// controllers/authController.js
import User from '../models/user.js';
import crypto from "crypto"
import jwt from 'jsonwebtoken';
import { createSendToken,  } from '../utils/functions.js';
import { signToken } from '../utils/functions.js';
import 'colors';
import { protect } from '../middleware/verifyToken.js';
import CarListing from '../models/carListing.js';
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








export const getFeaturedDealers = async (req, res) => {
  try {
    const featuredDealers = await User.find({
      role: 'dealer',
      'dealerInfo.isFeatured': true,
      'dealerInfo.featuredUntil': { $gt: new Date() },
    }).select('firstName lastName email phoneNumber state lga address avatar bio dealerInfo');

    res.status(200).json({
      status: 'success',
      results: featuredDealers.length,
      data: { dealers: featuredDealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch featured dealers' });
  }
};


// controllers/userController.js
export const searchDealers = async (req, res) => {
  try {
    const { q } = req.query;
    const query = { role: 'dealer' };

    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { 'dealerInfo.businessName': { $regex: q, $options: 'i' } },
        { 'dealerInfo.businessAddress': { $regex: q, $options: 'i' } },
        { 'dealerInfo.state': { $regex: q, $options: 'i' } },
        { 'dealerInfo.lga': { $regex: q, $options: 'i' } },
        { phoneNumber: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
        { lga: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ];
    }

    const dealers = await User.find(query).select('firstName lastName email phoneNumber state lga address avatar bio dealerInfo');

    res.status(200).json({
      status: 'success',
      results: dealers.length,
      data: { dealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to search dealers' });
  }
};


// controllers/dealerController.js (or userController.js)
export const getAllDealers = async (req, res) => {

  try {
    const dealers = await User.find({ role: 'dealer' }).select('firstName lastName email phoneNumber state lga address avatar bio dealerInfo');
    
    res.status(200).json({
      status: 'success',
      data: { dealers },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: 'Failed to fetch dealers' });
  }
};



export const getDealerById = async (req, res) => {
  try {
    const dealer = await User.findById(req.params?.id).select('firstName lastName email phoneNumber state lga address avatar bio dealerInfo');
    
    const cars = await CarListing.find({ postedBy: dealer._id }).select('title price images year mileage');

    res.status(200).json({
      status: 'success',
      data: { dealer, cars },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: 'Failed to fetch dealer details' });
  }
};

export const getFeaturedServiceProvider = async (req, res) => {
  try {
    const featuredDealers = await User.find({
      role: 'service-provider',
      'serviceProviderInfo.isFeatured': true,
      'serviceProviderInfo.featuredUntil': { $gt: new Date() },
    }).select('firstName lastName email phoneNumber state lga address avatar bio dealerInfo');

    res.status(200).json({
      status: 'success',
      results: featuredDealers.length,
      data: { dealers: featuredDealers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch featured dealers' });
  }
};


// export const getAllServiceProviders = async (req, res) => {
//   try {
//     const providers = await User.find({ role: 'service-provider' })
//       .select('firstName lastName phoneNumber serviceProviderInfo');
//     res.status(200).json({
//       status: 'success',
//       data: { providers },
//     });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: 'Failed to fetch providers' });
//   }
// };

export const searchServiceProviders = async (req, res) => {
  try {
    const { serviceType, location, rating, specialization } = req.query;
    const query = { role: 'service-provider' };

    if (serviceType) query['serviceProviderInfo.type'] = { $regex: serviceType, $options: 'i' };
    if (location) query['serviceProviderInfo.state'] = { $regex: location, $options: 'i' };
    if (rating) query['serviceProviderInfo.rating'] = { $gte: Number(rating) };
    if (specialization) query['serviceProviderInfo.specialization'] = { $regex: specialization, $options: 'i' };

    const providers = await User.find(query)
      .select('firstName lastName phoneNumber serviceProviderInfo');

    res.status(200).json({
      status: 'success',
      data: { providers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to search providers' });
  }
};










// Search blacklisted users (Superadmin only)
export const searchBlacklistedUsers = async (req, res) => {
  try {
    const {
      category,      // 'car dealers', 'private sellers', 'buyers', 'service providers'
      location,
      date,          // YYYY-MM-DD
      status,
      search,        // general search (name or email)
      page = 1,
      limit = 20,
    } = req.query;

    const query = { blacklisted: true };

    // Category filter (map to role)
    if (category) {
      const roleMap = {
        'car dealers': 'dealer',
        'private sellers': 'private-seller',
        'buyers': 'buyer',
        'service providers': 'service-provider',
      };
      query.role = roleMap[category.toLowerCase()];
      if (!query.role) {
        return res.status(400).json({ status: 'fail', message: 'Invalid category' });
      }
    }

    // Location filter (case-insensitive)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Date filter (exact date added)
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.blacklistedAt = { $gte: start, $lt: end };
    }

    // Status filter (if you add a status field later)
    if (status) {
      // You can add a 'status' field later if needed
      // For now, we just return active blacklisted users
    }

    // General search (name or email)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select('firstName lastName email phoneNumber role location blacklistedAt blacklistedReason blacklistedBy')
      .populate('blacklistedBy', 'firstName lastName email')
      .sort({ blacklistedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { users },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search blacklisted users',
      error: err.message,
    });
  }
};