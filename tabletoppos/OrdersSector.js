import React from 'react';
import { View, StyleSheet } from 'react-native';

const OrdersSector = () => {
  return <View style={styles.ordersSector} />;
};

const styles = StyleSheet.create({
  ordersSector: {
    flex: 1, // ✅ Takes up 1 part of the row
    backgroundColor: "#d1c4e9",
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
});

export default OrdersSector;
