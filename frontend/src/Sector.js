// Sector.js
import React from "react";
import DraggableTableSquare from "./DraggableTableSquare";
import StaffStats from "./StaffStats";

function Sector({
  selectedTable,
  setSelectedTable,
  numberOfTables,
  tablePositions,
  onTablePositionChange,
  staffEvaluation = {} // Accept staffEvaluation as a prop
}) {
  return (
    <div
      className="sector"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "95%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top half: Draggable tables */}
      <div
        style={{
          flex: 1, // This takes half when combined with bottom half
          borderBottom: "2px solid #ccc", // Visual separation
          position: "relative",
          overflow: "auto", // scroll if needed
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

      {/* Bottom half: Staff Stats */}
      <div
        style={{
          flex: 1, // This is the other half
          backgroundColor: "#f9f9f9",
          display: "flex",  // if you want to center something
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        <StaffStats employeeName="William" staffEvaluation={staffEvaluation} />
      </div>
    </div>
  );
}

export default Sector;
