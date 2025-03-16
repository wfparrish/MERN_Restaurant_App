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
  - **Backend Server (Intel NUC / VM)**: `192.168.1.4`
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

## **🔧 Installation on RHEL 9**

### **Step 1: Enable Required Repositories**

Since this RHEL system is registered, enable the necessary repositories:

```bash
sudo subscription-manager repos --enable=rhel-9-for-x86_64-baseos-rpms
sudo subscription-manager repos --enable=rhel-9-for-x86_64-appstream-rpms
```

Then enable CodeReady Builder (CRB):

```bash
sudo /usr/bin/crb enable
```

---

### **Step 2: Install Essential Development Tools**

Ensure your system has the necessary development tools:

```bash
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y git curl wget nano gcc-c++ make
```

---

### **Step 3: Install and Configure Node.js (For MERN Stack)**

#### **Option 1: Using NodeSource Repository (Recommended)**

```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs
```

#### **Option 2: Using AppStream Repository (Older Version)**

```bash
sudo dnf module enable nodejs:18
sudo dnf install -y nodejs
```

Verify installation:

```bash
node -v
npm -v
```

---

### **Step 4: Install Yarn**

Since you prefer **Yarn**, install it using:

```bash
sudo npm install -g yarn
yarn -v
```

---

### **Step 5: Install MongoDB**

```bash
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
```

Then install MongoDB:

```bash
sudo dnf install -y mongodb-org
sudo systemctl enable --now mongod
```

Verify:

```bash
mongod --version
```

---

### **Step 6: Configure Network (If Not Already Set)**

```bash
sudo nmcli con add type ethernet ifname eno1 con-name static-lan \
  ipv4.address 192.168.1.4/24 \
  ipv4.gateway 10.0.0.1 \
  ipv4.method manual \
  autoconnect yes
sudo nmcli con up eno1
ip a show eno1
```

### **Step 7: Install FFmpeg**

#### **Enable EPEL & RPM Fusion Repositories**

```bash
sudo dnf install -y \
https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm

sudo dnf install -y \
https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-9.noarch.rpm
```

#### **Install FFmpeg**

```bash
sudo dnf install -y ffmpeg ffmpeg-devel
```

#### **Verify Installation**

```bash
ffmpeg -version
```

---

### **Step 8: Clone and Install Your Application**

```bash
git clone https://github.com/yourrepo/restaurant-app.git
cd restaurant-app
```

#### **Install Backend Dependencies**

```bash
cd backend
yarn install
```

#### **Install Frontend Dependencies**

```bash
cd ../frontend
yarn install
```

#### **Install Tabletoppos Dependencies**

```bash
cd ../tabletoppos
yarn install
```

---

### **Step 9: Run the Backend**

```bash
cd ../backend
yarn dev
```

---

### **Step 10: Run the Frontend**

```bash
cd ../frontend
yarn start
```

---

### **Step 10: Run the Table Top POS**

```bash
cd ../tabletoppos
yarn start
```

---

### **Step 10: Rename Image Files to Ensure Compatibility**

There is a small bug with the files for burger.jpg, fries.jpg, and shakes.jpg. Run these commands so their images appear correctly in the

```bash
# Rename images in TableTopPOS
cd MERN_Restaurant_App/tabletoppos/assets/images/
mv burger.JPG burger.jpg
mv fries.JPG fries.jpg
mv shake.JPG shake.jpg

# Rename images in Frontend
cd ../../frontend/public/images/
mv burger.JPG burger.jpg
mv fries.JPG fries.jpg
mv shake.JPG shake.jpg
```

---

## 🔧 **Fixing "undefined symbol: mpg123_param2" in FFmpeg**

If you encounter the error:

```bash
ffmpeg: symbol lookup error: ffmpeg: undefined symbol: mpg123_param2
```

It means that FFmpeg is having issues due to a missing or incompatible version of `mpg123`. Follow these steps to resolve it.

### **🔍 Step 1: Check If `mpg123` is Installed**

```bash
rpm -q mpg123
```

If it's **not installed**, continue to the next step.

---

### **🛠 Step 2: Install or Reinstall `mpg123`**

```bash
sudo dnf install -y mpg123
sudo dnf reinstall -y mpg123
```

Verify installation:

```bash
rpm -q mpg123
```

Expected output:

```
mpg123-1.29.3-1.el9.x86_64
```

---

### **🔄 Step 3: Ensure All FFmpeg Dependencies Are Up to Date**

```bash
sudo dnf reinstall -y ffmpeg ffmpeg-devel mpg123
```

---

### **🔎 Step 4: Verify Libraries**

```bash
ldconfig -p | grep mpg123
```

If no output appears, force a library update:

```bash
sudo ldconfig
```

---

### **🚀 Step 5: Test FFmpeg**

```bash
ffmpeg -version
```

If no errors appear, FFmpeg is now working correctly!

---

## **Installing Nodemon**

`nodemon` is required for development to automatically restart the backend server when code changes.

#### **Option 1: Using `npx` (Recommended for Local Use)**

If you have `nodemon` installed as a local dependency (which is already included in `devDependencies` of `package.json`), you can run it using `npx`:

```bash
npx nodemon index.js
```

This ensures that you are using the project-specific version of `nodemon` without needing a global installation.

#### **Option 2: Installing Nodemon Globally**

If you prefer to run `nodemon` globally without `npx`, install it globally using Yarn:

```bash
yarn global add nodemon
```

Or using npm:

```bash
npm install -g nodemon
```

After installation, verify it works:

```bash
nodemon --version
```

#### **Fix: Nodemon Not Found After Global Installation**

If `nodemon` is not found after installing it globally, you may need to add Yarn’s global binaries to your system `PATH`.

1. Find the global Yarn binary path:

   ```bash
   yarn global bin
   ```

   This may return something like:

   ```
   /home/youruser/.yarn/bin
   ```

   or

   ```
   /home/youruser/.config/yarn/global/node_modules/.bin
   ```

2. Add the correct path to your shell profile:

   ```bash
   export PATH="$HOME/.yarn/bin:$PATH"
   ```

   or

   ```bash
   export PATH="$HOME/.config/yarn/global/node_modules/.bin:$PATH"
   ```

3. Apply the changes:
   ```bash
   source ~/.bashrc  # If using Bash
   source ~/.zshrc   # If using Zsh
   ```

Now, `nodemon --version` should work.

#### **Option 3: Ensuring Nodemon Runs in Development Mode**

To run the backend with `nodemon`, use the `dev` script from `package.json`:

```bash
yarn dev
```

This command will:

- Remove and recreate the `streams` directory.
- Start `nodemon` to watch for changes in `index.js`.

<!-- ## **Rollback Process (For RHEL 9 Installations)**

If something goes wrong, run the **rollback script**:

```bash
sudo ./rollback.sh
```

This will **remove MongoDB, Node.js, and project files** and reset the network settings. -->

### **✅ Summary**

- **Register the system** (`subscription-manager register`)
- **Enable RHEL Base Repositories**
- **Enable RPM Fusion for FFmpeg**
- **Enable EPEL for additional dependencies**
- **Refresh and install FFmpeg**

This process ensures **all dependencies are resolved automatically**.

🚀 **Now FFmpeg is fully installed and ready to use!**

## Future Improvements

- **Replace HLS with WebRTC or RTMP** for real-time video streaming.
- **Optimize WebSockets** for real-time updates.
- **Add Redux** for better state management.
- **Implement Object Detection** to identify food items and table settings in real time.
  - Recommended Libraries: OpenCV, TensorFlow.js, YOLO.
- **Enhance Object Tracking** to monitor staff and customer movements for operational efficiency.
  - Recommended Libraries: DeepSORT, MediaPipe, OpenCV.
- **Private Subnet for the Cameras** to add a layer of control and security over access to the cameras.

---

**Project Contributors:** William Parrish
