import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ROUTE,
  credentials: true
})); 

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.json({
    message: "API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});