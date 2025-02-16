// TableTop.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { io } from "socket.io-client"; // <-- Import the client
import MenusSector from "./MenusSector";
import ProductsSector from "./ProductsSector";
import OrdersSector from "./OrdersSector";
import HeaderSector from "./HeaderSector";
import SeatsSector from "./SeatsSector";

const TableTop = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [tableOrders, setTableOrders] = useState([]);

  // We'll store our socket connection reference
  let socket;

  useEffect(() => {
    // 1) Initial fetch
    fetchTableOrders();

    // 2) Connect to Socket.IO (server must allow cross-origin from 19006, 8081, etc.)
    socket = io("http://localhost:5000");
    socket.on("connect", () => {
      console.log("[TableTop] Socket connected, ID:", socket.id);
    });

    // On "orderUpdated", refresh local state
    socket.on("orderUpdated", (payload) => {
      console.log("[TableTop] Received orderUpdated:", payload);
      // Re-fetch the entire table data
      fetchTableOrders();
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTableOrders = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/orders/table/0");
      if (!resp.ok) {
        throw new Error("Failed to fetch table orders");
      }
      const data = await resp.json();
      // data is an array of seat objects: e.g. [{ seatIndex, items: [...] }, ...]
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
      if (!seatObj) {
        console.warn(`[TableTop] Seat ${seatIndex} not found`);
        return;
      }
      const updatedItems = [...seatObj.items, newItem];

      // PUT
      const putResp = await fetch(`http://localhost:5000/api/orders/0/${seatIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updatedItems }),
      });
      if (!putResp.ok) {
        throw new Error("Failed to update seat items");
      }
      // We do NOT call fetchTableOrders() here, because the server
      // will emit "orderUpdated", which triggers it anyway.
      console.log("[TableTop] addItemToSeat - PUT success");
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
