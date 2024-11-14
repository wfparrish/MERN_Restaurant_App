// Table.js
import React, { useState } from "react";
import Seat from "./Seat";
import TableBill from "./TableBill";
import TableCamera from "./TableCamera"; // Import the TableCamera component

function Table({
  tableIndex,
  orders,
  updateOrder,
  removeFromOrder,
  closeTable,
}) {
  const numberOfSeats = 4;
  const [selectedSeat, setSelectedSeat] = useState(null);

  const onBackToSeats = () => {
    setSelectedSeat(null);
  };

  return (
    <div
      className="table-container"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        height: "100vh",
      }}
    >
      <h1>Table {tableIndex + 1}</h1>

      {/* Camera View Section */}
      <div
        className="camera-view"
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <TableCamera tableIndex={tableIndex} />
      </div>

      {/* Seats and Orders Section */}
      <div
        className="seats-orders"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {selectedSeat === null ? (
          <>
            <h2>Available Seats</h2>
            <div
              className="seats"
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {Array.from({ length: numberOfSeats }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSeat(index)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    // Retain original styling without changes
                  }}
                >
                  Seat {index + 1}
                </button>
              ))}
            </div>

            {/* Table Bill Section */}
            <TableBill
              orders={orders}
              removeFromOrder={(seatIndex, itemIndex) =>
                removeFromOrder(tableIndex, seatIndex, itemIndex)
              }
            />
          </>
        ) : (
          <div className="selected-seat">
            <Seat
              seatNumber={selectedSeat + 1}
              order={orders[selectedSeat]}
              addToOrder={(item) => updateOrder(tableIndex, selectedSeat, item)}
              onBackToSeats={onBackToSeats}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;
