// ─────────────────────────────────────────────────────────────
// js/auth.js — ระบบล็อกอิน Firebase Authentication (Email/Password)
// ใช้ร่วมกันโดย login.js / signup.js (หน้าสมัคร/เข้าสู่ระบบ) และ
// common.js (auth guard ของทุกหน้าจอที่ต้องล็อกอินก่อนใช้งาน)
// ─────────────────────────────────────────────────────────────

import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const ERROR_MESSAGE_TH = {
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/user-not-found": "ไม่พบบัญชีผู้ใช้นี้ในระบบ",
  "auth/wrong-password": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/too-many-requests": "ลองผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่",
  "auth/email-already-in-use": "อีเมลนี้มีบัญชีอยู่แล้วในระบบ",
  "auth/weak-password": "รหัสผ่านสั้นเกินไป (อย่างน้อย 6 ตัวอักษร)"
};

export function mapAuthError(err) {
  return ERROR_MESSAGE_TH[err.code] || ("เกิดข้อผิดพลาด: " + err.message);
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// สมัครสมาชิก: สร้างบัญชี Firebase Auth แล้วสร้างเอกสารผู้ใช้ใน Firestore
// collection "users" ผูกกันด้วย email ทันที (ดูมติใน CLAUDE.md/SCOPE.md —
// users doc ยังไม่มีฟิลด์ role เพราะ role SA/Dev-Tester/PM เป็นแค่แนวคิด
// ไม่ได้บังคับสิทธิ์ในแอปรอบนี้)
export async function signup(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const userRef = doc(collection(db, "users"));
  await setDoc(userRef, { name: name, email: email, is_active: true });
  return cred.user;
}

export async function logout() {
  await signOut(auth);
  window.location.replace("login.html");
}

// เรียกจากหน้าที่ต้องล็อกอินก่อนใช้งาน (ทุกหน้ายกเว้น login.html/signup.html)
// คืนค่า Promise<{id, name, email}> ของผู้ใช้ที่ล็อกอินอยู่ — ถ้ายังไม่ล็อกอิน
// จะ redirect ไป login.html ทันที (Promise นี้จะไม่ resolve ในกรณีนั้น)
export function guardPage() {
  return new Promise(function (resolve) {
    onAuthStateChanged(auth, async function (firebaseUser) {
      if (!firebaseUser) {
        window.location.replace("login.html");
        return;
      }
      const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
      const snap = await getDocs(q);
      if (snap.empty) {
        await signOut(auth);
        window.location.replace("login.html?error=account-not-linked");
        return;
      }
      const userDoc = snap.docs[0];
      resolve({ id: userDoc.id, name: userDoc.data().name, email: userDoc.data().email });
    });
  });
}
