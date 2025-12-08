// import jwt from "jsonwebtoken"
// import crypto from "crypto"
// import User from "../models/user.js";
// import dotenv from "dotenv"



// import nodemailer from 'nodemailer';
// export const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '30d',
//   });
// };


// dotenv.config()
// export const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   // Remove password from output
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };



// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USERNAME,   // ← Must be this exact name
//     pass: process.env.EMAIL_PASSWORD,   // ← Must be this exact name
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });


// export const sendPasswordResetEmail = async (email, resetURL) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   await transporter.sendMail({
//     from: '"ECARS" <no-reply@ecars.com>',
//     to: email,
//     subject: 'Password Reset Request (valid 10 mins)',
//     html: `
//       <h2>Password Reset</h2>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetURL}" style="padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
//       <p>If you didn't request this, ignore this email.</p>
//     `,
//   });
// };






// export const verifyEmail = async (req, res) => {
//   try {
//     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await User.findOne({
//       emailVerificationToken: hashedToken,
//       emailVerificationExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Token invalid or expired',
//       });
//     }

//     user.emailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: 'success',
//       message: 'Email verified successfully!',
//     });
//   } catch (err) {
//     res.status(500).json({ status: 'error', message: 'Verification failed' });
//   }
// };



// // Create transporter (use your email provider)
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,           // e.g., smtp.gmail.com
//   port: process.env.EMAIL_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,     // your email
//     pass: process.env.EMAIL_PASS,     // your app password (not login password!)
//   },
// });

// // Optional: Verify connection on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.log('Email transporter error:', error);
//   } else {
//     console.log('Email transporter ready');
//   }
// });



// export const sendVerificationEmail = async (req, res) => {
//     const user = req.user;
//   try {
//     const user = req.user;

//     if (user.emailVerified) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Email is already verified',
//       });
//     }

//     // Generate secure token
//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(verificationToken)
//       .digest('hex');

//     // Save to user
//     user.emailVerificationToken = hashedToken;
//     user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//     await user.save({ validateBeforeSave: false });

//     // Verification URL
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     // Beautiful HTML Email
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px;">
//         <div style="text-align: center; padding: 20px;">
//           <h1 style="color: #4f46e5;">ECARS</h1>
//           <p style="font-size: 18px; color: #333;">Welcome to ECARS!</p>
//         </div>

//         <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
//           <h2 style="color: #1f2937;">Verify Your Email Address</h2>
//           <p style="color: #6b7280; font-size: 16px;">
//             You're almost there! Click the button below to verify your email and start listing cars.
//           </p>

//           <a href="${verificationUrl}" 
//              style="display: inline-block; margin: 30px 0; padding: 16px 32px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px;">
//             Verify Email Now
//           </a>

//           <p style="color: #9ca3af; font-size: 14px;">
//             Or copy and paste this link:<br/>
//             <span style="word-break: break-all; color: #6366f1;">${verificationUrl}</span>
//           </p>

//           <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

//           <p style="color: #9ca3af; font-size: 14px;">
//             This link expires in <strong>24 hours</strong>.<br/>
//             If you didn't create an account, ignore this email.
//           </p>
//         </div>

//         <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
//           © 2025 ECARS • All rights reserved
//         </div>
//       </div>
//     `;

//     // Send email
//     await transporter.sendMail({
//       from:'"ECARS" <no-reply@ecars.com>',
//       to: user.email,
//       subject: 'Verify Your ECARS Account – Action Required',
//       html,
//     });

//     console.log('Verification email sent to:', user.email);
//     console.log('Link:', verificationUrl);

//     res.status(200).json({
//       status: 'success',
//       message: 'Verification email sent! Check your inbox and spam folder.',
//     });
//   } catch (err) {
//     console.error('Email sending failed:', err);

//     // Clear token on failure
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to send verification email. Please try again later.',
//     });
//   }
// };




// utils/authUtils.js or keep in authController.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

// JWT Functions
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// SINGLE NODemailer Transporter (created once)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,        // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,   // essentialnews65@gmail.com
    pass: process.env.EMAIL_PASSWORD, // gxdxgtzswmuhxtzr
  },
  tls: { rejectUnauthorized: false },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error.message);
  } else {
    console.log('Email transporter ready!');
  }
});

// Password Reset Email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: '"ECARS" <no-reply@ecars.com>',
    to: email,
    subject: 'Password Reset Request (valid 10 mins)',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; border-radius: 10px;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetURL}" 
           style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #666;">This link expires in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send Verification Email (FIXED & CLEAN)
export const sendVerificationEmail = async (req, res) => {
  try {
    const user = req.user;

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is already verified',
      });
    }

    // Generate token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">ECARS</h1>
          <p style="margin: 10px 0 0; font-size: 18px;">Welcome to the future of car marketplace</p>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #1e293b;">Verify Your Email Address</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            You're one step away from listing and buying cars on ECARS!
          </p>
          <a href="${verificationUrl}" 
             style="display: inline-block; margin: 30px 0; padding: 16px 40px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px;">
            Verify Email Now
          </a>
          <p style="color: #94a3b8; font-size: 14px;">
            Or copy this link:<br>
            <strong style="word-break: break-all; color: #6366f1;">${verificationUrl}</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 13px;">
            This link expires in <strong>24 hours</strong>.<br>
            If you didn't sign up, please ignore this email.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          © 2025 ECARS • All rights reserved
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"ECARS" <no-reply@ecars.com>',
      to: user.email,
      subject: 'Verify Your ECARS Account – Action Required',
      html,
    });

    console.log('Verification email sent to:', user.email);
    console.log('Link:', verificationUrl);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent! Check your inbox.',
    });

  } catch (err) {
    console.error('Email failed:', err.message);

    // Clean up on error
    if (user) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to send email. Try again later.',
    });
  }
};

// Verify Email Token
export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token invalid or expired',
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Verification failed' });
  }
};