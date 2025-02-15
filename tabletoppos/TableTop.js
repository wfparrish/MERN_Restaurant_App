import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MenusSector from "./MenusSector";
import ProductsSector from "./ProductsSector";
import OrdersSector from "./OrdersSector";
import HeaderSector from "./HeaderSector";
import SeatsSector from "./SeatsSector";

const TableTop = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  return (
    <View style={styles.container}>
      <HeaderSector />
      <View style={styles.mainRow}>
        <MenusSector />
        <ProductsSector />
        <OrdersSector selectedSeat={selectedSeat} onBackToTableBill={() => setSelectedSeat(null)} />
      </View>
      <SeatsSector onSeatSelect={setSelectedSeat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 5,
    width: "100%",
  },
  mainRow: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
});

export default TableTop;
