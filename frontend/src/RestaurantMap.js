// RestaurantMap.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";
import Sector from "./Sector";

function RestaurantMap() {
  const numberOfTables = 16;
  const seatsPerTable = 4; // Assuming 4 seats per table

  const [selectedTable, setSelectedTable] = useState(null);

  const [orders, setOrders] = useState(
    Array.from({ length: numberOfTables }, () =>
      Array.from({ length: seatsPerTable }, () => [])
    )
  );

  const [tablePositions, setTablePositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch table positions and orders when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch table positions
        const positionsResponse = await axios.get('http://localhost:5000/api/table-positions');
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

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5000/api/orders');
        console.log('Orders Response:', ordersResponse.data); // For debugging

        // Initialize orders array
        const ordersData = Array.from({ length: numberOfTables }, () =>
          Array.from({ length: seatsPerTable }, () => [])
        );

        // Correctly process the fetched orders
        ordersResponse.data.forEach(({ tableIndex, seatIndex, items }) => {
          if (
            typeof tableIndex === 'number' &&
            typeof seatIndex === 'number' &&
            Array.isArray(items)
          ) {
            ordersData[tableIndex][seatIndex] = items;
          }
        });

        setOrders(ordersData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [numberOfTables, seatsPerTable]);

  const handleTablePositionChange = (tableIndex, newPosition) => {
    setTablePositions((prevPositions) => ({
      ...prevPositions,
      [tableIndex]: newPosition,
    }));

    // Save the updated position to the backend
    axios
      .put(`http://localhost:5000/api/table-positions/${tableIndex}`, newPosition)
      .then((response) => {
        console.log('Table position updated:', response.data);
      })
      .catch((err) => {
        console.error('Error updating table position:', err);
      });
  };

  const updateOrder = (tableIndex, seatIndex, item) => {
    setOrders((prevOrders) => {
      const newOrders = [...prevOrders];
      newOrders[tableIndex] = [...newOrders[tableIndex]];
      newOrders[tableIndex][seatIndex] = [...newOrders[tableIndex][seatIndex], item];

      // Save the updated order to the backend using the updated array
      axios
        .put(`http://localhost:5000/api/orders/${tableIndex}/${seatIndex}`, {
          items: newOrders[tableIndex][seatIndex],
        })
        .then((response) => {
          console.log('Order updated:', response.data);
        })
        .catch((err) => {
          console.error('Error updating order:', err);
        });

      return newOrders;
    });
  };

  const removeFromOrder = (tableIndex, seatIndex, itemIndex) => {
    setOrders((prevOrders) => {
      const newOrders = [...prevOrders];

      // Debugging logs
      console.log(`Table Index: ${tableIndex}`);
      console.log(`Seat Index: ${seatIndex}`);
      console.log('newOrders:', newOrders);
      console.log('newOrders[tableIndex]:', newOrders[tableIndex]);
      console.log('newOrders[tableIndex][seatIndex]:', newOrders[tableIndex]?.[seatIndex]);

      // Ensure that the specific table and seat orders are defined
      if (!newOrders[tableIndex] || !newOrders[tableIndex][seatIndex]) {
        console.error('Table or seat order is undefined.');
        return prevOrders; // Return previous state if undefined
      }

      newOrders[tableIndex] = [...newOrders[tableIndex]]; // Copy the table array
      newOrders[tableIndex][seatIndex] = newOrders[tableIndex][seatIndex].filter(
        (_, index) => index !== itemIndex
      );

      // Save the updated order to the backend using the updated array
      axios
        .put(`http://localhost:5000/api/orders/${tableIndex}/${seatIndex}`, {
          items: newOrders[tableIndex][seatIndex],
        })
        .then((response) => {
          console.log('Order updated:', response.data);
        })
        .catch((err) => {
          console.error('Error updating order:', err);
        });

      return newOrders;
    });
  };


  /**
   * Resets all table positions to their default starting points.
   */
  const resetTablePositions = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all table positions to default?"
    );
    if (!confirmReset) return;

    try {
      const response = await axios.put("http://localhost:5000/api/table-positions/reset");
      const { positions } = response.data;

      // Transform the positions array into an object
      const positionsObj = {};
      positions.forEach(({ tableIndex, x, y }) => {
        positionsObj[tableIndex] = { x, y };
      });

      setTablePositions(positionsObj);

      console.log("All table positions have been reset to default.");
    } catch (err) {
      console.error("Error resetting table positions:", err);
      alert("Failed to reset table positions. Please try again.");
    }
  };

  /**
   * Clears all orders by resetting items and total for each table.
   */
  const clearAllOrders = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all orders?"
    );
    if (!confirmClear) return;

    try {
      // Reset the orders state
      const clearedOrders = Array.from({ length: numberOfTables }, () =>
        Array.from({ length: seatsPerTable }, () => [])
      );
      setOrders(clearedOrders);

      // Send the cleared orders to the backend
      await axios.put("http://localhost:5000/api/orders/clear-all");

      console.log("All orders have been cleared.");
    } catch (err) {
      console.error("Error clearing orders:", err);
      alert("Failed to clear orders. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="restaurant-map" style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          flex: '0 0 50%',
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Sector
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          numberOfTables={numberOfTables}
          tablePositions={tablePositions}
          onTablePositionChange={handleTablePositionChange}
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
          flex: '0 0 50%',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {selectedTable !== null ? (
          <Table
            tableIndex={selectedTable}
            orders={orders[selectedTable] || Array.from({ length: seatsPerTable }, () => [])}
            updateOrder={updateOrder}
            removeFromOrder={removeFromOrder} // Pass the remove function to Table
            closeTable={() => setSelectedTable(null)}
          />
        ) : (
          <div style={{ padding: '20px' }}>
            <h2>Select a table to view details</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantMap;
