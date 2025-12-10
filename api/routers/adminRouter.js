import express from "express"
import { adminLogin, approveDealer, createSuperAdmin, getAllCarsAdmin, getAllDealersAdmin, getAllUsers, getPendingDealers, makeCarFeatured, makeCarNewest, makeDealerFeatured, makeServiceProviderFeatured, rejectDealer, verifyUserEmail } from "../controllers/adminController.js";
import { protect } from "../middleware/verifyToken.js";
import { restrictTo } from "../middleware/verifyToken.js";

const adminRouter = express.Router()



adminRouter.post('/create-superadmin', createSuperAdmin); 
adminRouter.post('/login', adminLogin)


adminRouter.use(protect);                    

adminRouter.use(restrictTo('superadmin'));   

adminRouter.put('/users/:id/verify-email', protect, restrictTo('superadmin'), verifyUserEmail);
adminRouter.get("/allusers", getAllUsers)
adminRouter.get('/dealers/pending', getPendingDealers);

adminRouter.put('/dealers/:id/approve', approveDealer);

adminRouter.put('/dealers/:id/reject', rejectDealer);


adminRouter.get('/cars', getAllCarsAdmin);
adminRouter.get('/dealers', getAllDealersAdmin);

adminRouter.patch('/cars/:id/featured', makeCarFeatured);
adminRouter.patch('/cars/:id/newest', makeCarNewest);
adminRouter.patch('/dealers/:id/featured', makeDealerFeatured);
adminRouter.patch('/service-providers/:id/featured', makeServiceProviderFeatured);


export default adminRouter















