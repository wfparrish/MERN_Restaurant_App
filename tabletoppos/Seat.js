import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Seat = ({ seatNumber, onSeatSelect }) => {
  return (
    <TouchableOpacity style={styles.seatCard} onPress={onSeatSelect}>
      <Text style={styles.seatText}>Seat {seatNumber + 1}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seatCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    minWidth: 160,
  },
  seatText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Seat;
