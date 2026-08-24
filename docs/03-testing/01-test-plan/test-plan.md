# Test Plan — Projexa

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead/PM ยืนยัน
- **อ้างอิงต้นทาง:** [[../../01-requirements/backlog|backlog]],
  [[../../01-requirements/feature-list|feature-list]],
  [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md)

> เอกสารนี้เป็นภาพรวมกลยุทธ์การทดสอบ **1 ไฟล์ต่อโปรเจกต์** ไม่ใช่ test case
> รายฟีเจอร์ (ดู [[test-cases/index|test-cases]] สำหรับรายละเอียดต่อฟีเจอร์)
> รายการที่ติดป้าย `(suggested)` เป็นการประเมินของ AI ที่ไม่มีข้อมูลต้นทาง
> ตรงๆ ต้องรอ Tester/QA Lead/PM ยืนยันก่อนถือเป็นทางการ

## 1. ขอบเขตการทดสอบ (Scope)

### In Scope

ครอบคลุมทั้ง 26 หน้าจอตาม §5 ของเอกสารออกแบบระบบ — user เลือกให้ทำ Acceptance
Criteria และ Test Case ล่วงหน้าครบทั้ง 26 หน้าจอในรอบนี้ แม้บางหน้าจอจะเป็น
Phase 2 ตาม `backlog.md` ก็ตาม (ดูคอลัมน์ "สถานะ" ด้านล่าง — สถานะดึงจาก
`backlog.md` ตรงๆ ไม่ติด suggested)

| SCR | ชื่อหน้าจอ | โมดูล | สถานะ |
|---|---|---|---|
| SCR-001 | Dashboard ภาพรวม | M1 | MVP RAISE #1 |
| SCR-002 | รายการโครงการ | M1 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-003 | ข้อมูลโครงการ | M1 | MVP RAISE #2 |
| SCR-004 | นำเข้า/บันทึก TOR | M1 | MVP RAISE #3 |
| SCR-005 | ตรวจสอบผลสกัด TOR | M1 | MVP RAISE #4 |
| SCR-006 | ทะเบียนความต้องการ (REQ) | M1 | MVP RAISE #5 |
| SCR-007 | งวดงานและเอกสารส่งมอบ | M1 | MVP RAISE #6 |
| SCR-008 | ผลวิเคราะห์ออกแบบจาก AI | M2 | MVP RAISE #7 |
| SCR-009 | ทะเบียนหน้าจอ | M2 | MVP RAISE #8 |
| SCR-010 | รายละเอียดหน้าจอ | M2 | MVP RAISE #9 |
| SCR-011 | ผังการทำงาน (Flow) | M2 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-012 | แผนงาน/Timeline | M3 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-013 | มอบหมายผู้รับผิดชอบ | M3 | MVP RAISE #10 |
| SCR-014 | ปฏิทินและการแจ้งเตือน | M3 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-015 | กระดานติดตามสถานะ | M4 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-016 | บันทึกความก้าวหน้า | M4 | MVP RAISE #11 |
| SCR-017 | ประวัติการเปลี่ยนแปลง | M4 | MVP RAISE #12 |
| SCR-018 | ติดตามปัญหา (Issue) | M4 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-019 | ทะเบียน Test Case | M5 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-020 | บันทึกผลการทดสอบ | M5 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-021 | คลังเอกสารโครงการ | M6 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-022 | จัดการ Template เอกสาร | M6 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-023 | สร้างเอกสารส่งมอบ | M6 | MVP RAISE #13 |
| SCR-024 | ประวัติเวอร์ชันเอกสาร | M6 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-025 | ผู้ใช้งานและสิทธิ์ | M7 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |
| SCR-026 | ข้อมูลตั้งต้น | M7 | Phase 2 — รวมอยู่ในสโคปการทดสอบรอบนี้ตามที่ user เลือกทำ AC/Test Case ล่วงหน้า |

### Out of Scope

ไม่มี (ครอบคลุมทั้ง 26 หน้าจอตาม §5) — หมายเหตุ: การที่ Test Case ถูกเขียนไว้
ล่วงหน้าสำหรับหน้าจอ Phase 2 ไม่ได้แปลว่าหน้าจอเหล่านั้นจะถูกพัฒนาในรอบ MVP
โครงการ RAISE นี้ (ยึดตาม §10 ที่ยังจำกัด MVP ไว้ที่ 13 หน้าจอ) การรันจริงของ
Test Case ฝั่ง Phase 2 ต้องรอถึงรอบพัฒนาที่เกี่ยวข้องก่อน

## 2. ประเภทการทดสอบ (Test Types)

| ประเภท | คำอธิบาย | อ้างอิง |
|---|---|---|
| Functional Testing | ทดสอบตาม Acceptance Criteria ของแต่ละ SCR | [[acceptance-criteria|acceptance-criteria]] |
| Integration Testing (suggested) | ทดสอบจุดต่อระหว่างหน้าจอตามสาย traceability (§4.2) เช่น SCR-005→SCR-006, SCR-008→SCR-009/010, SCR-017→SCR-023 | ประเมินเอง |
| UAT (suggested) | ให้ PM/BA/ผู้ใช้จริงยืนยันก่อนปิดงวด (ตาม §6 วงจรสถานะหน้าจอ) | ประเมินเอง |
| Regression Testing (suggested) | ทดสอบซ้ำหลังแก้บั๊กที่บันทึกใน Issue (SCR-018) | ประเมินเอง |
| AI Human-in-the-loop Verification (suggested) | ทดสอบเฉพาะจุดที่ AI เสนอข้อมูล (SCR-005, SCR-008, SCR-019, SCR-023) ต้องมีการยืนยันจากคนก่อนบันทึกจริงเสมอ ตาม §7.2 | ประเมินเอง |

## 3. Test Environment

- **Environment ที่รองรับ:** Dev/Staging/UAT (suggested — ยังไม่มีข้อมูลจริงจาก
  infra/DevOps ณ วันที่เขียนเอกสารนี้ **TODO:** รอข้อมูล environment
  จริงจากทีม infra/DevOps)
- **Browser/Device:** Web app responsive ตามสถาปัตยกรรม Presentation Layer
  ของระบบ (suggested — ยังไม่มีรายการ browser/device matrix ที่ยืนยันแล้ว
  **TODO:** รอ QA Lead ยืนยันรายการ browser/device ที่ต้องทดสอบจริง)
- **ข้อมูลทดสอบระดับสูง:** ใช้ข้อมูลโครงการตัวอย่าง (dummy project) ที่ไม่ใช่
  ข้อมูลลูกค้าจริง ตามที่ prototype SCR-003 (`docs/02-design/01-prototypes/v1/scr-003.html`)
  สาธิตไว้ — ไฟล์ TOR ตัวอย่างต้องเป็น .docx/.pdf ที่มี text layer ตามข้อจำกัด
  ที่ประกาศไว้ล่วงหน้าใน §10

## 4. Risk Management

| ความเสี่ยง | ผลกระทบ | โอกาสเกิด | แนวทางลด | อ้างอิง |
|---|---|---|---|---|
| ข้อมูลที่ AI สกัด/เสนอผิดพลาดแล้วไม่มีคนตรวจ | สูง | ปานกลาง | ทุกจุดที่ AI เสนอต้องผ่านการยืนยันจากคน (Human-in-the-loop) — ทดสอบเจาะจงที่ SCR-005, SCR-008, SCR-019, SCR-023 | `CLAUDE.md`, §7.2 |
| Traceability ขาดตอน (TorClause→...→TestResult) | สูง | ต่ำ | บังคับให้ทุก TestCase อ้าง Requirement/Screen ที่มาได้ | §4.2 |
| AI เขียนตัวเลข/ข้อมูลที่ต้องดึงจากฐานข้อมูลจริงเอง (hallucination) ในเอกสารส่งมอบ | สูง | ปานกลาง | ทดสอบเจาะจงว่าตัวเลข/ตาราง/เลขอ้างอิงในเอกสารที่ export มาจากฐานข้อมูลจริงเท่านั้น (SCR-023) | §7.2, §8.2 |
| หน้าจอ Phase 2 ถูกพัฒนาโดยไม่ผ่าน Gate ยืนยัน (§6) เพราะรีบตามกำหนดงวด | ปานกลาง | ปานกลาง (suggested) | บังคับ Entry/Exit Criteria ตามข้อ 5 ก่อนเริ่ม/ปิดรอบทดสอบทุกครั้ง | ประเมินเอง |
| Environment/Test data ยังไม่ยืนยันจริง (ดูข้อ 3) ทำให้ผลทดสอบคลาดเคลื่อน | ปานกลาง | สูง (suggested) | ต้องได้ข้อมูล environment ที่ยืนยันแล้วก่อนเข้ารอบทดสอบจริง | ประเมินเอง |

## 5. Entry / Exit Criteria

### Entry Criteria
- Spec และ Acceptance Criteria ของ SCR ในสโคปต้องผ่านการยืนยันจาก BA/PM แล้ว
  (สถานะไม่ใช่ Draft ที่ยังไม่มีใครตรวจ)
- Environment ทดสอบพร้อมใช้งานตามข้อ 3

### Exit Criteria
- Test Case ทุกอันในสโคปถูกรันครบและบันทึกผลใน [[../02-test-result/index|02-test-result]]
- ไม่มี Issue ระดับ Critical/Blocker ที่ยังเปิดอยู่ (อ้างอิง SCR-018)

## 6. Traceability

ยึดสาย `TorClause → Requirement → Screen → TestCase → TestResult` ตาม
`Projexa-System-Design-R1.md` §4.2 — ทุก Test Case ที่สร้างจาก skill นี้ต้อง
โยงกลับ SCR และ Acceptance Criteria ได้เสมอ (ดู [[acceptance-criteria|acceptance-criteria]] และ [[test-cases/index|test-cases]])

## ประวัติการอัปเดต

- 2026-08-24: สร้างเอกสารครั้งแรก ครอบคลุมทั้ง 26 หน้าจอตามที่ user ยืนยันสโคป
  พร้อมกับสร้าง `acceptance-criteria.md` และ `test-cases/*.md` ครบทุก SCR
