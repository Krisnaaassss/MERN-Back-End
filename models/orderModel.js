import mongoose from "mongoose";
const { Schema } = mongoose;

const singleProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total wajib diisi"],
  },
  itemsDetail: [singleProductSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  firstName: {
    type: String,
    required: [true, "Nama Depan wajib diisi"],
  },
  lastName: {
    type: String,
    required: [true, "Nama Belakang wajib diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor HP wajib diisi"],
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
