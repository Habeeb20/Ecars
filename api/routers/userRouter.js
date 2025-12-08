// routes/authRoutes.js
import express from 'express';
import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer } from '../controllers/userController.js';
import { protect } from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);
// router.get("/me", protect, getDashboard)
router.get("/me", protect, getMe)

router.patch('/upgrade-to-dealer', protect, upgradeToDealer);

router.put('/update-me', updateMe);
router.put('/update-password', updatePassword);

export default router;

