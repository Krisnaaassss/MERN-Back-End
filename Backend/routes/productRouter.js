import express from "express";
import {
  createProduct,
  allProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
} from "../controllers/productController.js";

const router = express.Router();

//ROUTE CRUD
// CREATE
// post/api/v1/product
//middleware auth
router.post("/", createProduct);

// READ
// get/api/v1/product
router.get("/", allProduct);

//Detail Product
// get/api/v1/product/:id
router.get("/:id", detailProduct);

// UPDATE
// put/api/v1/product/:id
//middleware auth
router.put("/:id", updateProduct);

// DELETE
// delete/api/v1/product/:id
//middleware auth
router.delete("/:id", deleteProduct);

//File Upload
//post/api/v1/product/upload
//middleware auth
router.post("/upload", fileUpload);

export default router;
