// ─────────────────────────────────────────────────────────────
// js/openrouter-config.example.js — แม่แบบตั้งค่าคีย์ OpenRouter
// (ใช้กับปุ่ม "ให้ AI ช่วยแนะนำประเภท" ใน SCR-010 รายละเอียดหน้าจอ)
//
// วิธีใช้: คัดลอกไฟล์นี้เป็น js/openrouter-config.js (ชื่อไฟล์นั้นถูก
// .gitignore ไว้แล้ว จะไม่ถูก commit/push) แล้วใส่คีย์จริงของคุณจาก
// https://openrouter.ai/keys
//
// ไฟล์นี้ใช้ได้เฉพาะตอนรันบนเครื่อง (local dev) เท่านั้น — ถูกตั้งไว้ใน
// firebase.json → hosting.ignore ไม่ให้ถูก deploy ขึ้น Firebase Hosting
// เพราะคีย์ OpenRouter เป็นคีย์ผูกเครดิต/บิล ถ้าเปิดเผยต่อสาธารณะใครก็เอา
// ไปเบิกโควตาได้ ต่างจาก Firebase Web API key ใน firebase-config.js ที่
// เปิดเผยต่อสาธารณะได้ปกติ (ความปลอดภัยจริงของ Firebase อยู่ที่
// firestore.rules ไม่ใช่ที่ apiKey)
// ─────────────────────────────────────────────────────────────

export const OPENROUTER_CONFIG = {
  apiKey: "YOUR_OPENROUTER_API_KEY",
  model: "google/gemini-2.5-flash-lite",
};
