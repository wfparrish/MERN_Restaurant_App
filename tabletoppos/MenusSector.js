import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MenusSector = () => {
  return (
    <View style={styles.menusSector}>

    </View>
  );
};

const styles = StyleSheet.create({
  menusSector: {
    flex: 0.5,
    backgroundColor: "#ffab91",
    padding: 10,
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MenusSector;
