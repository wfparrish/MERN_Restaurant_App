import React from 'react';
import { View, StyleSheet } from 'react-native';

const MenusSector = () => {
  return <View style={styles.menusSector} />;
};

const styles = StyleSheet.create({
  menusSector: {
    flex: 0.2, // 20% of main row
    backgroundColor: '#ffab91',
    marginRight: 5,
    width: '100%',
  },
});

export default MenusSector;
