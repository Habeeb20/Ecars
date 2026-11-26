// models/Sale.js
import mongoose from 'mongoose';
import Counter from './Counter.js';

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
      name:     { type: String, trim: true },
      email:    { type: String, trim: true, lowercase: true },
      phone:    { type: String, trim: true },
      address:  { type: String, trim: true },
      state:    { type: String, trim: true },
      lga:      { type: String, trim: true },
      idType:   { type: String, enum: ['nin', 'bvn', 'drivers_license', 'passport', 'other'], default: 'other' },
      idNumber: { type: String, trim: true },
      notes:    { type: String, trim: true },
    },

    // Financials
    // salePrice is the FINAL agreed price (after any discount). `discount` is
    // recorded for reporting only and is not subtracted again anywhere below.
    salePrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, min: 0, select: false },  // copied from listing at time of sale
    discount:  { type: Number, default: 0, min: 0 },     // absolute amount discounted
    profit:    { type: Number, select: false },          // salePrice - costPrice (computed on save)

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
    amountPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, default: 0, min: 0 },

    // Snapshot of car details at time of sale (denormalised for reporting)
    carSnapshot: {
      title:       String,
      make:        String,
      model:       String,
      year:        Number,
      color:       String,
      vin:         String,
      stockNumber: String,
      condition:   String,
      mileage:     Number,
    },

    saleDate: { type: Date, default: Date.now },
    notes:    { type: String, trim: true },

    // Unique across ALL dealers; assigned once on creation (see hook below)
    receiptNumber: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// ── Hook 1: payment + profit maths ─────────────────────────────────────────
saleSchema.pre('save', function () {
  // A new sale marked "paid" with no amount entered means paid in full
  if (this.isNew && this.paymentStatus === 'paid' && !this.amountPaid) {
    this.amountPaid = this.salePrice;
  }

  this.balanceDue = Math.max(0, this.salePrice - (this.amountPaid || 0));

  // costPrice is `select: false`, so it's only defined when it was loaded or
  // set on this document; otherwise the stored profit is left untouched.
  if (this.costPrice != null) {
    this.profit = this.salePrice - this.costPrice;
  }
});

// ── Hook 2: receipt number ─────────────────────────────────────────────────
// Assigned exactly once, from an atomic platform-wide counter, so two dealers
// (or two simultaneous sales) can never be given the same number.
saleSchema.pre('save', async function () {
  if (!this.isNew || this.receiptNumber) return;

  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { _id: `receipt-${year}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.receiptNumber = `RCP-${year}-${String(counter.seq).padStart(5, '0')}`;
});

// ── Indexes ────────────────────────────────────────────────────────────────
// No separate receiptNumber index: `unique: true` above already creates it.
saleSchema.index({ dealer: 1, saleDate: -1 });
saleSchema.index({ buyer: 1 });
saleSchema.index({ 'customerInfo.phone': 1 });
saleSchema.index({ 'customerInfo.email': 1 });

export default mongoose.model('Sale', saleSchema);