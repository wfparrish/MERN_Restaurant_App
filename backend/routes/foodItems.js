// routes/foodItems.js
import express from "express";
import FoodItem from "../models/FoodItem.js"; // You must include the .js extension in ES modules

const router = express.Router();

// GET all food items
router.get("/", async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new food item
router.post("/", async (req, res) => {
  const { img, title, price, text } = req.body;

  const foodItem = new FoodItem({
    img,
    title,
    price,
    text,
  });

  try {
    const newFoodItem = await foodItem.save();
    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
