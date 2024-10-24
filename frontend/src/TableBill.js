import React, { useState } from "react";

function TableBill({ orders }) {
  const [placedItems, setPlacedItems] = useState([]); // Track items that have been placed

  // Collect all items from all seats
  const allItems = orders.flat();

  // Calculate the total amount
  const totalAmount = allItems
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

  // Handle placing the order
  const placeOrder = () => {
    // Mark all current items as placed
    setPlacedItems([...allItems]);
  };

  return (
    <div className="table-bill">
      <h2>Table Bill</h2>
      {allItems.length > 0 ? (
        <>
          <ul>
            {allItems.map((item, index) => (
              <li
                key={index}
                style={{
                  color: placedItems.includes(item) ? "#007bff" : "black", // Apply color based on placement status
                }}
              >
                {item.title} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <h3>Total Amount: ${totalAmount}</h3>
          <button onClick={placeOrder} className="place-order-btn">
            Place Order
          </button>
        </>
      ) : (
        <p>No items ordered yet.</p>
      )}
    </div>
  );
}

export default TableBill;