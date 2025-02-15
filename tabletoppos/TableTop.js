import React from 'react';
import { View, StyleSheet } from 'react-native';
import MenusSector from './MenusSector';
import ProductsSector from './ProductsSector';
import OrdersSector from './OrdersSector';
import HeaderSector from './HeaderSector';
import SeatsSector from './SeatsSector';

const TableTop = () => {
  return (
    <View style={styles.container}>
      <HeaderSector />
      <View style={styles.mainRow}>
        <MenusSector />
        <ProductsSector />
        <OrdersSector />
      </View>
      <SeatsSector />
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
    flex: 1, // ✅ Ensures proper distribution
    flexDirection: "row",
    width: "100%",
  },
});


export default TableTop;
