# Test Case — SCR-022 จัดการ Template เอกสาร

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead ยืนยัน
- **อ้างอิง Requirement:** [[../../../01-requirements/01-spec/20260824-022-scr-022-จัดการ-template-เอกสาร|SCR-022]]
- **อ้างอิง Acceptance Criteria:** [[../acceptance-criteria|acceptance-criteria]]#scr-022-จัดการ-template-เอกสาร
- **อ้างอิง User Journey:** [[../../../02-design/01-prototypes/user-journey|user-journey]] (persona Admin — ขั้นตอนที่ 3)

## TC-067 อัปโหลดไฟล์ Template .dotx ได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | ผู้ใช้ (Admin) มีไฟล์ Template .dotx ขององค์กร |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี Admin<br>2. เปิดหน้าจัดการ Template เอกสาร<br>3. อัปโหลดไฟล์ `req-template.dotx` |
| Expected Result | ระบบรับและบันทึกไฟล์ Template `req-template.dotx` ไว้ในระบบสำเร็จ (ไฟล์ยังคงเป็น .dotx จริงขององค์กร ไม่ถูก AI จัดรูปแบบใหม่ ตาม §8.3) |
| Test Data | ไฟล์ตัวอย่าง `req-template.dotx` |
| อ้างอิง AC | AC-022-1 |
| อ้างอิง Requirement | SCR-022 |

## TC-068 กำหนด mapping ระหว่าง placeholder กับ data path ได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | มี Template `req-template.dotx` ที่อัปโหลดไว้แล้วและมี placeholder `{{project_name}}` อยู่ในไฟล์ |
| Test Steps | 1. เปิดหน้ากำหนด mapping ของ `req-template.dotx`<br>2. กำหนดให้ placeholder `{{project_name}}` ดึงค่าจาก data path `project.name`<br>3. กดบันทึก |
| Expected Result | ระบบบันทึก mapping ระหว่าง `{{project_name}}` กับ `project.name` สำเร็จ |
| Test Data | placeholder `{{project_name}}` → data path `project.name` (ตัวอย่าง) |
| อ้างอิง AC | AC-022-2 |
| อ้างอิง Requirement | SCR-022 |

## TC-069 ทดสอบ render Template ก่อนใช้งานจริงได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | Template `req-template.dotx` มี mapping ครบแล้วตาม TC-068 |
| Test Steps | 1. กดปุ่ม "ทดสอบ render" ด้วยข้อมูลโครงการตัวอย่าง<br>2. ตรวจสอบผลลัพธ์ที่แสดง |
| Expected Result | ระบบแสดงผลลัพธ์การ render Template โดยแทนค่า `{{project_name}}` เป็นชื่อโครงการตัวอย่างให้ผู้ใช้ตรวจสอบก่อนนำไปใช้งานจริง |
| Test Data | ข้อมูลโครงการตัวอย่าง "โครงการตัวอย่าง (ข้อมูลสาธิต)" |
| อ้างอิง AC | AC-022-3 |
| อ้างอิง Requirement | SCR-022 |
