import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { reportScam, requestCar, reportStolenCar, getMyReports, getStolenCars, getAllReports } from '../controllers/reportController.js';


const reportRouter = express.Router();
reportRouter.get('/reports', getAllReports);
reportRouter.get("/stolencars", getStolenCars)
reportRouter.use(protect); // All require login

reportRouter.post('/scam', reportScam);
reportRouter.post('/request', requestCar);
reportRouter.post('/stolen', reportStolenCar);
// routes/reportRoutes.js

reportRouter.get('/my', getMyReports);

export default reportRouter;