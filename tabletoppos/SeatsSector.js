import React from 'react';
import { View, StyleSheet } from 'react-native';

const SeatsSector = () => {
  return <View style={styles.seatsSector} />;
};

const styles = StyleSheet.create({
  seatsSector: {
    flex: 0.1, // 10% height
    backgroundColor: '#f48fb1',
    marginTop: 5,
    width: '100%',
  },
});

export default SeatsSector;
