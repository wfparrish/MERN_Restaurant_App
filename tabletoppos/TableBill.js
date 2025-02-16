import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

/**
 * We removed the local fetch call and state from TableBill.
 * Instead, TableBill now expects to get an array of seat objects from its parent
 * so it can display the entire table's items.
 *
 * However, in this simpler version, we have TableBill *inside* OrdersSector, 
 * so it doesn't get direct props from TableTop (the parent).
 * We'll handle that by modifying OrdersSector to pass the entire table's data, 
 * or we can fetch from context. 
 *
 * For now, we can just do a dummy display, or consider rewriting 
 * so TableBill also receives 'tableOrders' from TableTop directly.
 */

// If you truly want TableBill to show the entire table's data, 
// pass that data in as a prop. For instance:
// <TableBill tableOrders={tableOrders} />

const TableBill = ({ tableOrders = [] }) => {
  // Flatten all seats' items
  const allItems = tableOrders.flatMap((seat) => seat.items || []);

  const calculateTotal = () => {
    return tableOrders
      .reduce((sum, seat) => {
        const seatTotal = seat.items?.reduce(
          (subtotal, item) => subtotal + item.price * item.quantity,
          0
        ) || 0;
        return sum + seatTotal;
      }, 0)
      .toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Table 1 Bill</Text>
      {allItems.length > 0 ? (
        <FlatList
          data={allItems}
          keyExtractor={(_, index) => index.toString()}
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
