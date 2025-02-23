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
  const [selectedMenu, setSelectedMenu] = useState("Lunch"); // Default menu
  const [tableOrders, setTableOrders] = useState([]);
  const isFetched = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isFetched.current) {
      fetchTableOrders();
      isFetched.current = true;
    }
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("orderUpdated", () => {
      fetchTableOrders();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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

  const currentSeatItems =
    tableOrders.find((o) => o.seatIndex === selectedSeat)?.items || [];

  return (
    <View style={styles.container}>
      <HeaderSector />
      <View style={styles.mainRow}>
        {/* MenusSector should be on the left side */}
        <View style={styles.leftColumn}>
          <MenusSector onSelectMenu={setSelectedMenu} />
        </View>

        {/* Middle Section - Products Display */}
        <View style={styles.middleColumn}>
          <ProductsSector 
            selectedSeat={selectedSeat} 
            addItemToSeat={addItemToSeat} 
            selectedMenu={selectedMenu} 
          />
        </View>

        {/* Right Section - Orders Display */}
        <View style={styles.rightColumn}>
          <OrdersSector 
            selectedSeat={selectedSeat} 
            seatItems={currentSeatItems} 
            onBackToTableBill={() => setSelectedSeat(null)} 
            tableOrders={tableOrders} 
          />
        </View>
      </View>

      {/* Bottom Row - Seats Selection */}
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
    flexDirection: "row", // Keep sections side by side
    width: "100%",
  },
  leftColumn: {
    flex: 0.2, // Make MenusSector smaller in width
    backgroundColor: "#FF9966", // Keep it distinct
    padding: 10,
  },
  middleColumn: {
    flex: 0.6, // Make Product Sector the main part
    backgroundColor: "#E0F7FA",
    padding: 10,
  },
  rightColumn: {
    flex: 0.2, // OrdersSector should remain smaller
    backgroundColor: "#E1BEE7",
    padding: 10,
  },
});

export default TableTop;
