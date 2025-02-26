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

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/MERN_Restaurant_App.git
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

---

**Project Contributors:** William Parrish
