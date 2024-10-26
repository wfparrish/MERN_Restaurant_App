// backend/routes/tablePositions.js
import express from 'express';
import TablePosition from '../models/TablePosition.js';

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
