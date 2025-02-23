import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import FoodItem from "./FoodItem";

const API_URL = "http://localhost:5000/api/food-items";

const ProductsSector = ({ selectedSeat, addItemToSeat, selectedMenu }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    // Fetch all food items from the server
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) => console.error("Error fetching food items:", error));

    // Listen for screen size changes so we can adjust how many columns we show
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    Dimensions.addEventListener("change", updateWidth);

    // Cleanup the event listener when the component unmounts
    return () => {
      Dimensions.removeEventListener("change", updateWidth);
    };
  }, []);

  // Filter items based on the selected menu (e.g. "Breakfast", "Lunch", etc.)
  const filteredItems = selectedMenu
    ? foodItems.filter((item) => item.menuType === selectedMenu)
    : foodItems;

  // Handle the user tapping "CLICK ME!" or "Add to Order" (whatever text you pass in)
  const handleAddToOrder = (item) => {
    if (selectedSeat === null) {
      alert("Please select a seat first!");
      return;
    }
    addItemToSeat(selectedSeat, {
      title: item.title,
      price: item.price,
      quantity: 1,
    });
  };

  // Decide how many columns to use based on the screen width
  const numColumns = screenWidth > 768 ? 3 : 2;

  return (
    <View style={styles.productsSector}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.title}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <FoodItem
            title={item.title}
            price={item.price}
            text={item.text || "CLICK ME!"}
            onAddToOrder={() => handleAddToOrder(item)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productsSector: {
    flex: 2,
    backgroundColor: "#b2ebf2",
    padding: 10,
    justifyContent: "center",
  },
  row: {
    justifyContent: "space-between",
  },
});

export default ProductsSector;
