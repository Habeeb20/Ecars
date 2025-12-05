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
    enum: ['user', 'dealer', 'superadmin'],
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
}, { timestamps: true });

// Hash password only when modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate unique 4-digit number
userSchema.pre('save', async function (next) {
  if (this.uniqueNumber) return next();

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
  next();
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