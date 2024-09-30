import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import midtrans from "midtrans-client";
import { dotenv } from "dotenv";

dotenv.config();

let snap = new midtrans.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, itemsDetail, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let orderItem = [];
  let orderMidtrans = [];
  let total = 0;

  //looping cartItem dan menghitung total
  for (const cart of cartItem) {
    //mencari product berdasarkan id yang dikirim
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("ID Product Not Found");
    }

    //membuat objek singleProduct yang berisi quantity, name, price dan id product
    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };

    const shortName = name.substring(0, 30);
    const singleProductMidtrans = {
      quantity: cart.quantity,
      name: shortName,
      price,
      id: _id,
    };

    //menambahkan total dengan hasil perkalian quantity dan price
    total += cart.quantity * price;

    //menambahkan objek singleProduct ke dalam array orderItem
    orderItem = [...orderItem, singleProduct];
    orderMidtrans = [...orderMidtrans, singleProductMidtrans];
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

  let parameters = {
    transaction_details: {
      order_id: order._id,
      gross_amount: total,
    },
    item_details: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    },
  };

  const token = await snap.createTransactionToken(parameters);

  res.status(201).json({
    total,
    order,
    message: "Order Created",
    token,
  });
});

export const allOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
    message: "All Order Created",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  res.status(200).json({
    data: order,
    message: "Detail Order Created",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const userOrder = await Order.find({ user: req.user._id });

  res.status(200).json({
    data: userOrder,
    message: "Suscess Get Current User Order",
  });
});
