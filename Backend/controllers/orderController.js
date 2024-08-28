import asyncHandler from "../middlewares/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "Order Created",
  });
});

export const allOrder = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "All Order Created",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Detail Order Created",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Suscess Get Current User Order",
  });
});
