// frontend/src/components/Menus.js
import React from "react";

function Menus({ onSelectMenu }) {
  const menuTypes = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  return (
    <div className="Menus" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
      {menuTypes.map((menu) => (
        <button
          key={menu}
          onClick={() => onSelectMenu(menu)}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f8f8f8",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ddd")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f8f8f8")}
        >
          {menu}
        </button>
      ))}
    </div>
  );
}

export default Menus;
