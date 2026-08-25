---
name: gen-feature-journey
description: สร้างหรืออัปเดต docs/01-requirements/feature-list.md (พร้อม MoSCoW) และ docs/02-design/01-prototypes/user-journey.md (พร้อม mermaid flowchart) จากเอกสารออกแบบระบบและ spec หน้าจอที่มีอยู่ในโปรเจกต์ Projexa ใช้เมื่อผู้ใช้ขอสร้าง/อัปเดต feature list หรือ user journey จากเอกสาร TOR/spec ที่มีอยู่แล้ว ไม่ใช่การเขียนเอกสารใหม่ตั้งแต่ต้น
---

# gen-feature-journey

Skill นี้เทียบเท่ากับ "Document Generator" ในสถาปัตยกรรม Projexa เอง (`Projexa-System-Design-R1.md` §7–§8): เรียกใช้ sub-agent `requirements-synthesizer` (เทียบเท่า AI Layer) ให้วิเคราะห์เอกสารต้นทางและคืนค่าเป็น Markdown โครงสร้างคงที่ แล้ว **skill เป็นผู้ตัดสินใจเรื่อง path, template, และการเขียนไฟล์ปลายทางเองทั้งหมด** — ห้ามให้ sub-agent เขียนไฟล์เอง ห้ามข้ามขั้นตอนตรวจสอบก่อนเขียนทับไฟล์เดิม

## ก่อนเริ่ม — ตรวจไฟล์ต้นทาง

ตรวจว่ามีครบก่อนเรียก sub-agent มิฉะนั้นแจ้งผู้ใช้และหยุด:

- `Projexa-System-Design-R1.md`
- `docs/01-requirements/01-spec/*.md` (ควรมี 26 ไฟล์)
- `docs/01-requirements/backlog.md`

## ขั้นตอน

1. **เรียก sub-agent** ผ่าน Agent tool ด้วย `subagent_type: requirements-synthesizer` ไม่ต้องใส่ prompt เพิ่มเติมเรื่องเนื้อหา (agent มีคำสั่งของตัวเองอยู่แล้วในไฟล์นิยาม) แค่บอกบริบทว่ากำลังถูกเรียกจาก skill นี้เพื่อ regenerate ไฟล์ผลลัพธ์

2. **ตรวจรูปแบบผลลัพธ์** ต้องมีครบ 3 บล็อก `<<<FEATURE_LIST>>>`, `<<<USER_JOURNEY>>>`, `<<<SOURCES>>>` ตามสัญญาที่กำหนดไว้ในนิยาม agent ถ้าไม่ครบหรือรูปแบบผิด ให้เรียก sub-agent ซ้ำอีกครั้งพร้อมชี้ปัญหา ไม่ต้อง auto-fix เนื้อหาเอง

3. **เขียน `docs/01-requirements/feature-list.md`** โดยครอบเนื้อหาจากบล็อก `FEATURE_LIST` ด้วย header ต่อไปนี้เสมอ (แก้เฉพาะวันที่):

   ```markdown
   # Feature List — Projexa

   - **วันที่สร้าง/อัปเดตล่าสุด:** <วันที่วันนี้>
   - **สถานะ:** Draft — สังเคราะห์อัตโนมัติ ยังไม่ผ่านการยืนยันจาก BA/PM
   - **สร้างโดย:** skill `gen-feature-journey` (sub-agent `requirements-synthesizer`)
   - **อ้างอิงต้นทาง:** [Projexa-System-Design-R1.md](../../Projexa-System-Design-R1.md) §5, [[backlog|backlog]]

   > เอกสารนี้เป็น**มุมมองสรุป** ไม่ใช่ต้นทางของความจริง หากต้องการแก้ไข ให้แก้ที่ไฟล์ spec รายหน้าจอใน [[01-spec/index|01-spec]] หรือ [[backlog|backlog.md]] แล้วรันสร้างใหม่
   > คอลัมน์ MoSCoW ที่ติดป้าย `(suggested)` เป็นการประเมินของ AI **ยังไม่ยืนยัน** — ต้องให้ BA/PM ตรวจก่อนถือเป็นทางการ ส่วน `Must` มาจาก backlog.md ตรงๆ

   <เนื้อหาจากบล็อก FEATURE_LIST>

   ## แหล่งที่มา

   <เนื้อหาจากบล็อก SOURCES>
   ```

4. **เขียน `docs/02-design/01-prototypes/user-journey.md`** โดยครอบเนื้อหาจากบล็อก `USER_JOURNEY` ด้วย header ต่อไปนี้เสมอ:

   ```markdown
   # User Journey — Projexa

   - **วันที่สร้าง/อัปเดตล่าสุด:** <วันที่วันนี้>
   - **สถานะ:** Draft — สังเคราะห์อัตโนมัติ ยังไม่ผ่านการยืนยันจาก SA
   - **สร้างโดย:** skill `gen-feature-journey` (sub-agent `requirements-synthesizer`)
   - **อ้างอิงต้นทาง:** [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md) §9, [[../../01-requirements/feature-list|feature-list]]

   > แต่ละ diagram ในเอกสารนี้เป็น mermaid `flowchart` (ไม่ใช่ `journey`) เพื่อเลี่ยงการใส่คะแนนความพึงพอใจที่ไม่มีข้อมูลจริงรองรับ ดู [[../../01-requirements/01-spec/20260824-011-scr-011-ผังการทำงาน-flow|SCR-011]] สำหรับ flow ระดับหน้าจอแบบละเอียดกว่านี้

   <เนื้อหาจากบล็อก USER_JOURNEY>

   ## แหล่งที่มา

   <เนื้อหาจากบล็อก SOURCES>
   ```

   ถ้าไฟล์ปลายทางมีอยู่แล้ว ให้ **เขียนทับได้เลย** (ไม่ต้องย้ายของเก่าไป `00-archived` — เอกสารนี้เป็นมุมมองสรุปที่ regenerate จากต้นทางได้เสมอ ใช้ git history เป็นชั้นเวอร์ชันแทน ตามที่ตัดสินใจไว้ตอนออกแบบ)

5. **อัปเดต index ที่เกี่ยวข้อง** — เพิ่ม wikilink ไปยังไฟล์ใหม่ใน `docs/01-requirements/index.md` และ `docs/02-design/01-prototypes/index.md` ถ้ายังไม่มี (ไม่ต้องเพิ่มซ้ำถ้ามีอยู่แล้วจากรอบก่อน)

6. **บันทึกลง `docs/05-log/`** — เพิ่มบรรทัดในไฟล์ log ของวันที่ปัจจุบัน (สร้างไฟล์ใหม่ตามรูปแบบ `YYYYMMDD-log.md` ถ้ายังไม่มีของวันนั้น) ระบุว่า regenerate feature-list.md / user-journey.md รอบนี้ และลิงก์ไฟล์ที่เปลี่ยน

7. **สรุปให้ผู้ใช้** — บอกว่าไฟล์ไหนถูกสร้าง/อัปเดตบ้าง จำนวนฟีเจอร์ต่อระดับ MoSCoW และย้ำชัดเจนว่าเป็น **Draft ที่ต้องให้ BA/PM/SA ยืนยันก่อนใช้งานจริง**

## สิ่งที่ห้ามทำ

- ห้ามให้ sub-agent เขียนไฟล์เอง (sub-agent มีแค่ Read/Glob/Grep อยู่แล้ว)
- ห้ามลบหรือย้ายไฟล์ spec ต้นทางใดๆ ระหว่างทำงาน
- ห้ามแก้ไขเนื้อหาที่ sub-agent สังเคราะห์มาด้วยการเดาเพิ่มเอง หากเนื้อหาดูไม่ครบหรือผิดรูปแบบ ให้เรียก sub-agent ใหม่แทนการแก้เอง
- ห้ามลบป้าย `(suggested)` ออกจากรายการ MoSCoW ที่ไม่ใช่ Must โดยพลการ
