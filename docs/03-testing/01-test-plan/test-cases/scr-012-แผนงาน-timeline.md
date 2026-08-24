# Test Case — SCR-012 แผนงาน/Timeline

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ Tester/QA Lead ยืนยัน
- **อ้างอิง Requirement:** [[../../../01-requirements/01-spec/20260824-012-scr-012-แผนงาน-timeline|SCR-012]]
- **อ้างอิง Acceptance Criteria:** [[../acceptance-criteria|acceptance-criteria]]#scr-012-แผนงาน-timeline
- **อ้างอิง User Journey:** [[../../../02-design/01-prototypes/user-journey|user-journey]] (persona PM — ขั้นตอนที่ 6)

## TC-038 แสดงแผนงานแบบ Gantt ตามงวดงานและหน้าจอ

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | โครงการมีงวดงาน (SCR-007) และหน้าจอ (SCR-009) ที่บันทึกไว้แล้ว |
| Test Steps | 1. เข้าสู่ระบบด้วยบัญชี PM<br>2. เปิดหน้าแผนงาน/Timeline ของโครงการ |
| Expected Result | ระบบแสดงแผนงานแบบ Gantt ตามงวดงานและหน้าจอที่มีอยู่จริงในโครงการ |
| Test Data | งวดงาน "งวดที่ 1" และหน้าจอ SCR-A (ตัวอย่าง) |
| อ้างอิง AC | AC-012-1 |
| อ้างอิง Requirement | SCR-012 |

## TC-039 ปรับวันที่ในแผนงานได้

| ฟิลด์ | รายละเอียด |
|---|---|
| Pre-condition | ผู้ใช้เปิดหน้าแผนงานแบบ Gantt ที่มีรายการ SCR-A อยู่ |
| Test Steps | 1. เลื่อน/ปรับวันที่เริ่มต้นของรายการ SCR-A ในแผนงาน<br>2. บันทึกการเปลี่ยนแปลง |
| Expected Result | ระบบบันทึกวันที่ใหม่ของ SCR-A และแสดงแผนงานที่อัปเดตแล้วเมื่อเปิดหน้านี้อีกครั้ง |
| Test Data | วันที่เดิม 01/09/2026 → วันที่ใหม่ 05/09/2026 (ตัวอย่าง) |
| อ้างอิง AC | AC-012-2 |
| อ้างอิง Requirement | SCR-012 |
