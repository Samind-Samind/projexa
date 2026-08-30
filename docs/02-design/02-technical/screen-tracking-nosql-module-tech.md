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
| ภาษา/Library เขียน query ฝั่ง Application Service | **Node.js** + **`firebase-admin` SDK** |

## เหตุผล

- เอกสารดีไซน์ของโมดูลนี้ (`screen-tracking-nosql-module.md`) ใช้ศัพท์
  **collection / subcollection / embedded array** อยู่แล้วตั้งแต่ต้น (ตาม
  pattern ตัวอย่าง `LeaveEasy` ในคาบ) ซึ่งตรงกับแนวคิดของ Firestore โดยตรง —
  เลือก Firestore แล้วไม่ต้องแปล/ปรับคำศัพท์หรือโครงสร้างใดๆ ในเอกสารเดิม
- Firestore subcollection รองรับ `statusHistory` ที่ผูกกับแต่ละ `screens/{id}`
  โดยเฉพาะได้ตรงตัว และ embedded array (field `assignees[]`) ก็เป็นชนิดข้อมูล
  มาตรฐานของ Firestore อยู่แล้ว — ไม่ต้องออกแบบโครงสร้างเพิ่มเพื่อรองรับ engine
- `firebase-admin` SDK เป็น library มาตรฐานสำหรับเขียน script/backend service
  เข้าถึง Firestore โดยตรงจากฝั่ง server (เหมาะกับงานส่งหลักสูตรที่เน้นโค้ด
  เข้าถึง NoSQL ไม่ใช่การสร้างระบบเว็บเต็มรูปแบบ)

## Dev / Test Environment

| หัวข้อ | ตัวเลือกที่เลือก |
|---|---|
| Environment สำหรับเขียน/รัน test จริง | **Firebase Local Emulator Suite** (Firestore emulator) |

- เขียนและรัน script/test ทั้งหมด (ตาม TC-084 ถึง TC-100 ใน
  [screen-tracking-nosql-module.md ในโฟลเดอร์ test-cases](../../03-testing/01-test-plan/test-cases/screen-tracking-nosql-module.md))
  ชี้ `firebase-admin` SDK ไปที่ Firestore emulator (`FIRESTORE_EMULATOR_HOST`)
  แทนการต่อ Firebase project จริง — ไม่ต้องสมัคร/ผูก billing account จริง
  เพื่อทำงานส่งหลักสูตรนี้
- Seed ข้อมูลตัวอย่างของแต่ละ TC (เช่นเอกสาร `screens`/`screenTypes` ตั้งต้น)
  ให้เขียนเป็น script รันใส่ emulator ก่อนแต่ละรอบทดสอบ ไม่ต้อง provision
  ข้อมูลถาวรบน cloud
- ถ้าจะ deploy ขึ้น Firebase project จริงในภายหลัง (นอกสโคปงานส่งนี้) ค่อย
  จัดการ credential/service account แยกต่างหาก

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
