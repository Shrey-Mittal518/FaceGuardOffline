# FaceGuard Offline 🛡️
### NHAI Hackathon 7.0 — Offline Facial Recognition & Liveness Detection

![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-green)
![Offline](https://img.shields.io/badge/mode-100%25%20Offline-red)

## 📌 Problem Statement
NHAI field personnel at remote highway sites have zero network. Datalake 3.0 facial auth fails offline, enabling attendance fraud via photos.

## ✅ Solution
**FaceGuard Offline** — AI authentication engine working with zero internet.

## 🏗️ Architecture
```
Camera → Face Detection → Liveness Check → Recognition → SQLite → AWS Sync
```

## 🚀 Features
- ✅ 100% Offline
- ✅ Face Recognition (LBPH)
- ✅ Blink Detection (Anti-spoofing)
- ✅ React Native (Android + iOS)
- ✅ SQLite Local Storage
- ✅ AWS Sync when online

## 📱 Tech Stack
| Component | Technology | License |
|---|---|---|
| Face Recognition | OpenCV LBPH | Apache 2.0 |
| Liveness Detection | OpenCV Eye Cascade | Apache 2.0 |
| Mobile App | React Native 0.73 | MIT |
| Local Storage | SQLite | MIT |

## ⚡ Performance
| Metric | Value | Target |
|---|---|---|
| Speed | < 1 sec | < 1 sec ✅ |
| Model Size | ~15 MB | < 20 MB ✅ |
| Accuracy | > 95% | > 95% ✅ |
| Network | 0 | 0 ✅ |

## 🛠️ Setup

### Python Demo
```bash
git clone https://github.com/Shrey-Mittal518/FaceGuardOffline
pip install opencv-python mediapipe numpy
python main.py
```

### React Native
```bash
cd FaceGuardRN
npm install
npx react-native run-android
```

## 🔄 Sync & Purge
```
Offline → SQLite → Network restored → AWS S3 → ACK → Purge
```

📹 Demo Videos
🎥 Camera Demo → https://youtu.be/cWZPekBTW1s

🏗️ Architecture Walkthrough → https://youtube.com/shorts/pz0eE0D39tU?feature=share


## 👤 Author
**Shrey Mittal** — NHAI Hackathon 7.0

## 🔗 Source Code
GitHub: https://github.com/Shrey-Mittal518/FaceGuardOffline