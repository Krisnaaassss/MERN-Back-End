import asyncHandler from "../middlewares/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  res.send("Create Product");
});

export const allProduct = asyncHandler(async (req, res) => {
  res.send("All Product");
});

export const detailProduct = asyncHandler(async (req, res) => {
  res.send("detail Product");
});

export const updateProduct = asyncHandler(async (req, res) => {
  res.send("update Product");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  res.send("delete Product");
});

export const fileUpload = asyncHandler(async (req, res) => {
  res.send("File Upload");
});
