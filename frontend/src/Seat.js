// Seat.js
import React from "react";
import Menu from "./Menu";
import CurrentOrder from "./CurrentOrder";

function Seat({ seatNumber, order, addToOrder, onBackToSeats }) {
  // Calculate the total price for the order
  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="seat-container">
      <div className="seat">
        <h2>Seat {seatNumber}</h2>
        <Menu addToOrder={addToOrder} />
      </div>

      <CurrentOrder
        order={order}
        seatNumber={seatNumber}
        calculateTotal={calculateTotal}
        onBackToSeats={onBackToSeats}
      />
    </div>
  );
}

export default Seat;
