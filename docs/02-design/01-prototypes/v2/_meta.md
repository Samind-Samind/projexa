
# Prototype v2 — Meta

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-30
- **สถานะ:** Confirmed — ยืนยันโดย user เมื่อ 2026-08-30
- **สโคป:** SCR-009 (ทะเบียนหน้าจอ), SCR-010 (รายละเอียดหน้าจอ), SCR-013 (มอบหมายผู้รับผิดชอบ), SCR-016 (บันทึกความก้าวหน้า) — 4 หน้าจอ, โมดูล Screen Tracking ตามขอบเขตที่ตัดลดไว้สำหรับงานส่งหลักสูตร NoSQL (ดู [SCOPE.md](../../../../SCOPE.md) และ [[../../02-technical/screen-tracking-nosql-module|screen-tracking-nosql-module.md]]) — **ไม่ใช่** สโคปของระบบ Projexa จริงเต็มรูปแบบ
- **อ้างอิง Design System:** [[../DESIGN|DESIGN.md]] (โหมด: ใช้ของเดิม — DESIGN.md ถูกอัปเดตทั้งฉบับให้ตรงกับไฟล์อ้างอิง `Projexa.html` ในรอบก่อนหน้านี้แล้ว "Warm Terracotta Workspace" ไม่มีการแก้ไข DESIGN.md เพิ่มเติมในรอบสร้าง prototype นี้)
- **อ้างอิงต้นทาง:**
  - [[../../../01-requirements/backlog|backlog]] (#009, #010, #013, #016 — MVP RAISE)
  - [[../../../01-requirements/feature-list|feature-list]] (SCR-009/010/013/016 — ทั้งหมด Must Have)
  - [[../user-journey|user-journey]]
  - สเปกต้นทางรายหน้าจอ: [[../../../01-requirements/01-spec/20260824-009-scr-009-ทะเบียนหน้าจอ|SCR-009 spec]], [[../../../01-requirements/01-spec/20260824-010-scr-010-รายละเอียดหน้าจอ|SCR-010 spec]], [[../../../01-requirements/01-spec/20260824-013-scr-013-มอบหมายผู้รับผิดชอบ|SCR-013 spec]], [[../../../01-requirements/01-spec/20260824-016-scr-016-บันทึกความก้าวหน้า|SCR-016 spec]]
  - โครงสร้างข้อมูล/field ที่ตัดสโคปแล้ว (แหล่งอ้างอิงหลักของ field ในหน้าจอเหล่านี้ ไม่ใช่ database-schema.md/api-spec.md ตัวเต็มระบบ): [[../../02-technical/screen-tracking-nosql-module|screen-tracking-nosql-module.md]]
  - Sequence/business rule ต่อ flow: [[../../02-technical/screen-tracking-nosql-module-sequence|screen-tracking-nosql-module-sequence.md]]
  - Acceptance Criteria: [[../../../03-testing/01-test-plan/screen-tracking-nosql-module-acceptance-criteria|screen-tracking-nosql-module-acceptance-criteria.md]] (AC-NOSQL-009-x ถึง AC-NOSQL-016-x)
  - Test Case: [[../../../03-testing/01-test-plan/test-cases/screen-tracking-nosql-module|test-cases/screen-tracking-nosql-module.md]] (TC-084 ถึง TC-100)
- **เปลี่ยนแปลงจากเวอร์ชันก่อนหน้า:** เวอร์ชันแรกของสโคปนี้ — ไม่มีเวอร์ชันก่อนหน้าของ SCR-009/010/013/016 (คนละสโคปกับ [[../v1/_meta|v1]] ซึ่งเป็น SCR-003 ข้อมูลโครงการ ระบบ Projexa จริง — `v1` ไม่ถูกแก้ไขในรอบนี้ตามหลัก self-contained snapshot)

## หมายเหตุขอบเขต/ข้อจำกัดของ prototype รอบนี้

- SCR-009: ตัดตัวกรอง/จัดกลุ่มตามโมดูล (`module_id`) ออกจากสโคปนี้ตามที่ระบุใน `screen-tracking-nosql-module.md` เหลือเฉพาะกรองตามประเภทและสถานะ (3 ค่า)
- SCR-010: ใช้ AI Type Suggestion Helper แบบจำลอง (setTimeout ~1.2 วินาที) ไม่ได้ต่อ AI จริง — มีทั้ง path สำเร็จ (แสดง ai_confidence + ปุ่มยืนยัน) และ path timeout (ปุ่ม "จำลอง AI ไม่ตอบสนอง")
- SCR-013: จำลอง `assignees[]` แบบ embedded ด้วย DOM state ภายในหน้าเดียว (ไม่ persist ข้ามการ reload) รวมทั้งจำลองกรณีหน้าจอถูกลบระหว่างมอบหมายเป็นชุด (แถว SCR-104 มีสถานะจำลองไว้ล่วงหน้า)
- SCR-016: ใช้เฉพาะ 3 สถานะ (Not Started/Analysis/Design) ตามที่ตัดสโคปไว้ — รวม AC-NOSQL-016-4/TC-100 (หน้าจอถูกลบก่อนกดบันทึก) แล้ว ผ่านปุ่ม "จำลองหน้าจอถูกลบไปแล้ว" ที่กดแล้วบล็อกการบันทึกและพากลับไปหน้าทะเบียนหน้าจอ (เพิ่มเข้าไปหลังตรวจทาน prototype รอบแรกในเบราว์เซอร์แล้วพบว่ายังขาดเคสนี้อยู่)
- การเชื่อมโยงข้าม 4 หน้าจอ (ทะเบียนหน้าจอ → รายละเอียดหน้าจอ/มอบหมาย/บันทึกความก้าวหน้า) ใช้ query string (`?screen=`, `?ids=`) ในการส่ง state ระหว่างหน้า ไม่ใช้ localStorage/backend จริง เพื่อไม่ผิดกติกา "ห้าม persist ข้อมูลข้ามการ reload หน้า"
