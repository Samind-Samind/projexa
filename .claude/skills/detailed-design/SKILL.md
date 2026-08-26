---
name: detailed-design
description: >-
  สร้างหรือปรับปรุงเอกสาร Detailed Design ระดับ Conceptual Design ของโปรเจกต์
  Projexa ที่ docs/02-design/02-technical/detailed-design/ (1 ไฟล์ต่อ
  หน้าจอ/ฟีเจอร์ ต้องมี Sequence Diagram เป็นอย่างน้อย) โดยสังเคราะห์จาก spec
  รายหน้าจอ, tech-stack.md, prototype, และ acceptance-criteria.md ที่มีอยู่ใน
  โปรเจกต์ ระบุ actor/layer/entity ที่เกี่ยวข้อง, sequence flow แบบ mermaid,
  data flow, และ error/exception flow พร้อม traceability กลับไปยัง TOR/REQ
  ใช้ skill นี้เมื่อ user ขอสร้าง/ปรับปรุง detailed design, conceptual design,
  sequence diagram/sequence flow, หรือ system design เชิงเทคนิคของหน้าจอ/
  ฟีเจอร์ใดในระบบ
---

# Detailed Design (Conceptual Design + Sequence Flow)

Skill นี้คุมขั้นตอนสร้าง/ปรับปรุงเอกสาร **Detailed Design** ของโปรเจกต์
Projexa ที่ `docs/02-design/02-technical/detailed-design/` ซึ่งเป็นเอกสาร
**conceptual design ระดับหน้าจอ/ฟีเจอร์** (ต่างจาก `tech-stack.md` ที่เป็น
การตัดสินใจเทคโนโลยีระดับระบบ) ประกอบด้วยอย่างน้อย:

- ภาพรวมเชิงแนวคิด — actor, layer/component (ตาม §3 สถาปัตยกรรมใน
  `Projexa-System-Design-R1.md`), entity (ตาม §4.1), business rule ที่เกี่ยวข้อง
- **Sequence Diagram** (mermaid `sequenceDiagram`) — บังคับมีอย่างน้อย 1 diagram
  ต่อไฟล์ แสดง flow หลัก (happy path)
- Data flow / เงื่อนไขสำคัญ และ error/exception flow
- Traceability กลับไปยัง Spec/REQ (และ Acceptance Criteria ถ้ามี)

เอกสารนี้เป็นพิมพ์เขียวสำหรับตอนลงมือเขียนโค้ดจริง และเป็นฐานสำหรับ SDD
(Software/System Design Document) ที่จะ generate ในเฟสถัดไปตาม §10 ของ
`Projexa-System-Design-R1.md`

เอกสาร Detailed Design **ไม่ใช่**มุมมองสรุปแบบ `feature-list.md`/
`user-journey.md` — ห้ามเขียนทับหรือลบเนื้อหาเดิมโดยไม่ยืนยันกับ user ก่อน
ถ้าล้าสมัยจริงให้แนะนำย้ายไป `docs/00-archived/` แทน การที่เอกสารนี้เริ่มต้น
เป็นสถานะ Draft และต้องรอ user ยืนยันก่อนเขียนไฟล์จริง เป็น**ธรรมเนียมการทำงาน
เอกสารทั่วไปของโปรเจกต์นี้** (ตรวจทานก่อนถือเป็นทางการ) ไม่ใช่กติกาที่ผูกกับ
Human-in-the-loop ของตัวระบบ Projexa เอง

**สำคัญ:** ทำขั้นตอนที่ 1–7 ด้านล่างเองใน main loop (ห้ามส่งให้ sub agent ทำ)
เพราะต้องถาม-ตอบและขอยืนยันกับ user แบบ interactive ส่วน "การเขียนไฟล์จริง"
ให้มอบหมายให้ sub agent ชื่อ `detailed-design-writer` ผ่าน Agent tool เมื่อทุก
อย่างถูกยืนยันแล้วเท่านั้น sub agent ตัวนี้ทำงานแบบ one-shot และถามคำถามกลับ
user ไม่ได้ — **ห้ามให้ sub agent เป็นคนออกแบบ sequence flow หรือตัดสินใจ
เนื้อหา conceptual design เอง** หน้าที่นั้นเป็นของขั้นตอนในสกิลนี้เท่านั้น

## กติกาเมื่อพบสิ่งที่ไม่ชัดเจน

ทุกจุดที่ไม่ชัดเจนพอจะออกแบบต่อได้ **ต้องถามด้วย `AskUserQuestion`** และ
**ทุกคำถามต้องมีตัวเลือกอย่างน้อย 3 แนวทางเสมอ พร้อมข้อดี-ข้อเสียของแต่ละ
ตัวเลือก** (ไม่ใช่แค่ yes/no) ยกเว้นคำถามยืนยันล้วนๆ ที่ไม่มีทางเลือกเชิง
เนื้อหาจริง — ห้ามเดาแทน user เมื่อเอกสารโปรเจกต์ไม่มีข้อมูลรองรับ

## ขั้นตอน

### 1. รับสโคป (หน้าจอ/ฟีเจอร์ที่จะทำ)

ถ้า user ระบุมาแล้ว (รหัส SCR, ชื่อหน้าจอ, โมดูล, หรือ "ทั้งหมด") ให้ resolve
เทียบกับ `backlog.md`/`feature-list.md` ถ้า **ไม่ได้ระบุ** ต้องถามด้วย
`AskUserQuestion` พร้อมตัวเลือกอย่างน้อย 3 แนวทาง เช่น:

- ตัวเลือก 1: เฉพาะ MVP RAISE (13 หน้าจอ ตาม `Projexa-System-Design-R1.md`
  §10) — ข้อดี: ตรงกับขอบเขตที่จะลงมือพัฒนาจริงก่อน ข้อเสีย: ไม่ครอบคลุม
  Phase 2
- ตัวเลือก 2: เฉพาะหน้าจอที่มี AI Component เกี่ยวข้อง (SCR-004/005/008/009/
  010/011/019/021–024 ตาม §7.1) — ข้อดี: ปิดความเสี่ยงจุดที่ซับซ้อนสุดของ
  ระบบก่อน ข้อเสีย: หน้าจอ CRUD ทั่วไปยังไม่มี detailed design รองรับตอนเริ่ม
  เขียนโค้ด
- ตัวเลือก 3: ระบุเจาะจงเอง (พิมพ์รหัส SCR หรือชื่อโมดูล)

### 2. ตรวจไฟล์ต้นทางให้ครบก่อนเริ่ม

`Glob`/`Read` มิฉะนั้นแจ้ง user และถามว่าจะรอสร้างเอกสารที่ขาดก่อน หรือตัด
SCR นั้นออกจากสโคป:

- เสมอ: ไฟล์ spec ใน `docs/01-requirements/01-spec/` ของทุก SCR ในสโคป
  (ถ้าขาด แนะนำ skill `requirement` ก่อน), `docs/01-requirements/backlog.md`
- `Projexa-System-Design-R1.md` §3 (สถาปัตยกรรม), §4 (data model +
  traceability), §7 (กติกา AI component — ใช้ตรงๆ เมื่อ SCR ในสโคปมี AI
  component เกี่ยวข้อง ไม่ต้องถาม user เพราะเป็นกติการะบบที่ประกาศไว้แล้ว)
- `docs/02-design/02-technical/tech-stack.md` ถ้ามี — ใช้ชื่อเทคโนโลยี/บริการ
  จริงที่ `Confirmed` แล้วใน sequence diagram (ถ้ายังเป็น `Draft (suggested)`
  หรือยังไม่มีเอกสาร ให้ใช้ชื่อ layer ทั่วไปตาม §3 เช่น "Application Service",
  "AI Orchestration Layer" แทนชื่อเทคโนโลยีเฉพาะเจาะจง)
- ถ้ามี: `docs/02-design/01-prototypes/DESIGN.md` และไฟล์ prototype ของ SCR
  นั้นใน `docs/02-design/01-prototypes/v*/` (ดึงรายละเอียด interaction จริง
  เช่น popover, validation มาทำให้ sequence flow เจาะจงกว่าการเดา)
- ถ้ามี: section ของ SCR นั้นใน
  `docs/03-testing/01-test-plan/acceptance-criteria.md` (ใช้อ้าง error/
  validation flow ให้ตรงกับที่ทดสอบไว้แล้ว)

### 3. ตรวจไฟล์ปลายทางที่มีอยู่แล้ว

`Glob` `docs/02-design/02-technical/detailed-design/scr-*.md` — สำหรับ SCR
ในสโคปที่มีไฟล์อยู่แล้ว `Read` ผ่านๆ แล้วถามด้วย `AskUserQuestion`:

- ตัวเลือก 1 (แนะนำ): ปรับปรุงเฉพาะส่วนที่เปลี่ยน (เช่น เพิ่ม error flow ที่
  ขาด, แก้ sequence ตาม spec ที่อัปเดต) — ข้อดี: ไม่เสียเนื้อหาที่อาจถูกรีวิว
  ไปแล้ว ข้อเสีย: ถ้าโครงสร้าง flow เปลี่ยนมากอาจต้องปะติดปะต่อ
- ตัวเลือก 2: ทบทวนใหม่ทั้งไฟล์ (เขียนทับ) — ข้อดี: ได้ diagram ที่สอดคล้อง
  กันทั้งฉบับ เหมาะถ้า spec/prototype เปลี่ยนไปมาก ข้อเสีย: เสียประวัติการ
  ตรวจทานของเดิม (ต้องพึ่ง git history แทน)
- ตัวเลือก 3: ข้าม SCR นี้ในรอบนี้ (ทำเฉพาะ SCR ที่ยังไม่มีไฟล์)

### 4. กำหนดระดับความละเอียดของ conceptual design

Sequence diagram เป็นสิ่งที่บังคับมีเสมอ ถ้า user ไม่ได้ระบุระดับความละเอียด
เพิ่มเติมมา ให้ถามด้วย `AskUserQuestion`:

- ตัวเลือก 1 (แนะนำ): Sequence diagram (happy path) + สรุป error/exception
  flow แบบ bullet — ข้อดี: อ่านง่าย เพียงพอสำหรับ MVP ข้อเสีย: ไม่เห็น
  exception path เป็น diagram
- ตัวเลือก 2: Sequence diagram แยก 2 ชุดต่อ SCR (happy path + error/
  exception path เป็น diagram แยก) — ข้อดี: ครบถ้วนกว่า เหมาะกับหน้าจอที่มี
  AI component/validation ซับซ้อน ข้อเสีย: ใช้เวลาทำมากขึ้น เหมาะเฉพาะ SCR
  ที่ซับซ้อนจริง
- ตัวเลือก 3: เพิ่ม component-interaction diagram (mermaid flowchart แสดง
  layer/service ที่เกี่ยวข้องตาม §3) ประกอบก่อน sequence diagram ด้วย —
  ข้อดี: เห็นภาพรวมก่อนลง detail ข้อเสีย: อาจซ้ำกับข้อมูลใน §3 อยู่แล้วถ้า
  SCR นั้นไม่ได้ตัดข้าม layer พิเศษอะไร

บันทึกคำตอบไว้ใช้กับทุก SCR ในสโคป (หรือถาม per-SCR ถ้า user ต้องการความ
ละเอียดต่างกันในแต่ละหน้าจอ)

### 5. ตรวจ SCR ที่มี AI Component เกี่ยวข้อง

เทียบ SCR ในสโคปกับตาราง §7.1 ของ `Projexa-System-Design-R1.md` (TOR Parser /
Design Analyzer / Test Generator / Document Writer) ถ้า SCR ใดเกี่ยวข้อง
sequence diagram ของ SCR นั้น **ต้อง** สะท้อนกติกา §7.2 ให้ครบ (ไม่ต้องถาม
user เพราะเป็นกติกาที่ประกาศไว้แล้วในเอกสารระบบ):

- AI component คืนค่าเป็น JSON เท่านั้น (label เป็น step แยกจาก UI/DB)
- ทุกรายการจาก AI ต้องมี source reference/confidence — แสดงเป็น note บน
  arrow หรือ step บรรยาย
- ต้องมี step "แสดงผลให้ user ยืนยัน" (Review gate) ก่อน step บันทึกจริงลง
  Data Layer เสมอ — ห้าม diagram แสดง AI บันทึกตรงไป DB โดยไม่ผ่านคนยืนยัน
- ถ้า SCR เกี่ยวกับสร้างเอกสาร (SCR-021–024 ตาม §8): sequence ต้องแยก step
  "AI ร่างเนื้อความบรรยาย" ออกจาก step "ระบบดึงตัวเลข/ตาราง/Template render"
  ให้ชัดตามหลัก AI Layer แยกจาก Document Generator ใน §3/§8.2

### 6. สรุปแผนให้ user ยืนยันก่อนเขียนไฟล์

สรุปสั้นๆ ว่าจะทำอะไร: รายชื่อ SCR ในสโคป, ไฟล์ไหนสร้างใหม่/แก้ไข/เขียนทับ,
ระดับความละเอียดที่จะใช้ (จากขั้นตอน 4) แล้วขอยืนยันหนึ่งครั้ง เพราะเป็นการ
สร้าง/แก้ไฟล์จริงในโปรเจกต์

### 7. มอบหมายให้ sub agent `detailed-design-writer`

เมื่อ user ยืนยันแล้ว เรียกผ่าน Agent tool (subagent_type:
`detailed-design-writer`) พร้อมข้อมูลที่ finalize แล้วทั้งหมดในพรอมป์ (ห้าม
ส่งให้ sub agent ไปคิดต่อเอง — sub agent เขียนไฟล์ตามที่ระบุมาเท่านั้น):

- วันที่ปัจจุบัน (`YYYYMMDD` และ `YYYY-MM-DD`) จาก context ของ session
- รายชื่อ SCR ทั้งหมดในสโคป พร้อม path ไฟล์ spec, path tech-stack.md (ถ้ามี
  และ layer ไหน Confirmed แล้ว), path prototype (ถ้ามี), path section
  acceptance-criteria.md (ถ้ามี)
- ต่อแต่ละ SCR: **เนื้อหา conceptual design ที่ออกแบบไว้แล้ว** — actor,
  layer/component ที่เกี่ยวข้อง, entity ที่เกี่ยวข้อง, business rule, ขั้นตอน
  sequence flow แบบละเอียด (พอที่ sub agent แปลงเป็น mermaid `sequenceDiagram`
  ได้ตรงเป๊ะโดยไม่ต้องตัดสินใจเพิ่ม), error/exception flow, ว่า SCR นี้มี AI
  component เกี่ยวข้องหรือไม่ (ถ้ามีให้ระบุ component ไหนตาม §7.1 และย้ำกติกา
  ขั้นตอน 5)
- ระดับความละเอียดที่ตกลงกันในขั้นตอน 4 (ต่อ SCR ถ้าต่างกัน)
- สำหรับแต่ละไฟล์ปลายทาง: โหมด "สร้างใหม่" / "แก้เฉพาะส่วนที่เปลี่ยน" /
  "เขียนทับทั้งไฟล์" ตามผลจากขั้นตอน 3

sub agent จะจัดการให้ครบ: เขียน/แก้
`docs/02-design/02-technical/detailed-design/scr-XXX-{slug}.md`, สร้าง/อัปเดต
`docs/02-design/02-technical/detailed-design/index.md`, อัปเดต
`docs/02-design/02-technical/index.md`, และบันทึก `docs/05-log/`

### 8. รายงานผลกลับ user

สรุป path ไฟล์ที่ถูกสร้าง/แก้ไขทั้งหมด, SCR ไหนใช้ diagram ระดับใด, และย้ำว่า
เป็น **Draft ที่ต้องรอ SA/Dev Lead ตรวจทานและยืนยัน** ก่อนใช้เป็นพิมพ์เขียว
ลงมือเขียนโค้ดจริง (เป็นธรรมเนียมตรวจสอบเอกสารทั่วไปของโปรเจกต์นี้)

## สิ่งที่ห้ามทำ

- ห้ามให้ sub agent ออกแบบ sequence flow, เลือก layer/component, หรือตัดสิน
  ระดับความละเอียดเอง — ทุกอย่างต้องถูกออกแบบและยืนยันโดย user ผ่าน main loop
  นี้ก่อน แล้วส่งเป็นเนื้อหาที่ finalize แล้วเท่านั้น
- ห้ามข้ามการถามเมื่อสิ่งใดไม่ชัดเจน และห้ามถามคำถามที่ไม่มีตัวเลือกอย่างน้อย
  3 แนวทางพร้อมข้อดีข้อเสีย (ยกเว้นคำถามยืนยัน yes/no ล้วนๆ)
- ห้ามสร้างเอกสารที่ไม่มี Sequence Diagram อย่างน้อย 1 diagram ต่อ SCR
- ห้ามให้ sequence diagram ของ SCR ที่มี AI component แสดง AI บันทึกข้อมูล
  ตรงลง Data Layer โดยไม่มี step ให้คนยืนยันก่อน (ขัดกับ §7.2)
- ห้ามให้ sequence diagram ของ SCR ที่เกี่ยวกับสร้างเอกสาร (§8) แสดง AI
  เป็นคนสร้างไฟล์ `.docx` เอง (AI คืนค่า JSON เท่านั้น ตาม §3/§8.2)
- ห้ามลบหรือย้ายเนื้อหาเดิมใน detailed-design ที่ยังใช้ได้โดยไม่ผ่านการยืนยัน
  จาก user ก่อน (ถ้าล้าสมัยจริงให้แนะนำย้ายไป `docs/00-archived/` แทน)
