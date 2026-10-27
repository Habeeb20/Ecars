// // routes/blogRoutes.js
// import express from 'express';
// import { protect, restrictTo } from '../middleware/verifyToken.js';
// import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from '../controllers/blogController.js';


// const router = express.Router();

// // Public routes
// router.get('/', getAllBlogs);
// router.get('/:id', getBlogById);

// // Protected routes (Superadmin only)
// router.use(protect);
// router.use(restrictTo('superadmin'));

// router.post('/', createBlog);
// router.put('/:id', updateBlog);
// router.delete('/:id', deleteBlog);

// export default router;



// routes/blogRoutes.js  →  app.use('/api/blogs', blogRoutes)
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from '../controllers/blogController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog posts — public reading, superadmin management (mounted at /api/blogs)
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string, example: 5 things to check before buying a used car }
 *         content: { type: string }
 *         excerpt: { type: string }
 *         image: { type: string, format: uri }
 *         additionalImages: { type: array, items: { type: string, format: uri } }
 *         category: { type: string }
 *         tags: { type: array, items: { type: string } }
 *         isPublished: { type: boolean }
 *         views: { type: integer }
 *         publishedAt: { type: string, format: date-time }
 *         author:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             firstName: { type: string }
 *             lastName: { type: string }
 *             avatar: { type: string }
 *     BlogInput:
 *       type: object
 *       required: [title, content]
 *       properties:
 *         title: { type: string }
 *         content: { type: string }
 *         excerpt: { type: string }
 *         image: { type: string, format: uri }
 *         additionalImages: { type: array, items: { type: string, format: uri } }
 *         category: { type: string }
 *         tags: { type: array, items: { type: string } }
 *         isPublished: { type: boolean }
 *     BlogError:
 *       type: object
 *       properties:
 *         status: { type: string, example: error }
 *         message: { type: string }
 */

// Public routes
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: List all blogs (public)
 *     description: Sorted by `publishedAt`, newest first. Not paginated.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: All blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer }
 *                 data:
 *                   type: object
 *                   properties:
 *                     blogs:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Blog' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *   post:
 *     summary: Create a blog (superadmin only)
 *     description: Blogs are created as published.
 *     tags: [Blogs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       201:
 *         description: Blog created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     blog: { $ref: '#/components/schemas/Blog' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *       401: { description: Not authenticated }
 *       403: { description: Superadmin access required }
 */
router.get('/', getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single blog (public)
 *     description: Increments the blog's view count each time it is fetched.
 *     tags: [Blogs]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     blog: { $ref: '#/components/schemas/Blog' }
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *   put:
 *     summary: Update a blog (superadmin only)
 *     tags: [Blogs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BlogInput' }
 *     responses:
 *       200:
 *         description: Blog updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     blog: { $ref: '#/components/schemas/Blog' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *       401: { description: Not authenticated }
 *       403: { description: Superadmin access required }
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *   delete:
 *     summary: Delete a blog (superadmin only)
 *     tags: [Blogs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Blog deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string, example: Blog deleted successfully }
 *       401: { description: Not authenticated }
 *       403: { description: Superadmin access required }
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BlogError' }
 */
router.get('/:id', getBlogById);

// Protected routes (Superadmin only)
router.use(protect);
router.use(restrictTo('superadmin'));

router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;