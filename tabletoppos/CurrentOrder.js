// CurrentOrder.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const CurrentOrder = ({ seatNumber, onBackToTableBill }) => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    fetchSeatOrder(seatNumber);
  }, [seatNumber]);

  const fetchSeatOrder = async (seatNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/0/${seatNumber}`);
      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }
      const data = await response.json();
      setOrder(data.items || []);
    } catch (err) {
      console.error('Error fetching order:', err);
    }
  };

  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Order for Seat {seatNumber + 1}</Text>
      {order.length > 0 ? (
        <FlatList
          data={order}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.orderItem}>
              {item.title} - ${item.price.toFixed(2)}
            </Text>
          )}
        />
      ) : (
        <Text style={styles.noItems}>No items ordered yet.</Text>
      )}
      <Text style={styles.total}>Total: ${calculateTotal()}</Text>
      <Button title="Back to Table Bill" onPress={onBackToTableBill} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  noItems: {
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CurrentOrder;
