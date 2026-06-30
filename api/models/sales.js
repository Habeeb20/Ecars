// models/Sale.js
import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    // The car that was sold
    carListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarListing',
      required: true,
    },

    // The dealer who made the sale
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // The buyer (may or may not be a registered user)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Walk-in / non-registered buyer info
    customerInfo: {
      name:        { type: String, trim: true },
      email:       { type: String, trim: true, lowercase: true },
      phone:       { type: String, trim: true },
      address:     { type: String, trim: true },
      state:       { type: String, trim: true },
      lga:         { type: String, trim: true },
      idType:      { type: String, enum: ['nin', 'bvn', 'drivers_license', 'passport', 'other'], default: 'other' },
      idNumber:    { type: String, trim: true },
      notes:       { type: String, trim: true },
    },

    // Financials
    salePrice:     { type: Number, required: true },
    costPrice:     { type: Number, select: false }, // copied from listing at time of sale
    discount:      { type: Number, default: 0 },    // absolute amount discounted
    profit:        { type: Number, select: false },  // salePrice - costPrice (computed on save)

    // Payment
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'pos', 'cheque', 'installment', 'other'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'part_payment', 'pending'],
      default: 'paid',
    },
    amountPaid:    { type: Number, default: 0 },
    balanceDue:    { type: Number, default: 0 },

    // Snapshot of car details at time of sale (denormalised for reporting)
    carSnapshot: {
      title:        String,
      make:         String,
      model:        String,
      year:         Number,
      color:        String,
      vin:          String,
      stockNumber:  String,
      condition:    String,
      mileage:      Number,
    },

    saleDate:     { type: Date, default: Date.now },
    notes:        { type: String, trim: true },
    receiptNumber:{ type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// Compute profit on every save
saleSchema.pre('save', function () {
  if (this.costPrice != null) {
    this.profit = this.salePrice - this.costPrice;
  }
  this.balanceDue = Math.max(0, this.salePrice - (this.amountPaid || 0));
  
});

// Auto receipt number
saleSchema.pre('save', async function () {
  if (!this.isNew || this.receiptNumber) ;
  const count = await this.constructor.countDocuments({ dealer: this.dealer });
  const year  = new Date().getFullYear();
  this.receiptNumber = `RCP-${year}-${String(count + 1).padStart(5, '0')}`;
  
});

saleSchema.index({ dealer: 1, saleDate: -1 });
saleSchema.index({ buyer: 1 });
saleSchema.index({ 'customerInfo.phone': 1 });
saleSchema.index({ 'customerInfo.email': 1 });
saleSchema.index({ receiptNumber: 1 });

export default mongoose.model('Sale', saleSchema);