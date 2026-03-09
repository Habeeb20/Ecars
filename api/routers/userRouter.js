// routes/authRoutes.js
import express from 'express';
import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer, upgradeToServiceProvider, getAllDealers, getAllServiceProviders, searchServiceAndDealers, getFeaturedDealers, searchDealers, getFeaturedServiceProvider, searchServiceProviders, getDealerById, searchBlacklistedUsers, upgradeToCarPartSeller, getAllCarPartSellers, verifyCarPartSeller, searchCarPartSellers, authLogin } from '../controllers/userController.js';
import { protect } from '../middleware/verifyToken.js';
import { sendVerificationEmail } from '../utils/functions.js';
import { getBlacklistedUsers } from '../controllers/adminController.js';
import User from '../models/user.js';
import crypto from 'crypto';
const router = express.Router();
router.get('/alldealers', getAllDealers);
router.get('/dealers', getAllDealers);
router.get('/all-service-providers', getAllServiceProviders);

router.post('/register', register);
router.post('/login', login);
router.post('/auth-login', authLogin);
router.post('/forgotpassword', forgotPassword);

router.put('/resetpassword/:token', resetPassword);
// router.get("/me", protect, getDashboard)
router.get("/me", protect, getMe)
router.get("/featured-dealers", getFeaturedDealers)
router.get("/dealers/search", searchDealers)
router.get('/service-providers', getAllServiceProviders);
router.get("/featured-serviceprovider", getFeaturedServiceProvider)
router.get("/serviceprovider/search", searchServiceProviders)
router.get("/:id", getDealerById)

router.get('/service-providers/search', searchServiceProviders);

router.put('/upgrade-to-dealer', protect, upgradeToDealer);

router.put('/update-me', protect, updateMe);
router.put('/update-password', protect, updatePassword);




router.put('/upgrade-service-provider', protect, upgradeToServiceProvider);



router.get("/blacklistedusers", getBlacklistedUsers)
router.post('/send-verification-email', protect, sendVerificationEmail);
router.get('/search-providers', searchServiceAndDealers); 
// Search blacklisted users (supports all filters + search)
router.get('/blacklistedusers/search',  searchBlacklistedUsers);


router.put('/upgrade-carpart-seller', protect, upgradeToCarPartSeller);
router.get('/carpart-sellers', getAllCarPartSellers);

router.get('/carpart-sellers/search',  searchCarPartSellers);
router.get("/dealers/:id", getDealerById)


// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired verification link',
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Verification failed. Please try again.',
    });
  }
});
export default router;

