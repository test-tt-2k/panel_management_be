import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import memberRoutes from "./routes/members.js";
import dataRoutes from "./routes/datas.js";

const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("connected to DB");
    })
    .catch(err => {
      throw err;
    });
};

app.use(cookieParser());
app.use(express.json());

app.use(cors());

app.use("/api/v1/member", memberRoutes);
app.use("/api/v1/data", dataRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.set("trust proxy", true);

app.listen(8800 || process.env.PORT, () => {
  connect();
  console.log("connected to Server");
});
