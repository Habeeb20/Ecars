// routes/contactRoutes.js
import express from 'express';
import { submitContact,  getAllContacts,
  markContactAsRead, } from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/verifyToken.js';


const router = express.Router();

// Public route - anyone can send contact message
router.post('/', submitContact);

// // Admin-only routes
// router.use(protect); // require login


router.get('/', getAllContacts);
router.patch('/:id/read', markContactAsRead);

export default router;