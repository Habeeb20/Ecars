// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  slug: {
    type: String,

    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  excerpt: {
    type: String,
    maxlength: 300,
  },
  featuredImage: {
    type: String, // Cloudinary URL sent from frontend
  
  },
  additionalImages: [{
    type: String, // Array of Cloudinary URLs
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['News', 'Tips', 'Reviews', 'Guides', 'Industry', 'Other'],
    default: 'Other',
  },
  tags: [{
    type: String,
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  views: {
    type: Number,
    default: 0,
  },
  readTime: {
    type: Number,
    default: 5,
  },
}, { timestamps: true });

// Auto-generate slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

});

export default mongoose.model('Blog', blogSchema);