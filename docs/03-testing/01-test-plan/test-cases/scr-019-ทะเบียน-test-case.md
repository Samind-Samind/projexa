# Test Case — SCR-019 ทะเบียน Test Case

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead ยืนยัน
- **อ้างอิง Requirement:** [[../../../01-requirements/01-spec/20260824-019-scr-019-ทะเบียน-test-case|SCR-019]]
- **อ้างอิง Acceptance Criteria:** [[../acceptance-criteria|acceptance-criteria]]#scr-019-ทะเบียน-test-case
- **อ้างอิง User Journey:** [[../../../02-design/01-prototypes/user-journey|user-journey]] (persona Tester — ขั้นตอนที่ 1)

## TC-059 แสดงรายการ Test Case แบบ list/detail

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | มี Test Case ที่บันทึกไว้ในระบบสำหรับหน้าจอ SCR-A อย่างน้อย 1 รายการ |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี Tester<br>2. เปิดหน้าทะเบียน Test Case<br>3. กดเปิดดูรายละเอียดของ Test Case รายการหนึ่ง |
| Expected Result | ระบบแสดงรายการ Test Case แบบ list และเปิด detail ได้ครบถ้วน |
| Test Data | Test Case ตัวอย่าง TC-สาธิต-01 (ตัวอย่าง) |
| อ้างอิง AC | AC-019-1 |
| อ้างอิง Requirement | SCR-019 |

## TC-060 สร้าง Test Case เองได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | ผู้ใช้ (Tester) อยู่ที่หน้าทะเบียน Test Case |
| Test Steps | 1. กดปุ่ม "สร้าง Test Case ใหม่"<br>2. กรอกรายละเอียด Test Case เอง (ชื่อ, pre-condition, steps, expected result)<br>3. กดบันทึก |
| Expected Result | ระบบบันทึก Test Case ใหม่ที่ผู้ใช้สร้างเองเข้าทะเบียน และแสดงในรายการ |
| Test Data | Test Case ตัวอย่างที่สร้างเอง (ตัวอย่าง) |
| อ้างอิง AC | AC-019-2 |
| อ้างอิง Requirement | SCR-019 |

## TC-061 ให้ AI ร่าง Test Case จากหน้าจอ + business rule ได้ ผ่านการยืนยันจาก Tester ก่อนบันทึกจริง

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | หน้าจอ SCR-A มี ScreenCapability/BusinessRule บันทึกไว้แล้ว (SCR-010) |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี Tester<br>2. เปิดหน้าทะเบียน Test Case ของ SCR-A<br>3. สั่งให้ AI (Test Generator) ร่าง Test Case จากหน้าจอ SCR-A<br>4. ตรวจ Test Case ที่ AI ร่างมา แล้วกดยืนยัน |
| Expected Result | ระบบแสดง Test Case ที่ AI ร่างให้ Tester ตรวจก่อน และบันทึกเป็นทางการเฉพาะรายการที่ Tester ยืนยันแล้วเท่านั้น |
| Test Data | ScreenCapability/BusinessRule ตัวอย่างของ SCR-A |
| อ้างอิง AC | AC-019-3 |
| อ้างอิง Requirement | SCR-019, SCR-010 |
