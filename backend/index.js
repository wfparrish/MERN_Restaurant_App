// backend/index.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { spawn } from "child_process"; // To handle FFmpeg processes
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// Import Routes
import foodItemsRouter from "./routes/foodItems.js";
import tablePositionsRouter from "./routes/tablePositions.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

// Initialize __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 1) Create an HTTP server from our app
const server = http.createServer(app);

// 2) Create Socket.IO server from that HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8081"], // Explicitly allow frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ Ensure WebSocket is explicitly enabled
});

console.log("Socket.IO is running:", !!io);


// Store io so the orders router can access it
app.set("socketIo", io);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081"],
    credentials: true,
  })
);

app.use(express.json());

// Ensure the 'streams' directory exists
const streamsDir = path.join(__dirname, "streams");
if (!fs.existsSync(streamsDir)) {
  fs.mkdirSync(streamsDir);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase", {
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
  0: "CAMERA_URL_1",
  1: "CAMERA_URL_1",
  2: "CAMERA_URL_1",
  3: "CAMERA_URL_1",
  4: "CAMERA_URL_1",
  5: "CAMERA_URL_1",
  6: "CAMERA_URL_1",
  7: "CAMERA_URL_1",
  8: "CAMERA_URL_2",
  9: "CAMERA_URL_2",
  10: "CAMERA_URL_2",
  11: "CAMERA_URL_2",
  12: "CAMERA_URL_2",
  13: "CAMERA_URL_2",
  14: "CAMERA_URL_2",
  15: "CAMERA_URL_2",
};

// Prepare tracking objects
const activeStreams = {};
const cameraToTablesMap = {};

/**
 * Function to start streaming using FFmpeg
 * @param {string} cameraUrl - The URL of the camera stream
 * @param {string} streamKey - The unique key for the stream (cameraKey)
 */
const startStream = (cameraUrl, streamKey) => {
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    cameraUrl,
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "3",
    "-hls_flags",
    "delete_segments",
    path.join(streamsDir, `${streamKey}.m3u8`),
  ]);

  ffmpeg.stdout.on("data", (data) => {
    console.log(`FFmpeg stdout for ${streamKey}: ${data}`);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr for ${streamKey}: ${data}`);
  });

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg process for ${streamKey} exited with code ${code}`);
    delete activeStreams[streamKey];
  });

  activeStreams[streamKey] = ffmpeg;
};

// Start Stream Endpoint
app.get("/start-stream/:tableIndex", (req, res) => {
  const { tableIndex } = req.params;
  const cameraKey = tableToCameraMap[tableIndex];

  if (!cameraKey) {
    return res
      .status(404)
      .json({ message: `No camera configured for table ${tableIndex}` });
  }

  const cameraUrl = process.env[cameraKey];
  if (!cameraUrl) {
    return res
      .status(404)
      .json({ message: `Camera URL not set for ${cameraKey}` });
  }

  if (!cameraToTablesMap[cameraKey]) {
    cameraToTablesMap[cameraKey] = new Set();
  }
  cameraToTablesMap[cameraKey].add(tableIndex);

  // If a stream for this camera is already running, no need to start again
  if (activeStreams[cameraKey]) {
    return res.json({
      message: `Stream already running for camera ${cameraKey}`,
      cameraKey,
    });
  }

  // Otherwise, start it
  startStream(cameraUrl, cameraKey);
  res.json({ message: `Stream started for camera ${cameraKey}`, cameraKey });
});

// Stop Stream Endpoint
app.get("/stop-stream/:tableIndex", (req, res) => {
  const { tableIndex } = req.params;
  const cameraKey = tableToCameraMap[tableIndex];

  if (!cameraKey) {
    return res
      .status(404)
      .send(`No camera configured for table ${tableIndex}`);
  }

  if (!cameraToTablesMap[cameraKey]) {
    return res.status(400).send(`No active streams for camera ${cameraKey}`);
  }

  cameraToTablesMap[cameraKey].delete(tableIndex);

  // If no more tables are using this camera, stop the stream
  if (cameraToTablesMap[cameraKey].size === 0) {
    if (activeStreams[cameraKey]) {
      activeStreams[cameraKey].kill("SIGINT");
      delete activeStreams[cameraKey];
      delete cameraToTablesMap[cameraKey];
      return res.send(`Stream stopped for camera ${cameraKey}`);
    } else {
      return res.status(400).send(`No active stream found for camera ${cameraKey}`);
    }
  }

  res.send(`Stopped stream usage for table ${tableIndex} on camera ${cameraKey}`);
});

// Serve the HLS streams statically
app.use("/streams", express.static(streamsDir));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant App API");
});

// 3) Socket.IO: handle connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("orderUpdated", (payload) => {
    console.log("Received orderUpdated event:", payload);
    io.emit("orderUpdated", payload); // Broadcast it back to all clients
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});
// 4) Start the server with server.listen (not app.listen!)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
