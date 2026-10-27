// controllers/authController.js
import User from '../models/user.js';
import axios from  "axios"
import crypto from "crypto"
import jwt from 'jsonwebtoken';
import { createSendToken,  } from '../utils/functions.js';
import { signToken } from '../utils/functions.js';
import 'colors';
import { protect } from '../middleware/verifyToken.js';
import CarListing from '../models/carListing.js';
import { sendPasswordResetEmail } from '../utils/functions.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { linkAgentToUser } from '../services/agentService.js';




// whitelist roles. Never trust the role from the body:
const PUBLIC_ROLES = ['user', 'dealer', 'service-provider', 'carPart-seller', 'agent'];




// import createSendToken from wherever your login controller already gets it

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // must be true for port 465
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  // port: Number(process.env.EMAIL_PORT),
    host: 'smtp.gmail.com',
  port: 465,
  secure: true, // false for port 587 (STARTTLS), true for port 465
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// REGISTER → returns token so user logs in immediately
// controllers/authController.js

// export const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role } = req.body;

  
//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email:email.toLowerCase(), 
//       password,
//       role: role || 'user',
//     });

//       try {
//       await axios.post("https://auth.edirect.ng/api/auth/register", {
//         platform: "ecars",
//         first_name: firstName,
//         last_name: lastName,
//         email: email.toLowerCase(),
     
//         password,
//         role,
//       });
//       console.log("Edirect auth registration successful");
//     } catch (err) {
//       console.error("Edirect auth failed:", err.response?.data || err.message);
//     }
//       try {
//       await axios.post("https://backend-efixit.ereligion.ng/api/auth/register", {
     
//         first_name: firstName,
//         last_name: lastName,
//         email: email.toLowerCase(),
        
//         password,
//         role: "client",
//       });
//       console.log("Efixit auth registration successful");
//     } catch (err) {
//       console.error("Efixit auth failed:", err.response?.data || err.message);
//     }

//     createSendToken(newUser, 201, res);
//   } catch (err) {
//     console.log(err)
//     if (err.code === 11000 || err.message.includes('duplicate key')) {
//       return res.status(409).json({
//         status: 'fail',
//         message: 'This email is already registered. Please login instead.',
//       });
//     }

//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map(el => el.message);
//       return res.status(400).json({
//         status: 'fail',
//         message: messages.join(', '),
//       });
//     }

//     // Any other error
//     res.status(400).json({
//       status: 'fail',
//       message: 'Registration failed. Please try again.',
//     });
//   }
// };


// export const register = async (req, res) => {
//    try {
//     const {
//       firstName, lastName, email, password, role, phoneNumber, state, lga, address,
//       dealerInfo, serviceProviderInfo, carPartSellerInfo,
//     } = req.body;

//     const finalRole = role || 'user';
//     if (!PUBLIC_ROLES.includes(finalRole)) {
//       return res.status(400).json({ status: 'fail', message: 'Invalid role' });
//     }

//     // find the agent behind the signup link BEFORE building the payload
//     let agent = null;
//     if (req.body.referralCode) {
//       agent = await User.findOne({
//         role: 'agent',
//         referralCode: String(req.body.referralCode).toUpperCase().trim(),
//       });
//     }

//     const userPayload = {
//       firstName,
//       lastName,
//       email: email.toLowerCase(),
//       password,
//       role: finalRole,
//       phoneNumber,
//       state,
//       lga,
//       address,
//       signedUpByAgent: agent && finalRole !== 'agent' ? agent._id : undefined,
//     };

//     // Attach the correct nested object based on selected role
//     if (role === 'dealer' && dealerInfo) {
//       userPayload.dealerInfo = {
//         businessName:               dealerInfo.businessName,
//         businessRegistrationNumber: dealerInfo.businessRegistrationNumber,
//         businessAddress:            dealerInfo.businessAddress,
//         state:                      dealerInfo.state,
//         lga:                        dealerInfo.lga,
//       };
//     }

//     if (role === 'service-provider' && serviceProviderInfo) {
//       userPayload.serviceProviderInfo = {
//         type:               serviceProviderInfo.type,
//         businessName:       serviceProviderInfo.businessName,
//         businessAddress:    serviceProviderInfo.businessAddress,
//         state:              serviceProviderInfo.state,
//         lga:                serviceProviderInfo.lga,
//         phoneNumber:        serviceProviderInfo.phoneNumber,
//         whatsappNumber:     serviceProviderInfo.whatsappNumber,
//         yearsOfExperience:  serviceProviderInfo.yearsOfExperience,
//         servicesOffered:    serviceProviderInfo.servicesOffered || [],
//       };
//     }

//     if (role === 'carPart-seller' && carPartSellerInfo) {
//       userPayload.carPartSellerInfo = {
//         type:               carPartSellerInfo.type,
//         businessName:       carPartSellerInfo.businessName,
//         businessAddress:    carPartSellerInfo.businessAddress,
//         state:              carPartSellerInfo.state,
//         lga:                carPartSellerInfo.lga,
//         phoneNumber:        carPartSellerInfo.phoneNumber,
//         whatsappNumber:     carPartSellerInfo.whatsappNumber,
//         website:            carPartSellerInfo.website,
//         yearsOfExperience:  carPartSellerInfo.yearsOfExperience,
//         specialties:        carPartSellerInfo.specialties || [],
//       };
//     }

//     const newUser = await User.create(userPayload);


// // after the user is created
//     if (agent && newUser.role !== 'agent') {
//     linkAgentToUser(agent, newUser).catch((e) => console.error('Agent link failed:', e.message));
//     }

//     // Cross-platform registration (kept exactly as before)
//     try {
//       await axios.post('https://auth.edirect.ng/api/auth/register', {
//         platform: 'ecars',
//         first_name: firstName,
//         last_name: lastName,
//         email: email.toLowerCase(),
//         password,
//         role,
//       });
//       console.log('Edirect auth registration successful');
//     } catch (err) {
//       console.error('Edirect auth failed:', err.response?.data || err.message);
//     }

//     try {
//       await axios.post('https://backend-efixit.ereligion.ng/api/auth/register', {
//         first_name: firstName,
//         last_name: lastName,
//         email: email.toLowerCase(),
//         password,
//         role: 'client',
//       });
//       console.log('Efixit auth registration successful');
//     } catch (err) {
//       console.error('Efixit auth failed:', err.response?.data || err.message);
//     }

//     createSendToken(newUser, 201, res);
//   } catch (err) {
//     console.log(err);
//     if (err.code === 11000 || err.message.includes('duplicate key')) {
//       const field = Object.keys(err.keyPattern || {})[0];
//       const friendlyField = field === 'email'
//         ? 'email'
//         : field === 'dealerInfo.businessRegistrationNumber'
//         ? 'business registration number'
//         : field;
//       return res.status(409).json({
//         status: 'fail',
//         message: field === 'email'
//           ? 'This email is already registered. Please login instead.'
//           : `This ${friendlyField} is already registered.`,
//       });
//     }

//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map((el) => el.message);
//       return res.status(400).json({
//         status: 'fail',
//         message: messages.join(', '),
//       });
//     }

//     res.status(400).json({
//       status: 'fail',
//       message: 'Registration failed. Please try again.',
//     });
//   }
// };



export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      state,
      lga,
      address,
      referralCode,

      // role-specific payloads sent from the frontend, only one will be populated
      dealerInfo,
      serviceProviderInfo,
      carPartSellerInfo,
    } = req.body;

    // 1. Validate the role (this check lives INSIDE the function, where `res` and `role` exist)
    const finalRole = role || 'user';
    if (!PUBLIC_ROLES.includes(finalRole)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid role' });
    }

    // 2. Find the agent behind the signup link, if any (before building the payload)
    let agent = null;
    if (referralCode) {
      agent = await User.findOne({
        role: 'agent',
        referralCode: String(referralCode).toUpperCase().trim(),
      });
    }

    // 3. Base payload
    const userPayload = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: finalRole,
      phoneNumber,
      state,
      lga,
      address,
      signedUpByAgent: agent && finalRole !== 'agent' ? agent._id : undefined,
    };

    // 4. Attach the nested object for the selected role
    if (finalRole === 'dealer' && dealerInfo) {
      userPayload.dealerInfo = {
        businessName: dealerInfo.businessName,
        businessRegistrationNumber: dealerInfo.businessRegistrationNumber,
        businessAddress: dealerInfo.businessAddress,
        state: dealerInfo.state,
        lga: dealerInfo.lga,
      };
    }

    if (finalRole === 'service-provider' && serviceProviderInfo) {
      userPayload.serviceProviderInfo = {
        type: serviceProviderInfo.type,
        businessName: serviceProviderInfo.businessName,
        businessAddress: serviceProviderInfo.businessAddress,
        state: serviceProviderInfo.state,
        lga: serviceProviderInfo.lga,
        phoneNumber: serviceProviderInfo.phoneNumber,
        whatsappNumber: serviceProviderInfo.whatsappNumber,
        yearsOfExperience: serviceProviderInfo.yearsOfExperience,
        servicesOffered: serviceProviderInfo.servicesOffered || [],
      };
    }

    if (finalRole === 'carPart-seller' && carPartSellerInfo) {
      userPayload.carPartSellerInfo = {
        type: carPartSellerInfo.type,
        businessName: carPartSellerInfo.businessName,
        businessAddress: carPartSellerInfo.businessAddress,
        state: carPartSellerInfo.state,
        lga: carPartSellerInfo.lga,
        phoneNumber: carPartSellerInfo.phoneNumber,
        whatsappNumber: carPartSellerInfo.whatsappNumber,
        website: carPartSellerInfo.website,
        yearsOfExperience: carPartSellerInfo.yearsOfExperience,
        specialties: carPartSellerInfo.specialties || [],
      };
    }

    // 5. Create the user (the User model hashes the password and, for agents,
    //    adds the 20 points and the referral code in its pre-save hooks)
    const newUser = await User.create(userPayload);

    // 6. Credit the agent (does not block or fail the signup)
    if (agent && newUser.role !== 'agent') {
      linkAgentToUser(agent, newUser).catch((e) =>
        console.error('Agent link failed:', e.message)
      );
    }

    // 7. Cross-platform registration (agents are staff, not marketplace users, so skip them)
    if (finalRole !== 'agent') {
      try {
        await axios.post('https://auth.edirect.ng/api/auth/register', {
          platform: 'ecars',
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          password,
          role: finalRole,
        });
        console.log('Edirect auth registration successful');
      } catch (err) {
        console.error('Edirect auth failed:', err.response?.data || err.message);
      }

      try {
        await axios.post('https://backend-efixit.ereligion.ng/api/auth/register', {
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          password,
          role: 'client',
        });
        console.log('Efixit auth registration successful');
      } catch (err) {
        console.error('Efixit auth failed:', err.response?.data || err.message);
      }
    }

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);

    if (err.code === 11000 || err.message?.includes('duplicate key')) {
      const field = Object.keys(err.keyPattern || {})[0];
      const friendlyField =
        field === 'email'
          ? 'email'
          : field === 'dealerInfo.businessRegistrationNumber'
          ? 'business registration number'
          : field;
      return res.status(409).json({
        status: 'fail',
        message:
          field === 'email'
            ? 'This email is already registered. Please login instead.'
            : `This ${friendlyField} is already registered.`,
      });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((el) => el.message);
      return res.status(400).json({
        status: 'fail',
        message: messages.join(', '),
      });
    }

    res.status(400).json({
      status: 'fail',
      message: 'Registration failed. Please try again.',
    });
  }
};
// LOGIN


// Turns "0801 234 5678", "+2348012345678", "2348012345678" or "8012345678"
// into every format a number might be stored in. Returns null if invalid.
// Field(s) in your User schema that hold the phone number.
// Keep only the one that really exists once you've confirmed it.
const PHONE_FIELDS = ['phoneNumber', 'phone'];

// Turns "0805 560 3221", "+2348055603221", "2348055603221" or "8055603221"
// into every format a number might be stored in. Returns null if invalid.
const getPhoneVariants = (input) => {
  let digits = String(input).replace(/[\s\-()]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;

  let local = digits;
  if (digits.startsWith('234') && digits.length === 13) local = `0${digits.slice(3)}`;
  else if (digits.length === 10) local = `0${digits}`;

  if (!/^0\d{10}$/.test(local)) return null;

  const national = local.slice(1);
  return [local, `234${national}`, `+234${national}`];
};

export const login = async (req, res) => {
  try {
    // "identifier" is the new field; email/phone are accepted so older clients keep working
    const { identifier, email, phone, password } = req.body;
    const rawId = String(identifier || email || phone || '').trim();

    if (!rawId || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your email or phone number and password',
      });
    }

    let query;
    if (rawId.includes('@')) {
      query = { email: rawId.toLowerCase() };
    } else {
      const variants = getPhoneVariants(rawId);
      if (!variants) {
        return res.status(400).json({
          status: 'fail',
          message: 'Enter a valid email address or phone number',
        });
      }
      query = {
        $or: PHONE_FIELDS.map((field) => ({ [field]: { $in: variants } })),
      };
    }

    const user = await User.findOne(query).select('+password');

    // Same message for "no user" and "wrong password" so accounts can't be probed
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email/phone or password',
      });
    }

    // === ONLINE TRACKING LOGIC ===
    user.isOnline = true;
    user.lastSeen = new Date();
    user.lastActivity = new Date();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// export const login = async (req, res) => {
//     try {
//          const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Please provide email and password',
//       });
//     }
//      const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Incorrect email or password',
//       });
//   } 
//     // === ONLINE TRACKING LOGIC ===
//     user.isOnline = true;
//     user.lastSeen = new Date();
//     user.lastActivity = new Date();

//     // Save the updates (we modify the existing user document)
//     await user.save({ validateBeforeSave: false });

//     createSendToken(user, 200, res);
//     } catch (error) {
//            res.status(400).json({
//       status: 'fail',
//       message: error.message,
//     });
//    } 
// };



export const authLogin = async (req, res) => {
    try {
         const { email } = req.body;

    if (!email ) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your email ',
      });
    }
     const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
  } 
    // === ONLINE TRACKING LOGIC ===
    user.isOnline = true;
    user.lastSeen = new Date();
    user.lastActivity = new Date();

    // Save the updates (we modify the existing user document)
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
    } catch (error) {
      console.log(error)
           res.status(400).json({
      status: 'fail',
      message: error.message,
    });
   } 
};




// STEP 1 — POST /users/auth-login  { email }
export const requestAuthOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: 'fail', message: 'Please provide your email' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal whether the email is registered
      return res.status(200).json({ status: 'success', message: 'If that email exists, an OTP has been sent' });
    }

    const otp = generateOtp();
    user.authOtp = hashOtp(otp);
    user.authOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Your ECARS login code',
        html: `<p>Your one-time login code is:</p>
               <h2 style="letter-spacing:6px">${otp}</h2>
               <p>This code expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
      });
    } catch (mailErr) {
      user.authOtp = undefined;
      user.authOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Failed to send OTP email:', mailErr);
      return res.status(500).json({ status: 'fail', message: 'Failed to send OTP email, please try again' });
    }

    res.status(200).json({ status: 'success', message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// STEP 2 — POST /users/verify-auth-otp  { email, otp }
export const verifyAuthOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ status: 'fail', message: 'Please provide your email and the OTP' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+authOtp +authOtpExpires');

    if (!user || !user.authOtp || !user.authOtpExpires) {
      return res.status(401).json({ status: 'fail', message: 'Invalid or expired OTP' });
    }
    if (user.authOtpExpires < Date.now()) {
      user.authOtp = undefined;
      user.authOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ status: 'fail', message: 'OTP has expired, please request a new one' });
    }
    if (hashOtp(otp) !== user.authOtp) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect OTP' });
    }

    user.authOtp = undefined;
    user.authOtpExpires = undefined;
    user.isOnline = true;
    user.lastSeen = new Date();
    user.lastActivity = new Date();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'fail', message: error.message });
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
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // or for frontend: `https://yourapp.com/reset-password/${resetToken}`

    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      status: 'success',
      message: 'Reset link sent to email!',
    });
  } catch (err) {
    console.log(err)
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
// export const resetPassword = async (req, res) => {
//   const { password } = req.body;
//    if (!password || password.length < 6) {
//     return res.status(400).json({ status: false, message: "Password must be at least 6 characters" });
//   }

//         const saltRounds = 12;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
//   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
// console.log(user)
//   if (!user) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Token is invalid or has expired',
//     });
//   }

//   user.password = hashedPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // Log user in after reset
//   const token = signToken(user._id);

//   res.status(200).json({
//     status: 'success',
//     token,
//     message: 'Password reset successful',
//   });
// };



export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash token the same way as in forgot-password
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Optional: auto-login (many teams remove this)
    const jwtToken = signToken(user._id);

    return res.status(200).json({
      status: 'success',
      token: jwtToken,
      message: 'Password reset successful',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
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

    const user = await User.findById(req.user.id || req.user._id).select('+password');

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
    console.log(err)
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
    .select('firstName avatar serviceProviderInfo.businessName serviceProviderInfo.type serviceProviderInfo.state serviceProviderInfo.lga serviceProviderInfo.workshopPhotos serviceProviderInfo.rating phoneNumber')
    .sort('-serviceProviderInfo.verifiedAt');

    console.log(providers)
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
    const dealers = await User.find({ role: 'dealer' }).select('firstName lastName email phoneNumber state lga address avatar bio lastSeen createdAt isOnline dealerInfo');
    
    res.status(200).json({
      status: 'success',
      data: { dealers },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: 'Failed to fetch dealers' });
  }
};





export const getFeaturedServiceProvider = async (req, res) => {
  try {
    const featuredDealers = await User.find({
      role: 'service-provider',
      'serviceProviderInfo.isFeatured': true,
      'serviceProviderInfo.featuredUntil': { $gt: new Date() },
    }).select('firstName lastName email phoneNumber state lga address avatar bio serviceProviderInfo');

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





// Backend: Controllers (controllers/userController.js or adminController.js)
export const upgradeToCarPartSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id || req.user?.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    if (user.role !== 'user') {
      return res.status(400).json({ status: 'fail', message: 'You are already a specialized user' });
    }

    const { type, businessName, businessAddress, state, lga, phoneNumber, whatsappNumber, website, yearsOfExperience, specialties, shopPhotos } = req.body;

    user.role = 'carPart-seller';
    user.carPartSellerInfo = {
      type,
      businessName,
      businessAddress,
      state,
      lga,
      phoneNumber,
      whatsappNumber,
      website,
      yearsOfExperience,
      specialties,
      shopPhotos,
      verificationRequestedAt: new Date(),
    };

    await user.save();
    res.status(200).json({ status: 'success', message: 'Upgrade request submitted. Waiting for admin verification.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to upgrade' });
  }
};

export const getAllCarPartSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'carPart-seller' })
      .select('firstName lastName email phoneNumber carPartSellerInfo');
    res.json({ status: 'success', data: { sellers } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch car part sellers' });
  }
};

export const verifyCarPartSeller = async (req, res) => {
  try {
    const seller = await User.findByIdAndUpdate(
      req.params.id,
      { 'carPartSellerInfo.verified': true },
      { new: true }
    );
    if (!seller) return res.status(404).json({ status: 'fail', message: 'Seller not found' });
    res.json({ status: 'success', message: 'Car part seller verified' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to verify' });
  }
};

export const unverifyCarPartSeller = async (req, res) => {
  try {
    const seller = await User.findByIdAndUpdate(
      req.params.id,
      { 'carPartSellerInfo.verified': false },
      { new: true }
    );
    if (!seller) return res.status(404).json({ status: 'fail', message: 'Seller not found' });
    res.json({ status: 'success', message: 'Car part seller unverified' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to unverify' });
  }
};

// Search Car Part Sellers
export const searchCarPartSellers = async (req, res) => {
  try {
    const {
      search,
      state,
      lga,
      location,
      verified,
      isFeatured,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { role: 'carPart-seller' };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'carPartSellerInfo.businessName': { $regex: search, $options: 'i' } },
      ];
    }

    // These were being sent by the frontend but never read here, so
    // typing into State/LGA/Location had no effect on the results.
    if (state) {
      query['carPartSellerInfo.state'] = { $regex: `^${escapeRegex(state)}$`, $options: 'i' };
    }
    if (lga) {
      query['carPartSellerInfo.lga'] = { $regex: `^${escapeRegex(lga)}$`, $options: 'i' };
    }
    if (location) {
      // Free-text location field — partial match rather than exact,
      // since it's a looser "e.g. Iyana Ipaja, Lagos" style input.
      query['carPartSellerInfo.location'] = { $regex: escapeRegex(location), $options: 'i' };
    }

    // Booleans arrive over the wire as the strings "true"/"false".
    if (verified === 'true') query['carPartSellerInfo.verified'] = true;
    if (verified === 'false') query['carPartSellerInfo.verified'] = false;
    if (isFeatured === 'true') query['carPartSellerInfo.isFeatured'] = true;
    if (isFeatured === 'false') query['carPartSellerInfo.isFeatured'] = false;

    const skip = (Number(page) - 1) * Number(limit);

    const sellers = await User.find(query)
      .select('firstName lastName email phoneNumber carPartSellerInfo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: sellers.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: { sellers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to search car part sellers' });
  }
};

// Escapes regex special characters in user input so search terms like
// "A.C." or "Parts (Used)" don't break the regex or match unintended text.
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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


export const toggleLike = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.id || req.user._id;

    const seller = await User.findById(id)
    if(!seller ){
      return res.status(404).json({message: "car seller is not found"})
    }

    const alreadyLiked = seller.likes.includes(userId);

    if(alreadyLiked) {
      seller.likes = seller.likes.filter((uid) => uid.toString !== userId)
    } else {
      seller.likes.push(userId)
    }

    await seller.save()
    res.status(200).json({
           success: true,
      message: alreadyLiked ? 'Unliked' : 'Liked',
      likesCount: seller.likes.length,
      isLiked: !alreadyLiked,
    })
  } catch (error) {
        console.error('Toggle like error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}



export const shareProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await User.findByIdAndUpdate(
      id,
      { $inc: { shares: 1 } },
      { new: true }
    ).select('shares');

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Shared successfully',
      shares: provider.shares,
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const incrementProviderView = async (req, res) => {
  try {
    const { id } = req.params; // provider ID

    const provider = await User.findById(id);
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }



    provider.views = (provider.views || 0) + 1;
    await provider.save({ validateBeforeSave: false }); // skip full validation for speed

    res.status(200).json({
      success: true,
      message: 'View counted',
      views: provider.views,
    });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};










export const getPublicSellers = async (req, res) => {
  try {
    const { dealerLimit = 8, privateLimit = 8 } = req.query;

    const baseLookup = [
      {
        $lookup: {
          from: 'carlistings',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$postedBy', '$$userId'] }, { $eq: ['$status', 'active'] }] } } },
          ],
          as: 'carListings',
        },
      },
      { $addFields: { carListingsCount: { $size: '$carListings' } } },
      { $match: { blacklisted: { $ne: true }, isActive: true } },
    ];

    const publicProjection = {
      firstName: 1,
      lastName: 1,
      avatar: 1,
      slug: 1,
      state: 1,
      lga: 1,
      role: 1,
      carListingsCount: 1,
      'dealerInfo.businessName': 1,
      'dealerInfo.state': 1,
      'dealerInfo.lga': 1,
      'dealerInfo.verified': 1,
      'dealerInfo.isFeatured': 1,
    };

    const [dealers, privateSellers] = await Promise.all([
      User.aggregate([
        { $match: { role: 'dealer' } },
        ...baseLookup,
        { $project: publicProjection },
        { $sort: { 'dealerInfo.isFeatured': -1, carListingsCount: -1 } },
        { $limit: Number(dealerLimit) },
      ]),
      User.aggregate([
        { $match: { role: { $ne: 'dealer' } } },
        ...baseLookup,
        { $match: { carListingsCount: { $gt: 0 } } },
        { $project: publicProjection },
        { $sort: { carListingsCount: -1 } },
        { $limit: Number(privateLimit) },
      ]),
    ]);

    res.status(200).json({
      status: 'success',
      data: { dealers, privateSellers },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch sellers', error: err.message });
  }
};














