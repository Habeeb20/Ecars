// // schemas/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

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
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6,
//     select: false, 
//   },
//   role: {
//     type: String,
//     enum: ['user', 'dealer', 'superadmin'],
//     default: 'user',
//   },
//   uniqueNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

// });

// // Generate 4-digit unique number before saving
// userSchema.pre('save', async function (next) {
//   if (this.uniqueNumber) return next();

//   let isUnique = false;
//   let attempts = 0;

//   while (!isUnique && attempts < 10) {
//     const num = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
//     const exists = await this.constructor.findOne({ uniqueNumber: num });
//     if (!exists) {
//       this.uniqueNumber = num;
//       isUnique = true;
//     }
//     attempts++;
//   }

//   if (!isUnique) {
//     return next(new Error('Could not generate unique 4-digit number'));
//   }


// });

// // Compare password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };


// // In your User.js schema, add this method
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

const userSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'dealer','service-provider', 'superadmin'],
    default: 'user',
  },
  uniqueNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
    emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  // === NEW OPTIONAL FIELDS ===
  phoneNumber: {
    type: String,
    trim: true,
    sparse: true, // allows multiple nulls
    match: [/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'],
  },
  state: {
    type: String,
    trim: true,
  },
  lga: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: '', // we'll store Cloudinary URL here
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 200,
  },

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
    validate: {
      validator: function (v) { return this.role !== 'dealer' || !!v; },
      message: 'Business registration number is required',
    },
  },
  businessAddress: {
    type: String,
    validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'Business address required' }
  },
  state: {
    type: String,
    validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'State required' }
  },
  lga: {
    type: String,
    validate: { validator: function (v) { return this.role !== 'dealer' || !!v; }, message: 'LGA required' }
  },
  // ... rest optional
  verified: { type: Boolean, default: false },
   isFeatured: { type: Boolean, default: false },
  featuredUntil: Date,
},

// models/user.js — add inside userSchema

serviceProviderInfo: {
  type: {
    type: String,
    enum: ['mechanic', 'panel_beater', 'rewire', 'auto_electrician', 'vulcanizer', 'car_wash', 'detailer', 'upholsterer', 'ac_specialist', 'other'],
    required: [function() { return this.role === 'service-provider'; }, 'Service type is required'],
  },
  businessName: {
    type: String,
    trim: true,
    required: [function() { return this.role === 'service-provider'; }, 'Business name required'],
  },
  businessAddress: String,
  state: {
    type: String,
    required: [function() { return this.role === 'service-provider'; }, 'State required'],
  },
  lga: {
    type: String,
    required: [function() { return this.role === 'service-provider'; }, 'LGA required'],
  },
  phoneNumber: String,
  whatsappNumber: String,
  yearsOfExperience: Number,
  servicesOffered: [String], // e.g. ["Engine repair", "AC fix", "Painting"]
  workshopPhotos: [String], // Cloudinary URLs
  verified: { type: Boolean, default: false }, // admin approval
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalJobs: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  verificationRequestedAt: Date,
  isFeatured: { type: Boolean, default: false },
  featuredUntil: Date,
}
}, { timestamps: true });

// Hash password only when modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 12);
 
});

// Generate unique 4-digit number
userSchema.pre('save', async function (next) {
  if (this.uniqueNumber) return ;

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

  if (!isUnique) return next(new Error('Failed to generate unique number'));

});

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













































