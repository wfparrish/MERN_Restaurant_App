// TableBill.js
import React from "react";
import "./styles.css";

function TableBill({ orders, removeFromOrder }) {
  // Collect all items from all seats (assuming orders are passed from the parent)
  const allItems = orders.flat();

  // Calculate the total amount
  const totalAmount = allItems
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);

  return (
    <div className="table-bill">
      <h2>Table Bill</h2>
      {allItems.length > 0 ? (
        <>
          <ul>
            {orders.map((seatOrders, seatIndex) =>
              seatOrders.map((item, itemIndex) => (
                <li
                  key={`${seatIndex}-${itemIndex}`}
                  onClick={() => {
                    console.log(`Clicked on item: ${item.title}`);
                    removeFromOrder(seatIndex, itemIndex); // Remove the item when clicked
                  }}
                >
                  {item.title} - ${item.price.toFixed(2)}
                </li>
              ))
            )}
          </ul>
          <h3>Total Amount: ${totalAmount}</h3>
        </>
      ) : (
        <p>No items ordered yet.</p>
      )}
    </div>
  );
}

export default TableBill;
