import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    message: "Product Created",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  const data = await Product.find();

  res.status(201).json({
    message: "Berhasil Menampilkan All Product",
    data: data,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const ProductData = await Product.findById(paramsId);

  if (!ProductData) {
    res.status(404);
    throw new Error("Product Not Found");
  }

  res.status(201).json({
    message: "Berhasil Menemukan Product",
    data: ProductData,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const updateProduct = await Product.findByIdAndUpdate(paramsId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    message: "Product Updated",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  await Product.findByIdAndDelete(paramsId);
  res.status(201).json({
    message: "Product Deleted",
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  res.send("File Upload");
});
