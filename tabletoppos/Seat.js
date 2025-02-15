// Seat.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Seat = ({ seatNumber }) => {
  return (
    <View style={styles.seatCard}>
      <Text style={styles.seatText}>Seat {seatNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  seatCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    margin: 8,
    borderRadius: 10, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
    minWidth: 160, // Ensures a good size for seats
  },
  seatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Seat;
