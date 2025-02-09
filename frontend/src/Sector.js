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
      {/* Top portion: Draggable tables */}
      <div
        style={{
          flex: 1,
          maxHeight: "70%", // Restrict this section to 70% of the height
          borderBottom: "2px solid #ccc",
          position: "relative",
          overflow: "auto", // Enable scrolling if needed
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

      {/* Bottom portion: Staff Stats */}
      <div
        style={{
          flex: 1,
          maxHeight: "30%", // Ensures StaffStats does not exceed 30% of Sector height
          backgroundColor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          overflow: "auto", // Enable scrolling if content overflows
        }}
      >
        <StaffStats employeeName="William" staffEvaluation={staffEvaluation} />
      </div>
    </div>
  );
}

export default Sector;
