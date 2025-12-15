// routes/offerRoutes.js
import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { acceptOffer, createOffer, getMyOffers, rejectOffer } from '../controllers/offerController.js';


const offerRouter = express.Router();

offerRouter.post('/', protect, createOffer);


offerRouter.get('/my', protect, getMyOffers);


offerRouter.put('/:id/accept', protect, acceptOffer);
offerRouter.put('/:id/reject', protect, rejectOffer);

export default offerRouter;


