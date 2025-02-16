// RestaurantMap.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // <-- Import Socket.IO client
import Table from "./Table";
import Sector from "./Sector";

function RestaurantMap() {
  const numberOfTables = 16;
  const seatsPerTable = 4; // Assuming 4 seats per table

  const [selectedTable, setSelectedTable] = useState(null);

  // 2D array of items: [ [ seat0Items, seat1Items, ...], ... ]
  const [orders, setOrders] = useState(
    Array.from({ length: numberOfTables }, () =>
      Array.from({ length: seatsPerTable }, () => [])
    )
  );

  const [tablePositions, setTablePositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const staffEvaluation = {
    condiments_ontable: 1,
    table_greeted_with_water: 1,
    water_refills: 0,
    order_taken_with_tablet: 1,
    prebussing_occurred: 0,
    time_spent_at_table: 12,
    time_until_first_appetizer_arrive: 5,
    time_until_first_drink_arrive: 2,
    time_until_entree_arrive: 15,
    time_until_dessert_arrive: 25,
    time_between_last_ring_and_check_presentation: 8,
    dessert_menu_offered: 1,
  };

  // We'll store a reference to our socket connection
  // so we don't re-connect repeatedly.
  // Alternatively, you can just do a local variable in useEffect.
  let socket;

  useEffect(() => {
    // 1) Initial data load
    fetchInitialData();

    // 2) Connect to Socket.IO server
    socket = io("http://localhost:5000", {
      // if needed: transports: ["websocket"]
    });

    socket.on("connect", () => {
      console.log("[RestaurantMap] Connected via socket:", socket.id);
    });

    // On "orderUpdated", re-fetch the entire set of orders
    socket.on("orderUpdated", (payload) => {
      console.log("[RestaurantMap] orderUpdated event received:", payload);
      fetchAllOrders();
    });

    socket.on("disconnect", () => {
      console.log("[RestaurantMap] Socket disconnected");
    });

    // Cleanup when unmounting
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For brevity, we separate out the order fetch into a function
  const fetchAllOrders = async () => {
    try {
      const ordersResponse = await axios.get("http://localhost:5000/api/orders");
      // Build the 2D array again
      const ordersData = Array.from({ length: numberOfTables }, () =>
        Array.from({ length: seatsPerTable }, () => [])
      );

      ordersResponse.data.forEach(({ tableIndex, seatIndex, items }) => {
        if (
          typeof tableIndex === "number" &&
          typeof seatIndex === "number" &&
          Array.isArray(items)
        ) {
          ordersData[tableIndex][seatIndex] = items;
        }
      });
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    }
  };

  const fetchInitialData = async () => {
    try {
      // Fetch table positions
      const positionsResponse = await axios.get(
        "http://localhost:5000/api/table-positions"
      );
      const positions = {};
      positionsResponse.data.forEach(({ tableIndex, x, y }) => {
        positions[tableIndex] = { x, y };
      });

      // Assign default positions to tables without positions
      for (let i = 0; i < numberOfTables; i++) {
        if (!positions[i]) {
          positions[i] = {
            x: (i % 5) * 100 + 20,
            y: Math.floor(i / 5) * 100 + 20,
          };
        }
      }
      setTablePositions(positions);

      // Fetch all orders
      await fetchAllOrders();

      setLoading(false);
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
  };

  // updateOrder, removeFromOrder, resetTablePositions, clearAllOrders, etc.
  // (unchanged from your existing code except for re-checking if you need
  // to do an additional re-fetch or rely on the socket event).
  // For brevity, we'll keep them as-is.

  const handleTablePositionChange = async (tableIndex, newPosition) => {
    setTablePositions((prev) => ({
      ...prev,
      [tableIndex]: newPosition,
    }));

    try {
      await axios.put(
        `http://localhost:5000/api/table-positions/${tableIndex}`,
        newPosition
      );
      console.log("Table position updated");
    } catch (err) {
      console.error("Error updating table position:", err);
    }
  };

  const updateOrder = (tableIndex, seatIndex, item) => {
    setOrders((prevOrders) => {
      const newOrders = [...prevOrders];
      newOrders[tableIndex] = [...newOrders[tableIndex]];
      newOrders[tableIndex][seatIndex] = [
        ...newOrders[tableIndex][seatIndex],
        item,
      ];

      // PUT to server
      axios
        .put(`http://localhost:5000/api/orders/${tableIndex}/${seatIndex}`, {
          items: newOrders[tableIndex][seatIndex],
        })
        .then((res) => {
          console.log("Order updated:", res.data);
          // No need to manually re-fetch, because "orderUpdated" event
          // will come from the server. But it's okay if you do re-fetch
          // for immediate local consistency.
          // fetchAllOrders();
        })
        .catch((err) => {
          console.error("Error updating order:", err);
        });
      return newOrders;
    });
  };

  const removeFromOrder = (tableIndex, seatIndex, itemIndex) => {
    setOrders((prev) => {
      const newOrders = [...prev];
      if (!newOrders[tableIndex] || !newOrders[tableIndex][seatIndex]) {
        return prev;
      }
      newOrders[tableIndex] = [...newOrders[tableIndex]];
      newOrders[tableIndex][seatIndex] = newOrders[tableIndex][seatIndex].filter(
        (_, idx) => idx !== itemIndex
      );

      axios
        .put(`http://localhost:5000/api/orders/${tableIndex}/${seatIndex}`, {
          items: newOrders[tableIndex][seatIndex],
        })
        .then((res) => {
          console.log("Order updated after removal:", res.data);
          // Again, the 'orderUpdated' event will come in,
          // so we can rely on that or re-fetch here.
        })
        .catch((err) => {
          console.error("Error removing item:", err);
        });

      return newOrders;
    });
  };

  const resetTablePositions = async () => {
    const confirmReset = window.confirm("Reset all table positions?");
    if (!confirmReset) return;

    try {
      const response = await axios.put("http://localhost:5000/api/table-positions/reset");
      const { positions } = response.data;

      const positionsObj = {};
      positions.forEach(({ tableIndex, x, y }) => {
        positionsObj[tableIndex] = { x, y };
      });

      setTablePositions(positionsObj);
      console.log("All table positions have been reset to default.");
    } catch (err) {
      console.error("Error resetting positions:", err);
      alert("Failed to reset table positions. Please try again.");
    }
  };

  const clearAllOrders = async () => {
    const confirmClear = window.confirm("Clear all orders?");
    if (!confirmClear) return;

    try {
      // Reset local state
      const cleared = Array.from({ length: numberOfTables }, () =>
        Array.from({ length: seatsPerTable }, () => [])
      );
      setOrders(cleared);

      // Instruct server to remove all docs
      await axios.put("http://localhost:5000/api/orders/clear-all");
      console.log("All orders have been cleared.");
      // The server should also emit an event if you coded that route similarly,
      // which calls 'orderUpdated' => which we might ignore or re-fetch here.
    } catch (err) {
      console.error("Error clearing orders:", err);
      alert("Failed to clear orders. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="restaurant-map" style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          flex: "0 0 50%",
          borderRight: "1px solid #ccc",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <Sector
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          numberOfTables={numberOfTables}
          tablePositions={tablePositions}
          onTablePositionChange={handleTablePositionChange}
          staffEvaluation={staffEvaluation}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={resetTablePositions}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset Table Positions
          </button>

          <button
            onClick={clearAllOrders}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear All Orders
          </button>
        </div>
      </div>

      <div
        style={{
          flex: "0 0 50%",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {selectedTable !== null ? (
          <Table
            tableIndex={selectedTable}
            orders={
              orders[selectedTable] ||
              Array.from({ length: seatsPerTable }, () => [])
            }
            updateOrder={updateOrder}
            removeFromOrder={removeFromOrder}
            closeTable={() => setSelectedTable(null)}
          />
        ) : (
          <div style={{ padding: "20px" }}>
            <h2>Select a table to view details</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantMap;
