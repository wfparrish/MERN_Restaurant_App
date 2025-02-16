import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import FoodItem from "./FoodItem";

const API_URL = "http://localhost:5000/api/food-items";

/**
 * ProductsSector now accepts:
 *  - selectedSeat  => which seat to add items to
 *  - addItemToSeat => function from TableTop that does the PUT + state update
 */
const ProductsSector = ({ selectedSeat, addItemToSeat }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) =>
        console.error("Error fetching food items:", error)
      );

    const updateWidth = () =>
      setScreenWidth(Dimensions.get("window").width);
    Dimensions.addEventListener("change", updateWidth);

    return () =>
      Dimensions.removeEventListener("change", updateWidth);
  }, []);

  // We handle the click event by calling the parent's addItemToSeat
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

  return (
    <View style={styles.productsSector}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.title}
        numColumns={screenWidth > 768 ? 3 : 2}
        renderItem={({ item }) => (
          <FoodItem
            title={item.title}
            price={item.price}
            text={item.text || "CLICK ME!"}
            onAddToOrder={() => handleAddToOrder(item)}
          />
        )}
        columnWrapperStyle={styles.row}
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
