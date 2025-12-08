// routes/authRoutes.js
import express from 'express';
import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer, upgradeToServiceProvider, getAllDealers, getAllServiceProviders, searchServiceAndDealers } from '../controllers/userController.js';
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




// routes/userRoutes.js
router.patch('/upgrade-service-provider', protect, upgradeToServiceProvider);
router.get('/dealers', getAllDealers);
router.get('/service-providers', getAllServiceProviders);
router.get('/search-providers', searchServiceAndDealers); // /api/users/search-providers?q=ahmed&state=lagos&type=mechanic

export default router;

