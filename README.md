# AI Restaurant POS Application

## Project Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for restaurant management. It includes an admin panel, a customer-facing TableTop POS, and real-time updates using WebSockets.

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

## **Recommended Network Subnet Configuration**

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

## **Network Hardware Configuration (Required for Both Windows & RHEL 9 Installations)**

### **Cisco Catalyst Switch**

```plaintext
enable
configure terminal
hostname CatalystSwitch
interface vlan1
ip address 192.168.1.2 255.255.255.0
no shutdown
exit
wr mem
```

### **Trendnet PoE Switch**

- Access the web interface at `192.168.10.200` and change its IP to `192.168.1.100`.

### **Hikvision Cameras**

- Default IP: `192.168.1.64`
- Change camera IPs:
  - **Camera 1:** `192.168.1.10`
  - **Camera 2:** `192.168.1.11`
- Test RTSP streams using VLC:
  ```plaintext
  vlc rtsp://192.168.1.10:554/Streaming/channels/101
  ```

---

## Installation Options

This application supports **both Windows and RHEL 9 installations**. Choose the appropriate instructions for your system:

---

## **Installation on Windows**

### **1. Clone the Repository**

```powershell
git clone https://github.com/wfparrish/MERN_Restaurant_App.git
cd MERN_Restaurant_App
```

### **2. Install Dependencies**

```powershell
cd backend && yarn install
cd ../frontend && yarn install
cd ../tabletoppos && yarn install
```

### **3. Set Up MongoDB**

1. Download MongoDB from [MongoDB Official Site](https://www.mongodb.com/try/download/community).
2. Install it and ensure the MongoDB service is running.
3. Create a `C:\data\db` directory if it does not exist.
4. Start MongoDB:
   ```powershell
   mongod --dbpath C:\data\db
   ```

### **4. Start the Application**

```powershell
cd backend && yarn dev
cd ../frontend && yarn start
cd ../tabletoppos && yarn start
```

---

## **Installation on RHEL 9**

### **1. Install RHEL 9 on the Intel NUC**

1. **Download the RHEL 9 ISO** from the [Red Hat Customer Portal](https://access.redhat.com/) or the [Red Hat Developer Program](https://developers.redhat.com/).
2. **Create a bootable USB** using [Fedora Media Writer](https://getfedora.org/en/workstation/download/).
   - Select **Custom Image** and load the RHEL 9 ISO.
   - Write the image to a USB drive (minimum 8GB).
3. **Install RHEL 9**:
   - Boot from the USB and follow on-screen instructions.
   - Configure network settings and user credentials.
4. **After installation**, update the system:
   ```bash
   sudo dnf update -y
   ```

### **2. Install Dependencies**

```bash
sudo dnf install -y git curl wget nano gcc-c++ make
```

### **3. Install MongoDB on RHEL 9**

```bash
sudo dnf install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

### **4. Install Node.js & Yarn**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
npm install -g yarn
```

### **5. Install Project Dependencies**

```bash
cd backend && yarn install
cd ../frontend && yarn install
cd ../tabletoppos && yarn install
```

### **6. Start Services**

```bash
sudo systemctl start mongod
cd backend && yarn dev &
cd frontend && yarn start &
cd tabletoppos && yarn start &
```

---

## **Rollback Process (For RHEL 9 Installations)**

If something goes wrong, run the **rollback script**:

```bash
sudo ./rollback.sh
```

This will **remove MongoDB, Node.js, and project files** and reset the network settings.

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
