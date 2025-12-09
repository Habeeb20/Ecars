import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { reportScam, requestCar, reportStolenCar, getMyReports } from '../controllers/reportController.js';


const reportRouter = express.Router();

reportRouter.use(protect); // All require login

reportRouter.post('/scam', reportScam);
reportRouter.post('/request', requestCar);
reportRouter.post('/stolen', reportStolenCar);
reportRouter.get('/my', getMyReports);

export default reportRouter;