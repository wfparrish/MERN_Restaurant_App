// RestaurantMap.js
import React, { useState } from "react";
import Table from "./Table";
import Sector from "./Sector"; // Import the Sector component

function RestaurantMap() {
  const numberOfTables = 16;
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState(
    Array(numberOfTables)
      .fill()
      .map(() => Array(4).fill([]))
  );

  const updateOrder = (tableIndex, seatIndex, item) => {
    const newOrders = [...orders];
    newOrders[tableIndex][seatIndex] = [
      ...newOrders[tableIndex][seatIndex],
      item,
    ];
    setOrders(newOrders);
  };

  return (
    <div
      className="restaurant-map"
      style={{ display: "flex", height: "100vh" }}
    >
      {/* Left side: Sector */}
      <div
        style={{
          flex: "0 0 50%", // Occupies 50% of the width
          borderRight: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      >
        <Sector
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          numberOfTables={numberOfTables}
        />
      </div>

      {/* Right side: Table details */}
      <div
        style={{
          flex: "0 0 50%", // Occupies 50% of the width
          boxSizing: "border-box",
        }}
      >
        {selectedTable !== null ? (
          <Table
            tableIndex={selectedTable}
            orders={orders[selectedTable]}
            updateOrder={updateOrder}
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
