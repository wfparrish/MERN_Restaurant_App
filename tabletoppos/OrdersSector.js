// OrdersSector.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TableBill from './TableBill';
import CurrentOrder from './CurrentOrder';

const OrdersSector = ({ selectedSeat, onBackToTableBill }) => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (selectedSeat !== null) {
      fetchSeatOrder(selectedSeat);
    }
  }, [selectedSeat]);

  const fetchSeatOrder = async (seatNumber) => {
    try {
      const seatIndex = seatNumber - 1; // Convert to zero-based index
      const response = await fetch(`http://localhost:5000/api/orders/0/${seatIndex}`);
      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }
      const data = await response.json();
      setOrder(data.items || []);
    } catch (err) {
      console.error('Error fetching order:', err);
    }
  };

  return (
    <View style={styles.ordersSector}>
      {selectedSeat === null ? (
        <TableBill />
      ) : (
        <CurrentOrder
          seatNumber={selectedSeat}
          order={order}
          onBackToTableBill={onBackToTableBill}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ordersSector: {
    flex: 1,
    backgroundColor: '#d1c4e9',
    width: '100%',
    padding: 10,
  },
});

export default OrdersSector;
