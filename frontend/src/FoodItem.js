// frontend/src/components/FoodItem.js
import React from "react";

function FoodItem({ img, title, price, text, onAddToOrder }) {
  if (!img || !title || price === undefined || !text) {
    return null; // or a loading indicator
  }

  return (
    <div className="FoodItem">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={onAddToOrder}>{text}</button>
    </div>
  );
}

export default FoodItem;
