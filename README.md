# AI Restaurant POS Application

## Project Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for restaurant management. It includes an admin panel, a customer-facing TableTop POS, and real-time updates using web sockets.

## Project Structure

```
restaurant-app/
├── backend/       # Express.js backend with MongoDB
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── app.js
│   ├── package.json
│   └── .env
├── frontend/      # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ... other React files
├── tabletoppos/   # React Native front-end for customer UI
│   ├── src/
│   ├── package.json
│   └── ... other React Native files
├── .gitignore
└── README.md
```

## Hardware Stack

This setup utilizes network hardware to manage camera streams and POS connectivity effectively.

- **Cisco Catalyst Switch** – Acts as the main network switch, managing traffic for all connected devices.
- **Trendnet PoE Switch (TPE-1020WS)** – Provides Power over Ethernet (PoE) to **Hikvision cameras** and other devices.
- **Hikvision IP Cameras** – Used for AI-driven object detection and tracking.
- **Intel NUC / Server** – Runs the backend services including MongoDB and real-time processing.
- **Tablet Devices** – Connect to the TableTop POS application wirelessly.

### **Recommended Network Subnet Configuration**

To ensure smooth connectivity between the hardware components, the following subnet configuration is recommended:

- **Management Network (Switch & PoE devices)**: `192.168.1.0/24`
  - **Cisco Catalyst Switch IP**: `192.168.1.2`
  - **Trendnet PoE Switch IP**: `192.168.1.100`
- **Camera Network**: `192.168.1.0/24`
  - **Hikvision Camera 1**: `192.168.1.10`
  - **Hikvision Camera 2**: `192.168.1.11`
- **POS & Application Servers**: `192.168.1.0/24`
  - **Backend Server (Intel NUC / VM)**: `192.168.1.x` subnet
  - **Admin Workstations**: `192.168.1.x` subnet
- **Tablet Devices (Dynamic DHCP Assignments)**: `192.168.1.x`

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/wfparrish/MERN_Restaurant_App.git
cd MERN_Restaurant_App
```

### 2. Install dependencies

```bash
cd backend && yarn install
cd ../frontend && yarn install
cd ../tabletoppos && yarn install
```

### 3. Set up MongoDB

If MongoDB is not installed, install it:

```bash
sudo apt-get update
sudo apt-get install -y mongodb
```

Create the necessary database directory (if it does not exist):

```bash
ls -ld /data/db  # Check if the directory exists
sudo mkdir -p /data/db
sudo chown -R `id -u` /data/db  # Set ownership for your user
```

Start MongoDB:

```bash
mongod --fork --logpath /var/log/mongodb.log
```

Confirm MongoDB is running:

```bash
mongo  # Open the MongoDB shell
```

### 4. Create a `.env` file in the `backend/` directory

```ini
MONGO_URI=mongodb://localhost:27017/mern-restaurant-app
PORT=5000
CAMERA_URL_1=rtsp://192.168.1.10:554/Streaming/channels/101
CAMERA_URL_2=rtsp://192.168.1.11:554/Streaming/channels/101
```

### 5. Seed the database

```bash
cd backend
npx yarn seed
```

### 6. Running the Project

#### **Start MongoDB**

```bash
mongod
```

#### **Start Backend**

```bash
cd backend
npx yarn dev
```

#### **Start Frontend**

```bash
cd ../frontend
npx yarn start
```

#### **Start TableTop POS (React Native)**

```bash
cd ../tabletoppos
yarn start
```

## API Endpoints

Test if the backend is working by running:

```bash
curl http://localhost:5000/api/food-items
```

## Troubleshooting

### 1. MongoDB permission errors

If MongoDB fails to start due to permission issues, try:

```bash
sudo chown -R `id -u` /data/db
```

### 2. Clearing the database

If necessary, reset the database by running:

```bash
mongo
use mern-restaurant-app
db.dropDatabase()
```

### 3. React Hot-Reloading Issues

If frontend changes do not reflect, restart the frontend server:

```bash
cd frontend
npx yarn start
```

## Future Improvements

- **Replace HLS with WebRTC or RTMP** for real-time video streaming.
- **Optimize WebSockets** for real-time updates.
- **Add Redux** for better state management.
- **Implement Object Detection** to identify food items and table settings in real time.
  - Recommended Libraries: OpenCV, TensorFlow.js, YOLO.
- **Enhance Object Tracking** to monitor staff and customer movements for operational efficiency.
  - Recommended Libraries: DeepSORT, MediaPipe, OpenCV.

---

**Project Contributors:** William Parrish
