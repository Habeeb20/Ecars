// routes/inventoryRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { createListing,  getMyInventory,
  getInventoryStats,
  updateListing,
  markAsSold,
  bulkUpdateStatus,
  bulkDelete,
  deleteListing,
  getListingById,
  getSimilarListings, } from '../controllers/inventoryController.js';


const router = express.Router();

// Public
router.get('/listing/:id', getListingById);
router.get('/listing/:id/similar', getSimilarListings);

// Protected - dealers, service-providers & carPart-sellers manage their own stock
router.use(protect);
router.use(restrictTo('dealer', 'service-provider', 'carPart-seller', 'superadmin'));

router.post('/', createListing);
router.get('/', getMyInventory);
router.get('/stats', getInventoryStats);
router.patch('/bulk/status', bulkUpdateStatus);
router.delete('/bulk', bulkDelete);
router.patch('/:id', updateListing);
router.patch('/:id/sold', markAsSold);
router.delete('/:id', deleteListing);

export default router;
