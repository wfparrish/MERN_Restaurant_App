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
    required: true,
  },
});

// Use `export default` instead of `module.exports`
const FoodItem = mongoose.model("FoodItem", FoodItemSchema);
export default FoodItem;
