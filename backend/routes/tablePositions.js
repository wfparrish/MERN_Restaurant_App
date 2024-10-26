// backend/routes/tablePositions.js
import express from 'express';
import TablePosition from '../models/TablePosition.js';
import DEFAULT_TABLE_POSITIONS from '../constants/defaultTablePositions.js'; // Import the defaults

const router = express.Router();

// Get all table positions
router.get('/', async (req, res) => {
  try {
    const positions = await TablePosition.find();
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **New Reset Endpoint**
// PUT /api/table-positions/reset
router.put('/reset', async (req, res) => {
  try {
    const resetPromises = Object.entries(DEFAULT_TABLE_POSITIONS).map(([tableIndex, pos]) =>
      TablePosition.findOneAndUpdate(
        { tableIndex: Number(tableIndex) },
        { x: pos.x, y: pos.y },
        { new: true, upsert: true }
      )
    );

    await Promise.all(resetPromises);

    // Retrieve the updated positions
    const updatedPositions = await TablePosition.find();

    res.status(200).json({
      message: "All table positions have been reset to default.",
      positions: updatedPositions,
    });
  } catch (error) {
    console.error("Error resetting table positions:", error);
    res.status(500).json({ message: "Server error. Failed to reset table positions." });
  }
});

// Update a table's position
router.put('/:tableIndex', async (req, res) => {
  const { tableIndex } = req.params;
  const { x, y } = req.body;

  if (typeof x !== 'number' || typeof y !== 'number') {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  try {
    const position = await TablePosition.findOneAndUpdate(
      { tableIndex: Number(tableIndex) },
      { x, y },
      { new: true, upsert: true } // upsert creates a new document if none exists
    );
    res.json(position);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



export default router;
