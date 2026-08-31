// ─────────────────────────────────────────────────────────────
// js/seed.js — ใส่ข้อมูลตัวอย่างจาก js/data.js ขึ้น Firestore ครั้งเดียว
// รันจาก seed.html เท่านั้น ไม่ได้ใช้ในหน้าจอปกติของระบบ
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

document.getElementById("ปุ่มเริ่ม").addEventListener("click", เริ่มใส่ข้อมูล);

async function เริ่มใส่ข้อมูล() {
  var ปุ่ม = document.getElementById("ปุ่มเริ่ม");
  var กล่องสถานะ = document.getElementById("สถานะ");
  ปุ่ม.disabled = true;
  กล่องสถานะ.textContent = "กำลังใส่ข้อมูล…\n";

  try {
    for (var u of window.SEED_DATA.users) {
      await setDoc(doc(db, "users", u.id), u);
    }
    กล่องสถานะ.textContent += "✅ users " + window.SEED_DATA.users.length + " รายการ\n";

    for (var t of window.SEED_DATA.screenTypes) {
      await setDoc(doc(db, "screenTypes", t.id), t);
    }
    กล่องสถานะ.textContent += "✅ screenTypes " + window.SEED_DATA.screenTypes.length + " รายการ\n";

    var จำนวนประวัติรวม = 0;
    for (var s of window.SEED_DATA.screens) {
      var { statusHistory, ...screenDoc } = s;
      screenDoc.updated_at = new Date().toISOString();
      await setDoc(doc(db, "screens", s.code), screenDoc);
      for (var h of statusHistory) {
        await addDoc(collection(db, "screens", s.code, "statusHistory"), h);
        จำนวนประวัติรวม++;
      }
    }
    กล่องสถานะ.textContent += "✅ screens " + window.SEED_DATA.screens.length + " รายการ\n";
    กล่องสถานะ.textContent += "✅ statusHistory " + จำนวนประวัติรวม + " รายการ (subcollection ของแต่ละ screens)\n";

    กล่องสถานะ.textContent += "\nเสร็จแล้ว — เปิด Firebase Console ดูข้อมูลได้เลย";
  } catch (err) {
    กล่องสถานะ.textContent += "\n❌ ใส่ข้อมูลไม่สำเร็จ: " + err.message;
  } finally {
    ปุ่ม.disabled = false;
  }
}
