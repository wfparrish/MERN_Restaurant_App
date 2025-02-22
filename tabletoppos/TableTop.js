// TableTop.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { io } from "socket.io-client"; 
import MenusSector from "./MenusSector";
import ProductsSector from "./ProductsSector";
import OrdersSector from "./OrdersSector";
import HeaderSector from "./HeaderSector";
import SeatsSector from "./SeatsSector";

const TableTop = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [tableOrders, setTableOrders] = useState([]);
  const isFetched = useRef(false);
  const socketRef = useRef(null);

  // 🟢 Fetch orders once on mount
  useEffect(() => {
    if (!isFetched.current) {
      fetchTableOrders();
      isFetched.current = true;
    }
  }, []);

  // 🟢 Setup WebSocket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("orderUpdated", () => {
      fetchTableOrders(); // Fetch updated orders when an order is updated
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  /**
   * Fetch orders from backend
   */
  const fetchTableOrders = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/orders/table/0");
      if (!resp.ok) {
        throw new Error("Failed to fetch table orders");
      }
      const data = await resp.json();
      setTableOrders(data || []);
    } catch (err) {
      console.error("[TableTop] Error fetching table orders:", err);
    }
  };

  /**
   * Called by ProductsSector to add an item to the seat's order.
   */
  const addItemToSeat = async (seatIndex, newItem) => {
    try {
      const seatObj = tableOrders.find((o) => o.seatIndex === seatIndex);
      if (!seatObj) return;

      const updatedItems = [...seatObj.items, newItem];

      const putResp = await fetch(`http://localhost:5000/api/orders/0/${seatIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!putResp.ok) {
        throw new Error("Failed to update seat items");
      }
    } catch (err) {
      console.error("[TableTop] Error adding item:", err);
    }
  };

  // The selected seat's items (or an empty array)
  const currentSeatItems =
    tableOrders.find((o) => o.seatIndex === selectedSeat)?.items || [];

  return (
    <View style={styles.container}>
      <HeaderSector />
      <View style={styles.mainRow}>
        <MenusSector />
        <ProductsSector selectedSeat={selectedSeat} addItemToSeat={addItemToSeat} />
        <OrdersSector
          selectedSeat={selectedSeat}
          seatItems={currentSeatItems}
          onBackToTableBill={() => setSelectedSeat(null)}
          tableOrders={tableOrders}
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
