// backend/index.js

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { spawn } from "child_process"; // To handle FFmpeg processes
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Import Routes
import foodItemsRouter from "./routes/foodItems.js";
import tablePositionsRouter from "./routes/tablePositions.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

// Initialize __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust based on your frontend's origin
    credentials: true,
  })
);
app.use(express.json());

// Ensure the 'streams' directory exists
const streamsDir = path.join(__dirname, 'streams');
if (!fs.existsSync(streamsDir)) {
  fs.mkdirSync(streamsDir);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/food-items", foodItemsRouter);
app.use("/api/table-positions", tablePositionsRouter);
app.use("/api/orders", ordersRouter);

// Define table to camera mapping
const tableToCameraMap = {
  0: 'CAMERA_URL_1',
  1: 'CAMERA_URL_1',
  2: 'CAMERA_URL_1',
  3: 'CAMERA_URL_1',
  4: 'CAMERA_URL_1',
  5: 'CAMERA_URL_1',
  6: 'CAMERA_URL_1',
  7: 'CAMERA_URL_1',
  8: 'CAMERA_URL_2',
  9: 'CAMERA_URL_2',
  10: 'CAMERA_URL_2',
  11: 'CAMERA_URL_2',
  12: 'CAMERA_URL_2',
  13: 'CAMERA_URL_2',
  14: 'CAMERA_URL_2',
  15: 'CAMERA_URL_2'
  // Add more mappings if you have more cameras
  // For tables without cameras, you can omit them or map to null
};

// Streaming Setup
const activeStreams = {}; // Tracks active streams per camera
const cameraToTablesMap = {}; // Tracks which tables are using each camera

/**
 * Function to start streaming using FFmpeg
 * @param {string} cameraUrl - The URL of the camera stream
 * @param {string} streamKey - The unique key for the stream (cameraKey)
 */
const startStream = (cameraUrl, streamKey) => {
  // FFmpeg command to convert camera stream to HLS
  const ffmpeg = spawn('ffmpeg', [
    '-i', cameraUrl,                  // Input stream
    '-c:v', 'libx264',                // Video codec
    '-c:a', 'aac',                    // Audio codec
    '-f', 'hls',                      // Format
    '-hls_time', '2',                 // Segment duration
    '-hls_list_size', '3',            // Number of segments
    '-hls_flags', 'delete_segments',  // Flags
    path.join(streamsDir, `${streamKey}.m3u8`) // Output HLS playlist
  ]);

  ffmpeg.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout for ${streamKey}: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr for ${streamKey}: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process for ${streamKey} exited with code ${code}`);
    delete activeStreams[streamKey];
  });

  // Store the FFmpeg process
  activeStreams[streamKey] = ffmpeg;
};

// backend/index.js

// Start Stream Endpoint
app.get('/start-stream/:tableIndex', (req, res) => {
  const { tableIndex } = req.params;
  const cameraKey = tableToCameraMap[tableIndex];

  if (!cameraKey) {
    return res.status(404).json({ message: `No camera configured for table ${tableIndex}` });
  }

  const cameraUrl = process.env[cameraKey];

  if (!cameraUrl) {
    return res.status(404).json({ message: `Camera URL not set for ${cameraKey}` });
  }

  // Initialize the set for tracking tables using this camera
  if (!cameraToTablesMap[cameraKey]) {
    cameraToTablesMap[cameraKey] = new Set();
  }

  cameraToTablesMap[cameraKey].add(tableIndex);

  // If the stream for this camera is already running, don't start another
  if (activeStreams[cameraKey]) {
    return res.json({ message: `Stream already running for camera ${cameraKey}`, cameraKey });
  }

  // Start the stream
  startStream(cameraUrl, cameraKey);
  res.json({ message: `Stream started for camera ${cameraKey}`, cameraKey });
});


// Stop Stream Endpoint
app.get('/stop-stream/:tableIndex', (req, res) => {
  const { tableIndex } = req.params;
  const cameraKey = tableToCameraMap[tableIndex];

  if (!cameraKey) {
    return res.status(404).send(`No camera configured for table ${tableIndex}`);
  }

  if (!cameraToTablesMap[cameraKey]) {
    return res.status(400).send(`No active streams for camera ${cameraKey}`);
  }

  cameraToTablesMap[cameraKey].delete(tableIndex);

  // If no tables are using this camera, stop the stream
  if (cameraToTablesMap[cameraKey].size === 0) {
    if (activeStreams[cameraKey]) {
      activeStreams[cameraKey].kill('SIGINT'); // Gracefully stop FFmpeg
      delete activeStreams[cameraKey];
      delete cameraToTablesMap[cameraKey];
      return res.send(`Stream stopped for camera ${cameraKey}`);
    } else {
      return res.status(400).send(`No active stream found for camera ${cameraKey}`);
    }
  }

  res.send(`Stopped stream usage for table ${tableIndex} on camera ${cameraKey}`);
});

// Serve HLS Streams
app.use('/streams', express.static(streamsDir));

// Define a default route to prevent "Cannot GET /" error
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant App API");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
