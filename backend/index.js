// backend/index.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import foodItemsRouter from "./routes/foodItems.js";
import tablePositionsRouter from "./routes/tablePositions.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on your frontend's origin
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/food-items", foodItemsRouter);
app.use("/api/table-positions", tablePositionsRouter);
app.use("/api/orders", ordersRouter);

// Define a default route to prevent "Cannot GET /" error
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant App API");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
