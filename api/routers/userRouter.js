// // routes/authRoutes.js
// import express from 'express';
// import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer, upgradeToServiceProvider, getAllDealers, getAllServiceProviders, searchServiceAndDealers, getFeaturedDealers, searchDealers, getFeaturedServiceProvider, searchServiceProviders, getDealerById, searchBlacklistedUsers, upgradeToCarPartSeller, getAllCarPartSellers, verifyCarPartSeller, searchCarPartSellers, authLogin, toggleLike, shareProvider, incrementProviderView, requestAuthOtp, verifyAuthOtp, getPublicSellers } from '../controllers/userController.js';
// import { protect } from '../middleware/verifyToken.js';
// import { sendVerificationEmail } from '../utils/functions.js';
// import { getBlacklistedUsers } from '../controllers/adminController.js';
// import User from '../models/user.js';
// import crypto from 'crypto';

// const router = express.Router();
// router.get('/alldealers', getAllDealers);
// router.get('/dealers', getAllDealers);
// router.get('/all-service-providers', getAllServiceProviders);
// router.get('/sellers', getPublicSellers);
// router.post('/register', register);
// router.post('/login', login);
// // router.post('/auth-login', authLogin);
// router.post('/forgotpassword', forgotPassword);
// router.post('/auth-login', requestAuthOtp);       // step 1: send OTP
// router.post('/verify-auth-otp', verifyAuthOtp);    // step 2: verify + log in

// router.put('/resetpassword/:token', resetPassword);
// // router.get("/me", protect, getDashboard)
// router.get("/me", protect, getMe)
// router.get("/featured-dealers", getFeaturedDealers)
// router.get("/dealers/search", searchDealers)
// router.get('/service-providers', getAllServiceProviders);
// router.get("/featured-serviceprovider", getFeaturedServiceProvider)
// router.get("/serviceprovider/search", searchServiceProviders)
// router.get("/:id", getDealerById)

// router.get('/service-providers/search', searchServiceProviders);

// router.put('/upgrade-to-dealer', protect, upgradeToDealer);

// router.put('/update-me', protect, updateMe);
// router.put('/update-password', protect, updatePassword);




// router.put('/upgrade-service-provider', protect, upgradeToServiceProvider);



// router.get("/blacklistedusers", getBlacklistedUsers)
// router.post('/send-verification-email', protect, sendVerificationEmail);
// router.get('/search-providers', searchServiceAndDealers); 
// // Search blacklisted users (supports all filters + search)
// router.get('/blacklistedusers/search',  searchBlacklistedUsers);


// router.put('/upgrade-carpart-seller', protect, upgradeToCarPartSeller);
// router.get('/carpart-sellers', getAllCarPartSellers);

// router.get('/carpart-sellers/search',  searchCarPartSellers);
// router.get("/dealers/:id", getDealerById)


// router.post('/dealers/:id/like', toggleLike);
// router.post('/dealers/:id/share', shareProvider);

// router.post('/dealers/:id/view', incrementProviderView);


// // GET /api/auth/verify-email/:token
// router.get('/verify-email/:token', async (req, res) => {
//   try {
//     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await User.findOne({
//       emailVerificationToken: hashedToken,
//       emailVerificationExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Invalid or expired verification link',
//       });
//     }

//     user.emailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({
//       status: 'success',
//       message: 'Email verified successfully!',
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Verification failed. Please try again.',
//     });
//   }
// });
// export default router;












// routes/authRoutes.js  →  app.use('/api/auth', router)
import express from 'express';
import { register, login, forgotPassword, resetPassword, getDashboard, getMe, updateMe, updatePassword, upgradeToDealer, upgradeToServiceProvider, getAllDealers, getAllServiceProviders, searchServiceAndDealers, getFeaturedDealers, searchDealers, getFeaturedServiceProvider, searchServiceProviders, getDealerById, searchBlacklistedUsers, upgradeToCarPartSeller, getAllCarPartSellers, verifyCarPartSeller, searchCarPartSellers, authLogin, toggleLike, shareProvider, incrementProviderView, requestAuthOtp, verifyAuthOtp, getPublicSellers } from '../controllers/userController.js';
import { protect } from '../middleware/verifyToken.js';
import { sendVerificationEmail } from '../utils/functions.js';
import { getBlacklistedUsers } from '../controllers/adminController.js';
import User from '../models/user.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Registration, login, OTP login, password reset, email verification (mounted at /api/auth)
 *   - name: Users
 *     description: Profile, role upgrades, and public dealer / service-provider / parts-seller directories (same router)
 * components:
 *   schemas:
 *     FailResponse:
 *       type: object
 *       description: Standard error shape used across the status-style endpoints
 *       properties:
 *         status: { type: string, enum: [fail, error], example: fail }
 *         message: { type: string }
 *     User:
 *       type: object
 *       description: User document (password never returned). Role-specific fields appear under dealerInfo, serviceProviderInfo or carPartSellerInfo.
 *       properties:
 *         _id: { type: string }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         email: { type: string, format: email }
 *         phoneNumber: { type: string }
 *         role: { type: string, enum: [user, dealer, service-provider, carPart-seller, agent, superadmin] }
 *         state: { type: string }
 *         lga: { type: string }
 *         address: { type: string }
 *         bio: { type: string }
 *         avatar: { type: string }
 *         slug: { type: string }
 *         emailVerified: { type: boolean }
 *         isOnline: { type: boolean }
 *         lastSeen: { type: string, format: date-time }
 *         dealerInfo: { type: object }
 *         serviceProviderInfo: { type: object }
 *         carPartSellerInfo: { type: object }
 *         createdAt: { type: string, format: date-time }
 *     AuthTokenResponse:
 *       type: object
 *       description: Returned by createSendToken (shape inferred — check utils/functions.js)
 *       properties:
 *         status: { type: string, example: success }
 *         token: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             user: { $ref: '#/components/schemas/User' }
 *     UserListResponse:
 *       type: object
 *       properties:
 *         status: { type: string, example: success }
 *         results: { type: integer }
 *         data: { type: object, description: 'Holds a list under dealers / providers / sellers / results / users depending on the endpoint' }
 *     PagedQuery:
 *       type: object
 *       description: Not used directly; documents the page/limit convention
 *       properties:
 *         page: { type: integer, default: 1 }
 *         limit: { type: integer, default: 20 }
 *   parameters:
 *     UserId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 */

/**
 * @swagger
 * /api/auth/alldealers:
 *   get:
 *     summary: List all dealers (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Dealers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dealers:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/User' }
 *       500:
 *         description: Failed to fetch dealers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 * /api/auth/dealers:
 *   get:
 *     summary: List all dealers (public, same as /alldealers)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Dealers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dealers:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/User' }
 */
router.get('/alldealers', getAllDealers);
router.get('/dealers', getAllDealers);

/**
 * @swagger
 * /api/auth/all-service-providers:
 *   get:
 *     summary: List verified service providers (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Verified service providers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 * /api/auth/service-providers:
 *   get:
 *     summary: List verified service providers (public, same as /all-service-providers)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Verified service providers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get('/all-service-providers', getAllServiceProviders);

/**
 * @swagger
 * /api/auth/sellers:
 *   get:
 *     summary: Public sellers — dealers and private sellers with active listings
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: dealerLimit, schema: { type: integer, default: 8 } }
 *       - { in: query, name: privateLimit, schema: { type: integer, default: 8 } }
 *     responses:
 *       200:
 *         description: Sellers ranked by listing count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dealers: { type: array, items: { type: object } }
 *                     privateSellers: { type: array, items: { type: object } }
 */
router.get('/sellers', getPublicSellers);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     description: Returns a token so the user is logged in immediately. Pass `referralCode` to credit an agent. Role-specific details go in `dealerInfo`, `serviceProviderInfo` or `carPartSellerInfo`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               role: { type: string, enum: [user, dealer, service-provider, carPart-seller, agent], default: user }
 *               phoneNumber: { type: string }
 *               state: { type: string }
 *               lga: { type: string }
 *               address: { type: string }
 *               referralCode: { type: string, description: An agent's referral code }
 *               dealerInfo: { type: object, description: 'businessName, businessRegistrationNumber, businessAddress, state, lga' }
 *               serviceProviderInfo: { type: object, description: 'type, businessName, businessAddress, state, lga, phoneNumber, whatsappNumber, yearsOfExperience, servicesOffered[]' }
 *               carPartSellerInfo: { type: object, description: 'type, businessName, businessAddress, state, lga, phoneNumber, whatsappNumber, website, yearsOfExperience, specialties[]' }
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthTokenResponse' }
 *       400:
 *         description: Invalid role, validation error, or registration failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       409:
 *         description: Email or business registration number already registered
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with email or phone number and password
 *     description: '`identifier` accepts an email or a Nigerian phone number in any common format. `email` and `phone` are still accepted for older clients.'
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string, example: ada@example.com }
 *               email: { type: string, description: Legacy }
 *               phone: { type: string, description: Legacy }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthTokenResponse' }
 *       400:
 *         description: Missing or invalid identifier/password
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401:
 *         description: Incorrect email/phone or password
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/login', login);
// router.post('/auth-login', authLogin);

/**
 * @swagger
 * /api/auth/forgotpassword:
 *   post:
 *     summary: Email a password-reset link
 *     description: The link is valid for 10 minutes.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Reset link sent
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       404:
 *         description: No user with that email
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       500:
 *         description: Error sending email
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /api/auth/auth-login:
 *   post:
 *     summary: OTP login, step 1 — email a 4-digit code
 *     description: The code expires in 10 minutes. The response is the same whether or not the email is registered.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: OTP sent (if the email exists)
 *       400:
 *         description: Email missing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       500:
 *         description: Failed to send OTP email
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/auth-login', requestAuthOtp);       // step 1: send OTP

/**
 * @swagger
 * /api/auth/verify-auth-otp:
 *   post:
 *     summary: OTP login, step 2 — verify the code and log in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string, example: '4821' }
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthTokenResponse' }
 *       400:
 *         description: Email or OTP missing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401:
 *         description: Invalid, incorrect or expired OTP
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.post('/verify-auth-otp', verifyAuthOtp);    // step 2: verify + log in

/**
 * @swagger
 * /api/auth/resetpassword/{token}:
 *   put:
 *     summary: Reset password using the emailed token
 *     tags: [Auth]
 *     parameters:
 *       - { in: path, name: token, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password, minLength: 6 }
 *     responses:
 *       200:
 *         description: Password reset; a new token is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 token: { type: string }
 *                 message: { type: string }
 *       400:
 *         description: Password too short, or token invalid/expired
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.put('/resetpassword/:token', resetPassword);
// router.get("/me", protect, getDashboard)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the logged-in user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       401: { description: Not authenticated }
 */
router.get("/me", protect, getMe)

/**
 * @swagger
 * /api/auth/featured-dealers:
 *   get:
 *     summary: Dealers with an active featured subscription (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Featured dealers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get("/featured-dealers", getFeaturedDealers)

/**
 * @swagger
 * /api/auth/dealers/search:
 *   get:
 *     summary: Search dealers by name, business, location, phone or bio
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: q, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching dealers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get("/dealers/search", searchDealers)

router.get('/service-providers', getAllServiceProviders);

/**
 * @swagger
 * /api/auth/featured-serviceprovider:
 *   get:
 *     summary: Service providers with an active featured subscription (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Featured service providers (returned under `data.dealers`)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get("/featured-serviceprovider", getFeaturedServiceProvider)

/**
 * @swagger
 * /api/auth/serviceprovider/search:
 *   get:
 *     summary: Search service providers
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: serviceType, schema: { type: string } }
 *       - { in: query, name: location, schema: { type: string }, description: Matches state }
 *       - { in: query, name: rating, schema: { type: number }, description: Minimum rating }
 *       - { in: query, name: specialization, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching providers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 * /api/auth/service-providers/search:
 *   get:
 *     summary: Search service providers (same as /serviceprovider/search)
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: serviceType, schema: { type: string } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: rating, schema: { type: number } }
 *       - { in: query, name: specialization, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching providers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get("/serviceprovider/search", searchServiceProviders)

/**
 * @swagger
 * /api/auth/{id}:
 *   get:
 *     summary: Get a dealer and their listings by user id
 *     description: Also available as /api/auth/dealers/{id}. Because this route is registered early, it captures every single-segment GET path declared after it.
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Dealer and their cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dealer: { $ref: '#/components/schemas/User' }
 *                     cars: { type: array, items: { type: object } }
 *       500:
 *         description: Failed to fetch dealer details
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 * /api/auth/dealers/{id}:
 *   get:
 *     summary: Get a dealer and their listings by user id
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Dealer and their cars
 */
router.get("/:id", getDealerById)

router.get('/service-providers/search', searchServiceProviders);

/**
 * @swagger
 * /api/auth/upgrade-to-dealer:
 *   put:
 *     summary: Upgrade my account to a dealer
 *     description: The new dealer starts unverified until an admin approves. Service providers and superadmins cannot upgrade.
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [businessName, businessRegistrationNumber, businessAddress, state, lga, phoneNumber]
 *             properties:
 *               businessName: { type: string }
 *               businessRegistrationNumber: { type: string }
 *               businessAddress: { type: string }
 *               state: { type: string }
 *               lga: { type: string }
 *               phoneNumber: { type: string }
 *               website: { type: string }
 *               description: { type: string }
 *               logo: { type: string }
 *               yearEstablished: { type: integer }
 *     responses:
 *       200:
 *         description: Upgraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400: { description: Already a dealer, or required fields missing }
 *       401: { description: Not authenticated }
 *       403: { description: This account type cannot be converted }
 *       409: { description: Business registration number already registered }
 */
router.put('/upgrade-to-dealer', protect, upgradeToDealer);

/**
 * @swagger
 * /api/auth/update-me:
 *   put:
 *     summary: Update my profile (not the password)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phoneNumber: { type: string }
 *               state: { type: string }
 *               lga: { type: string }
 *               address: { type: string }
 *               bio: { type: string }
 *               avatar: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Password supplied, or validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 */
router.put('/update-me', protect, updateMe);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Change my password
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, format: password }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Missing fields or update failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.put('/update-password', protect, updatePassword);




/**
 * @swagger
 * /api/auth/upgrade-service-provider:
 *   put:
 *     summary: Upgrade my account to a service provider
 *     description: Starts unverified until an admin approves. Dealers and superadmins cannot upgrade.
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, businessName, state, lga, phoneNumber]
 *             properties:
 *               type: { type: string }
 *               businessName: { type: string }
 *               businessAddress: { type: string }
 *               state: { type: string }
 *               lga: { type: string }
 *               phoneNumber: { type: string }
 *               whatsappNumber: { type: string }
 *               servicesOffered: { type: array, items: { type: string } }
 *               workshopPhotos: { type: array, items: { type: string } }
 *               yearsOfExperience: { type: integer }
 *     responses:
 *       200:
 *         description: Upgraded, awaiting approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400: { description: Already a service provider, or required fields missing }
 *       401: { description: Not authenticated }
 *       403: { description: This account type cannot be converted }
 */
router.put('/upgrade-service-provider', protect, upgradeToServiceProvider);



/**
 * @swagger
 * /api/auth/blacklistedusers:
 *   get:
 *     summary: List blacklisted users (admin)
 *     description: Intended for admins, but the route has no auth middleware. Also, because `GET /:id` is registered earlier, this path is currently handled by `getDealerById`.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Blacklisted users
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get("/blacklistedusers", getBlacklistedUsers)

/**
 * @swagger
 * /api/auth/send-verification-email:
 *   post:
 *     summary: Send me an email-verification link
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Verification email sent
 *       401: { description: Not authenticated }
 */
router.post('/send-verification-email', protect, sendVerificationEmail);

/**
 * @swagger
 * /api/auth/search-providers:
 *   get:
 *     summary: Search dealers and service providers together
 *     description: Because `GET /:id` is registered earlier, this path is currently handled by `getDealerById`.
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: q, schema: { type: string }, description: Business or first name }
 *       - { in: query, name: state, schema: { type: string } }
 *       - { in: query, name: lga, schema: { type: string } }
 *       - { in: query, name: type, schema: { type: string }, description: Service provider type }
 *       - { in: query, name: role, schema: { type: string, default: 'dealer,service-provider' } }
 *       - { in: query, name: verified, schema: { type: string, enum: ['true', 'false'], default: 'true' } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get('/search-providers', searchServiceAndDealers); 
// Search blacklisted users (supports all filters + search)

/**
 * @swagger
 * /api/auth/blacklistedusers/search:
 *   get:
 *     summary: Search blacklisted users (intended for superadmin)
 *     description: No auth middleware is currently applied.
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string, enum: [car dealers, private sellers, buyers, service providers] } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: date, schema: { type: string, format: date }, description: Date blacklisted }
 *       - { in: query, name: search, schema: { type: string }, description: Name or email }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated blacklisted users
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 *       400:
 *         description: Invalid category
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
router.get('/blacklistedusers/search',  searchBlacklistedUsers);


/**
 * @swagger
 * /api/auth/upgrade-carpart-seller:
 *   put:
 *     summary: Upgrade my account to a car part seller
 *     description: Only plain `user` accounts can upgrade. Awaits admin verification.
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string }
 *               businessName: { type: string }
 *               businessAddress: { type: string }
 *               state: { type: string }
 *               lga: { type: string }
 *               phoneNumber: { type: string }
 *               whatsappNumber: { type: string }
 *               website: { type: string }
 *               yearsOfExperience: { type: integer }
 *               specialties: { type: array, items: { type: string } }
 *               shopPhotos: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Upgrade request submitted
 *       400:
 *         description: Already a specialized user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       401: { description: Not authenticated }
 *       404: { description: User not found }
 */
router.put('/upgrade-carpart-seller', protect, upgradeToCarPartSeller);

/**
 * @swagger
 * /api/auth/carpart-sellers:
 *   get:
 *     summary: List all car part sellers
 *     description: Because `GET /:id` is registered earlier, this path is currently handled by `getDealerById`.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Sellers (under `data.sellers`)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get('/carpart-sellers', getAllCarPartSellers);

/**
 * @swagger
 * /api/auth/carpart-sellers/search:
 *   get:
 *     summary: Search car part sellers
 *     tags: [Users]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: Name, email or business name }
 *       - { in: query, name: state, schema: { type: string } }
 *       - { in: query, name: lga, schema: { type: string } }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: verified, schema: { type: string, enum: ['true', 'false'] } }
 *       - { in: query, name: isFeatured, schema: { type: string, enum: ['true', 'false'] } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated sellers
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 */
router.get('/carpart-sellers/search',  searchCarPartSellers);
router.get("/dealers/:id", getDealerById)


/**
 * @swagger
 * /api/auth/dealers/{id}/like:
 *   post:
 *     summary: Like or unlike a seller (toggle)
 *     description: The handler reads `req.user` but the route has no `protect` middleware, so this fails for every request until auth is added.
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Like state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 likesCount: { type: integer }
 *                 isLiked: { type: boolean }
 *       404: { description: Seller not found }
 *       500: { description: Server error }
 */
router.post('/dealers/:id/like', toggleLike);

/**
 * @swagger
 * /api/auth/dealers/{id}/share:
 *   post:
 *     summary: Increment a provider's share count
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Updated share count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 shares: { type: integer }
 *       404: { description: Provider not found }
 */
router.post('/dealers/:id/share', shareProvider);

/**
 * @swagger
 * /api/auth/dealers/{id}/view:
 *   post:
 *     summary: Record a provider profile view
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Updated view count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 views: { type: integer }
 *       404: { description: Provider not found }
 */
router.post('/dealers/:id/view', incrementProviderView);


// GET /api/auth/verify-email/:token
/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify an email address from the emailed link
 *     tags: [Auth]
 *     parameters:
 *       - { in: path, name: token, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Email verified
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       400:
 *         description: Invalid or expired verification link
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 *       500:
 *         description: Verification failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FailResponse' }
 */
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