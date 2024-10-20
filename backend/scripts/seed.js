// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import FoodItem from "../models/FoodItem.js"; // Don't forget to include the .js extension

dotenv.config();

const seedData = [
  {
    img: "/path/to/burger.png",
    title: "Burger",
    price: 3.89,
    text: "Click Me!",
  },
  { img: "/path/to/fries.png", title: "Fries", price: 1.99, text: "Click Me!" },
  {
    img: "/path/to/shakes.png",
    title: "Shakes",
    price: 2.99,
    text: "Click Me!",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await FoodItem.deleteMany(); // Optional: Clears existing data
    await FoodItem.insertMany(seedData);
    console.log("Data seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  });
