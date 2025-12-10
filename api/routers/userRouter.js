// routes/authRoutes.js
import express from 'express';
import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer, upgradeToServiceProvider, getAllDealers, getAllServiceProviders, searchServiceAndDealers, getFeaturedDealers, searchDealers, getFeaturedServiceProvider, searchServiceProviders, getDealerById } from '../controllers/userController.js';
import { protect } from '../middleware/verifyToken.js';
import { sendVerificationEmail } from '../utils/functions.js';


const router = express.Router();
router.get('/alldealers', getAllDealers);
router.get('/all-service-providers', getAllServiceProviders);

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.get("/dealers/:id", getDealerById)
router.patch('/resetpassword/:token', resetPassword);
// router.get("/me", protect, getDashboard)
router.get("/me", protect, getMe)
router.get("/featured-dealers", getFeaturedDealers)
router.get("/dealers/search", searchDealers)
router.get("/featured-serviceprovider", getFeaturedServiceProvider)
router.get("/serviceprovider/search", searchServiceProviders)
router.get("/:id", getDealerById)

router.get('/service-providers/search', searchServiceProviders);

router.put('/upgrade-to-dealer', protect, upgradeToDealer);

router.put('/update-me', updateMe);
router.put('/update-password', updatePassword);




router.put('/upgrade-service-provider', protect, upgradeToServiceProvider);

router.get('/service-providers', getAllServiceProviders);


router.post('/send-verification-email', protect, sendVerificationEmail);
router.get('/search-providers', searchServiceAndDealers); // /api/users/search-providers?q=ahmed&state=lagos&type=mechanic

export default router;

