# Acceptance Criteria — Screen Tracking Module (สโคปงานส่งหลักสูตร NoSQL)

- **วันที่สร้าง:** 2026-08-30
- **สถานะ:** Confirmed — ยืนยันโดย user เมื่อ 2026-08-30
- **อ้างอิงต้นทาง:** [screen-tracking-nosql-module.md](../02-design/02-technical/screen-tracking-nosql-module.md),
  [screen-tracking-nosql-module-sequence.md](../02-design/02-technical/screen-tracking-nosql-module-sequence.md),
  [SCOPE.md](../../SCOPE.md)

> **คำเตือนสำคัญ:** ไฟล์นี้เป็น Acceptance Criteria ของ**สโคปงานส่งหลักสูตรที่
> ตัดลดแล้วเท่านั้น** (3 สถานะ, `assignees[]` แบบ embedded, ประเภทหน้าจอ 5 ค่า
> เริ่มต้น) — **คนละไฟล์กับ** [[acceptance-criteria|acceptance-criteria.md]]
> ซึ่งเขียนตามระบบ Projexa จริงเต็มรูปแบบ (10 สถานะ, `Assignment` แยกตาราง,
> ScreenCapability/BusinessRule/field list) ห้ามนำ 2 ไฟล์นี้มาปนกันหรือใช้แทน
> กัน — รหัส AC ในไฟล์นี้ใช้ prefix **`AC-NOSQL-`** เพื่อไม่ให้สับสนกับรหัส
> `AC-009-x`...`AC-016-x` ในไฟล์ระบบเต็ม

## SCR-009 ทะเบียนหน้าจอ (list — โฟลเดอร์หลัก `screens`)

- **Backlog:** [[../../01-requirements/backlog|backlog]] — MVP RAISE
- **อ้างอิง Spec:** [[../../01-requirements/01-spec/20260824-009-scr-009-ทะเบียนหน้าจอ|SCR-009]]
- **อ้างอิง Sequence:** [screen-tracking-nosql-module-sequence.md §1](../02-design/02-technical/screen-tracking-nosql-module-sequence.md)

### AC-NOSQL-009-1 แสดงรายการหน้าจอทั้งหมดจาก collection `screens`

- **Given** มีเอกสารอยู่ใน collection `screens` อย่างน้อย 1 รายการ
- **When** SA เปิดหน้าทะเบียนหน้าจอ
- **Then** ระบบแสดงรายการหน้าจอทั้งหมด พร้อม `type.label`, `current_status`,
  และผู้รับผิดชอบจาก `assignees[]` ที่ denormalize มาในตัวเอกสารอยู่แล้ว
  (ไม่ query join เพิ่ม)

### AC-NOSQL-009-2 กรองตามประเภทและสถานะ (3 ค่า)

- **Given** collection `screens` มีเอกสารหลายประเภท (`type`) และหลายสถานะ
  ในกลุ่ม `current_status` (Not Started/Analysis/Design)
- **When** SA เลือกตัวกรองประเภทและ/หรือสถานะ
- **Then** ระบบแสดงเฉพาะเอกสารที่ตรงเงื่อนไข `find({type_id, current_status})`

### AC-NOSQL-009-3 Empty state เมื่อยังไม่มีหน้าจอ

- **Given** collection `screens` ยังไม่มีเอกสารเลย
- **When** SA เปิดหน้าทะเบียนหน้าจอ
- **Then** ระบบแสดง empty state พร้อมปุ่ม "สร้างหน้าจอใหม่"

### AC-NOSQL-009-4 ไม่พบผลลัพธ์ตาม filter

- **Given** ตั้งค่า filter ที่ไม่ตรงกับเอกสารใดใน `screens`
- **When** SA กดกรอง
- **Then** ระบบแสดงข้อความ "ไม่พบหน้าจอที่ตรงเงื่อนไข" พร้อมปุ่มล้าง filter

## SCR-010 รายละเอียดหน้าจอ (สร้าง/แก้ไข + AI แนะนำประเภท)

- **Backlog:** [[../../01-requirements/backlog|backlog]] — MVP RAISE
- **อ้างอิง Spec:** [[../../01-requirements/01-spec/20260824-010-scr-010-รายละเอียดหน้าจอ|SCR-010]]
- **อ้างอิง Sequence:** [screen-tracking-nosql-module-sequence.md §2](../02-design/02-technical/screen-tracking-nosql-module-sequence.md)

### AC-NOSQL-010-1 บันทึกชื่อ คำอธิบาย และประเภทของหน้าจอ

- **Given** SA เปิด "สร้างหน้าจอใหม่" และกรอกชื่อ + คำอธิบาย + เลือกประเภท
- **When** SA กด "บันทึก"
- **Then** ระบบ upsert เอกสารใหม่ใน `screens` โดย denormalize `type.label`
  ติดไปกับฟิลด์ `type` ด้วย (ไม่ query join `screenTypes` ทุกครั้งที่อ่าน)

### AC-NOSQL-010-2 AI แนะนำประเภทพร้อม confidence ต้องยืนยันก่อนบันทึกเสมอ

- **Given** SA พิมพ์ชื่อ + คำอธิบายหน้าจอ และเลือกให้ AI ช่วยแนะนำประเภท
- **When** AI วิเคราะห์ข้อความสำเร็จ
- **Then** ระบบแสดงประเภทที่แนะนำพร้อมค่า `ai_confidence` เป็น**ตัวเลือกที่ยัง
  ไม่บันทึก** — ต้องรอ SA กดยืนยันหรือเลือกประเภทอื่นเองก่อนกด "บันทึก" เท่านั้น
  (`is_suggested = true` จนกว่าจะยืนยัน ตามหลัก human-in-the-loop)

### AC-NOSQL-010-3 AI แนะนำไม่สำเร็จไม่บล็อกการทำงาน

- **Given** SA ขอให้ AI ช่วยแนะนำประเภท
- **When** AI timeout หรือแนะนำไม่สำเร็จ
- **Then** ระบบไม่บล็อกการทำงาน — SA เลือกประเภทจาก dropdown เองได้ทันที

### AC-NOSQL-010-4 บังคับกรอกชื่อหน้าจอก่อนบันทึก

- **Given** SA เปิดฟอร์มสร้าง/แก้ไขหน้าจอ
- **When** SA กด "บันทึก" โดยไม่กรอกชื่อหน้าจอ
- **Then** ระบบบล็อกการบันทึกและแจ้งเตือนที่ field ชื่อ

### AC-NOSQL-010-5 ตรวจจับการบันทึกชนกัน (optimistic concurrency)

- **Given** เอกสาร `screens/{id}` ถูกแก้ไขโดยผู้ใช้อื่นระหว่างที่ SA กำลังแก้ไข
  อยู่
- **When** SA กด "บันทึก" ทับข้อมูลเดิมที่โหลดไว้ตั้งแต่ต้น
- **Then** ระบบแจ้งเตือนให้โหลดข้อมูลล่าสุดก่อนบันทึกซ้ำ ไม่เขียนทับเงียบๆ

## SCR-013 มอบหมายผู้รับผิดชอบ (`assignees[]` แบบ embedded)

- **Backlog:** [[../../01-requirements/backlog|backlog]] — MVP RAISE
- **อ้างอิง Spec:** [[../../01-requirements/01-spec/20260824-013-scr-013-มอบหมายผู้รับผิดชอบ|SCR-013]]
- **อ้างอิง Sequence:** [screen-tracking-nosql-module-sequence.md §3](../02-design/02-technical/screen-tracking-nosql-module-sequence.md)

### AC-NOSQL-013-1 มอบหมายผู้รับผิดชอบเข้า field `assignees[]`

- **Given** PM เลือกหน้าจอที่จะมอบหมาย 1 รายการ และเลือกผู้รับผิดชอบ + บทบาท
- **When** PM กด "มอบหมาย"
- **Then** ระบบ PATCH เอกสาร `screens/{id}` โดย push entry
  `{user_id, user_name, role, assigned_by, assigned_at}` เข้า field
  `assignees[]` โดยตรง (`user_name` เป็น denormalized snapshot ของชื่อผู้ใช้
  ณ ตอนมอบหมาย — ไม่มีการสร้างตารางหรือ subcollection แยกสำหรับ assignment)

### AC-NOSQL-013-2 มอบหมายหลายหน้าจอพร้อมกันเป็นชุดได้

- **Given** PM เลือกหน้าจอมากกว่า 1 รายการพร้อมกัน
- **When** PM เลือกผู้รับผิดชอบ + บทบาท แล้วกด "มอบหมาย"
- **Then** ระบบอัปเดต `assignees[]` ของทุกเอกสารที่เลือกทีละรายการ และแสดงผล
  ลัพธ์เป็น toast สรุปจำนวนหน้าจอที่มอบหมายสำเร็จ

### AC-NOSQL-013-3 มอบหมาย role ที่มีคนอยู่แล้วเป็นการแทนที่ ไม่ใช่เพิ่มซ้ำ

- **Given** เอกสาร `screens/{id}` มี entry ใน `assignees[]` ที่ role ตรงกับ
  role ที่กำลังจะมอบหมายอยู่แล้ว
- **When** PM มอบหมายผู้รับผิดชอบคนใหม่ให้ role เดิมนั้น
- **Then** ระบบแทนที่ entry เดิมในอาร์เรย์ด้วยข้อมูลใหม่ ไม่สร้าง entry ซ้ำซ้อน

### AC-NOSQL-013-4 ข้ามหน้าจอที่ถูกลบไปแล้วระหว่างมอบหมายเป็นชุด

- **Given** PM เลือกหน้าจอหลายรายการเพื่อมอบหมายเป็นชุด
- **When** บางหน้าจอในชุดที่เลือกถูกลบไปแล้วก่อนบันทึกเสร็จ
- **Then** ระบบข้ามรายการที่ถูกลบ ไม่ยกเลิกรายการอื่นที่มอบหมายสำเร็จแล้ว
  และแสดงแยกว่ารายการไหนสำเร็จ/ไม่สำเร็จ

## SCR-016 บันทึกความก้าวหน้า (เปลี่ยนสถานะ → เขียน `statusHistory`)

- **Backlog:** [[../../01-requirements/backlog|backlog]] — MVP RAISE
- **อ้างอิง Spec:** [[../../01-requirements/01-spec/20260824-016-scr-016-บันทึกความก้าวหน้า|SCR-016]]
- **อ้างอิง Sequence:** [screen-tracking-nosql-module-sequence.md §4](../02-design/02-technical/screen-tracking-nosql-module-sequence.md)

### AC-NOSQL-016-1 เปลี่ยนสถานะได้เฉพาะ 3 ค่าในสโคปนี้

- **Given** ผู้รับผิดชอบ (Dev/Tester) เปิดหน้าบันทึกความก้าวหน้าของหน้าจอที่ตน
  รับผิดชอบ
- **When** ผู้รับผิดชอบเลือกสถานะใหม่จาก 3 ปุ่ม (Not Started/Analysis/Design)
- **Then** ระบบอัปเดต `screens/{id}.current_status` เป็นค่าที่เลือก — ไม่มี
  ตัวเลือกสถานะอื่นนอกเหนือจาก 3 ค่านี้ในสโคปรอบนี้

### AC-NOSQL-016-2 บังคับกรอกเหตุผลเฉพาะตอนถอยสถานะ

- **Given** ผู้รับผิดชอบเลือกสถานะที่ถอยหลัง (เช่น Design→Analysis หรือ
  Analysis→Not Started)
- **When** ผู้รับผิดชอบพยายามกด "บันทึก" โดยไม่กรอกเหตุผล
- **Then** ระบบบล็อกการบันทึกและบังคับแสดงช่อง "เหตุผล" ให้กรอกก่อน — กรณี
  เดินหน้าสถานะปกติไม่บังคับกรอกเหตุผล

### AC-NOSQL-016-3 เขียนเอกสารใหม่ใน subcollection `statusHistory` ทุกครั้งที่เปลี่ยนสถานะ

- **Given** ผู้รับผิดชอบเปลี่ยนสถานะสำเร็จ (ไม่ว่าเดินหน้าหรือถอยหลัง)
- **When** ระบบบันทึกการเปลี่ยนสถานะ
- **Then** ระบบ insert เอกสารใหม่ใน subcollection `screens/{id}/statusHistory`
  พร้อม `old_status`, `new_status`, `reason` (ถ้ามี), `changed_by`,
  `changed_at` โดย `changed_by`/`changed_at` ต้องถูกบันทึกอัตโนมัติจากระบบ
  ไม่ใช่ให้ผู้ใช้กรอกเอง

### AC-NOSQL-016-4 หน้าจอถูกลบไปแล้วก่อนกดบันทึก

- **Given** ผู้รับผิดชอบเปิดหน้าบันทึกความก้าวหน้าค้างไว้
- **When** เอกสาร `screens/{id}` ถูกลบไปแล้วก่อนที่จะกด "บันทึก"
- **Then** ระบบแจ้งเตือนว่าหน้าจอนี้ไม่มีอยู่แล้ว และพากลับไปหน้ารายการ

---

> เอกสารนี้เป็น**คนละแทร็ก**กับ [[acceptance-criteria|acceptance-criteria.md]]
> ของระบบ Projexa จริง — ถ้าจะเขียนโค้ดส่งงานหลักสูตร NoSQL ให้ยึด AC-NOSQL-*
> ในไฟล์นี้เท่านั้น
