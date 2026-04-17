import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Ini adalah data kunci (API) yang kamu berikan tadi
const firebaseConfig = {
  apiKey: "AIzaSyCiITtDaCJwgb1XoEZ9bXdoqQRUisYL3p8",
  authDomain: "web-yusal.firebaseapp.com",
  databaseURL: "https://web-yusal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-yusal",
  storageBucket: "web-yusal.firebasestorage.app",
  messagingSenderId: "554310887953",
  appId: "1:554310887953:web:1ee0bd74d74bb0b9891fb0",
  measurementId: "G-JEBYR8554X"
};

// Inisialisasi Firebase agar tidak error saat aplikasi dijalankan ulang
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };
