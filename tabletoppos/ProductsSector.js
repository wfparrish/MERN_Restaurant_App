import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductsSector = () => {
  return <View style={styles.productsSector} />;
};

const styles = StyleSheet.create({
  productsSector: {
    flex: 0.5, // 50% of main row
    backgroundColor: '#b2ebf2',
    marginRight: 5,
    width: '100%',
  },
});

export default ProductsSector;
