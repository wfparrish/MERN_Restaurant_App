// DraggableTableSquare.js
import React, { useState, useRef, useEffect } from "react";

function DraggableTableSquare({
  tableIndex,
  position,
  onPositionChange,
  onClick,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const squareRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target === squareRef.current) {
      setIsDragging(true);
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = position.x + e.movementX;
        const newY = position.y + e.movementY;
        onPositionChange(tableIndex, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position]);

  return (
    <div
      ref={squareRef}
      className="table-square"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "50px",
        height: "50px",
        backgroundColor: "lightblue",
        border: "1px solid black",
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      Table {tableIndex + 1}
    </div>
  );
}

export default DraggableTableSquare;
