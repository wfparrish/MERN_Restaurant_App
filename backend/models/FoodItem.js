// models/FoodItem.js
import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  menuType: {
    type: String,
    required: true,  // e.g. "Breakfast", "Lunch", "Dinner", "Dessert"
  },
});

const FoodItem = mongoose.model("FoodItem", FoodItemSchema);
export default FoodItem;
