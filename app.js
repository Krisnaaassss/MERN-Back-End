import express from "express";
import authrouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const port = 3000;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Parent Router
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

//jika error
app.use(notFound);
app.use(errorHandler);

//Ini Server
app.listen(port, () => {
  console.log(`Running in Port ${port}`);
});

//Hubungkan ke DB
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Database Connection Error:", error);
  });
