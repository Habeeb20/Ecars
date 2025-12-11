// routes/blogRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from '../controllers/blogController.js';


const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes (Superadmin only)
router.use(protect);
router.use(restrictTo('superadmin'));

router.post('/', createBlog);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;