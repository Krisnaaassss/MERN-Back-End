import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import midtrans from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

const snap = new midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let orderItems = [];
  let orderMidtrans = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findById(cart.product);
    if (!productData) {
      return res
        .status(404)
        .json({ message: `Product not found: ${cart.product}` });
    }

    const { name, price, _id } = productData;
    const quantity = parseInt(cart.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ message: `Invalid quantity for product: ${name}` });
    }

    const singleProduct = {
      quantity,
      name,
      price,
      product: _id,
    };

    const shortName = name.substring(0, 30);
    const singleProductMidtrans = {
      id: _id.toString(),
      price,
      quantity,
      name: shortName,
    };

    total += quantity * price;
    orderItems.push(singleProduct);
    orderMidtrans.push(singleProductMidtrans);
  }

  const order = await Order.create({
    email,
    firstName,
    lastName,
    phone,
    itemsDetail: orderItems,
    total,
    user: req.user._id,
  });

  const parameters = {
    transaction_details: {
      order_id: order._id.toString(), // harus di konversi ke string agar sesuai dengan tipe data yang diharapkan oleh Midtrans
      gross_amount: Math.round(total),
    },
    item_details: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    },
  };

  try {
    const token = await snap.createTransactionToken(parameters);
    res.status(201).json({
      orderId: order._id,
      total,
      message: "Order created successfully",
      token,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    res.status(500).json({ message: "Error creating payment token" });
  }
});

export const allOrder = asyncHandler(async (req, res) => {
  // Mendapatkan semua data order dari database
  const orders = await Order.find().sort({ createdAt: -1 });

  // Mengembalikan response dengan data order dalam format JSON
  res.status(200).json({
    orders,
    message: "All orders retrieved successfully",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json({
    data: order,
    message: "Order details retrieved successfully",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  //-1 dalam .sort() berarti mengurutkan data berdasarkan createdAt dalam urutan terbalik (baru ke lama). Jadi, order yang terbaru akan muncul di paling atas.
  const userOrders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    data: userOrders,
    message: "Current user orders retrieved successfully",
  });
});

export const callbackPayment = asyncHandler(async (req, res) => {
  const statusResponse = await snap.transaction.notification(req.body);

  let orderId = statusResponse.order_id;
  let transactionStatus = statusResponse.transaction_status;

  const orderData = await Order.findById(orderId);

  if (!orderData) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (transactionStatus == "capture" || transactionStatus == "settlement") {
    orderData.status = "success";
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    orderData.status = "failed";
  } else if (transactionStatus == "pending") {
    orderData.status = "pending";
  }

  await orderData.save();
  return res.status(200).send("Payment notification received successfully");
});
