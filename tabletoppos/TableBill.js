// TableBill.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const TableBill = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchTableOrders();
  }, []);

  const fetchTableOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders/table/0");
      if (!response.ok) {
        throw new Error(`Error fetching table orders: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching table orders:", err);
    }
  };

  const calculateTotal = () => {
    return orders
      .reduce((total, order) => {
        return (
          total +
          order.items.reduce(
            (seatTotal, item) => seatTotal + item.price * item.quantity,
            0
          )
        );
      }, 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Table 1 Bill</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders.flatMap((order) => order.items)}
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
      <Text style={styles.total}>Total Amount: ${calculateTotal()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  noItems: {
    fontSize: 16,
    color: "#999",
    marginVertical: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default TableBill;
