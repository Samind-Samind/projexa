// ─────────────────────────────────────────────────────────────
// js/firebase-config.example.js — แม่แบบตั้งค่าการเชื่อมต่อ Firebase
// (โมดูล Screen Tracking)
//
// วิธีใช้: คัดลอกไฟล์นี้เป็น js/firebase-config.js (ชื่อไฟล์นั้นถูก
// .gitignore ไว้แล้ว จะไม่ถูก commit/push) แล้วแทนค่าด้านล่างด้วยค่าจริง
// จาก Firebase Console ของโปรเจกต์คุณเอง (Project settings → General →
// Your apps → SDK setup and configuration)
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
