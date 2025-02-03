// StaffStats.js
import React from "react";

function StaffStats({ employeeName = "William", staffEvaluation = {} }) {
  // Map keys to user-friendly labels
  const labelMap = {
    condiments_ontable: "Condiments on Table",
    table_greeted_with_water: "Table Greeted with Water",
    water_refills: "Water Refills",
    order_taken_with_tablet: "Order Taken with Tablet",
    prebussing_occurred: "Pre-bussing Occurred",
    time_spent_at_table: "Time Spent at Table (minutes)",
    time_until_first_appetizer_arrive: "Time until First Appetizer Arrives",
    time_until_first_drink_arrive: "Time until First Drink Arrives",
    time_until_entree_arrive: "Time until Entrée Arrives",
    time_until_dessert_arrive: "Time until Dessert Arrives",
    time_between_last_ring_and_check_presentation:
      "Time between Last Ring & Check Presentation",
    dessert_menu_offered: "Dessert Menu Offered",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box", // Include borders and padding in total width
      }}
    >
      <h3>Server Name: {employeeName}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {Object.entries(staffEvaluation).map(([key, val]) => {
          const label = labelMap[key] || key;
          // Check if it's a boolean-like field (1 or 0) but not time_spent_at_table
          const isBooleanField =
            (val === 0 || val === 1) && key !== "time_spent_at_table";

          return (
            <li
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "3px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            >
              {isBooleanField ? (
                <>
                  <span style={{ marginRight: "8px" }}>{label}</span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: val === 1 ? "green" : "red",
                      marginLeft: "auto", // Move the circle to the far right if desired
                    }}
                  />
                </>
              ) : (
                <>
                  {label}: <strong>{val}</strong>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StaffStats;
