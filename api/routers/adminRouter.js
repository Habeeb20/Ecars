import express from "express"
import { adminLogin, approveDealer, approveServiceProvider, blacklistUser, createSuperAdmin, getAllCarsAdmin, getAllDealersAdmin, getAllServiceProviders, getAllUsers, getBlacklistedUsers, getPendingDealers, getPendingServiceProvider, makeCarFeatured, makeCarNewest, makeDealerFeatured, makeServiceProviderFeatured, rejectDealer, rejectserviceProvider, unblacklistUser, verifyUserEmail } from "../controllers/adminController.js";
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
adminRouter.get('/service-providers/pending', getPendingServiceProvider);

adminRouter.put('/service-providers/:id/approve', approveServiceProvider);

adminRouter.put('/service-providers/:id/reject', rejectserviceProvider);
adminRouter.get('/service-providers', getAllServiceProviders);

adminRouter.get('/cars', getAllCarsAdmin);
adminRouter.get('/dealers', getAllDealersAdmin);

adminRouter.patch('/cars/:id/featured', makeCarFeatured);
adminRouter.patch('/cars/:id/newest', makeCarNewest);
adminRouter.patch('/dealers/:id/featured', makeDealerFeatured);
adminRouter.patch('/service-providers/:id/featured', makeServiceProviderFeatured);
adminRouter.post("/blacklist", blacklistUser)
adminRouter.delete('/blacklist/:userId', unblacklistUser)
adminRouter.get('/blacklisted', getBlacklistedUsers)


export default adminRouter















