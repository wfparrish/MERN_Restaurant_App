import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import FoodItem from "./FoodItem";

const API_URL = "http://localhost:5000/api/food-items";

const ProductsSector = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) => console.error("Error fetching food items:", error));

    // Listen for window size changes
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    Dimensions.addEventListener("change", updateWidth);

    return () => Dimensions.removeEventListener("change", updateWidth);
  }, []);

  return (
    <View style={styles.productsSector}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.title}
        numColumns={screenWidth > 768 ? 3 : 2} // 3 columns on large screens, 2 on smaller ones
        renderItem={({ item }) => (
          <FoodItem title={item.title} price={item.price} text={item.text} onAddToOrder={() => alert(`Added ${item.title} to cart!`)} />
        )}
        columnWrapperStyle={styles.row} // Ensures spacing
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productsSector: {
    flex: 2, // ✅ Takes up 2 parts of the row, leaving 1 part for OrdersSector
    backgroundColor: "#b2ebf2",
    padding: 10,
    justifyContent: "center",
  },
  row: {
    justifyContent: "space-between", // ✅ Ensures proper spacing in the grid
  },
});


export default ProductsSector;
