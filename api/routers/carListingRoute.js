import { protect } from '../middleware/verifyToken.js';
import { createCarListing, getMyCars, updateCarListing, deleteCarListing, getAllCars, searchCars, getCarById, createListingForOthers, recordCarView, toggleLikeCar, getCarLikeStatus, getAllCarsForSearch, getCarFilterOptions, createSaleListing, convertListingToSale, getMyInventory, getSaleListings, getUnverifiedCars, verifyCar, unverifyCar, toggleVerifyCar, getAllCarsForAdmin, getVerifiedCars } from '../controllers/carListingController.js';
import express from "express"
import { getNewestListings } from '../controllers/plansController.js';
import Car from "../models/carListing.js"
import { restrictTo } from '../middleware/verifyToken.js';
import { getCarsByBodyType } from '../controllers/CarPartListingController.js';
import { getCarById1, getSimilarCars, toggleLikeCar1, incrementShareCount } from '../controllers/carListingController.js';
const router =express.Router()
router.get("/", protect, getAllCarsForAdmin)
router.post('/create', protect, createCarListing);
router.get('/verified', getVerifiedCars);
router.get('/my', protect, getMyCars);
router.get("/allcars", getAllCars)
router.post("/", createListingForOthers)
router.post('/sales', protect, createSaleListing);
router.post('/:listingId/convert-to-sale', protect, restrictTo('dealer'), convertListingToSale);
router.get('/my-inventory', protect, restrictTo('dealer'), getMyInventory);
router.get('/sales', getSaleListings);
router.get('/search', searchCars);
router.put('/:id', protect, updateCarListing);     
router.delete('/:id', protect, deleteCarListing);
router.get("/newest", getNewestListings)  
router.get('/allcarsearch', getAllCarsForSearch);  
// routes/carRoutes.js
router.get('/cars/filter-options', getCarFilterOptions);
router.get('/by-body-type/:bodyType', getCarsByBodyType)

router.get('/unverified', protect,  getUnverifiedCars);
router.put('/:id/verify', protect,  verifyCar);
router.put('/:id/unverify', protect,  unverifyCar);
router.put('/:id/toggle-verify', protect, toggleVerifyCar);
router.get('/:id', getCarById1);
router.get('/:id/similar', getSimilarCars);
router.put('/:id/like', protect, toggleLikeCar1);
router.put('/:id/share', incrementShareCount);





// routes/carRoutes.js
router.put('/:id/view', recordCarView);                    // record view (can be called on page load)
router.put('/:id/like', protect, toggleLikeCar1);    // like/unlike
router.get('/:id/like-status', protect, getCarLikeStatus); // check if liked + count

// GET /api/cars/compare - Public or protected (your choice)
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