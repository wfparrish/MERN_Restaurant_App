import React from 'react';
import { View, StyleSheet } from 'react-native';

const OrdersSector = () => {
  return <View style={styles.ordersSector} />;
};

const styles = StyleSheet.create({
  ordersSector: {
    flex: 0.3, // 30% of main row
    backgroundColor: '#d1c4e9',
    width: '100%',
  },
});

export default OrdersSector;
