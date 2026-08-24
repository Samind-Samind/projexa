---
name: test-design
description: >-
  สร้างหรืออัปเดตเอกสาร Acceptance Criteria (Given-When-Then),
  Test Plan, และ Test Case ของโปรเจกต์ Projexa ใน
  docs/03-testing/01-test-plan/ โดยสังเคราะห์จาก Backlog, Feature List,
  User Journey, และ spec รายหน้าจอ (รวม prototype ถ้ามี) รองรับการระบุ
  เจาะจงว่าจะสร้างเอกสารประเภทใด (AC/Test Plan/Test Case/ทั้งหมด) และสโคป
  หน้าจอ/backlog item ใด ใช้เมื่อ user ขอสร้าง/อัปเดต test case, test plan,
  หรือ acceptance criteria
---

# Test Design (Acceptance Criteria / Test Plan / Test Case)

Skill นี้คุมขั้นตอนสร้าง **เอกสารการทดสอบ 3 ประเภท** ใน
`docs/03-testing/01-test-plan/`:

- `acceptance-criteria.md` — Given-When-Then ต่อ **Backlog Item** (1 ไฟล์
  รวมทั้งโปรเจกต์ ขยายทีละ section ตามสโคปที่สร้างแต่ละรอบ)
- `test-plan.md` — ภาพรวมกลยุทธ์การทดสอบ **1 ไฟล์ต่อโปรเจกต์** (scope,
  ประเภทการทดสอบ, environment, risk management, entry/exit criteria)
- `test-cases/{feature-slug}.md` — test case แบบ step-by-step **1 ไฟล์ต่อ
  ฟีเจอร์/backlog item**

ตามหลัก **Human-in-the-loop** ของ Projexa (ดู `CLAUDE.md`): ไม่มีเอกสาร/
section ใดถูกสร้างหรือเขียนทับโดยไม่ผ่านการยืนยันจาก user ก่อน เอกสารทั้ง 3
ประเภทนี้**ไม่ใช่**มุมมองสรุปแบบ `feature-list.md`/`user-journey.md` — ห้าม
เขียนทับโดยไม่ถาม ถ้าเนื้อหาเดิมล้าสมัยจริงให้แนะนำย้ายไป `docs/00-archived/`
แทนการลบ/ทับ

**สำคัญ:** ทำขั้นตอนที่ 1–6 ด้านล่างเองใน main loop (ห้ามส่งให้ sub agent ทำ)
เพราะต้องถาม-ตอบและขอยืนยันกับ user แบบ interactive ส่วน "การเขียนไฟล์จริง"
ให้มอบหมายให้ sub agent ชื่อ `test-designer` ผ่าน Agent tool เมื่อทุกอย่าง
ถูกยืนยันแล้วเท่านั้น sub agent ตัวนี้ทำงานแบบ one-shot และถามคำถามกลับ user
ไม่ได้

## ขั้นตอน

### 1. รับว่าจะสร้างเอกสารประเภทใด

ถ้า user ระบุมาแล้วในข้อความ (เช่น "ทำ test case ให้ SCR-006", "อัปเดต test
plan") ให้ resolve เป็นชุดประเภทที่ต้องทำ ถ้า **ไม่ได้ระบุ** ให้ถามด้วย
`AskUserQuestion` (multiSelect) จากตัวเลือก: Acceptance Criteria / Test Plan /
Test Case / ทั้งหมด 3 อย่าง

จำกฎการพึ่งพากันไว้: **Test Case ควรมี Acceptance Criteria รองรับก่อนเสมอ**
(test step ต้องอ้าง AC ได้) ถ้า user เลือกทำ Test Case ของ SCR ที่ยังไม่มี
section ใน `acceptance-criteria.md` ให้ถามด้วย `AskUserQuestion`:

- ตัวเลือก 1 (แนะนำ): สร้าง Acceptance Criteria ของ SCR นั้นก่อน แล้วต่อด้วย
  Test Case ในรอบเดียวกัน — ข้อดี: test case อ้าง AC-id จริงได้ครบ ข้อเสีย:
  งานรอบนี้ใหญ่ขึ้นเล็กน้อย
- ตัวเลือก 2: ข้าม AC ไปก่อน ให้ test case อ้างอิงตรงไปที่รายการ "Acceptance
  Criteria" ดิบในไฟล์ spec แทน — ข้อดี: เร็วกว่า ข้อเสีย: อ้างอิงหยาบกว่า
  Given-When-Then ที่ตั้งใจให้ traceability ชัดเจนกว่า
- ตัวเลือก 3: ยกเลิกการสร้าง test case ของ SCR นั้นในรอบนี้ รอสร้าง AC แยกทีหลัง

### 2. รับสโคป (backlog item / SCR / โมดูล)

ใช้กับทั้ง 3 ประเภท (สำหรับ Test Plan ใช้กำหนดตาราง In Scope/Out of Scope
ของเอกสาร ไม่ใช่การจำกัดว่าจะเขียนกี่ไฟล์) ถ้า user ระบุมาแล้ว (รหัส SCR,
ชื่อหน้าจอ, โมดูล, หรือ "ทั้งหมด") ให้ resolve เทียบกับ `backlog.md`/
`feature-list.md` ถ้า **ไม่ได้ระบุ** ต้องถามด้วย `AskUserQuestion` เสมอ พร้อม
ตัวเลือกอย่างน้อย 3 แนวทาง เช่น:

- ตัวเลือก 1: เฉพาะ MVP RAISE (13 หน้าจอ ตาม `Projexa-System-Design-R1.md`
  §10) — ข้อดี: ตรงกับขอบเขตที่จะทดสอบจริงก่อน ข้อเสีย: ไม่ครอบคลุม Phase 2
- ตัวเลือก 2: ทั้งหมด 26 หน้าจอ — ข้อดี: เห็นภาพรวมการทดสอบทั้งระบบ ข้อเสีย:
  ใช้เวลามาก และหลายหน้าจอเป็น Phase 2 ที่ยังไม่แน่ใจ scope จริง
- ตัวเลือก 3: ระบุเจาะจงเอง (พิมพ์รหัส SCR หรือชื่อโมดูล)

### 3. ตรวจไฟล์ต้นทางให้ครบก่อนเริ่ม

ตรวจด้วย `Glob`/`Read` มิฉะนั้นแจ้ง user และหยุด (หรือถามว่าจะสร้างเอกสารที่
ขาดก่อนด้วย skill อื่น):

- เสมอ: `docs/01-requirements/backlog.md`, `docs/01-requirements/feature-list.md`
  (ถ้าขาด แนะนำ skill `gen-feature-journey` ก่อน)
- ถ้าทำ Acceptance Criteria หรือ Test Case: ไฟล์ spec ใน
  `docs/01-requirements/01-spec/` ของ**ทุก** SCR ในสโคป (ถ้าขาด แนะนำ skill
  `requirement` ก่อน)
- ถ้าทำ Test Case: `docs/02-design/01-prototypes/user-journey.md` (ถ้าขาด
  แนะนำ `gen-feature-journey`) และ section ของ SCR นั้นใน
  `docs/03-testing/01-test-plan/acceptance-criteria.md` (ดูข้อ 1)
- Optional (เสริมความคมของเนื้อหา ไม่บังคับต้องมี): `Glob`
  `docs/02-design/01-prototypes/v*/` หาเวอร์ชันล่าสุด แล้วดูว่ามีไฟล์ HTML
  ของ SCR ในสโคปหรือไม่ — ถ้ามีให้ส่ง path ให้ sub agent อ้างอิงเพิ่ม ถ้าไม่มี
  ก็ทำต่อได้ตามปกติ

ถ้าขาดไฟล์ที่จำเป็น ให้ถามด้วย `AskUserQuestion`: (ก) รอสร้างเอกสารที่ขาด
ก่อน หรือ (ข) ตัด SCR นั้นออกจากสโคปแล้วทำต่อเฉพาะที่มีข้อมูลครบ

### 4. ตรวจไฟล์ปลายทางที่มีอยู่แล้ว

- **`test-plan.md`** — ถ้ามีอยู่แล้ว `Read` ผ่านๆ แล้วถามด้วย
  `AskUserQuestion` ว่าจะ (1) อัปเดตเฉพาะหัวข้อที่เปลี่ยน (เช่น scope
  เปลี่ยนเพราะเพิ่ม SCR ใหม่) หรือ (2) เขียนทับใหม่ทั้งไฟล์ (เหมาะถ้าโครงสร้าง
  เปลี่ยนมาก) — แนะนำตัวเลือก (1) เป็นค่าเริ่มต้นเสมอเพื่อไม่ให้เสียเนื้อหาที่
  อาจถูกรีวิวไปแล้ว
- **`acceptance-criteria.md`** — ถ้ามีอยู่แล้ว `Grep` หา heading `## SCR-XXX`
  ของแต่ละ SCR ในสโคป: ถ้ามี section เดิมอยู่แล้ว จะเป็นการ **แก้ไข section
  นั้น** (ไม่ใช่เพิ่มซ้ำ) ถ้ายังไม่มีจะเป็นการ **เพิ่ม section ใหม่ต่อท้าย**
  ไม่ต้องถาม user ต่อ (การขยายทีละ SCR เป็นพฤติกรรมปกติของไฟล์นี้)
- **`test-cases/{feature-slug}.md`** — ถ้าไฟล์ของ SCR นั้นมีอยู่แล้ว ถามด้วย
  `AskUserQuestion` ว่าจะ (1) เพิ่ม test case ใหม่ต่อท้ายไฟล์เดิม (ไม่แก้ของ
  เดิม) หรือ (2) ทบทวนใหม่ทั้งไฟล์ (เหมาะถ้า AC/spec เปลี่ยนไปมากจนของเดิม
  ล้าสมัย) — แนะนำ (1) เป็นค่าเริ่มต้น

### 5. สรุปแผนให้ user ยืนยันก่อนเขียนไฟล์

สรุปสั้นๆ ว่าจะทำอะไร: ประเภทเอกสารที่จะสร้าง/แก้, รายชื่อ SCR ในสโคป, ไฟล์ไหน
สร้างใหม่/แก้ไข/เพิ่ม section แล้วขอยืนยันหนึ่งครั้ง เพราะเป็นการสร้าง/แก้ไฟล์
จริงในโปรเจกต์

### 6. มอบหมายให้ sub agent `test-designer`

เมื่อ user ยืนยันแล้ว เรียกผ่าน Agent tool (subagent_type: `test-designer`)
พร้อมข้อมูลทั้งหมดที่จำเป็นในพรอมป์:

- วันที่ปัจจุบัน (`YYYYMMDD` และ `YYYY-MM-DD`) จาก context ของ session —
  อย่าให้ sub agent เดาเอง
- ประเภทเอกสารที่ต้องทำรอบนี้ (AC / Test Plan / Test Case — อาจมากกว่า 1)
- รายชื่อ SCR ทั้งหมดในสโคป พร้อม path ไฟล์ spec ของแต่ละอัน และสถานะ MVP
  RAISE/Phase 2 จาก backlog.md
- ถ้ามี prototype ที่เกี่ยวข้อง: path ไฟล์ HTML ของแต่ละ SCR (หรือระบุว่า
  "ไม่มี prototype")
- สำหรับแต่ละไฟล์ปลายทาง: โหมด "สร้างใหม่" / "แก้ section เดิม" / "เพิ่มต่อ
  ท้าย" / "เขียนทับทั้งไฟล์" ตามผลจากขั้นตอน 4
- ถ้า Test Plan: ขอบเขต in-scope/out-of-scope ที่ตกลงกันในขั้นตอน 2

sub agent จะจัดการให้ครบ: เขียน/แก้ `test-plan.md`, `acceptance-criteria.md`,
`test-cases/{feature-slug}.md`, อัปเดต `docs/03-testing/01-test-plan/index.md`
และ `docs/03-testing/01-test-plan/test-cases/index.md`, และบันทึก
`docs/05-log/`

### 7. รายงานผลกลับ user

สรุป path ไฟล์ที่ถูกสร้าง/แก้ไขทั้งหมด และย้ำว่าเป็น **Draft ที่ต้องรอ
Tester/QA Lead/PM ยืนยัน** ตามหลัก Human-in-the-loop (ดู role "Tester" ใน
`Projexa-System-Design-R1.md` §3) ก่อนถือเป็นชุดทดสอบที่ใช้งานจริง

## สิ่งที่ห้ามทำ

- ห้ามให้ sub agent ตัดสินใจเรื่องประเภทเอกสาร, สโคป, หรือโหมดสร้าง/แก้ไฟล์
  เอง — ทุกอย่างต้องถูกตัดสินและยืนยันโดย user ผ่าน main loop นี้ก่อนแล้วส่ง
  เป็นค่าที่ finalize แล้วเท่านั้น
- ห้ามข้ามขั้นตอนตรวจไฟล์ต้นทาง (ขั้นตอน 3) แม้ user จะรีบ
- ห้ามสร้าง Test Case ที่อ้าง AC-id ที่ไม่มีอยู่จริงในไฟล์
  `acceptance-criteria.md` (ดูกฎการพึ่งพาในขั้นตอนที่ 1)
- ห้ามลบหรือย้ายเนื้อหาเดิมใน `acceptance-criteria.md`/`test-plan.md`/
  `test-cases/*.md` โดยไม่ผ่านการยืนยันจาก user ก่อน (ถ้าล้าสมัยจริงให้แนะนำ
  ย้ายไป `docs/00-archived/` แทน — เป็นการตัดสินใจของ user ไม่ใช่ของ skill นี้)
