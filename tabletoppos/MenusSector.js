import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, FlatList, StyleSheet } from "react-native";

const API_URL = "http://localhost:5000/api/food-items"; // Change if using a device/emulator

const MenusSector = () => {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) => console.error("Error fetching food items:", error));
  }, []);

  return (
    <View style={styles.menusSector}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Button title={item.text} onPress={() => alert(`Added ${item.title} to cart!`)} />
          </View>
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

export default MenusSector;
