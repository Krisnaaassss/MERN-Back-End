import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, itemsDetail, cartItem } = req.body;

  if (!cartItem || cartItem.length < 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("ID Product Not Found");
    }
    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };
    total += cart.quantity * price;
    orderItem = [...orderItem, singleProduct];
  }

  const order = await Order.create({
    email,
    firstName,
    lastName,
    phone,
    itemsDetail: orderItem,
    total,
    user: req.user._id,
  });

  res.status(201).json({
    total,
    order,
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
