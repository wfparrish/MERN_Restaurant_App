// routes/orders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Clears all orders in the DB
 * PUT /api/orders/clear-all
 */
router.put("/clear-all", async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ message: "All orders have been cleared." });
  } catch (err) {
    console.error("Error clearing orders:", err);
    res.status(500).json({ message: "Server error. Failed to clear orders." });
  }
});

/**
 * GET /api/orders/
 * Returns all orders in the DB
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/orders/table/:tableIndex
 * Returns all orders for a specific table
 */
router.get("/table/:tableIndex", async (req, res) => {
  const { tableIndex } = req.params;
  try {
    const orders = await Order.find({ tableIndex: Number(tableIndex) });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/orders/:tableIndex/:seatIndex
 * Returns the order for a specific seat at a table
 */
router.get("/:tableIndex/:seatIndex", async (req, res) => {
  const { tableIndex, seatIndex } = req.params;
  try {
    const order = await Order.findOne({
      tableIndex: Number(tableIndex),
      seatIndex: Number(seatIndex),
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    return res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/orders/:tableIndex/:seatIndex
 * Update (or upsert) the items for a specific seat at a table.
 * Then emit a "orderUpdated" event via Socket.IO.
 */
router.put("/:tableIndex/:seatIndex", async (req, res) => {
  const { tableIndex, seatIndex } = req.params;
  const { items } = req.body;

  try {
    // Upsert the seat's order in Mongo
    const order = await Order.findOneAndUpdate(
      { tableIndex: Number(tableIndex), seatIndex: Number(seatIndex) },
      { items },
      { new: true, upsert: true }
    );

    // Debug logs before we emit
    console.log("PUT /:tableIndex/:seatIndex -> about to emit orderUpdated");
    console.log("    tableIndex:", tableIndex);
    console.log("    seatIndex:", seatIndex);

    // Broadcast to all connected Socket.IO clients
    const io = req.app.get("socketIo"); // Retrieve the Socket.IO instance
    io.emit("orderUpdated", {
      tableIndex: Number(tableIndex),
      seatIndex: Number(seatIndex),
      items: order.items,
    });

    console.log("Emitted orderUpdated for tableIndex:", tableIndex);

    return res.json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(400).json({ message: err.message });
  }
});

export default router;
