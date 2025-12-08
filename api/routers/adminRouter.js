import express from "express"
import { approveDealer, createSuperAdmin, getPendingDealers, rejectDealer } from "../controllers/adminController.js";
import { protect } from "../middleware/verifyToken.js";
import { restrictTo } from "../middleware/verifyToken.js";

const adminRouter = express.Router()



adminRouter.post('/create-superadmin', createSuperAdmin); 



adminRouter.use(protect);                    

adminRouter.use(restrictTo('superadmin'));   


adminRouter.get('/dealers/pending', getPendingDealers);

adminRouter.put('/dealers/:id/approve', approveDealer);

adminRouter.put('/dealers/:id/reject', rejectDealer);

export default adminRouter