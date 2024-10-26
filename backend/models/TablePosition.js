// models/TablePosition.js
import mongoose from 'mongoose';

const TablePositionSchema = new mongoose.Schema({
  tableIndex: {
    type: Number,
    required: true,
    unique: true,
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const TablePosition = mongoose.model('TablePosition', TablePositionSchema);

export default TablePosition;
