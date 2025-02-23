import React from "react";
import { View, Button, StyleSheet } from "react-native";

const menuTypes = ["Breakfast", "Lunch", "Dinner", "Dessert"];

const MenusSector = ({ onSelectMenu }) => {
  return (
    <View style={styles.container}>
      {menuTypes.map((menu) => (
        <View key={menu} style={styles.buttonContainer}>
          <Button title={menu} onPress={() => onSelectMenu(menu)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full height of the parent container
    justifyContent: "center", // Centers buttons vertically
    alignItems: "center", // Aligns buttons in the middle horizontally
    padding: 10,
    backgroundColor: "#FFA07A", // Light orange background
  },
  buttonContainer: {
    width: "80%", // Ensures buttons take up a good width
    marginVertical: 10, // Adds spacing between buttons
  },
});

export default MenusSector;
