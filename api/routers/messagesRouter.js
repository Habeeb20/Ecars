import express from 'express';
import { protect, restrictTo } from '../middleware/verifyToken.js';
import { getConversation, getMyConversations, sendMessage } from '../controllers/MessageController.js';



const router = express.Router();

// Protected routes
router.use(protect);

router.post('/', sendMessage);
router.get('/conversation/:userId', getConversation);
router.get('/my-conversations', getMyConversations);



export default router;