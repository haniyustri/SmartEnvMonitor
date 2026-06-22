import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// ✅ TAMBAHKAN IMPORT AUTHENTICATION
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBorWt32Ue3XFkCqa_kwJKh1QbEd7p__OI",
  authDomain: "suhu-kelembaban-4a867.firebaseapp.com",
  databaseURL: "https://suhu-kelembaban-4a867-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "suhu-kelembaban-4a867",
  storageBucket: "suhu-kelembaban-4a867.firebasestorage.app",
  messagingSenderId: "581697517102",
  appId: "1:581697517102:web:ba6b05dbd380c9d01b91bf",
  measurementId: "G-C830D3DP2C"
};

// PENCEGAHAN DUPLIKASI (Mengatasi error duplicate-app)
let app;
if (getApps().length === 0) {
  // Jika belum ada aplikasi Firebase yang berjalan, inisialisasi baru
  app = initializeApp(firebaseConfig);
} else {
  // Jika sudah ada (karena Fast Refresh), gunakan yang sudah berjalan
  app = getApp();
}

// Inisialisasi Firestore
export const db = getFirestore(app);

// ✅ INISIALISASI DAN EXPORT AUTHENTICATION
export const auth = getAuth(app);