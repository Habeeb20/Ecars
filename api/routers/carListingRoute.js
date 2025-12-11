import { protect } from '../middleware/verifyToken.js';
import { createCarListing, getMyCars, updateCarListing, deleteCarListing, getAllCars, searchCars, getCarById, createListingForOthers } from '../controllers/carListingController.js';
import express from "express"
import { getNewestListings } from '../controllers/plansController.js';

const router =express.Router()

router.post('/create', protect, createCarListing);
router.get('/my', protect, getMyCars);
router.get("/allcars", getAllCars)
router.post("/", createListingForOthers)
router.get('/search', searchCars);
router.patch('/:id', protect, updateCarListing);     
router.delete('/:id', protect, deleteCarListing);
router.get("/newest", getNewestListings)    



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