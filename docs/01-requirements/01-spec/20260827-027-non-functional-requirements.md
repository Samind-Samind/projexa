
# 027 — Non-Functional Requirements (NFR) รวมทั้งโปรเจกต์

- **วันที่สร้าง:** 2026-08-27
- **สถานะ:** Draft
- **ผู้ให้ requirement:** ไม่ระบุ (สังเคราะห์โดย AI จากการวิเคราะห์เอกสาร requirement/backlog/feature-list/test-plan/acceptance-criteria/high-level architecture/detailed design ที่มีอยู่ในโปรเจกต์ทั้งหมด แล้วให้ user ยืนยันผ่านคำถามหลายรอบในเซสชันสนทนา — ไม่ใช่ requirement ที่ user เขียนขึ้นเองแต่แรก)
- **อ้างอิง TOR/เอกสารเดิม:** [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md) §11 §14, [[../../02-design/02-technical/architecture|architecture.md]] §5, [[../../02-design/02-technical/detailed-design/scr-003-ข้อมูลโครงการ|scr-003 detailed design]], [[../backlog|backlog.md]], [[../feature-list|feature-list.md]], [[../../03-testing/01-test-plan/test-plan|test-plan.md]], [[../../03-testing/01-test-plan/acceptance-criteria|acceptance-criteria.md]]

## ความต้องการดิบ (Raw Requirement)

> สร้างเอกสาร requirement ใหม่ 1 ไฟล์สำหรับ Non-Functional Requirements (NFR) รวมทั้งหมดของโปรเจกต์ Projexa — ไม่ใช่ requirement ของหน้าจอใดหน้าจอหนึ่ง แต่เป็น cross-cutting requirement ของทั้งระบบ

## บริบท/ที่มา

เอกสารนี้มาจากการวิเคราะห์ requirement/backlog/feature-list/test case/test report/high-level design/detailed design ที่มีอยู่ทั้งหมดในโปรเจกต์ เพื่อเสนอ NFR ที่ควรเพิ่ม โดยระหว่างการวิเคราะห์ user ได้ตอบคำถามยืนยัน 4 ประเด็นสำคัญไว้ดังนี้ (เป็นข้อมูลจริงที่ user ยืนยันในเซสชันสนทนา ไม่ใช่การเดาของ AI):

1. **Deployment target:** ยังไม่ตัดสินใจ (จะกระทบ NFR ด้าน Availability/Backup/Security เชิงรายละเอียดเมื่อรู้ค่าจริงจาก skill `tech-stack`)
2. **ความอ่อนไหวของข้อมูล:** ข้อมูลใน TOR/โครงการ (งบประมาณ สัญญา ข้อมูลลูกค้า) เป็นข้อมูล**อ่อนไหว/เป็นความลับ** — มีผลโดยตรงต่อ NFR-06 (การส่งข้อมูลให้ AI ภายนอก)
3. **Availability:** ต้องการแบบ **Best-effort** ไม่มี SLA formal (เหมาะกับ internal tool ขนาด MVP RAISE)
4. **Backup policy:** ต้องการ **Daily automated backup, RPO ~24 ชั่วโมง**

## รายละเอียด (Detail)

### NFR-01 Performance — UI Responsiveness

- **หมวด:** Performance
- **Priority:** Must
- **สถานะ:** ใหม่ (ยกระดับจากเอกสารเดิม)
- **คำแนะนำ:** หน้าจอทั่วไปตอบสนอง ≤ 2–3 วินาที (suggested), การอัปเดตสถานะ (SCR-016/017) ต้องทำได้ใน ≤ 3 คลิก
- **เหตุผล/อ้างอิง:** มาจาก risk mitigation ใน §14 ของ Projexa-System-Design-R1.md ตรงๆ แต่ยังไม่เคยถูกเขียนเป็น NFR อย่างเป็นทางการ

### NFR-02 Performance — AI Processing (Async)

- **หมวด:** Performance
- **Priority:** Must
- **สถานะ:** ใหม่ (สอดคล้องกับของเดิม)
- **คำแนะนำ:** งานที่เรียก AI Orchestration (TOR Parser/Design Analyzer/Document Writer) ต้องเป็น asynchronous พร้อมแสดงสถานะ (เช่น "extracting") ไม่ block UI
- **เหตุผล/อ้างอิง:** SCR-004 spec ระบุ "แสดงสถานะการสกัด" และ sequence diagram Flow A ใน architecture.md มี state `extracting` อยู่แล้ว

### NFR-03 Data Consistency

- **หมวด:** Reliability / Data Integrity
- **Priority:** Must
- **สถานะ:** **Confirmed แล้ว** ใน architecture.md §5 (เอกสารนี้ยกขึ้นมาเป็น NFR อย่างเป็นทางการในทะเบียน REQ เพื่อ traceability ครบเท่านั้น ไม่ใช่มติใหม่)
- **คำแนะนำ:** Consistency-first — operation ที่กระทบสาย traceability (`TorClause → Requirement → Screen → TestCase → TestResult`) ต้องเป็น synchronous/transactional เสมอ เมื่อขัดกับความเร็วในการตอบสนองให้ยึด consistency ก่อน
- **เหตุผล/อ้างอิง:** เป็นมติที่ user ยืนยันแล้วใน architecture.md §5 "Consistency-first NFR"

### NFR-04 Security — AuthN/AuthZ (RBAC)

- **หมวด:** Security
- **Priority:** Must
- **สถานะ:** ใหม่ (ขยายจาก suggested เดิม)
- **คำแนะนำ:** RBAC ระดับโครงการตาม 7 role (§2 ของเอกสารหลัก) หนึ่งคนมีได้หลาย role, enforce สิทธิ์ที่ Application Layer ทุก service ก่อนถึง Data Layer, เพิ่ม session timeout (suggested)
- **เหตุผล/อ้างอิง:** JWT+RBAC เสนอไว้ใน §11 ของ Projexa-System-Design-R1.md (ยังไม่ confirm ที่ tech-stack.md), จุด enforce ระบุแล้วใน architecture.md §5

### NFR-05 Security — Data Protection (Encryption)

- **หมวด:** Security
- **Priority:** Must
- **สถานะ:** ใหม่ — ช่องว่าง (gap)
- **คำแนะนำ:** เข้ารหัสข้อมูลระหว่างส่ง (TLS) ทุกช่องทาง + เข้ารหัสข้อมูลที่พัก (encryption at rest) อย่างน้อยที่ File Storage (ไฟล์ TOR ต้นฉบับ, เอกสารส่งมอบที่สร้าง)
- **เหตุผล/อ้างอิง:** ไม่พบการระบุเรื่อง encryption ในเอกสารโปรเจกต์เลย ทั้งที่ TOR มีข้อมูลสัญญา/งบประมาณลูกค้าซึ่งยืนยันแล้วว่าเป็นข้อมูลอ่อนไหว/ความลับ

### NFR-06 Security/Privacy — ข้อมูลที่ส่งให้ AI ภายนอก (Claude API)

- **หมวด:** Security / Privacy
- **Priority:** Must
- **สถานะ:** ใหม่ — **สำคัญขึ้นตามที่ user ยืนยันว่าข้อมูลอ่อนไหว/เป็นความลับ**
- **คำแนะนำ:** ต้องมี DPA (Data Processing Agreement)/ข้อตกลงคุ้มครองข้อมูลกับผู้ให้บริการ AI ก่อนใช้งานจริง เป็นมาตรการขั้นต่ำ และพิจารณา redact/mask เฉพาะฟิลด์อ่อนไหวจัด (เช่น เลขบัตรประชาชน, เลขบัญชี, ข้อมูลส่วนบุคคล) ก่อนส่งให้ AI ถ้าพบว่า TOR จริงมีข้อมูลลักษณะนี้ปนอยู่ (suggested — ไม่แนะนำ redact ทั้งหมดเพราะจะลดคุณภาพการสกัดของ AI Parser ลงมาก)
- **เหตุผล/อ้างอิง:** user ยืนยันแล้วว่าข้อมูล TOR/โครงการ (งบประมาณ สัญญา ข้อมูลลูกค้า) เป็นข้อมูลอ่อนไหว/เป็นความลับ ขณะที่สถาปัตยกรรมต้องส่งเนื้อหา TOR ไปให้ Claude API (บริการภายนอก) ตาม §7 ของเอกสารหลัก

### NFR-07 Backup & Disaster Recovery

- **หมวด:** Reliability
- **Priority:** Must
- **สถานะ:** ใหม่ — ช่องว่าง, **ตามที่ user ยืนยัน**
- **คำแนะนำ:** Daily automated backup, RPO ≈ 24 ชั่วโมง
- **เหตุผล/อ้างอิง:** ไม่มีการระบุ backup policy ในเอกสารใดเลยมาก่อน ทั้งที่ระบบเป็น single source of truth ของ traceability ทั้งสาย — user ยืนยันค่านี้ตรงๆ ในเซสชันสนทนา

### NFR-08 Availability

- **หมวด:** Reliability
- **Priority:** Should
- **สถานะ:** ใหม่, **ตามที่ user ยืนยัน**
- **คำแนะนำ:** Best-effort ไม่มี SLA formal
- **เหตุผล/อ้างอิง:** เหมาะกับ internal tool ขนาด MVP RAISE — user ยืนยันค่านี้ตรงๆ ในเซสชันสนทนา

### NFR-09 Scalability / Capacity

- **หมวด:** Performance / Capacity
- **Priority:** Should
- **สถานะ:** **Confirmed โดย user (2026-08-27)**
- **คำแนะนำ:** Concurrent users 20–100 คน (ระดับกลาง), Active projects พร้อมกัน < 10 โครงการ, ขนาดไฟล์ TOR (.docx/.pdf) สูงสุดต่อการอัปโหลด 1 ไฟล์ 25 MB
- **เหตุผล/อ้างอิง:** เดิมไม่มีข้อมูล scale ในเอกสารโปรเจกต์ใดเลย — user ยืนยันตัวเลขจริงในเซสชันสนทนาต่อเนื่องวันที่ 2026-08-27

### NFR-10 Audit Log Retention

- **หมวด:** Compliance / Data Governance
- **Priority:** Must
- **สถานะ:** **Confirmed โดย user (2026-08-27)**
- **คำแนะนำ:** เก็บ StatusHistory/AuditLogEntry เป็นระยะเวลา **10 ปีหลังปิดโครงการ**
- **เหตุผล/อ้างอิง:** หลัก "Everything is Logged" confirmed แล้วในเอกสารหลัก แต่ยังไม่เคยมี retention period ระบุไว้ที่ใดเลยมาก่อน — user ยืนยันตัวเลขนี้ตรงๆ ในเซสชันสนทนาต่อเนื่องวันที่ 2026-08-27 **หมายเหตุ: เดิมควรรอฝ่ายกฎหมาย/องค์กรยืนยัน แต่ user เลือกตัดสินใจแทนเองในเซสชันนี้**

### NFR-11 Usability — Interaction Efficiency

- **หมวด:** Usability
- **Priority:** Must
- **สถานะ:** **Confirmed แล้ว (บางส่วน)**
- **คำแนะนำ:** อัปเดตสถานะทำได้ใน ≤ 3 คลิก, ฟอร์มสำคัญ ≤ 5 ฟิลด์บังคับต่อหน้า (suggested)
- **เหตุผล/อ้างอิง:** §14 risk mitigation ของ Projexa-System-Design-R1.md ระบุไว้ตรงๆ ("ทำหน้าจออัปเดตให้เร็วมาก ≤ 3 คลิก")

### NFR-12 Localization

- **หมวด:** Usability / Localization
- **Priority:** Must
- **สถานะ:** **Confirmed แล้ว (บางส่วน จาก §10; ส่วนรูปแบบวันที่ Confirmed โดย user 2026-08-27)**
- **คำแนะนำ:** รองรับภาษาไทยเต็มรูปแบบทั้ง UI และเอกสารที่ generate (Confirmed จาก §10 เดิม) — เอกสารที่ระบบ generate (REQ, รายงานความก้าวหน้า ฯลฯ) ต้องแสดงวันที่แบบ **พ.ศ.** (เช่น 27 สิงหาคม 2569)
- **เหตุผล/อ้างอิง:** §10 ข้อจำกัดของ Projexa-System-Design-R1.md ระบุ "รองรับภาษาไทยเป็นหลัก" ตรงๆ — ส่วนรูปแบบวันที่ user ยืนยันเพิ่มในเซสชันสนทนาต่อเนื่องวันที่ 2026-08-27

### NFR-13 Document Fidelity / Compatibility

- **หมวด:** Compatibility
- **Priority:** Must
- **สถานะ:** ใหม่ (ยกระดับจากหลักการที่มีอยู่)
- **คำแนะนำ:** ไฟล์ .docx ที่ export ต้องเปิดได้ถูกต้อง 100% ใน Microsoft Word ตรงตาม Template ขององค์กร ไม่มี formatting error
- **เหตุผล/อ้างอิง:** มาจากหลักการ "Template Compliance" ใน CLAUDE.md และ §8 ของ Projexa-System-Design-R1.md โดยตรง

### NFR-14 Browser/Device Compatibility

- **หมวด:** Compatibility
- **Priority:** Should
- **สถานะ:** **Confirmed โดย user (2026-08-27)**
- **คำแนะนำ:** Browser: Chrome, Edge, Firefox (2 เวอร์ชันล่าสุดของแต่ละตัว) — Device: รองรับ Desktop + Tablet + Mobile (responsive เต็มรูปแบบทุกขนาดหน้าจอ)
- **เหตุผล/อ้างอิง:** `test-plan.md` มีหมายเหตุ TODO ไว้แล้วว่ายังไม่มี browser/device matrix ที่ยืนยันจาก QA Lead — user ยืนยันค่านี้ในเซสชันสนทนาต่อเนื่องวันที่ 2026-08-27 **หมายเหตุ: เดิมควรเป็นมติของ QA Lead แต่ user เลือกตัดสินใจแทนเองในเซสชันนี้**

### NFR-15 Maintainability / Extensibility

- **หมวด:** Maintainability
- **Priority:** Should
- **สถานะ:** ใหม่
- **คำแนะนำ:** ต้องเพิ่ม document template ใหม่ หรือช่องทางแจ้งเตือนใหม่ (เช่น LINE/Email) ได้โดยไม่กระทบ core AI Orchestration/Data Layer
- **เหตุผล/อ้างอิง:** รองรับ Phase 2 ตาม §10 (SDD/TSC/User Manual templates, LINE/Email notify, Gantt แก้ไขได้, Kanban, M5 เต็มรูปแบบ) — สอดคล้องกับการที่ Document Generator และ AI Orchestration ถูกออกแบบแยกกันอยู่แล้วใน architecture.md

### NFR-16 AI Service Resilience

- **หมวด:** Reliability
- **Priority:** Should
- **สถานะ:** **Confirmed บางส่วน** (manual fallback)
- **คำแนะนำ:** Manual fallback path เมื่อ AI ล้มเหลว/ให้ผลไม่ครบ (confirmed แล้ว) + เพิ่ม timeout policy ชัดเจน (suggested: timeout 30–60 วินาที, retry 1 ครั้งก่อนถือว่า fail แล้วให้ fallback)
- **เหตุผล/อ้างอิง:** architecture.md §4 มี "Resilience: ทุกจุดที่มี AI ต้องมี manual fallback path คู่ขนานเสมอ" confirmed แล้ว แต่ยังไม่มีตัวเลข timeout/retry กำกับ

### NFR-17 Deployment / Portability

- **หมวด:** Deployment
- **Priority:** — (รอกำหนด)
- **สถานะ:** **รอ (TBD)**
- **คำแนะนำ:** ยังกำหนดไม่ได้จนกว่าจะเลือก deployment target ผ่าน skill `tech-stack` — จะส่งผลกระทบต่อ NFR-05 (Encryption), NFR-07 (Backup), NFR-08 (Availability) เชิงรายละเอียด (เช่น region, redundancy) เมื่อรู้ค่าจริง
- **เหตุผล/อ้างอิง:** user ยืนยันตรงๆ ว่า "ยังไม่ตัดสินใจ" เรื่อง deployment environment

## Acceptance Criteria

- [ ] ทุก NFR มีรหัส (NFR-01 ถึง NFR-17), หมวด, priority, คำแนะนำ, สถานะ, เหตุผล/อ้างอิงครบ
- [ ] NFR-17 (Deployment/Portability) ยังไม่มีข้อมูลยืนยัน ต้องติดป้ายชัดเจนว่ารอข้อมูลเพิ่ม (รอ skill `tech-stack`) ห้ามใส่เป็นค่าที่ยืนยันแล้ว
- [ ] NFR-09, NFR-10, NFR-12 (ส่วนรูปแบบวันที่), NFR-14 — Confirmed โดย user แล้วเมื่อ 2026-08-27 ตามที่ระบุไว้ในแต่ละหัวข้อ
- [ ] NFR ที่มีสถานะ Confirmed แล้วในเอกสารอื่น (NFR-03, NFR-11 บางส่วน, NFR-12 บางส่วน, NFR-16 บางส่วน) ต้องระบุว่า Confirmed จากที่ใด ไม่ใช่เป็นมติใหม่ของเอกสารนี้ เพื่อไม่ให้ขัดแย้งกับ architecture.md ที่ Confirmed ไปแล้ว

## Traceability

- TOR Clause: ไม่มี (เป็น cross-cutting requirement ของทั้งระบบ ไม่ได้ผูกกับข้อใดข้อหนึ่งใน TOR โดยตรง)
- เอกสารอ้างอิง: [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md) §11 (Tech Stack ที่เสนอไว้), §14 (Risk Mitigation), §10 (ข้อจำกัด/ขอบเขต MVP)
- Requirement/เอกสารที่เกี่ยวข้อง: [[../../02-design/02-technical/architecture|architecture.md]] §4 §5, [[../../02-design/02-technical/detailed-design/scr-003-ข้อมูลโครงการ|scr-003 detailed design]], [[../backlog|backlog.md]] (ทุกรายการ SCR-001 ถึง SCR-026), [[../feature-list|feature-list.md]], [[../../03-testing/01-test-plan/test-plan|test-plan.md]], [[../../03-testing/01-test-plan/acceptance-criteria|acceptance-criteria.md]]

## หมายเหตุ

เอกสารนี้เป็นข้อเสนอ NFR ระดับ Draft รอ PM/SA ยืนยันอย่างเป็นทางการก่อนนำไปใช้เป็นเกณฑ์การพัฒนา/ทดสอบจริง เมื่อ deployment target (skill `tech-stack`) ได้รับการยืนยันแล้ว ควรกลับมาอัปเดต NFR-17 (และรายละเอียดของ NFR-05/07/08 ที่เกี่ยวข้อง) อีกครั้ง — ส่วนอื่นที่เคยรอข้อมูลเพิ่ม (scale, browser matrix, ปฏิทิน พ.ศ./ค.ศ., retention period) ได้รับการยืนยันจาก user ครบแล้วในรอบสนทนาต่อเนื่องวันที่ 2026-08-27 เหลือรอเพียง deployment target (skill `tech-stack`) เท่านั้น

ระหว่างการวิเคราะห์ user ได้ยืนยัน 4 ประเด็นในเซสชันสนทนาวันที่ 2026-08-27 ได้แก่ (1) deployment target ยังไม่ตัดสินใจ, (2) ข้อมูล TOR/โครงการเป็นข้อมูลอ่อนไหว/เป็นความลับ, (3) Availability แบบ Best-effort ไม่มี SLA formal, (4) Backup policy แบบ Daily automated backup, RPO ~24 ชั่วโมง — รายละเอียดเต็มอยู่ในหัวข้อ "บริบท/ที่มา" ด้านบน

ต่อมาในรอบสนทนาต่อเนื่องวันเดียวกัน (2026-08-27) user ได้ยืนยันเพิ่มอีก 4 ประเด็น ได้แก่ (5) NFR-09 Scalability/Capacity — concurrent users 20–100 คน, active projects พร้อมกัน < 10 โครงการ, ขนาดไฟล์ TOR สูงสุดต่อการอัปโหลด 25 MB, (6) NFR-10 Audit Log Retention — 10 ปีหลังปิดโครงการ (user เลือกตัดสินใจแทนฝ่ายกฎหมาย/องค์กรเอง), (7) NFR-12 Localization — รูปแบบวันที่ในเอกสารที่ generate ต้องเป็น พ.ศ., (8) NFR-14 Browser/Device Compatibility — Chrome/Edge/Firefox 2 เวอร์ชันล่าสุด และรองรับ Desktop + Tablet + Mobile แบบ responsive เต็มรูปแบบ (user เลือกตัดสินใจแทน QA Lead เอง)
