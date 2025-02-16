import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";

const CurrentOrder = ({ seatNumber, order, onBackToTableBill }) => {
  // Debug logs to confirm props are received correctly
  console.log("CurrentOrder -> Received seatNumber:", seatNumber);
  console.log("CurrentOrder -> Received order:", order);

  // Calculate the total for the array of items
  const calculateTotal = () => {
    return order
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Order for Seat {seatNumber + 1}</Text>
      {order && order.length > 0 ? (
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

export default CurrentOrder;
