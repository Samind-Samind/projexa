// ─────────────────────────────────────────────────────────────
// js/seed.js — ใส่ข้อมูลตัวอย่างจาก js/data.js ขึ้น Firestore ครั้งเดียว
// รันจาก seed.html เท่านั้น ไม่ได้ใช้ในหน้าจอปกติของระบบ
//
// หมายเหตุ (หลังเพิ่มระบบล็อกอิน): ไม่ seed collection "users" ตรงๆ อีกต่อไป
// เพราะผู้ใช้ต้องสมัครสมาชิกเองผ่าน signup.html (ได้ Firestore auto-generated
// id ผูกกับ Firebase Auth) — ที่นี่แค่ query "users" จริงจาก Firestore มาจับคู่
// ชื่อ (user_name/changed_by_name/assigned_by_name ใน data.js) กับ user_id จริง
// ก่อนเขียน screens/statusHistory — ชื่อไหนยังไม่มีในระบบจะถูกข้าม (ไม่ผูก) และ
// แจ้งเตือนในกล่องสถานะ
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

document.getElementById("ปุ่มเริ่ม").addEventListener("click", เริ่มใส่ข้อมูล);

(function renderUserReference() {
  var list = document.getElementById("seed-user-reference");
  if (!list || !window.SEED_DATA) return;
  list.innerHTML = window.SEED_DATA.users.map(function (u) {
    return "<li>" + u.name + " — " + u.email + "</li>";
  }).join("");
})();

async function เริ่มใส่ข้อมูล() {
  var ปุ่ม = document.getElementById("ปุ่มเริ่ม");
  var กล่องสถานะ = document.getElementById("สถานะ");
  ปุ่ม.disabled = true;
  กล่องสถานะ.textContent = "รอตรวจสอบการล็อกอิน…\n";
  await window.AUTH_READY;
  กล่องสถานะ.textContent += "กำลังใส่ข้อมูล…\n";

  try {
    const userSnapshot = await getDocs(collection(db, "users"));
    const nameToId = {};
    userSnapshot.forEach(function (docSnap) {
      nameToId[docSnap.data().name] = docSnap.id;
    });
    กล่องสถานะ.textContent += "อ่านรายชื่อผู้ใช้จริงจาก Firestore แล้ว " + userSnapshot.size + " คน\n";

    function resolveId(name) {
      return name && nameToId[name] ? nameToId[name] : null;
    }

    for (var t of window.SEED_DATA.screenTypes) {
      await setDoc(doc(db, "screenTypes", t.id), t);
    }
    กล่องสถานะ.textContent += "✅ screenTypes " + window.SEED_DATA.screenTypes.length + " รายการ\n";

    var จำนวนประวัติรวม = 0;
    var จำนวนที่ข้าม = 0;
    for (var s of window.SEED_DATA.screens) {
      var { statusHistory, ...screenDoc } = s;
      screenDoc.assignees = (screenDoc.assignees || []).map(function (a) {
        const userId = resolveId(a.user_name);
        if (!userId) จำนวนที่ข้าม++;
        return {
          user_id: userId,
          user_name: a.user_name,
          role: a.role,
          assigned_by: resolveId(a.assigned_by_name),
          assigned_at: a.assigned_at
        };
      }).filter(function (a) { return a.user_id !== null; });

      var newRef = doc(collection(db, "screens"));
      screenDoc.screens_id = newRef.id;
      screenDoc.updated_at = new Date().toISOString();
      await setDoc(newRef, screenDoc);
      for (var h of statusHistory) {
        await addDoc(collection(db, "screens", newRef.id, "statusHistory"), {
          changed_by: resolveId(h.changed_by_name),
          changed_by_name: h.changed_by_name,
          changed_at: h.changed_at,
          old_status: h.old_status,
          new_status: h.new_status,
          reason: h.reason,
          note: h.note
        });
        จำนวนประวัติรวม++;
      }
    }
    กล่องสถานะ.textContent += "✅ screens " + window.SEED_DATA.screens.length + " รายการ\n";
    กล่องสถานะ.textContent += "✅ statusHistory " + จำนวนประวัติรวม + " รายการ (subcollection ของแต่ละ screens)\n";
    if (จำนวนที่ข้าม > 0) {
      กล่องสถานะ.textContent += "⚠️ ข้ามการมอบหมาย " + จำนวนที่ข้าม + " รายการ เพราะยังไม่พบชื่อผู้ใช้นั้นในระบบ (สมัครสมาชิกให้ครบแล้วมอบหมายเพิ่มทีหลังได้)\n";
    }

    กล่องสถานะ.textContent += "\nเสร็จแล้ว — เปิด Firebase Console ดูข้อมูลได้เลย";
  } catch (err) {
    กล่องสถานะ.textContent += "\n❌ ใส่ข้อมูลไม่สำเร็จ: " + err.message;
  } finally {
    ปุ่ม.disabled = false;
  }
}
