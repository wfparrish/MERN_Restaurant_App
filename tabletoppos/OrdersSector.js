import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import TableBill from "./TableBill";
import CurrentOrder from "./CurrentOrder";

const OrdersSector = ({ selectedSeat, onBackToTableBill }) => {
  // `order` will hold the array of items for the currently selected seat
  const [order, setOrder] = useState([]);

  useEffect(() => {
    console.log("OrdersSector -> useEffect triggered");
    console.log("selectedSeat:", selectedSeat);
    if (selectedSeat !== null) {
      // Whenever `selectedSeat` changes from null to a valid seat, fetch the seat's order.
      fetchSeatOrder(selectedSeat);
    } else {
      // If no seat is selected, clear out the order or keep it as an empty array
      setOrder([]);
    }
  }, [selectedSeat]);

  const fetchSeatOrder = async (seatNumber) => {
    try {
      // Adjust indexing as needed: if your API expects 0-based, seatNumber might be okay as-is
      // or you might do const seatIndex = seatNumber - 1.
      const seatIndex = seatNumber;
      console.log("Fetching order for seatIndex:", seatIndex);

      const response = await fetch(`http://localhost:5000/api/orders/0/${seatIndex}`);
      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      // If your API returns something like { items: [...] } for a seat,
      // you might do `setOrder(data.items || [])`.
      setOrder(data.items || []);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  console.log("OrdersSector -> Rendering with selectedSeat:", selectedSeat);
  console.log("OrdersSector -> Current `order` state:", order);

  return (
    <View style={styles.ordersSector}>
      {selectedSeat === null ? (
        <TableBill />
      ) : (
        <CurrentOrder
          seatNumber={selectedSeat}
          order={order}  // Passing the array of items down as 'order'
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
