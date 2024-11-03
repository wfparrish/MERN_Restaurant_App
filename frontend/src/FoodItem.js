// frontend/src/components/FoodItem.js
import React from "react";

function FoodItem({ img, title, price, text, onAddToOrder }) {
  //Construct the image path based on the title
  const imgSrc = `/images/${title.toLowerCase().replace(/ /g, "_")}.jpg`;

  if (!img || !title || price === undefined || !text) {
    return null; // or a loading indicator
  }

  return (
    <div className="FoodItem">
      <img src={imgSrc} alt={title} className="food-item-img" />
      <h3>{title}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={onAddToOrder}>{text}</button>
    </div>
  );
}

export default FoodItem;
