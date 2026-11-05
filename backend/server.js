import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve Images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 ShopEasy Backend Running Successfully");
});

// Wait for MongoDB before handling API requests in serverless environments.
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Vercel mounts api/index.js at /api and may strip that prefix before Express sees the request.
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error.message);
  res.status(503).json({
    message: "The backend database is unavailable. Check the server configuration and try again.",
  });
});

// Start the server everywhere except when Vercel imports the app as a function.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server Running on Port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Failed:", error.message);
      process.exitCode = 1;
    });
}

export default app;