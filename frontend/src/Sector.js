// Sector.js
import React, { useState } from "react";
import DraggableTableSquare from "./DraggableTableSquare";

function Sector({ selectedTable, setSelectedTable, numberOfTables }) {
  const [tablePositions, setTablePositions] = useState(() => {
    // Initialize table positions
    const positions = {};
    const numPerRow = Math.ceil(Math.sqrt(numberOfTables)); // Number of tables per row
    const spacingX = 100; // Horizontal spacing between tables
    const spacingY = 100; // Vertical spacing between tables
    for (let i = 0; i < numberOfTables; i++) {
      const row = Math.floor(i / numPerRow);
      const col = i % numPerRow;
      positions[i] = {
        x: col * spacingX + 20, // Adding 20px offset from the edges
        y: row * spacingY + 20,
      };
    }
    return positions;
  });

  const handleTablePositionChange = (tableIndex, newPosition) => {
    setTablePositions((prev) => ({
      ...prev,
      [tableIndex]: newPosition,
    }));
  };

  return (
    <div
      className="sector"
      style={{
        position: "relative",
        width: "95%", // Adjusted width to 95%
        height: "100%", // Fill the parent container's height
        boxSizing: "border-box",
      }}
    >
      {Array.from({ length: numberOfTables }, (_, index) => {
        const position = tablePositions[index];
        return (
          <DraggableTableSquare
            key={index}
            tableIndex={index}
            position={position}
            onPositionChange={handleTablePositionChange}
            onClick={() => setSelectedTable(index)}
          />
        );
      })}
    </div>
  );
}

export default Sector;
