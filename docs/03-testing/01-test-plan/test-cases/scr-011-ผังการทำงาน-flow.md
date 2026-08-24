# Test Case — SCR-011 ผังการทำงาน (Flow)

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead ยืนยัน
- **อ้างอิง Requirement:** [[../../../01-requirements/01-spec/20260824-011-scr-011-ผังการทำงาน-flow|SCR-011]]
- **อ้างอิง Acceptance Criteria:** [[../acceptance-criteria|acceptance-criteria]]#scr-011-ผังการทำงาน-flow
- **อ้างอิง User Journey:** [[../../../02-design/01-prototypes/user-journey|user-journey]] (persona BA/SA — ขั้นตอนที่ 6)

## TC-036 แสดงผัง Flow การทำงานของระบบ

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | มีหน้าจอและลำดับการทำงานที่บันทึกไว้ในทะเบียนหน้าจอ (SCR-009/010) |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี SA<br>2. เปิดหน้าผังการทำงาน (Flow) ของโครงการ |
| Expected Result | ระบบแสดงผัง Flow การทำงานของระบบตามข้อมูลหน้าจอที่บันทึกไว้จริง |
| Test Data | หน้าจอตัวอย่าง SCR-A, SCR-B ที่มีลำดับต่อกัน (ตัวอย่าง) |
| อ้างอิง AC | AC-011-1 |
| อ้างอิง Requirement | SCR-011 |

## TC-037 แสดงการเชื่อมโยง/ลำดับระหว่างหน้าจอต่างๆ

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | หน้าจอ SCR-A และ SCR-B มีความสัมพันธ์ต่อกัน (SCR-A → SCR-B) |
| Test Steps | 1. เปิดหน้าผังการทำงาน<br>2. ตรวจสอบเส้นเชื่อมโยงระหว่าง SCR-A และ SCR-B |
| Expected Result | ระบบแสดงเส้นเชื่อมโยงและลำดับจาก SCR-A ไปยัง SCR-B ถูกต้องตามที่บันทึกไว้ |
| Test Data | ความสัมพันธ์ SCR-A → SCR-B (ตัวอย่าง) |
| อ้างอิง AC | AC-011-2 |
| อ้างอิง Requirement | SCR-011 |
