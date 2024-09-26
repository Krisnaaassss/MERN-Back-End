import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    message: "Product Created",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  //request query
  const queryObj = { ...req.query };

  // untuk menghilangkan page dan limit dari query
  const excludeFields = ["page", "limit", "name"];
  excludeFields.forEach((element) => delete queryObj[element]);

  let query;

  if (req.query.name) {
    query = Product.find({
      name: {
        $regex: req.query.name,
        $options: "i",
      },
    });
  } else {
    query = Product.find();
  }

  //pagination
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 10;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments(queryObj);
  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("Page Not Found");
    }
  }

  const data = await query;
  const totalPage = Math.ceil(countProduct / limitData);

  res.status(201).json({
    message: "Berhasil Menampilkan Product",
    data: data,
    pagination: {
      totalPage,
      page,
      totalProduct: countProduct,
    },
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
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["jpg", "png"],
    },
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "gagal upload", error: error });
      }
      res.json({
        message: "success upload",
        url: result.secure_url,
      });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
