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

### **Installing Nodemon**

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

## **Installing FFmpeg on RHEL 9**

To install **FFmpeg** on **Red Hat Enterprise Linux (RHEL 9)**, follow these steps to **enable the necessary repositories** and **resolve dependencies**.

### **1. Register the System**

Ensure your system is registered to access Red Hat repositories:

```sh
sudo subscription-manager register --auto-attach
```

Verify the registration:

```sh
sudo subscription-manager status
```

If Simple Content Access (SCA) is enabled, you can proceed without manually attaching a subscription.

### **2. Enable Required Repositories**

FFmpeg is not included in the default RHEL repositories. Enable the following:

#### ✅ **Enable Red Hat Base Repositories**

```sh
sudo subscription-manager repos --enable=rhel-9-for-x86_64-baseos-rpms
sudo subscription-manager repos --enable=rhel-9-for-x86_64-appstream-rpms
sudo subscription-manager repos --enable=codeready-builder-for-rhel-9-x86_64-rpms
```

#### ✅ **Enable RPM Fusion (Provides FFmpeg)**

```sh
sudo dnf install -y \
https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-9.noarch.rpm
```

#### ✅ **Enable EPEL (Provides Additional Dependencies)**

```sh
sudo dnf install -y \
https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```

### **3. Refresh Package Metadata**

Once repositories are enabled, refresh the package list:

```sh
sudo dnf clean all
sudo dnf makecache
```

### **4. Install FFmpeg**

Now that all required repositories are active, install FFmpeg:

```sh
sudo dnf install -y ffmpeg
```

### **5. Verify Installation**

Check that FFmpeg is installed successfully:

```sh
ffmpeg -version
```

Expected output:

```
ffmpeg version 5.x.x ...
```

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
