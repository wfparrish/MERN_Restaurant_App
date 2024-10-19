// Menu.js
import React from "react";
import FoodItem from "./FoodItem";

const foodItems = [
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

function Menu({ addToOrder }) {
  return (
    <div className="Menu">
      {foodItems.map((item, index) => (
        <FoodItem
          key={index}
          img={item.img}
          title={item.title}
          price={item.price}
          text={item.text}
          onAddToOrder={() => addToOrder(item)} // Pass the item to the addToOrder function
        />
      ))}
    </div>
  );
}

export default Menu;
