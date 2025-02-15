import React from "react";
import { View, StyleSheet } from "react-native";
import Seat from "./Seat";

const SeatsSector = () => {
  const seats = [1, 2, 3, 4]; // Assuming 4 seats

  return (
    <View style={styles.seatsSector}>
      {seats.map((seat) => (
        <Seat key={seat} seatNumber={seat} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  seatsSector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f48fb1", // Keep pink background
    paddingVertical: 10,
    height: 80, // 🔥 Fixed height to prevent expansion
  },
});

export default SeatsSector;
