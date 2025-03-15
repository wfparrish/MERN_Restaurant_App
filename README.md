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

## **Installation on RHEL 9**

### **1. Install RHEL 9 on the Intel NUC**

1. **Download the RHEL 9 ISO** from the [Red Hat Customer Portal](https://access.redhat.com/) or the [Red Hat Developer Program](https://developers.redhat.com/).
2. **Create a bootable USB** using [Fedora Media Writer](https://getfedora.org/en/workstation/download/).
   - If using an extracted ISO instead of mounting it, keep the USB connected for access.
3. **Install RHEL 9**:
   - Boot from the USB and follow on-screen instructions.
   - Configure network settings and user credentials.

### **2. Configure Local Repository (USB with Extracted ISO)**

```bash
sudo mkdir -p /opt/rhel-repo
sudo cp -r /run/media/$USER/RHEL-9-2-0-BaseOS-x86_64/* /opt/rhel-repo/
```

Modify repository configuration:

```bash
sudo nano /etc/yum.repos.d/local.repo
```

Add the following content:

```ini
[LocalRepo]
name=RHEL 9 Local Repository
baseurl=file:///run/media/$USER/RHEL-9-2-0-BaseOS-x86_64/BaseOS/
gpgcheck=0
enabled=1

[AppStream]
name=RHEL 9 AppStream Repository
baseurl=file:///run/media/$USER/RHEL-9-2-0-BaseOS-x86_64/AppStream/
gpgcheck=0
enabled=1
```

Disable the subscription manager:

```bash
sudo vim /etc/dnf/dnf.conf
```

Add this line:

```ini
exclude=subscription-manager
```

Clean and update repository list:

```bash
sudo dnf clean all --disableplugin=subscription-manager
sudo dnf repolist --disableplugin=subscription-manager
```

### **3. Install Required Packages**

```bash
sudo dnf install -y git curl wget nano gcc-c++ make --disableplugin=subscription-manager
```

### **4. Install MongoDB**

```bash
sudo dnf install -y mongodb-org
sudo systemctl enable --now mongod
```

Fix `vm.max_map_count` error:

```bash
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### **5. Configure Network Connection**

```bash
sudo nmcli con add type ethernet ifname eno1 con-name static-lan \
  ipv4.address 192.168.1.4/24 \
  ipv4.gateway 192.168.1.2 \
  ipv4.method manual \
  autoconnect yes
sudo nmcli con up eno1
ip a show eno1
```

### **6. Verify Connectivity**

- **Ping Devices:**
  ```bash
  ping -c 4 192.168.1.2  # Cisco Catalyst
  ping -c 4 192.168.1.100 # Trendnet PoE Switch
  ping -c 4 192.168.1.10  # Hikvision Camera 1
  ping -c 4 192.168.1.11  # Hikvision Camera 2
  ```

If all devices respond, networking is configured correctly.

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
