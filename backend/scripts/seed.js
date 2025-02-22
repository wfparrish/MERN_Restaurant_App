// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import FoodItem from "../models/FoodItem.js"; // Make sure the path is correct

dotenv.config();

const seedData = [
  {
    img: "/path/to/burger.png",
    title: "Burger",
    price: 3.89,
    text: "Click Me!",
    menuType: "Lunch",
  },
  {
    img: "/path/to/fries.png",
    title: "Fries",
    price: 1.99,
    text: "Click Me!",
    menuType: "Lunch",
  },
  {
    img: "/path/to/shakes.png",
    title: "Shakes",
    price: 2.99,
    text: "Click Me!",
    menuType: "Lunch",
  },
  {
    img: "/path/to/pancakes.png",
    title: "Pancakes",
    price: 4.99,
    text: "Click Me!",
    menuType: "Breakfast",
  },
  {
    img: "/path/to/eggs.png",
    title: "Eggs",
    price: 2.50,
    text: "Click Me!",
    menuType: "Breakfast",
  },
  {
    img: "/path/to/bacon.png",
    title: "Bacon",
    price: 3.00,
    text: "Click Me!",
    menuType: "Breakfast",
  },
  {
    img: "/path/to/coffee.png",
    title: "Coffee",
    price: 1.99,
    text: "Click Me!",
    menuType: "Breakfast",
  },
  {
    img: "/path/to/steak.png",
    title: "Steak",
    price: 12.99,
    text: "Click Me!",
    menuType: "Dinner",
  },
  {
    img: "/path/to/potatoes.png",
    title: "Potatoes",
    price: 4.50,
    text: "Click Me!",
    menuType: "Dinner",
  },
  {
    img: "/path/to/veggies.png",
    title: "Veggies",
    price: 3.99,
    text: "Click Me!",
    menuType: "Dinner",
  },
  {
    img: "/path/to/beer.png",
    title: "Beer",
    price: 5.00,
    text: "Click Me!",
    menuType: "Dinner",
  },
  {
    img: "/path/to/icecream.png",
    title: "Ice Cream",
    price: 3.50,
    text: "Click Me!",
    menuType: "Dessert",
  },
  {
    img: "/path/to/donut.png",
    title: "Donut",
    price: 2.50,
    text: "Click Me!",
    menuType: "Dessert",
  },
  {
    img: "/path/to/jello.png",
    title: "Jello",
    price: 2.00,
    text: "Click Me!",
    menuType: "Dessert",
  },
  {
    img: "/path/to/cake.png",
    title: "Cake",
    price: 4.99,
    text: "Click Me!",
    menuType: "Dessert",
  },
  {
    img: "/path/to/pie.png",
    title: "Pie",
    price: 3.99,
    text: "Click Me!",
    menuType: "Dessert",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await FoodItem.deleteMany(); // Clears existing data if desired
    await FoodItem.insertMany(seedData);
    console.log("Data seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  });
