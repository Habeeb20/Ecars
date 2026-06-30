// // models/carListing.js
// import mongoose from 'mongoose';

// const carListingSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Car title is required'],
//     trim: true,
//   },
//   price: {
//     type: Number,
//     required: [true, 'Price is required'],
//     min: [10000, 'Price too low'],
//   },
//   make: {
//     type: String,
//     required: [true, 'Car make is required (e.g. Toyota)'],
//   },
//   model: {
//     type: String,
//     required: [true, 'Car model is required (e.g. Camry)'],
//   },
//   year: {
//     type: Number,
//     required: [true, 'Year is required'],
//     min: [1980],
//     max: [new Date().getFullYear() + 1],
//   },
//   mileage: {
//     type: Number,
//     required: [true, 'Mileage is required'],
//   },
//   transmission: {
//     type: String,
//     enum: ['automatic', 'manual'],
//     required: [true, 'Transmission is required'],
//   },
//   fuelType: {
//     type: String,
//     enum: ['petrol', 'diesel', 'electric', 'hybrid'],
//     required: [true, 'Fuel type is required'],
//   },
//   bodyType: {
//     type: String,
//     // enum: ['sedan', 'suv', 'hatchback', 'truck', 'van', 'coupe', 'convertible'],
//     required: true,
//   },
//   condition: {
//     type: String,
//     enum: ['brand new', 'foreign used', 'nigerian used', 'foreignUsed','nigerianUsed', 'brandNew' ],
//     required: true,
//   },
//   color: {
//     type: String,
//     required: true,
//   },
//   vin: { type: String, trim: true }, // optional
//   location: {
//     state: { type: String, required: true },
//     lga: { type: String, required: true },
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required'],
//     minlength: [50, 'Description too short'],
//   },

//   // Cloudinary URLs (frontend uploads → sends strings)
//   images: [{
//     type: String,
//     required: [true, 'At least one image is required'],
//   }],
//     phoneNumber: { type: String, required: false },

//   // At least 4 images, max 20
//   features: [String], // e.g. ["AC", "Leather seats", "Reverse camera"]

//   // Relations
//   postedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true,
//   },

//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'sold', 'pending', 'rejected'],
//     default: 'active',
//   },
//   isFeatured: { type: Boolean, default: false },
//   views: { type: Number, default: 0 },


//     views: {
//     type: Number,
//     default: 0,
//   },

//   likes: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     likedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],

//   likeCount: {
//     type: Number,
//     default: 0,
//   },

//   // Optional: track shares (if you want analytics)
//   shareCount: {
//     type: Number,
//     default: 0,
//   },

// featuredUntil: Date,
// }, { timestamps: true });
// carListingSchema.index({ 'likes.user': 1 });
// // Index for search
// carListingSchema.index({ make: 'text', model: 'text', title: 'text' });

// export default mongoose.model('CarListing', carListingSchema);






























// models/carListing.js
import mongoose from 'mongoose';

const carListingSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Car title is required'], trim: true },
  price: { type: Number, required: [true, 'Price is required'], min: [10000, 'Price too low'] },
  make: { type: String, required: [true, 'Car make is required (e.g. Toyota)'] },
  model: { type: String, required: [true, 'Car model is required (e.g. Camry)'] },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1980],
    max: [new Date().getFullYear() + 1],
  },
  mileage: { type: Number, required: [true, 'Mileage is required'] },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    required: [true, 'Transmission is required'],
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Fuel type is required'],
  },
  bodyType: { type: String, required: true },
  condition: {
    type: String,
    enum: ['brand new', 'foreign used', 'nigerian used', 'foreignUsed', 'nigerianUsed', 'brandNew'],
    required: true,
  },
  color: { type: String, required: true },
  vin: { type: String, trim: true },
  location: {
    state: { type: String, required: true },
    lga: { type: String, required: true },
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description too short'],
  },

  images: [{ type: String, required: [true, 'At least one image is required'] }],
  phoneNumber: { type: String, required: false },
  features: [String],

  // === Inventory / stock specific fields ===
  stockNumber: { type: String, trim: true, index: true }, // dealer-facing internal SKU, auto-generated
  quantity: { type: Number, default: 1, min: 0 }, // useful for identical-unit batches (rare but supported)
  costPrice: { type: Number, select: false }, // private acquisition cost, only dealer/admin can see (margin calc)
  dateAcquired: { type: Date, default: Date.now },
  daysInStock: { type: Number, default: 0 }, // recalculated on read, see virtual below
  soldAt: { type: Date },
  soldPrice: { type: Number },
  warehouseLocation: { type: String, trim: true }, // e.g. "Lot A - Bay 3"

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: {
    type: String,
    enum: ['active', 'sold', 'pending', 'rejected', 'draft', 'reserved'],
    default: 'active',
  },
  isFeatured: { type: Boolean, default: false },

  views: { type: Number, default: 0 },

  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt: { type: Date, default: Date.now },
  }],
  likeCount: { type: Number, default: 0 },
  shareCount: { type: Number, default: 0 },

  featuredUntil: Date,
}, { timestamps: true });

carListingSchema.index({ 'likes.user': 1 });
carListingSchema.index({ make: 'text', model: 'text', title: 'text', stockNumber: 'text' });
carListingSchema.index({ postedBy: 1, status: 1 });

// Virtual: how many days the unit has been sitting in stock
carListingSchema.virtual('ageInDays').get(function () {
  const end = this.status === 'sold' && this.soldAt ? this.soldAt : new Date();
  const start = this.dateAcquired || this.createdAt || new Date();
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
});

carListingSchema.set('toJSON', { virtuals: true });
carListingSchema.set('toObject', { virtuals: true });

// Auto-generate a stock number like DLR-2026-0001 (per dealer) the first time it's saved
carListingSchema.pre('save', async function (next) {
  if (!this.isNew || this.stockNumber) ;
  const year = new Date().getFullYear();
  const count = await this.constructor.countDocuments({ postedBy: this.postedBy });
  this.stockNumber = `STK-${year}-${String(count + 1).padStart(4, '0')}`;
  
});

export default mongoose.model('CarListing', carListingSchema);






