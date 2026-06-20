# 🌿 SmartEnv Monitor

Aplikasi mobile IoT untuk memantau kondisi lingkungan secara realtime menggunakan ESP32, React Native, Firebase, dan OpenWeatherMap API.

---

## 👥 Anggota Tim & Pembagian Tugas

| No | Nama | Peran | Tanggung Jawab |
|----|------|-------|----------------|
| 1 | Hani Yustri | UI/UX & State Specialist | Desain seluruh tampilan app, navigasi, state management, WebSocket display |
| 2 | Aditya Nurfalaq | API & Network Specialist | Integrasi Axios ke OpenWeatherMap API, parsing JSON, error handling |
| 3 | Ahmad Darwis F | Cloud & Auth Specialist | Setup Firebase Auth, Firestore database, manajemen sesi user |

---

## 📱 Deskripsi Aplikasi

SmartEnv Monitor adalah aplikasi mobile berbasis React Native yang terintegrasi dengan hardware ESP32 + sensor DHT22 untuk memantau suhu dan kelembaban ruangan secara realtime. Data sensor dikirim via protokol WebSocket (WiFi) ke aplikasi, ditampilkan dalam bentuk grafik realtime, dan disimpan ke Firebase Firestore sebagai riwayat data.

---

## 🔗 API yang Digunakan

| API | Fungsi | Library |
|-----|--------|---------|
| OpenWeatherMap API | Fetch data cuaca luar ruangan (suhu, kelembaban, kecepatan angin) | Axios |
| Firebase Authentication | Login & Register user | Firebase SDK |
| Firebase Firestore | Simpan & ambil riwayat data sensor per user | Firebase SDK |
| ESP32 WebSocket Server | Terima data sensor realtime dari hardware | WebSocket (built-in) |

---

## ✨ 3 Fitur Utama

### Fitur 1 — Dashboard Realtime (UI/UX & State - Anggota 1)
- Menampilkan data suhu dan kelembaban dari sensor ESP32 secara realtime
- Grafik realtime yang update setiap 5 detik
- Indikator kondisi otomatis (Normal, Terlalu Panas, Terlalu Lembab, dll)
- Status koneksi WebSocket (Terhubung/Terputus)
- Perbandingan data sensor dengan cuaca luar (Surabaya)

### Fitur 2 — Integrasi API Cuaca via Axios (API Specialist - Anggota 2)
- Fetch data cuaca Surabaya dari OpenWeatherMap API menggunakan Axios
- Parsing response JSON (suhu luar, kelembaban, kecepatan angin, deskripsi cuaca)
- Error handling jika request gagal atau timeout
- Data ditampilkan di WeatherCard pada halaman Dashboard

### Fitur 3 — Firebase Auth & Riwayat Data (Firebase - Anggota 3)
- Login & Register menggunakan Firebase Authentication (email/password)
- Menyimpan riwayat data sensor ke Cloud Firestore per user
- Struktur data: `users/{userId}/history/{timestamp}`
- Manajemen sesi user (auto-login, logout)

---

## 🏗️ Arsitektur Sistem

## 📂 Struktur Folder

```
SmartEnvMonitor/
├── screens/
│   ├── LoginScreen.jsx       # Halaman login (Anggota 1 & 3)
│   ├── DashboardScreen.jsx   # Dashboard utama (Anggota 1)
│   ├── HistoryScreen.jsx     # Riwayat data (Anggota 1 & 3)
│   └── ProfileScreen.jsx     # Profil user (Anggota 1)
├── components/
│   ├── SensorCard.jsx        # Card data sensor (Anggota 1)
│   ├── WeatherCard.jsx       # Card cuaca luar (Anggota 1 & 2)
│   └── SensorChart.jsx       # Grafik realtime (Anggota 1)
├── hooks/
│   └── useWebSocket.js       # Hook koneksi WebSocket (Anggota 1)
├── services/
│   ├── weatherApi.js         # Axios OpenWeatherMap (Anggota 2)
│   └── firebase.js           # Firebase config (Anggota 3)
└── navigation/
    └── AppNavigator.jsx      # Navigasi antar halaman (Anggota 1)
```

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| React Native + Expo | Framework aplikasi mobile |
| WebSocket | Komunikasi realtime dengan ESP32 |
| Axios | HTTP request ke OpenWeatherMap API |
| Firebase Auth | Autentikasi user |
| Firebase Firestore | Database cloud |
| react-native-chart-kit | Grafik realtime |
| ESP32 + DHT22 | Hardware sensor suhu & kelembaban |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (LTS)
- Expo CLI
- Aplikasi Expo Go di HP

### Langkah

1. Clone repository
2. Install dependencies
3. Install web support
4. Jalankan aplikasi

```bash
git clone https://github.com/haniyustri/SmartEnvMonitor.git
cd SmartEnvMonitor
npm install
npx expo install react-dom react-native-web
npx expo start --web
```

---

## 📡 Protokol Komunikasi

Aplikasi menggunakan **WebSocket over WiFi** untuk komunikasi dengan ESP32.

Format data JSON yang dikirim ESP32:

```json
{
  "temperature": 28.5,
  "humidity": 65.2,
  "status": "connected"
}
```

---

*Proyek ini dibuat untuk memenuhi Ujian Praktikum Mobile Computing & Telemetri dan Interfacing Semester Genap 2025-2026 — Politeknik Perkapalan Negeri Surabaya (PPNS)*