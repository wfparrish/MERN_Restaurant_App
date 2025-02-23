import React, { useState } from "react";
import Menus from "./Menus";
import Menu from "./Menu";
import CurrentOrder from "./CurrentOrder";

function Seat({ seatNumber, order, addToOrder, onBackToSeats }) {
  const [selectedMenu, setSelectedMenu] = useState("Lunch"); // Default menu

  // Calculate the total price for the order
  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="seat-container">
      <div className="seat">
        <h2>Seat {seatNumber}</h2>

        {/* ✅ Menu selection component */}
        <Menus onSelectMenu={setSelectedMenu} />

        {/* ✅ Pass selected menu to Menu */}
        <Menu addToOrder={addToOrder} selectedMenu={selectedMenu} />
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
