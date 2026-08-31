# Screen Tracking Module — Tech Decision (สโคปงานส่งหลักสูตร NoSQL)

- **วันที่สร้าง:** 2026-08-30
- **สถานะ:** Confirmed — ยืนยันโดย user เมื่อ 2026-08-30
- **ระดับเอกสาร:** บันทึกตัดสินใจสั้นเฉพาะโมดูลนี้สำหรับงานส่งหลักสูตร NoSQL
  เท่านั้น — **ไม่ใช่** `tech-stack.md` ของระบบ Projexa จริง (ยังไม่มีเอกสารนั้น
  และไม่ได้ตั้งใจตัดสินใจ Frontend/Auth/Hosting ของทั้งระบบในไฟล์นี้ ถ้าจะทำ
  ให้ใช้ skill `tech-stack` แยกทำทั้งระบบภายหลัง)
- **อ้างอิงต้นทาง:** [screen-tracking-nosql-module.md](screen-tracking-nosql-module.md),
  [screen-tracking-nosql-module-sequence.md](screen-tracking-nosql-module-sequence.md),
  [SCOPE.md](../../../SCOPE.md)

> **เหตุผลที่ต้องมีเอกสารนี้:** `screen-tracking-nosql-module-sequence.md` เขียน
> ชื่อ layer ไว้แบบ generic ("Application Service") เพราะตอนสร้างยังไม่มี
> เอกสารตัดสินใจเทคโนโลยี — ไฟล์นี้ปิดช่องว่างนั้นเพื่อให้รู้ engine/ภาษาที่
> แน่นอนก่อนเขียน query จริง

## การตัดสินใจ

| หัวข้อ | ตัวเลือกที่เลือก |
|---|---|
| Document Database (NoSQL engine) | **Firebase Firestore** (Native mode) |
| ภาษา/Library เขียน query | **JavaScript (vanilla) ฝั่ง client** + **Firebase JS SDK (Web, modular v9+)** — `initializeApp`/`getFirestore` ต่อ Firestore project จริงตรงจากเบราว์เซอร์ (เดิมเคยเลือก Node.js + `firebase-admin` — ดูประวัติการตัดสินใจด้านล่าง) |

## เหตุผล

- เอกสารดีไซน์ของโมดูลนี้ (`screen-tracking-nosql-module.md`) ใช้ศัพท์
  **collection / subcollection / embedded array** อยู่แล้วตั้งแต่ต้น (ตาม
  pattern ตัวอย่าง `LeaveEasy` ในคาบ) ซึ่งตรงกับแนวคิดของ Firestore โดยตรง —
  เลือก Firestore แล้วไม่ต้องแปล/ปรับคำศัพท์หรือโครงสร้างใดๆ ในเอกสารเดิม
- Firestore subcollection รองรับ `statusHistory` ที่ผูกกับแต่ละ `screens/{id}`
  โดยเฉพาะได้ตรงตัว และ embedded array (field `assignees[]`) ก็เป็นชนิดข้อมูล
  มาตรฐานของ Firestore อยู่แล้ว — ไม่ต้องออกแบบโครงสร้างเพิ่มเพื่อรองรับ engine
- Firebase JS SDK (client-side) ต่อจากหน้าเว็บ (`app/`) ตรงเข้า Firestore
  project จริงโดยไม่มี backend คั่น — ตาม pattern เดียวกับตัวอย่าง `LeaveEasy`
  ในคาบทุกประการ (`initializeApp`/`getFirestore`, ไม่มี server, ไม่มี auth ใน
  สโคปนี้) ทำให้ตรวจสอบผลได้ง่ายด้วยการเปิดหน้าเว็บจริงคู่กับ Firebase Console

## Dev / Test Environment

| หัวข้อ | ตัวเลือกที่เลือก |
|---|---|
| Environment สำหรับรันจริง | **Firebase project จริง** (`projexa-b3a6a`) — ไม่ใช้ Local Emulator Suite แล้ว |

- ต่อ `app/js/firebase-config.js` เข้า Firestore project จริงตรงๆ, publish
  `app/firestore.rules` (เปิด read/write แบบไม่ล็อกอิน — ยังไม่มี auth ในสโคป
  นี้) ผ่าน Firebase Console, แล้ว seed ข้อมูลตัวอย่างผ่าน `app/seed.html`
  ครั้งเดียว (ไม่ต้องใช้ script ฝั่ง server + emulator อีกต่อไป)
- ตรวจสอบผลด้วยการแก้ไขข้อมูลใน Firebase Console แล้วรีเฟรชหน้าเว็บดู
  (แบบเดียวกับที่ตรวจสอบ `LeaveEasy`)

## ประวัติการตัดสินใจ

- 2026-08-30: สร้างเอกสารครั้งแรก จากคำถามว่ายังขาดเอกสารอะไรก่อนเขียนโค้ดจริง
  ตาม `SCOPE.md` — user ยืนยันให้ทำเป็นบันทึกสั้นเฉพาะโมดูลนี้ (ไม่ใช่
  weighted-scoring เต็มรูปแบบของ skill `tech-stack`) และเลือก Firebase
  Firestore + Node.js เพราะตรงกับศัพท์ collection/subcollection ที่เอกสาร
  เดิมใช้อยู่แล้ว
- 2026-08-30 (รอบตรวจซ้ำ): เพิ่มหัวข้อ Dev/Test Environment — user ยืนยันให้ใช้
  Firebase Local Emulator Suite เป็น environment หลักสำหรับเขียน/รัน test
  จริง (ไม่ต้องผูก Firebase project จริง) พบระหว่างตรวจทานว่าเอกสารเดิมตัดสินใจ
  engine/ภาษาไว้แล้วแต่ยังไม่ระบุว่าจะรันจริงอย่างไร
- 2026-08-31: **เปลี่ยนมติ** จาก Node.js + `firebase-admin` + Local Emulator
  Suite เป็น **Client-side Firebase JS SDK ต่อ Firebase project จริง
  (`projexa-b3a6a`)** — user ส่ง `firebaseConfig` ของ project จริงมาขอให้เชื่อม
  เว็บ (`app/` — โค้ดจริงของโมดูลนี้ นอกเหนือจาก prototype `v2/` ที่ห้ามแก้)
  เข้ากับ Firestore ตรงๆ แบบเดียวกับที่ทำกับตัวอย่าง `LeaveEasy` ในคาบ (ไม่ใช่
  แบบ server-side ผ่าน emulator ตามมติเดิม) ยืนยันกับ user แล้วว่าให้เปลี่ยนมติ
  นี้แทนที่จะคงของเดิมไว้

## ขอบเขตที่ไม่ตัดสินใจในเอกสารนี้ (ไม่จำเป็นสำหรับงานส่งรอบนี้)

- Frontend framework — ถ้างานส่งต้องมี UI ประกอบ ให้ใช้ prototype แบบ HTML/CSS/JS
  ที่มีอยู่แล้วในโปรเจกต์ (`docs/02-design/01-prototypes/`) เป็นตัวอย่างหน้าตา
  โดยไม่ต้องผูกกับ framework ใด
- Auth / Hosting / Deployment — นอกสโคปงานส่งหลักสูตรนี้
- Tech stack ของระบบ Projexa จริงทั้งระบบ — ให้ทำแยกด้วย skill `tech-stack`
  เมื่อจะขยายเป็นระบบจริงในอนาคต ไม่เกี่ยวกับการตัดสินใจในไฟล์นี้

## ประวัติการตัดสินใจ

- 2026-08-30: สร้างเอกสารครั้งแรก จากคำถามว่ายังขาดเอกสารอะไรก่อนเขียนโค้ดจริง
  ตาม `SCOPE.md` — user ยืนยันให้ทำเป็นบันทึกสั้นเฉพาะโมดูลนี้ (ไม่ใช่
  weighted-scoring เต็มรูปแบบของ skill `tech-stack`) และเลือก Firebase
  Firestore + Node.js เพราะตรงกับศัพท์ collection/subcollection ที่เอกสาร
  เดิมใช้อยู่แล้ว
- 2026-08-30 (รอบตรวจซ้ำ): เพิ่มหัวข้อ Dev/Test Environment — user ยืนยันให้ใช้
  Firebase Local Emulator Suite เป็น environment หลักสำหรับเขียน/รัน test
  จริง (ไม่ต้องผูก Firebase project จริง) พบระหว่างตรวจทานว่าเอกสารเดิมตัดสินใจ
  engine/ภาษาไว้แล้วแต่ยังไม่ระบุว่าจะรันจริงอย่างไร
