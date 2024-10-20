// frontend/src/components/Menu.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodItem from "./FoodItem";

function Menu({ addToOrder }) {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/food-items"
        );
        setFoodItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food items:", err);
        setError("Failed to load food items");
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="Menu">
      {foodItems.map((item) => (
        <FoodItem
          key={item._id}
          img={item.img}
          title={item.title}
          price={item.price}
          text={item.text}
          onAddToOrder={() => addToOrder(item)}
        />
      ))}
    </div>
  );
}

export default Menu;
