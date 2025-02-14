import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import FoodItem from "./FoodItem";

const API_URL = "http://localhost:5000/api/food-items"; // Adjust if using a real device

const MenusSector = () => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Food items received:", data); // Log the API response
        setFoodItems(data);
      })
      .catch((error) => console.error("Error fetching food items:", error));
  }, []);


  return (
    <View style={styles.menusSector}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <FoodItem
            title={item.title}
            price={item.price}
            text={item.text}
            onAddToOrder={() => alert(`Added ${item.title} to cart!`)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menusSector: {
    flex: 0.2,
    backgroundColor: "#ffab91",
    padding: 10,
    width: "100%",
  },
});

export default MenusSector;
