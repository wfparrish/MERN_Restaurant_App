import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

// Function to return the correct image require() statement
const getImage = (title) => {
  if (!title) return null; // Safety check

  switch (title.toLowerCase()) {
    case "burger":
      return require("./assets/images/burger.jpg");
    case "fries":
      return require("./assets/images/fries.jpg");
    case "shakes":
      return require("./assets/images/shakes.jpg");
    default:
      return null; // No fallback image
  }
};


const FoodItem = ({ title, price, text, onAddToOrder }) => {
  const imageSource = getImage(title);

  return (
    <View style={styles.card}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <Text>No Image Found</Text>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
      <Button title={text} onPress={onAddToOrder} />
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 5,
  },
});

export default FoodItem;
