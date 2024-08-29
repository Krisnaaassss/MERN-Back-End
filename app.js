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

dotenv.config();

const app = express();
const port = 3000;

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
