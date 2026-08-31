// ─────────────────────────────────────────────────────────────
// js/firebase-config.js — ตั้งค่าการเชื่อมต่อ Firebase (โมดูล Screen Tracking)
// โหลด SDK จาก CDN แบบ ES module เพราะโปรเจกต์นี้ไม่มีขั้นตอน build
// (แนวทางเดียวกับตัวอย่าง LeaveEasy — client-side Web SDK ต่อ Firestore
// project จริงตรงๆ ไม่มี backend คั่น ดูมติที่
// docs/02-design/02-technical/screen-tracking-nosql-module-tech.md)
// ─────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWkqkQTrGQ9ouz5flI52c96_6H8n2uBWE",
  authDomain: "projexa-b3a6a.firebaseapp.com",
  projectId: "projexa-b3a6a",
  storageBucket: "projexa-b3a6a.firebasestorage.app",
  messagingSenderId: "357414186954",
  appId: "1:357414186954:web:fd6d8c827f68bec923a933",
  measurementId: "G-X92SZVKJXV"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
