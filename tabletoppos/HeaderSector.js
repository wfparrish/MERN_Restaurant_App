import React from 'react';
import { View, StyleSheet } from 'react-native';

const HeaderSector = () => {
  return <View style={styles.headerSector} />;
};

const styles = StyleSheet.create({
  headerSector: {
    flex: 0.1, // 10% height
    backgroundColor: '#90caf9',
    marginBottom: 5,
    width: '100%',
  },
});

export default HeaderSector;
