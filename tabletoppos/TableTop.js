import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MenusSector from "./MenusSector";
import ProductsSector from "./ProductsSector";
import OrdersSector from "./OrdersSector";
import HeaderSector from "./HeaderSector";
import SeatsSector from "./SeatsSector";

/**
 * The "parent" component that:
 * 1) Fetches the entire table's orders on mount and stores them in 'tableOrders'.
 * 2) Passes seat-specific data down to OrdersSector for display.
 * 3) Passes the entire tableOrders array to TableBill.
 * 4) Provides a function 'addItemToSeat' that child components can call to add a new item.
 */
const TableTop = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  // This state holds the entire table's orders. Each entry might look like:
  // { seatIndex: 0, tableIndex: 0, items: [ {title: 'Burger', price: 3.89, ...}, ... ] }
  const [tableOrders, setTableOrders] = useState([]);

  // Fetch the entire table's orders once on mount.
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
      // This data is an array of seats, e.g. [{ seatIndex: 0, items: [...]}, ...]
      setTableOrders(data || []);
    } catch (err) {
      console.error("Error fetching table orders:", err);
    }
  };

  /**
   * Called by ProductsSector (or anywhere else) to add an item to a seat's order.
   */
  const addItemToSeat = async (seatIndex, newItem) => {
    try {
      // 1) Find the seat object in our current state.
      const seatObj = tableOrders.find((o) => o.seatIndex === seatIndex);
      if (!seatObj) {
        console.warn(`Seat ${seatIndex} not found in tableOrders.`);
        return;
      }
      // 2) Create a new array of items with the appended item.
      const updatedItems = [...seatObj.items, newItem];

      // 3) PUT to server to update that seat's items
      const putResp = await fetch(`http://localhost:5000/api/orders/0/${seatIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
      if (!putResp.ok) {
        throw new Error(`Error updating order: ${putResp.statusText}`);
      }

      // 4) Re-fetch the entire table so we have fresh state
      await fetchTableOrders();
    } catch (err) {
      console.error("Error adding item to seat:", err);
    }
  };

  // Extract the items array for the currently selected seat.
  // If no seat is selected, it can be an empty array.
  const currentSeatItems =
    tableOrders.find((seatOrder) => seatOrder.seatIndex === selectedSeat)?.items || [];

  return (
    <View style={styles.container}>
      <HeaderSector />

      <View style={styles.mainRow}>
        <MenusSector />

        {/* 
          Pass selectedSeat and addItemToSeat so that 
          ProductsSector can add items to the correct seat.
        */}
        <ProductsSector
          selectedSeat={selectedSeat}
          addItemToSeat={addItemToSeat}
        />

        {/*
          OrdersSector now just receives the items for the selected seat 
          (no internal fetch needed). 
        */}
        <OrdersSector
          selectedSeat={selectedSeat}
          seatItems={currentSeatItems}
          onBackToTableBill={() => setSelectedSeat(null)}
          tableOrders={tableOrders} // pass the entire array
        />

      </View>

      <SeatsSector onSeatSelect={setSelectedSeat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 5,
    width: "100%",
  },
  mainRow: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
});

export default TableTop;
