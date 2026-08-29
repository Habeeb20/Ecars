// routes/dealerVideoRoutes.js
import express from 'express';
import {protect, restrictTo} from "../middleware/verifyToken.js"
import { createDealerVideo, getDealerVideos, getDealerVideosByUser, recordVideoView, deleteDealerVideo, getDealerProfile } from '../controllers/dealerVideoController.js';

const router = express.Router();

router.post('/', protect, restrictTo('dealer'), createDealerVideo);
router.get('/', getDealerVideos);
router.get('/dealer/:dealerId', getDealerVideosByUser);
router.put('/:id/view', recordVideoView);
router.delete('/:id', protect, deleteDealerVideo);
router.get('/dealer-profile/:dealerId', getDealerProfile);

export default router;