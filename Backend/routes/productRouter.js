import express from "express";
import {
  protectMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import {
  createProduct,
  allProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
} from "../controllers/productController.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

//ROUTE CRUD
// CREATE
// post/api/v1/product
//middleware auth
router.post("/", protectMiddleware, adminMiddleware, createProduct);

// READ
// get/api/v1/product
router.get("/", allProduct);

//Detail Product
// get/api/v1/product/:id
router.get("/:id", detailProduct);

// UPDATE
// put/api/v1/product/:id
//middleware auth
router.put("/:id", protectMiddleware, adminMiddleware, updateProduct);

// DELETE
// delete/api/v1/product/:id
//middleware auth
router.delete("/:id", protectMiddleware, adminMiddleware, deleteProduct);

//File Upload
//post/api/v1/product/upload
//middleware auth
router.post(
  "/upload",
  protectMiddleware,
  adminMiddleware,
  upload.single("image"),
  fileUpload
);

export default router;
