# SCOPE.md — ขอบเขตโครงงาน (NoSQL Module: Screen Tracking)

> เอกสารนี้เป็นตารางขอบเขตสั้นๆ สำหรับใช้อ้างอิงตลอดงานส่งหลักสูตร (4 สัปดาห์)
> ตามรูปแบบที่กำหนด — ไม่ใช่เอกสารดีไซน์ฉบับเต็มของ Projexa (ดูรายละเอียดเต็มที่
> [docs/02-design/02-technical/screen-tracking-nosql-module.md](docs/02-design/02-technical/screen-tracking-nosql-module.md))

- **วันที่สร้าง:** 2026-08-30
- **โมดูลที่เลือก:** Screen Tracking (ทะเบียนหน้าจอ + ติดตามสถานะพัฒนา)

> **หมายเหตุ (2026-08-30):** เอกสาร Detailed Design (sequence diagram) ของ
> SCR-009/010/013/016 ที่มีอยู่ตอนนี้ที่
> `docs/02-design/02-technical/detailed-design/` **อ้างอิงระบบ Projexa จริง
> เต็มรูปแบบ** (ตาม `database-schema.md`/`api-spec.md` ที่ไม่ได้ตัดสโคป —
> สถานะครบ 10 ค่า, `Assignment` เป็นตารางแยก, ประเภทหน้าจอ Dashboard/Form/
> Review/List/Detail/Timeline/Wizard) **ไม่ตรงกับตารางขอบเขตในไฟล์นี้** โดย
> ตั้งใจ — สองเอกสารนี้เป็นคนละแทร็กกัน: `SCOPE.md`/
> `screen-tracking-nosql-module.md` คือขอบเขตสำหรับ**งานส่งหลักสูตร NoSQL**
> (ต้องเขียนโค้ดจริงให้อยู่ในกรอบนี้ — ยังไม่มี Detailed Design ของตัวเอง)
> ส่วน `detailed-design/scr-009/010/013/016.md` คือดีไซน์ของ **ระบบ Projexa
> จริง** (ใช้เป็นพิมพ์เขียวขยายงานในอนาคต ไม่ใช่สิ่งที่ต้องพัฒนาตามสำหรับงาน
> ส่งครั้งนี้) — ถ้าจะลงมือเขียนโค้ดส่งงาน ให้ยึดตารางในไฟล์นี้เท่านั้น

| | LeaveEasy (ตัวอย่างในคาบ) | ของฉัน |
|---|---|---|
| โฟลเดอร์หลัก | `leaveRequests` | `screens` |
| โฟลเดอร์ประเภท | `leaveTypes` | `screenTypes` |
| โฟลเดอร์ย่อย | `approvals` | `statusHistory` |
| ช่องบอกว่าเป็นของใคร | `requesterId` · `requesterName` | `assignees[].user_id` · `assignees[].user_name` (denormalized snapshot — embedded array ใน document `screen`) |
| สถานะทั้งหมด | รอพิจารณา · อนุมัติ · ไม่อนุมัติ | Not Started · Analysis · Design |
| คนที่สร้างรายการ | พนักงาน | AI (Design Analyzer) หรือ SA/BA/PM |
| คนที่เปลี่ยนสถานะ | หัวหน้า | ผู้รับผิดชอบ (Dev/Tester ที่ถูกมอบหมาย) |
| ช่องข้อความยาวที่ AI จะอ่าน | `reason` | `note`/`reason` ใน `statusHistory` (บังคับกรอกตอนถอยสถานะ) |
| งานที่ AI ช่วย (สัปดาห์ที่ 8) | จัดประเภทการลาให้อัตโนมัติ | แนะนำ `screenType` (Process/Inquiry/Report UI/Service/Report) จากคำอธิบายหน้าจอที่พิมพ์ พร้อม confidence ให้ user ยืนยัน |

## หน้าจอในสโคป (4 หน้า)

1. ทะเบียนหน้าจอ (list)
2. รายละเอียดหน้าจอ (create/edit + เลือกประเภท)
3. มอบหมายผู้รับผิดชอบ
4. บันทึกความก้าวหน้า (เปลี่ยนสถานะ + เขียน `statusHistory`)

## บทบาทผู้ใช้ (3 บทบาท)

SA (ยืนยันหน้าจอ) · ผู้รับผิดชอบ Dev/Tester (กดเปลี่ยนสถานะ) · PM (มอบหมายผู้รับผิดชอบ)

## สิ่งที่ตัดออกจากสโคปรอบนี้ (จดไว้ ไม่ลงมือทำ)

- สถานะที่เหลือของวงจรพัฒนาเต็มรูปแบบ: Development, UnitTest, SIT, UAT, Done, OnHold, Rework
- `Assignment` แบบตารางแยกเต็มรูปแบบ (ตอนนี้ใช้ embedded array แทนเพื่อไม่ให้เกิน "โฟลเดอร์ย่อย 1 อัน")
- ประเภทหน้าจอ (`screenType`) อื่นนอกเหนือจาก 5 ค่าเริ่มต้น
