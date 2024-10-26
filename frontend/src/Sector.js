// Sector.js
import React from "react";
import DraggableTableSquare from "./DraggableTableSquare";

function Sector({ selectedTable, setSelectedTable, numberOfTables, tablePositions, onTablePositionChange }) {
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
            onPositionChange={onTablePositionChange}
            onClick={() => setSelectedTable(index)}
          />
        );
      })}
    </div>
  );
}

export default Sector;
