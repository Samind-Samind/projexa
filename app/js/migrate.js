// ─────────────────────────────────────────────────────────────
// js/migrate.js — ย้ายเอกสาร screens เดิม (doc id = code) ไปใช้
// doc id เป็น Firestore auto-generated id + ฟิลด์ code แยกต่างหาก
// รันจาก migrate.html เท่านั้น ครั้งเดียวหลังอัปเดตโค้ด ไม่ได้ใช้ในหน้าจอปกติ
// รันซ้ำได้ปลอดภัย (idempotent) — ข้ามเอกสารที่ย้ายแล้ว (data.screens_id === docSnap.id)
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

document.getElementById("ปุ่มเริ่ม").addEventListener("click", เริ่มย้ายข้อมูล);

async function เริ่มย้ายข้อมูล() {
  var ปุ่ม = document.getElementById("ปุ่มเริ่ม");
  var กล่องสถานะ = document.getElementById("สถานะ");
  ปุ่ม.disabled = true;
  กล่องสถานะ.textContent = "รอตรวจสอบการล็อกอิน…\n";
  await window.AUTH_READY;
  กล่องสถานะ.textContent += "กำลังตรวจสอบเอกสารใน screens...\n";

  try {
    const snapshot = await getDocs(collection(db, "screens"));
    const toMigrate = [];
    snapshot.forEach(function (docSnap) {
      const data = docSnap.data();
      if (data.screens_id !== docSnap.id) toMigrate.push({ oldId: docSnap.id, data: data });
    });

    if (toMigrate.length === 0) {
      กล่องสถานะ.textContent += "ไม่พบเอกสารที่ต้องย้าย — ทุกเอกสารใช้ id ใหม่แล้ว\n";
      return;
    }

    กล่องสถานะ.textContent += "พบ " + toMigrate.length + " เอกสารที่ยังใช้ doc id เดิม (= code) — เริ่มย้าย...\n";

    for (const item of toMigrate) {
      const oldId = item.oldId;
      const newRef = doc(collection(db, "screens"));
      const newData = Object.assign({}, item.data, {
        screens_id: newRef.id,
        code: item.data.code || oldId
      });
      await setDoc(newRef, newData);

      const historySnapshot = await getDocs(collection(db, "screens", oldId, "statusHistory"));
      for (const h of historySnapshot.docs) {
        await addDoc(collection(db, "screens", newRef.id, "statusHistory"), h.data());
        await deleteDoc(h.ref);
      }

      await deleteDoc(doc(db, "screens", oldId));
      กล่องสถานะ.textContent += "✅ " + oldId + " → " + newRef.id + " (code: " + newData.code + ", ย้ายประวัติ " + historySnapshot.size + " รายการ)\n";
    }

    กล่องสถานะ.textContent += "\nย้ายข้อมูลเสร็จแล้ว — เปิด Firebase Console ตรวจสอบได้เลย";
  } catch (err) {
    กล่องสถานะ.textContent += "\n❌ ย้ายข้อมูลไม่สำเร็จ: " + err.message;
  } finally {
    ปุ่ม.disabled = false;
  }
}
