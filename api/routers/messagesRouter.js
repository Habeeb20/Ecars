import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { getConversation, getMyConversations, getMyOffers, sendMessage, sendOffer } from '../controllers/MessageController.js';



const router = express.Router();

// Protected routes
router.use(protect);

router.post('/', sendMessage);
router.get('/conversation/:userId', getConversation);
router.get('/my-conversations', getMyConversations);

// routes/messageRoutes.js
router.post('/',  sendOffer);                    // Send normal message or offer
router.get('/my-offers',  getMyOffers);         // Seller sees received offers

export default router;