// controllers/blogController.js
import Blog from "../models/blog.js"
import User from "../models/user.js";


// Create Blog (Superadmin only)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, image, additionalImages, category, tags, isPublished } = req.body;

    if (!req.user.role === 'superadmin') {
      return res.status(403).json({ status: 'error', message: 'Superadmin access required' });
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      image,
      additionalImages,
      category,
      tags,
      isPublished : true,
      author: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: { blog },
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Get All Blogs (Public)
export const getAllBlogs = async (req, res) => {
  try {
    // const { page = 1, limit = 10, category, tag } = req.query;
    // const query = { isPublished: true };

    // if (category) query.category = category;
    // if (tag) query.tags = tag;

    const blogs = await Blog.find()
      .populate('author', 'firstName lastName avatar')
      .sort({ publishedAt: -1 })
   
  
 
    res.status(200).json({
      status: 'success',
      results: blogs.length,
    //   totalPages: Math.ceil(total / limit),
      data: { blogs },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Get Single Blog (Public)
export const getBlogById = async (req, res) => {
  console.log (req.params.id)
  try {
    const blog = await Blog.findOne({ _id: req.params.id })
      .populate('author', 'firstName lastName avatar');

    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      status: 'success',
      data: { blog },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Update Blog (Superadmin only)
export const updateBlog = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ status: 'error', message: 'Superadmin access required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { blog: updatedBlog },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// Delete Blog (Superadmin only)
export const deleteBlog = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ status: 'error', message: 'Superadmin access required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    await blog.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};