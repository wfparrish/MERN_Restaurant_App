// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  tableIndex: {
    type: Number,
    required: true,
  },
  seatIndex: {
    type: Number,
    required: true,
  },
  items: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

OrderSchema.index({ tableIndex: 1, seatIndex: 1 }, { unique: true });

const Order = mongoose.model('Order', OrderSchema);

export default Order;
