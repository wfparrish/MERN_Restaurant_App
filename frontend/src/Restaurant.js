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

        // Initialize orders array
        const ordersData = Array.from({ length: numberOfTables }, () =>
          Array.from({ length: seatsPerTable }, () => [])
        );

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
      {/* Left side: Sector */}
      <div
        style={{
          flex: '0 0 50%',
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      >
        <Sector
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          numberOfTables={numberOfTables}
          tablePositions={tablePositions}
          onTablePositionChange={handleTablePositionChange}
        />
      </div>

      {/* Right side: Table details */}
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
