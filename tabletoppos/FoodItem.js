import React from "react";
import { View, Text, Image, Button, StyleSheet, Dimensions } from "react-native";

const getImage = (title) => {
  switch (title) {
    case "Burger":
      return require("./assets/images/burger.jpg");
    case "Fries":
      return require("./assets/images/fries.jpg");
    case "Shakes":
      return require("./assets/images/shakes.jpg");
    default:
      return null;
  }
};

const FoodItem = ({ title, price, text, onAddToOrder }) => {
  return (
    <View style={styles.card}>
      <Image source={getImage(title)} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
      <Button title={text} onPress={onAddToOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: Dimensions.get("window").width > 768 ? "30%" : "45%", // Adjust width dynamically
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 5,
  },
});

export default FoodItem;
