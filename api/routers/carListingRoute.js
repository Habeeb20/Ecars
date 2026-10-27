// import { protect } from '../middleware/verifyToken.js';
// import { createCarListing, getMyCars, updateCarListing, deleteCarListing, getAllCars, searchCars, getCarById, createListingForOthers, recordCarView, toggleLikeCar, getCarLikeStatus, getAllCarsForSearch, getCarFilterOptions, createSaleListing, convertListingToSale, getMyInventory, getSaleListings, getUnverifiedCars, verifyCar, unverifyCar, toggleVerifyCar, getAllCarsForAdmin, getVerifiedCars } from '../controllers/carListingController.js';
// import express from "express"
// import { getNewestListings } from '../controllers/plansController.js';
// import Car from "../models/carListing.js"
// import { restrictTo } from '../middleware/verifyToken.js';
// import { getCarsByBodyType } from '../controllers/CarPartListingController.js';
// import { getCarById1, getSimilarCars, toggleLikeCar1, incrementShareCount } from '../controllers/carListingController.js';
// const router =express.Router()
// router.get("/", protect, getAllCarsForAdmin)
// router.post('/create', protect, createCarListing);
// router.get('/verified', getVerifiedCars);
// router.get('/my', protect, getMyCars);
// router.get("/allcars", getAllCars)
// router.post("/", createListingForOthers)
// router.post('/sales', protect, createSaleListing);
// router.post('/:listingId/convert-to-sale', protect, restrictTo('dealer'), convertListingToSale);
// router.get('/my-inventory', protect, restrictTo('dealer'), getMyInventory);
// router.get('/sales', getSaleListings);
// router.get('/search', searchCars);
// router.put('/:id', protect, updateCarListing);     
// router.delete('/:id', protect, deleteCarListing);
// router.get("/newest", getNewestListings)  
// router.get('/allcarsearch', getAllCarsForSearch);  
// // routes/carRoutes.js
// router.get('/cars/filter-options', getCarFilterOptions);
// router.get('/by-body-type/:bodyType', getCarsByBodyType)

// router.get('/unverified', protect,  getUnverifiedCars);
// router.put('/:id/verify', protect,  verifyCar);
// router.put('/:id/unverify', protect,  unverifyCar);
// router.put('/:id/toggle-verify', protect, toggleVerifyCar);
// router.get('/:id', getCarById1);
// router.get('/:id/similar', getSimilarCars);
// router.put('/:id/like', protect, toggleLikeCar1);
// router.put('/:id/share', incrementShareCount);





// // routes/carRoutes.js
// router.put('/:id/view', recordCarView);                    // record view (can be called on page load)
// router.put('/:id/like', protect, toggleLikeCar1);    // like/unlike
// router.get('/:id/like-status', protect, getCarLikeStatus); // check if liked + count

// // GET /api/cars/compare - Public or protected (your choice)
// router.get('/compare', async (req, res) => {
//   try {
//     const {
//       search = '',
//       mode = 'different', // 'same' or 'different'
//       brand,
//       model,
//       yearFrom,
//       yearTo,
//     } = req.query;

//     let query = {};

//     // Search by make/model/year
//     if (search) {
//       query.$or = [
//         { make: { $regex: search, $options: 'i' } },
//         { model: { $regex: search, $options: 'i' } },
//         { year: { $regex: search, $options: 'i' } },
//       ];
//     }

//     // Same model/brand mode
//     if (mode === 'same') {
//       if (brand) query.make = { $regex: brand, $options: 'i' };
//       if (model) query.model = { $regex: model, $options: 'i' };
//     }

//     // Year range
//     if (yearFrom || yearTo) {
//       query.year = {};
//       if (yearFrom) query.year.$gte = Number(yearFrom);
//       if (yearTo) query.year.$lte = Number(yearTo);
//     }

//     const cars = await Car.find(query)
//       .populate('dealer', 'businessName verified') // or 'seller' depending on your schema
//       .sort({ createdAt: -1 })
//       .limit(50); // limit to avoid loading too many

//     res.json({
//       status: 'success',
//       data: { cars },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: 'error', message: 'Server error' });
//   }
// });





// // routes/carRoutes.js (or wherever your routes are)
// // router.get('/carapi/vehicles', async (req, res) => {
// //   try {
// //     const { search } = req.query;

// //     const response = await fetch(
// //       `https://carapi.app/api/vehicles?search=${encodeURIComponent(search)}`,
// //       {
// //         headers: {
// //           'Authorization': `Bearer ${process.env.CARAPI_JWT}`, 
// //         },
// //       }
// //     );

// //     const data = await response.json();
// //     res.json(data);
// //   } catch (err) {
// //     console.log(err)
// //     res.status(500).json({ error: 'Failed to fetch from CarAPI' });
// //   }
// // });


// router.get("/:id", getCarById)

// export default router 


import { protect } from '../middleware/verifyToken.js';
import { createCarListing, getMyCars, updateCarListing, deleteCarListing, getAllCars, searchCars, getCarById, createListingForOthers, recordCarView, toggleLikeCar, getCarLikeStatus, getAllCarsForSearch, getCarFilterOptions, createSaleListing, convertListingToSale, getMyInventory, getSaleListings, getUnverifiedCars, verifyCar, unverifyCar, toggleVerifyCar, getAllCarsForAdmin, getVerifiedCars } from '../controllers/carListingController.js';
import express from "express"
import { getNewestListings } from '../controllers/plansController.js';
import Car from "../models/carListing.js"
import { restrictTo } from '../middleware/verifyToken.js';
import { getCarsByBodyType } from '../controllers/CarPartListingController.js';
import { getCarById1, getSimilarCars, toggleLikeCar1, incrementShareCount } from '../controllers/carListingController.js';
const router =express.Router()

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car listings — browse, search, post, like, sale listings and admin verification (mounted at /api/cars)
 * components:
 *   schemas:
 *     CarListing:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         title: { type: string, example: 2018 Toyota Camry XLE }
 *         price: { type: number, example: 8500000 }
 *         make: { type: string, example: Toyota }
 *         model: { type: string, example: Camry }
 *         year: { type: integer, example: 2018 }
 *         mileage: { type: number, example: 64000 }
 *         transmission: { type: string, example: automatic }
 *         fuelType: { type: string, example: petrol }
 *         bodyType: { type: string, example: sedan }
 *         condition: { type: string, example: used }
 *         color: { type: string }
 *         vin: { type: string }
 *         stockNumber: { type: string }
 *         description: { type: string }
 *         location:
 *           type: object
 *           properties:
 *             state: { type: string, example: Lagos }
 *             lga: { type: string, example: Ikeja }
 *         images:
 *           type: array
 *           description: Cloudinary URLs (at least 4 required)
 *           items: { type: string, format: uri }
 *         features: { type: array, items: { type: string } }
 *         status: { type: string, enum: [active, pending, sold, draft] }
 *         postedBy:
 *           description: User id, or a populated user object
 *           oneOf:
 *             - { type: string }
 *             - { type: object }
 *         views: { type: integer }
 *         likeCount: { type: integer }
 *         shareCount: { type: integer }
 *         isVerified: { type: boolean }
 *         verifiedAt: { type: string, format: date-time }
 *         verifiedBy: { type: string }
 *         saleType: { type: string, enum: [distress, discount] }
 *         originalPrice: { type: number }
 *         saleReason: { type: string }
 *         saleExpiresAt: { type: string, format: date-time }
 *         createdAt: { type: string, format: date-time }
 *     CarInput:
 *       type: object
 *       required: [images]
 *       properties:
 *         title: { type: string }
 *         price: { type: number }
 *         make: { type: string }
 *         model: { type: string }
 *         year: { type: integer }
 *         mileage: { type: number }
 *         transmission: { type: string }
 *         fuelType: { type: string }
 *         bodyType: { type: string }
 *         condition: { type: string }
 *         color: { type: string }
 *         vin: { type: string }
 *         description: { type: string }
 *         location:
 *           type: object
 *           properties:
 *             state: { type: string }
 *             lga: { type: string }
 *         images:
 *           type: array
 *           minItems: 4
 *           items: { type: string, format: uri }
 *         features: { type: array, items: { type: string } }
 *     CarFail:
 *       type: object
 *       description: Error shape used by the status-style endpoints
 *       properties:
 *         status: { type: string, enum: [fail, error], example: fail }
 *         message: { type: string }
 *     CarFlagError:
 *       type: object
 *       description: Error shape used by the success-flag style endpoints
 *       properties:
 *         success: { type: boolean, example: false }
 *         message: { type: string }
 *         error: { type: string }
 *     CarListResponse:
 *       type: object
 *       properties:
 *         status: { type: string, example: success }
 *         results: { type: integer }
 *         data:
 *           type: object
 *           properties:
 *             cars:
 *               type: array
 *               items: { $ref: '#/components/schemas/CarListing' }
 *     CarPagedResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         count: { type: integer }
 *         total: { type: integer }
 *         page: { type: integer }
 *         pages: { type: integer }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/CarListing' }
 *   parameters:
 *     CarId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: string }
 *       description: Car listing id
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: List all cars (admin view)
 *     description: Filter by verification, status or free-text search. Currently only requires a logged-in user — see the note on role restriction.
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *       - { in: query, name: verified, schema: { type: string, enum: ['true', 'false'] } }
 *       - { in: query, name: status, schema: { type: string, enum: [active, pending, sold, draft] } }
 *       - { in: query, name: search, schema: { type: string }, description: Matches title, make, model or stock number }
 *     responses:
 *       200:
 *         description: Paginated cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarPagedResponse' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 *   post:
 *     summary: Create a listing on behalf of someone else (guests allowed)
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarInput' }
 *     responses:
 *       201:
 *         description: Listing created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     listing: { $ref: '#/components/schemas/CarListing' }
 *       500:
 *         description: Failed to create listing
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get("/", protect, getAllCarsForAdmin)

/**
 * @swagger
 * /api/cars/create:
 *   post:
 *     summary: Post a car listing
 *     description: Non-verified-dealers are limited to 3 active/pending listings. At least 4 images are required.
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarInput' }
 *     responses:
 *       201:
 *         description: Car listed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string, example: Car listed successfully! }
 *                 data:
 *                   type: object
 *                   properties:
 *                     car: { $ref: '#/components/schemas/CarListing' }
 *       400:
 *         description: Fewer than 4 images, or validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Listing limit reached
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.post('/create', protect, createCarListing);

/**
 * @swagger
 * /api/cars/verified:
 *   get:
 *     summary: List verified, active cars (public)
 *     tags: [Cars]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 12 } }
 *     responses:
 *       200:
 *         description: Paginated verified cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarPagedResponse' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.get('/verified', getVerifiedCars);

/**
 * @swagger
 * /api/cars/my:
 *   get:
 *     summary: Get my car listings
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: My listings, newest first
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarListResponse' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get('/my', protect, getMyCars);

/**
 * @swagger
 * /api/cars/allcars:
 *   get:
 *     summary: Latest 50 active cars (public)
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Active cars, newest first
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarListResponse' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get("/allcars", getAllCars)
router.post("/", createListingForOthers)

/**
 * @swagger
 * /api/cars/sales:
 *   get:
 *     summary: List distress / discount sale listings (public)
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [distress, discount] }
 *         description: Omit to return both types
 *     responses:
 *       200:
 *         description: Sale listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 listings:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *   post:
 *     summary: Create a distress or discount sale listing
 *     description: For `discount`, `originalPrice` must be greater than `price`.
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CarInput'
 *             type: object
 *             required: [saleType]
 *             properties:
 *               saleType: { type: string, enum: [distress, discount] }
 *               originalPrice: { type: number, description: Required for discount sales }
 *               saleReason: { type: string }
 *               saleExpiresAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Sale listing created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 listing: { $ref: '#/components/schemas/CarListing' }
 *       400: { description: Invalid saleType or originalPrice }
 *       401: { description: Not authenticated }
 *       500: { description: Server error }
 */
router.post('/sales', protect, createSaleListing);

/**
 * @swagger
 * /api/cars/{listingId}/convert-to-sale:
 *   post:
 *     summary: Convert an inventory listing into a sale listing (dealers only)
 *     description: For `discount`, the new `price` must be lower than the current price; the old price becomes `originalPrice`.
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: listingId, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [saleType]
 *             properties:
 *               saleType: { type: string, enum: [distress, discount] }
 *               price: { type: number, description: New lower price (discount only) }
 *               saleReason: { type: string }
 *               saleExpiresAt: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Listing converted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 listing: { $ref: '#/components/schemas/CarListing' }
 *       400: { description: Invalid saleType or price }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers only }
 *       404: { description: Listing not found in your inventory }
 *       500: { description: Server error }
 */
router.post('/:listingId/convert-to-sale', protect, restrictTo('dealer'), convertListingToSale);

/**
 * @swagger
 * /api/cars/my-inventory:
 *   get:
 *     summary: Get my active/pending inventory (dealers only)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Inventory listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 listings:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *       401: { description: Not authenticated }
 *       403: { description: Dealers only }
 */
router.get('/my-inventory', protect, restrictTo('dealer'), getMyInventory);
router.get('/sales', getSaleListings);

/**
 * @swagger
 * /api/cars/search:
 *   get:
 *     summary: Search cars (regex-based filters)
 *     tags: [Cars]
 *     parameters:
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: minPrice, schema: { type: number } }
 *       - { in: query, name: maxPrice, schema: { type: number } }
 *       - { in: query, name: minYear, schema: { type: integer } }
 *       - { in: query, name: maxYear, schema: { type: integer } }
 *       - { in: query, name: keywords, schema: { type: string }, description: Matches make, model or description }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: fuelType, schema: { type: string } }
 *       - { in: query, name: minMileage, schema: { type: number } }
 *       - { in: query, name: maxMileage, schema: { type: number } }
 *       - { in: query, name: vehicleType, schema: { type: string } }
 *       - { in: query, name: condition, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Up to 100 matching cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.get('/search', searchCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update my car listing
 *     description: Only the owner can edit, and sold cars cannot be edited. Only whitelisted fields are applied. If `images` is sent it must contain at least 4.
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CarInput' }
 *     responses:
 *       200:
 *         description: Listing updated
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
 *                     car: { $ref: '#/components/schemas/CarListing' }
 *       400:
 *         description: Sold car, fewer than 4 images, or validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *   delete:
 *     summary: Delete my car listing
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Listing deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *       401: { description: Not authenticated }
 *       403:
 *         description: Not the owner
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 *   get:
 *     summary: Get a car's details (public)
 *     description: Increments the listing's view count each time it is fetched.
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       400:
 *         description: Invalid car ID
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 *       404:
 *         description: Car listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id', protect, updateCarListing);     
router.delete('/:id', protect, deleteCarListing);

/**
 * @swagger
 * /api/cars/newest:
 *   get:
 *     summary: Newest listings from users with an active "newest listings access" subscription
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Up to 50 listings, newest first
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarListResponse' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get("/newest", getNewestListings)  

/**
 * @swagger
 * /api/cars/allcarsearch:
 *   get:
 *     summary: Search active cars with filters
 *     description: Free-text `keyword` matches title, make, model, colour, VIN, description, stock number, body type and location; numeric keywords also match year, price and mileage exactly.
 *     tags: [Cars]
 *     parameters:
 *       - { in: query, name: keyword, schema: { type: string } }
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: string, example: 2015-2020 }, description: 'Year range as "min-max" (or a single start year)' }
 *       - { in: query, name: priceRange, schema: { type: string, example: 1000000-5000000 }, description: 'Price range as "min-max"' }
 *       - { in: query, name: bodyType, schema: { type: string } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: fuelType, schema: { type: string } }
 *       - { in: query, name: transmission, schema: { type: string } }
 *       - { in: query, name: state, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Matching cars, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: integer }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get('/allcarsearch', getAllCarsForSearch);  

// routes/carRoutes.js
/**
 * @swagger
 * /api/cars/cars/filter-options:
 *   get:
 *     summary: Filter values that exist given the current selection
 *     description: Each field's own selection is excluded from its own match, so the user can always switch it. Note the path is registered as `/cars/filter-options`, so with the router mounted at /api/cars the full URL is /api/cars/cars/filter-options.
 *     tags: [Cars]
 *     parameters:
 *       - { in: query, name: make, schema: { type: string } }
 *       - { in: query, name: bodyType, schema: { type: string } }
 *       - { in: query, name: condition, schema: { type: string } }
 *       - { in: query, name: fuelType, schema: { type: string } }
 *       - { in: query, name: transmission, schema: { type: string } }
 *       - { in: query, name: state, schema: { type: string } }
 *       - { in: query, name: yearRange, schema: { type: string, example: 2015-2020 } }
 *       - { in: query, name: priceRange, schema: { type: string, example: 1000000-5000000 } }
 *     responses:
 *       200:
 *         description: Available options per filter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     makes: { type: array, items: { type: string } }
 *                     bodyTypes: { type: array, items: { type: string } }
 *                     conditions: { type: array, items: { type: string } }
 *                     fuelTypes: { type: array, items: { type: string } }
 *                     transmissions: { type: array, items: { type: string } }
 *                     states: { type: array, items: { type: string } }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get('/cars/filter-options', getCarFilterOptions);

/**
 * @swagger
 * /api/cars/by-body-type/{bodyType}:
 *   get:
 *     summary: List cars by body type
 *     tags: [Cars]
 *     parameters:
 *       - { in: path, name: bodyType, required: true, schema: { type: string, example: suv } }
 *     responses:
 *       200:
 *         description: Cars of that body type
 *         content:
 *           application/json:
 *             schema: { type: object }
 */
router.get('/by-body-type/:bodyType', getCarsByBodyType)

/**
 * @swagger
 * /api/cars/unverified:
 *   get:
 *     summary: List cars pending verification (admin)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200:
 *         description: Paginated unverified cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarPagedResponse' }
 *       401: { description: Not authenticated }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.get('/unverified', protect,  getUnverifiedCars);

/**
 * @swagger
 * /api/cars/{id}/verify:
 *   put:
 *     summary: Mark a listing as verified (admin)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Car verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Car listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id/verify', protect,  verifyCar);

/**
 * @swagger
 * /api/cars/{id}/unverify:
 *   put:
 *     summary: Remove verification from a listing (admin)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Car unverified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Car listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id/unverify', protect,  unverifyCar);

/**
 * @swagger
 * /api/cars/{id}/toggle-verify:
 *   put:
 *     summary: Toggle a listing's verification status (admin)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Verification toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CarListing' }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Car listing not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id/toggle-verify', protect, toggleVerifyCar);
router.get('/:id', getCarById1);

/**
 * @swagger
 * /api/cars/{id}/similar:
 *   get:
 *     summary: Up to 4 other active listings of the same make
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Similar cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CarListing' }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.get('/:id/similar', getSimilarCars);

/**
 * @swagger
 * /api/cars/{id}/like:
 *   put:
 *     summary: Like or unlike a car (toggle)
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Like state after toggling
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 liked: { type: boolean }
 *                 likeCount: { type: integer }
 *       401: { description: Not authenticated }
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id/like', protect, toggleLikeCar1);

/**
 * @swagger
 * /api/cars/{id}/share:
 *   put:
 *     summary: Increment a listing's share count
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Share count bumped
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *       500:
 *         description: Failed to update share count
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFlagError' }
 */
router.put('/:id/share', incrementShareCount);





// routes/carRoutes.js
/**
 * @swagger
 * /api/cars/{id}/view:
 *   put:
 *     summary: Record a view
 *     description: Call on page load. Increments the view counter.
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Updated view count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 views: { type: integer }
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error
 */
router.put('/:id/view', recordCarView);                    // record view (can be called on page load)
router.put('/:id/like', protect, toggleLikeCar1);    // like/unlike

/**
 * @swagger
 * /api/cars/{id}/like-status:
 *   get:
 *     summary: Get like count and whether I liked this car
 *     tags: [Cars]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Like status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: boolean, example: true }
 *                 likeCount: { type: integer }
 *                 isLiked: { type: boolean }
 *       401: { description: Not authenticated }
 *       404: { description: Car not found }
 *       500: { description: Server error }
 */
router.get('/:id/like-status', protect, getCarLikeStatus); // check if liked + count

// GET /api/cars/compare - Public or protected (your choice)
/**
 * @swagger
 * /api/cars/compare:
 *   get:
 *     summary: Find cars to compare
 *     description: In `same` mode, `brand` and `model` narrow the results to one model.
 *     tags: [Cars]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: Matches make, model or year }
 *       - { in: query, name: mode, schema: { type: string, enum: [same, different], default: different } }
 *       - { in: query, name: brand, schema: { type: string } }
 *       - { in: query, name: model, schema: { type: string } }
 *       - { in: query, name: yearFrom, schema: { type: integer } }
 *       - { in: query, name: yearTo, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Up to 50 cars
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarListResponse' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CarFail' }
 */
router.get('/compare', async (req, res) => {
  try {
    const {
      search = '',
      mode = 'different', // 'same' or 'different'
      brand,
      model,
      yearFrom,
      yearTo,
    } = req.query;

    let query = {};

    // Search by make/model/year
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
      ];
    }

    // Same model/brand mode
    if (mode === 'same') {
      if (brand) query.make = { $regex: brand, $options: 'i' };
      if (model) query.model = { $regex: model, $options: 'i' };
    }

    // Year range
    if (yearFrom || yearTo) {
      query.year = {};
      if (yearFrom) query.year.$gte = Number(yearFrom);
      if (yearTo) query.year.$lte = Number(yearTo);
    }

    const cars = await Car.find(query)
      .populate('dealer', 'businessName verified') // or 'seller' depending on your schema
      .sort({ createdAt: -1 })
      .limit(50); // limit to avoid loading too many

    res.json({
      status: 'success',
      data: { cars },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});





// routes/carRoutes.js (or wherever your routes are)
// router.get('/carapi/vehicles', async (req, res) => {
//   try {
//     const { search } = req.query;

//     const response = await fetch(
//       `https://carapi.app/api/vehicles?search=${encodeURIComponent(search)}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.CARAPI_JWT}`, 
//         },
//       }
//     );

//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: 'Failed to fetch from CarAPI' });
//   }
// });


router.get("/:id", getCarById)

export default router