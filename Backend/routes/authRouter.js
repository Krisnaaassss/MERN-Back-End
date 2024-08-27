import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protectMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//post/api/v1/auth/register
router.post("/register", registerUser);

//post/api/v1/auth/login
router.post("/login", loginUser);

//get/api/v1/auth/logut
router.get("/logout", (req, res) => {
  res.send("Logout");
});

//get/api/v1/auth/getuser
router.get("/getuser", protectMiddleware, (req, res) => {
  res.send("Getuser");
});

export default router;
