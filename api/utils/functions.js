import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/user.js";

import nodemailer from 'nodemailer';
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};





export const sendPasswordResetEmail = async (email, resetURL) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"ECARS" <no-reply@ecars.com>',
    to: email,
    subject: 'Password Reset Request (valid 10 mins)',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetURL}" style="padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};





// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.emailVerified) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already verified',
      });
    }

    // Generate token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email - Ecars',
      message: `Click this link to verify your email: ${verificationUrl}\nLink expires in 24 hours.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent!',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Email could not be sent' });
  }
};

// Verify email
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