



// // schemas/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import { generateUniqueSlug } from '../utils/slugify.js';
// import { AGENT_SIGNUP_POINTS } from '../config/agent.js';
// import crypto from "crypto"
// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, 'First name is required'],
//     trim: true,
//   },
//   lastName: {
//     type: String,
//     required: [true, 'Last name is required'],
//     trim: true,
//   },
//  email: {
//   type: String,

//   lowercase: true,
//   trim: true,
//   match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
//   set: (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
// },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6,
//     select: false,
//   },
//   role: {
//     type: String,
//     enum: ['user', 'dealer', 'agent', 'service-provider', 'carPart-seller', 'superadmin'],
//     default: 'user',
//   },
//   uniqueNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },

//   loyaltyPoints: { type: Number, default: 0, min: 0 },
// referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true }, // agents only
// signedUpByAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
//   // add to userSchema, alongside the other auth fields
// authOtp: { type: String, select: false },
// authOtpExpires: { type: Date, select: false },

//   // === Public profile slug used for dynamic dealer/provider routes ===
//   // e.g. "Habeeb Dealers" -> "habeebdealers" -> /habeebdealers
//   slug: {
//     type: String,
//     unique: true,
//     sparse: true,
//     index: true,
//   },

//   // schemas/User.js (add to existing schema)
// videoCredits: { type: Number, default: 0 },       // remaining posts allowed
// totalVideoCreditsPurchased: { type: Number, default: 0 }, // lifetime, for stats

//   isActive: { type: Boolean, default: true },
//   emailVerified: { type: Boolean, default: false },
//   emailVerificationToken: String,
//   emailVerificationExpires: Date,
//   passwordResetToken: String,
//   passwordResetExpires: Date,
//   verificationToken: String,
//   verificationTokenExpiresAt: Date,

//   phoneNumber: {
//     type: String,
//     trim: true,
//     sparse: true,
//     match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'],
//   },
//   state: { type: String, trim: true },
//   lga: { type: String, trim: true },
//   address: { type: String, trim: true },
//   avatar: { type: String, default: '' },
//   bio: { type: String, trim: true, maxlength: 200 },

//   isAvailable: { type: Boolean, default: false },
//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: null },
//   createdAt: { type: Date, default: Date.now },

//   views: { type: Number, default: 0 },
//   shares: { type: Number, default: 0 },
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   averageRating: { type: Number, default: 0, min: 0, max: 5 },

//   blacklisted: { type: Boolean, default: false },
//   blacklistedAt: { type: Date, default: null },
//   blacklistedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//   blacklistedReason: { type: String, default: '' },

//   dealerInfo: {
//     businessName: {
//       type: String,
//       trim: true,
//       validate: {
//         validator: function (v) { return this.role !== 'dealer' || !!v; },
//         message: 'Business name is required',
//       },
//     },
//     businessRegistrationNumber: {
//       type: String,
//       trim: true,
//       unique: true,
//       sparse: true,
//       // validate: {
//       //   validator: function (v) { return this.role !== 'dealer' || !!v; },
//       //   message: 'Business registration number is required',
//       // },
//     },
//     businessAddress: {
//       type: String,
//       validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'Business address required' },
//     },
//     state: {
//       type: String,
//       validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'State required' },
//     },
//     lga: {
//       type: String,
//       validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'LGA required' },
//     },
//     verified: { type: Boolean, default: true },
//     isFeatured: { type: Boolean, default: false },
//     featuredUntil: Date,

//     // stock-related dealer settings
//     lowStockThreshold: { type: Number, default: 3 }, // alert when active listings <= this
//     totalStock: { type: Number, default: 0 },        // cached count, updated by inventory controller
//     totalSoldCount: { type: Number, default: 0 },
//   },

//   serviceProviderInfo: {
//     type: {
//       type: String,
//       enum: ['mechanic', 'panel_beater', 'rewire', 'auto_electrician', 'vulcanizer', 'car_wash', 'detailer', 'upholsterer', 'ac_specialist', 'other'],
//       required: [function () { return this.role === 'service-provider'; }, 'Service type is required'],
//     },
//     businessName: {
//       type: String,
//       trim: true,
//       required: [function () { return this.role === 'service-provider'; }, 'Business name required'],
//     },
//     businessAddress: String,
//     state: {
//       type: String,
//       required: [function () { return this.role === 'service-provider'; }, 'State required'],
//     },
//     verified: { type: Boolean, default: false },
//     lga: {
//       type: String,
//       required: [function () { return this.role === 'service-provider'; }, 'LGA required'],
//     },
//     phoneNumber: String,
//     whatsappNumber: String,
//     yearsOfExperience: Number,
//     servicesOffered: [String],
//     workshopPhotos: [String],
//     rating: { type: Number, default: 0, min: 0, max: 5 },
//     totalJobs: { type: Number, default: 0 },
//     available: { type: Boolean, default: true },
//     verificationRequestedAt: Date,
//     isFeatured: { type: Boolean, default: false },
//     featuredUntil: Date,
//   },

//   carPartSellerInfo: {
//     type: {
//       type: String,
//       enum: ['new-parts', 'used-parts', 'both', 'other', 'all'],
//       required: [function () { return this.role === 'carPart-seller'; }, 'Parts type is required'],
//     },
//     businessName: {
//       type: String,
//       trim: true,
//       required: [function () { return this.role === 'carPart-seller'; }, 'Business name is required'],
//     },
//     businessAddress: {
//       type: String,
//       required: [function () { return this.role === 'carPart-seller'; }, 'Business address is required'],
//     },
//     state: {
//       type: String,
//       required: [function () { return this.role === 'carPart-seller'; }, 'State is required'],
//     },
//     lga: {
//       type: String,
//       required: [function () { return this.role === 'carPart-seller'; }, 'LGA is required'],
//     },
//     phoneNumber: String,
//     whatsappNumber: String,
//     website: String,
//     verified: { type: Boolean, default: false },
//     isFeatured: { type: Boolean, default: false },
//     featuredUntil: Date,
//     yearsOfExperience: Number,
//     specialties: [String],
//     shopPhotos: [String],
//     rating: { type: Number, default: 0, min: 0, max: 5 },
//     totalSales: { type: Number, default: 0 },
//     available: { type: Boolean, default: true },
//     verificationRequestedAt: Date,
//   },
// }, { timestamps: true });

// // Hash password only when modifie


// // Hash password only when modified
// userSchema.pre('save', async function () {
//   if (!this.isModified('password') || !this.password) {
//     return;
//   }
//   this.password = await bcrypt.hash(this.password, 12);
// });

// // Generate unique 4-digit number
// userSchema.pre('save', async function () {
//   if (this.uniqueNumber) {
//     return;
//   }

//   let isUnique = false;
//   let attempts = 0;

//   while (!isUnique && attempts < 30) {
//     const num = Math.floor(1000 + Math.random() * 9000).toString();
//     const exists = await this.constructor.findOne({ uniqueNumber: num });
//     if (!exists) {
//       this.uniqueNumber = num;
//       isUnique = true;
//     }
//     attempts++;
//   }

//   if (!isUnique) {
//     throw new Error('Failed to generate unique number');
//   }
// });

// // Generate / refresh the public slug
// userSchema.pre('save', async function () {
//   const businessNameByRole = {
//     dealer: this.dealerInfo?.businessName,
//     'service-provider': this.serviceProviderInfo?.businessName,
//     'carPart-seller': this.carPartSellerInfo?.businessName,
//   };

//   const businessName = businessNameByRole[this.role];
//   if (!businessName) {
//     return;
//   }

//   const nameChanged =
//     this.isNew ||
//     this.isModified('dealerInfo.businessName') ||
//     this.isModified('serviceProviderInfo.businessName') ||
//     this.isModified('carPartSellerInfo.businessName');

//   if (!this.slug || nameChanged) {
//     this.slug = await generateUniqueSlug(this.constructor, businessName, this._id);
//   }
// });


// userSchema.pre('save', async function () {
//   if (this.role !== 'agent') return;
//   if (this.isNew && !this.loyaltyPoints) this.loyaltyPoints = AGENT_SIGNUP_POINTS;
//   if (!this.referralCode) {
//     for (let i = 0; i < 10; i++) {
//       const code = crypto.randomBytes(4).toString('hex').toUpperCase();
//       if (!(await this.constructor.exists({ referralCode: code }))) {
//         this.referralCode = code;
//         break;
//       }
//     }
//   }
// });
// // Password comparison
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Check if password was changed after token issued
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false;
// };

// export default mongoose.model('User', userSchema);














































// schemas/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateUniqueSlug } from '../utils/slugify.js';
import { AGENT_SIGNUP_POINTS } from '../config/agent.js';

// "", "   " and null all mean "not provided": the field is simply not stored.
// This keeps optional unique fields (email, phone) from colliding with each other.
const emptyToUndefined = (v) =>
  typeof v === 'string' && v.trim() !== '' ? v : undefined;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    // Optional. Uniqueness is enforced by the partial index declared below the schema.
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      set: emptyToUndefined,
    },

    // Optional. Uniqueness is enforced by the partial index declared below the schema.
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'],
      set: emptyToUndefined,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    passwordChangedAt: Date,

    role: {
      type: String,
      enum: ['user', 'dealer', 'agent', 'service-provider', 'carPart-seller', 'superadmin'],
      default: 'user',
    },
    uniqueNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    loyaltyPoints: { type: Number, default: 0, min: 0 },
    referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true }, // agents only
    signedUpByAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },

    // E-Auth (OTP) login
    authOtp: { type: String, select: false },
    authOtpExpires: { type: Date, select: false },

    // === Public profile slug used for dynamic dealer/provider routes ===
    // e.g. "Habeeb Dealers" -> "habeebdealers" -> /habeebdealers
    // (unique already creates the index, so no separate index: true)
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    videoCredits: { type: Number, default: 0 }, // remaining posts allowed
    totalVideoCreditsPurchased: { type: Number, default: 0 }, // lifetime, for stats

    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    state: { type: String, trim: true },
    lga: { type: String, trim: true },
    address: { type: String, trim: true },
    avatar: { type: String, default: '' },
    bio: { type: String, trim: true, maxlength: 200 },

    isAvailable: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },

    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    blacklisted: { type: Boolean, default: false },
    blacklistedAt: { type: Date, default: null },
    blacklistedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    blacklistedReason: { type: String, default: '' },

    dealerInfo: {
      businessName: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) { return this.role !== 'dealer' || !!v; },
          message: 'Business name is required',
        },
      },
      businessRegistrationNumber: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        set: emptyToUndefined,
      },
      businessAddress: {
        type: String,
        validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'Business address required' },
      },
      state: {
        type: String,
        validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'State required' },
      },
      lga: {
        type: String,
        validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'LGA required' },
      },
      verified: { type: Boolean, default: true },
      isFeatured: { type: Boolean, default: false },
      featuredUntil: Date,

      // stock-related dealer settings
      lowStockThreshold: { type: Number, default: 3 }, // alert when active listings <= this
      totalStock: { type: Number, default: 0 }, // cached count, updated by inventory controller
      totalSoldCount: { type: Number, default: 0 },
    },

    serviceProviderInfo: {
      type: {
        type: String,
        enum: ['mechanic', 'panel_beater', 'rewire', 'auto_electrician', 'vulcanizer', 'car_wash', 'detailer', 'upholsterer', 'ac_specialist', 'other'],
        required: [function () { return this.role === 'service-provider'; }, 'Service type is required'],
      },
      businessName: {
        type: String,
        trim: true,
        required: [function () { return this.role === 'service-provider'; }, 'Business name required'],
      },
      businessAddress: String,
      state: {
        type: String,
        required: [function () { return this.role === 'service-provider'; }, 'State required'],
      },
      verified: { type: Boolean, default: false },
      lga: {
        type: String,
        required: [function () { return this.role === 'service-provider'; }, 'LGA required'],
      },
      phoneNumber: String,
      whatsappNumber: String,
      yearsOfExperience: Number,
      servicesOffered: [String],
      workshopPhotos: [String],
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalJobs: { type: Number, default: 0 },
      available: { type: Boolean, default: true },
      verificationRequestedAt: Date,
      isFeatured: { type: Boolean, default: false },
      featuredUntil: Date,
    },

    carPartSellerInfo: {
      type: {
        type: String,
        enum: ['new-parts', 'used-parts', 'both', 'other', 'all'],
        required: [function () { return this.role === 'carPart-seller'; }, 'Parts type is required'],
      },
      businessName: {
        type: String,
        trim: true,
        required: [function () { return this.role === 'carPart-seller'; }, 'Business name is required'],
      },
      businessAddress: {
        type: String,
        required: [function () { return this.role === 'carPart-seller'; }, 'Business address is required'],
      },
      state: {
        type: String,
        required: [function () { return this.role === 'carPart-seller'; }, 'State is required'],
      },
      lga: {
        type: String,
        required: [function () { return this.role === 'carPart-seller'; }, 'LGA is required'],
      },
      phoneNumber: String,
      whatsappNumber: String,
      website: String,
      verified: { type: Boolean, default: false },
      isFeatured: { type: Boolean, default: false },
      featuredUntil: Date,
      yearsOfExperience: Number,
      specialties: [String],
      shopPhotos: [String],
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalSales: { type: Number, default: 0 },
      available: { type: Boolean, default: true },
      verificationRequestedAt: Date,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

/* ───────────────────────── indexes ─────────────────────────
 * Partial indexes only cover documents where the field is a real string,
 * so any number of users can have no email / no phone number.
 * If you previously had an "email_1" index, drop it once (db.users.dropIndex("email_1"))
 * and clear stored null/"" values so Mongoose can build these.
 */
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);
userSchema.index(
  { phoneNumber: 1 },
  { unique: true, partialFilterExpression: { phoneNumber: { $type: 'string' } } }
);

/* ───────────────────────── hooks ───────────────────────── */

// Hash password only when modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Generate unique 4-digit number
userSchema.pre('save', async function () {
  if (this.uniqueNumber) {
    return;
  }

  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 30) {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    const exists = await this.constructor.findOne({ uniqueNumber: num });
    if (!exists) {
      this.uniqueNumber = num;
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique number');
  }
});

// Generate / refresh the public slug
userSchema.pre('save', async function () {
  const businessNameByRole = {
    dealer: this.dealerInfo?.businessName,
    'service-provider': this.serviceProviderInfo?.businessName,
    'carPart-seller': this.carPartSellerInfo?.businessName,
  };

  const businessName = businessNameByRole[this.role];
  if (!businessName) {
    return;
  }

  const nameChanged =
    this.isNew ||
    this.isModified('dealerInfo.businessName') ||
    this.isModified('serviceProviderInfo.businessName') ||
    this.isModified('carPartSellerInfo.businessName');

  if (!this.slug || nameChanged) {
    this.slug = await generateUniqueSlug(this.constructor, businessName, this._id);
  }
});

// Agents: signup points + referral code
userSchema.pre('save', async function () {
  if (this.role !== 'agent') return;
  if (this.isNew && !this.loyaltyPoints) this.loyaltyPoints = AGENT_SIGNUP_POINTS;
  if (!this.referralCode) {
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      if (!(await this.constructor.exists({ referralCode: code }))) {
        this.referralCode = code;
        break;
      }
    }
  }
});

/* ───────────────────────── methods ───────────────────────── */

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after token issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export default mongoose.model('User', userSchema);





