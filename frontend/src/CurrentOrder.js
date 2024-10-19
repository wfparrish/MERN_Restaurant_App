// CurrentOrder.js
import React from "react";

function CurrentOrder({ order, seatNumber, calculateTotal, onBackToSeats }) {
  return (
    <div className="current-order">
      <h2>Current Order for Seat {seatNumber}</h2>
      <ul>
        {order.length > 0 ? (
          order.map((item, index) => (
            <li key={index}>
              {item.title} - ${item.price.toFixed(2)}
            </li>
          ))
        ) : (
          <li>No items ordered yet.</li>
        )}
      </ul>
      <h3>Total: ${calculateTotal()}</h3>

      {/* Move the button inside CurrentOrder */}
      <div className="back-button-container">
        <button onClick={onBackToSeats}>Back to Seats</button>
      </div>
    </div>
  );
}

export default CurrentOrder;
