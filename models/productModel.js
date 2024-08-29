import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama product wajib diisi"],
    unique: [true, "Nama product sudah terdaftar"],
  },
  price: {
    type: String,
    required: [true, "Harga product wajib diisi"],
  },
  description: {
    type: String,
    required: [true, "Deskripsi wajib diisi"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Kategori product wajib diisi"],
    enum: ["sepatu", "kemeja", "baju", "celana"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
