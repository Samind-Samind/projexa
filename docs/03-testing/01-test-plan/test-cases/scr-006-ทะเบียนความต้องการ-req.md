# Test Case — SCR-006 ทะเบียนความต้องการ (REQ)

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead ยืนยัน
- **อ้างอิง Requirement:** [[../../../01-requirements/01-spec/20260824-006-scr-006-ทะเบียนความต้องการ-req|SCR-006]]
- **อ้างอิง Acceptance Criteria:** [[../acceptance-criteria|acceptance-criteria]]#scr-006-ทะเบียนความต้องการ-req
- **อ้างอิง User Journey:** [[../../../02-design/01-prototypes/user-journey|user-journey]] (persona BA/SA — ขั้นตอนที่ 2)

## TC-020 แสดงรายการ REQ แบบ list และ detail

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | มี Requirement ที่ยืนยันแล้วจาก SCR-005 อยู่ในระบบอย่างน้อย 1 รายการ |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี BA<br>2. เปิดหน้าทะเบียนความต้องการ<br>3. กดเปิดดูรายละเอียดของ REQ รายการหนึ่ง |
| Expected Result | ระบบแสดงรายการ REQ แบบ list และเปิด detail ของ REQ ที่เลือกได้ครบถ้วน |
| Test Data | REQ ตัวอย่าง REQ-001 (ตัวอย่าง) |
| อ้างอิง AC | AC-006-1 |
| อ้างอิง Requirement | SCR-006 |

## TC-021 แยกประเภท Functional (FR) และ Non-Functional (NFR)

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | ทะเบียนความต้องการมี REQ ทั้งประเภท FR และ NFR อยู่แล้ว |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี BA<br>2. เปิดหน้าทะเบียนความต้องการ<br>3. กรอง/ดูรายการแยกตามประเภท FR และ NFR |
| Expected Result | ระบบแสดง/กรองแยกประเภท FR และ NFR ให้เห็นชัดเจน ไม่ปนกัน |
| Test Data | REQ-001 (FR, ตัวอย่าง), REQ-002 (NFR, ตัวอย่าง) |
| อ้างอิง AC | AC-006-2 |
| อ้างอิง Requirement | SCR-006 |

## TC-022 REQ ลิงก์กลับไปยังข้อ (clause) ใน TOR ต้นทางได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | REQ นั้นถูกสกัดมาจากข้อความใน TOR ที่ระบุ clause ชัดเจน |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี BA<br>2. เปิดดูรายละเอียดของ REQ นั้น<br>3. กดลิงก์อ้างอิง TOR clause |
| Expected Result | ระบบพาไปยังข้อความ (clause) ใน TOR ต้นทางที่ REQ นั้นอ้างอิงถูกต้อง |
| Test Data | REQ-001 อ้างอิง TOR ข้อ 1 (ตัวอย่าง) |
| อ้างอิง AC | AC-006-3 |
| อ้างอิง Requirement | SCR-006 |
