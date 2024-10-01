import express from "express";
import {
  adminMiddleware,
  protectMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  allOrder,
  callbackPayment,
  createOrder,
  currentUserOrder,
  detailOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// post /api/v1/order
// only user role has login
router.post("/", protectMiddleware, createOrder);

// get /api/v1/order
// only role admin
router.get("/", protectMiddleware, adminMiddleware, allOrder);

// get /api/v1/order/:id
// only role admin
router.get("/:id", protectMiddleware, adminMiddleware, detailOrder);

//get /api/v1/order/current/user
// only user role has login
router.get("/current/user", protectMiddleware, currentUserOrder);

//post /api/v1/order/callback/midtrans
router.post("/callback/midtrans", callbackPayment);

export default router;
