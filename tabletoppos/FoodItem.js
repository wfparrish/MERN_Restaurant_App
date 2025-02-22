import React from "react";
import { View, Text, Image, Button, StyleSheet, Dimensions } from "react-native";

// 1) Create a dictionary of title → require(...) pairs
const images = {
  "Burger": require("./assets/images/burger.jpg"),
  "Fries": require("./assets/images/fries.jpg"),
  "Shakes": require("./assets/images/shakes.jpg"),
  "Pancakes": require("./assets/images/pancakes.jpg"),
  "Eggs": require("./assets/images/eggs.jpg"),
  "Bacon": require("./assets/images/bacon.jpg"),
  "Coffee": require("./assets/images/coffee.jpg"),
  "Steak": require("./assets/images/steak.jpg"),
  "Potatoes": require("./assets/images/potatoes.jpg"),
  "Veggies": require("./assets/images/veggies.jpg"),
  "Beer": require("./assets/images/beer.jpg"),
  "Ice Cream": require("./assets/images/icecream.jpg"),
  "Donut": require("./assets/images/donut.jpg"),
  "Jello": require("./assets/images/jello.jpg"),
  "Cake": require("./assets/images/cake.jpg"),
  "Pie": require("./assets/images/pie.jpg"),
};

// 2) Lookup function that returns the appropriate require(...) or null
const getImage = (title) => {
  return images[title] || null;
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
    width: Dimensions.get("window").width > 768 ? "30%" : "45%",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain", // or 'cover', etc.
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
