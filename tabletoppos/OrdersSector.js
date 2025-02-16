// OrdersSector.js
import React from "react";
import { View, StyleSheet } from "react-native";
import TableBill from "./TableBill";
import CurrentOrder from "./CurrentOrder";

/**
 * This OrdersSector component:
 *  - If 'selectedSeat' is null, we display TableBill with the entire tableOrders
 *  - If 'selectedSeat' is a valid seat index, we display CurrentOrder for just that seat.
 */
const OrdersSector = ({
  selectedSeat,
  seatItems,      // array of items for the currently selected seat
  tableOrders,    // array of all seat objects, e.g. [{ seatIndex, items }, ...]
  onBackToTableBill
}) => {
  return (
    <View style={styles.ordersSector}>
      {selectedSeat === null ? (
        // Show the entire table's bill if no seat is selected
        <TableBill tableOrders={tableOrders} />
      ) : (
        // Show the selected seat's order
        <CurrentOrder
          seatNumber={selectedSeat}
          order={seatItems}
          onBackToTableBill={onBackToTableBill}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ordersSector: {
    flex: 1,
    backgroundColor: "#d1c4e9",
    width: "100%",
    padding: 10,
  },
});

export default OrdersSector;
