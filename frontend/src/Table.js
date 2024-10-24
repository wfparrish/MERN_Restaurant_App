// Table.js
import React, { useState } from "react";
import Seat from "./Seat";
import TableBill from "./TableBill"; // Import the TableBill component

function Table({
  tableIndex,
  orders,
  updateOrder,
  closeTable, // Optional: use if you want a button to deselect the table
}) {
  const numberOfSeats = 4;
  const [selectedSeat, setSelectedSeat] = useState(null);

  const onBackToSeats = () => {
    setSelectedSeat(null);
  };

  return (
    <div
      className="table-content"
      style={{ padding: "20px", boxSizing: "border-box" }}
    >
      {/* Optional: Include a button to deselect the table */}
      {/* <button onClick={closeTable}>Deselect Table</button> */}
      <h1>Table {tableIndex + 1}</h1>
      {selectedSeat === null ? (
        <>
          <h2>Available Seats</h2>
          <div className="seats">
            {Array.from({ length: numberOfSeats }, (_, index) => (
              <button key={index} onClick={() => setSelectedSeat(index)}>
                Seat {index + 1}
              </button>
            ))}
          </div>
          {/* Include the TableBill component here */}
          <TableBill orders={orders} />
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
  );
}

export default Table;
