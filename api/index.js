import express from "express"


import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db.js";
import router from "./routers/userRouter.js";
import User from "./models/user.js";
import adminRouter from "./routers/adminRouter.js";
import carListingRouter from "./routers/carListingRoute.js"
import statsRoute from "./routers/statsRouter.js"
import reportRouter from "./routers/reportRoute.js";
import paymentRouter from "./routers/paymentRoute.js"
import plansRouter from "./routers/plansRoutes.js"
import valueRouter from "./routers/valueAssetsRoutes.js"
dotenv.config();
connectDb()

const app = express()


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));

///routes
app.get("/", (req, res) => {
  res.send("ecars backend is listening on port....");
});


app.use("/api/users", router)

app.use("/api/auth", router)
app.use("/api/admin", adminRouter)
app.use("/api/cars", carListingRouter)
app.use("/api/stats", statsRoute)
app.use("/api/reports", reportRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/subscriptions", plansRouter)
app.use("/api/value", valueRouter)


// await User.create({
//   firstName: 'Admin',
//   lastName: 'Boss',
//   email: 'ecars@gmail.com',
//   password: 'essential01',
//   role: 'superadmin'
// });

// console.log('Superadmin created!');


// Start server
const port = process.env.PORT || 2020;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})
