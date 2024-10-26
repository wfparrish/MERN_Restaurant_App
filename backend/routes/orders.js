// routes/orders.js
import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for a specific table
router.get('/table/:tableIndex', async (req, res) => {
  const { tableIndex } = req.params;
  try {
    const orders = await Order.find({ tableIndex: Number(tableIndex) });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order for a specific seat at a table
router.put('/:tableIndex/:seatIndex', async (req, res) => {
  const { tableIndex, seatIndex } = req.params;
  const { items } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { tableIndex: Number(tableIndex), seatIndex: Number(seatIndex) },
      { items },
      { new: true, upsert: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
