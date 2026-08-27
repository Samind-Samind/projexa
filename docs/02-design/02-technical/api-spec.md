# API Spec (Conceptual) — Projexa

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-27
- **สถานะ:** Draft — รอ SA/Dev Lead ยืนยันเป็นทางการ (ดูสถานะราย resource
  ด้านล่าง)
- **ระดับเอกสาร:** Conceptual — resource path/verb เป็นสัญกรณ์สื่อสารเท่านั้น
  **ยังไม่ผูกมัดกับ API framework, library, หรือ protocol เฉพาะเจาะจง**
- **อ้างอิงต้นทาง:** [Projexa-System-Design-R1.md §2](../../../Projexa-System-Design-R1.md)
  (บทบาท/สิทธิ์), §7 (AI component), §8 (การสร้างเอกสาร),
  [[database-schema|database-schema]] (ถ้ามี),
  [[../../01-requirements/01-spec/index|01-spec]]

> เอกสารนี้ระบุ resource/operation ที่ระบบต้องมี ในระดับแนวคิด แต่ละ
> resource มีสถานะ `Draft (suggested)` หรือ `Confirmed` แยกกัน ทุก endpoint
> ที่เกี่ยวข้องกับผลลัพธ์ AI (§7.1) ต้องแยกขั้นตอน "เสนอผล"/"ยืนยันบันทึกจริง"
> เสมอ ตามกติกา §7.2 ข้อ 5 — ห้าม merge เป็นขั้นตอนเดียว

## แนวทางร่วม (Global Conventions)

ข้อมูลจริงจาก user (สัมภาษณ์และยืนยันแล้วในเซสชันของ skill `data-api-design`
วันที่ 2026-08-26):

1. **Endpoint style:** Resource-oriented (CRUD ต่อ entity) ผสม Action-
   oriented เฉพาะจุด workflow/gate (เช่น ยืนยันผลสกัด, มอบหมายเป็นชุด,
   export เอกสาร)
2. **AI job pattern:** AI job ทุกตัว (TOR Parser, Design Analyzer, Test
   Generator, Document Writer) เป็น **async** — endpoint เริ่มงานคืน
   `job_id` ทันที + endpoint แยกเช็คสถานะ (`GET /ai-jobs/{job_id}`) — pattern
   เดียวกันทั้ง 4 ตัว
3. **AI propose/confirm pair:** ทุก AI endpoint ต้องมี endpoint คู่แยกกัน
   เสมอ: `POST {resource}/ai-propose` (คืนผลเสนอ label `AI Generated`/
   `suggested` พร้อม `source_clause`/`source_req`/`confidence` ตามที่ระบุใน
   §7.1/§7.2) → `POST {resource}/{id}/confirm` (human ยืนยันทีละรายการก่อน
   บันทึกเป็นทางการ → เปลี่ยนเป็น `Human Confirmed`) — ห้ามรวมเป็น endpoint
   เดียว
4. **Pagination/filter/sort:** มาตรฐานเดียวกันทุก resource แบบ list —
   offset-based (`page`, `pageSize`) + `sort` + `filter[field]`
5. **Error response:** object มาตรฐานเดียวกันทั้งระบบ
   `{ code, message, fieldErrors?: [{field, message}] }`
6. **API versioning:** ยังไม่กำหนดในระดับ conceptual นี้ (ไม่ต้องมี path
   prefix เวอร์ชัน)
7. **Permission model:** ตรวจ Role ระดับโครงการ (ผ่าน `ProjectRoleAssignment`)
   เป็นหลักทุก endpoint + เสริมเช็ค Assignment ระดับ record เฉพาะจุดที่ spec
   ระบุชัด (เช่น การบันทึกความก้าวหน้า/เปลี่ยนสถานะหน้าจอ (SCR-016) ต้องเป็น
   ผู้ถูก assign หรือ role PM/SA เท่านั้น)

## ทรัพยากร (Resources)

> รายการ resource ด้านล่างจัดกลุ่มตามโมดูล M1–M7 และ entity ของ
> [[database-schema|database-schema.md]]

### M1 — จัดการโครงการและ TOR (SCR-001 ถึง SCR-007)

#### Project — `/projects`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-001, SCR-002, SCR-003
- **Entity ที่เกี่ยวข้อง:** `Project`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /projects` | รายการโครงการ พร้อม filter/sort/pagination มาตรฐาน | ทุก role ที่มี `ProjectRoleAssignment` | query: `page`, `pageSize`, `sort`, `filter[status]` ฯลฯ | list ของ `Project` |
| Get | `GET /projects/{id}` | รายละเอียดโครงการ | เช่นเดียวกับ list | — | `Project` detail |
| Create | `POST /projects` | สร้างโครงการใหม่ | PM, Admin | body: `name`, `customer_name`, `start_date`, `end_date`, `budget` | `Project` ที่สร้าง |
| Update | `PATCH /projects/{id}` | แก้ไขข้อมูลโครงการ | PM | body: field ที่แก้ | `Project` ที่อัปเดต |

#### TorDocument — `/projects/{id}/tor-documents`, `/tor-documents/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-004, SCR-005
- **Entity ที่เกี่ยวข้อง:** `TorDocument`, `TorClause`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Upload/Create | `POST /projects/{id}/tor-documents` | นำเข้า TOR (อัปโหลดไฟล์ หรือกรอกเนื้อหาเอง) | PM, BA | body: `file` หรือ `raw_text` | `TorDocument` (status=`Pending`) |
| Get | `GET /tor-documents/{id}` | ดูรายละเอียด TOR | PM, BA, SA (read) | — | `TorDocument` detail |
| Start extraction (AI) | `POST /tor-documents/{id}/ai-propose` | เริ่มงาน AI TOR Parser (async) | PM, BA | — | คืน `job_id`; เปลี่ยน `extraction_status`=`Extracting` |
| Check job status | `GET /ai-jobs/{job_id}` | เช็คสถานะ/ผลลัพธ์งาน AI (polling) | เจ้าของ job | — | status ของ job + ผลลัพธ์ (draft `TorClause`/`Requirement`) เมื่อ `Done` |

#### Requirement — `/projects/{id}/requirements`, `/requirements/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-006
- **Entity ที่เกี่ยวข้อง:** `Requirement`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /projects/{id}/requirements` | ทะเบียนความต้องการ | ทุก role (read) | filter/sort/pagination มาตรฐาน | list ของ `Requirement` |
| Get | `GET /requirements/{id}` | รายละเอียดความต้องการ | ทุก role (read) | — | `Requirement` detail |
| Manual create | `POST /projects/{id}/requirements` | เพิ่มความต้องการเอง (ไม่ผ่าน AI) | BA, PM | body: `type`, `title`, `description`, `tor_clause_id`? | `Requirement` (`origin_label`=`ManualEntry`) |
| Update (แก้ก่อนยืนยัน) | `PATCH /requirements/{id}` | แก้ไขก่อนยืนยัน | BA, PM | body: field ที่แก้ | `Requirement` ที่อัปเดต |
| Confirm (Gate 1) | `POST /requirements/{id}/confirm` | ยืนยันความต้องการเป็นทางการ | BA, PM | — | `status`→`Confirmed`, `origin_label`→`HumanConfirmed` |
| Delete (soft) | `DELETE /requirements/{id}` | ลบความต้องการ (soft-delete) | BA, PM | — | ตั้ง `is_deleted`=true |

#### Milestone / DeliverableDoc — `/projects/{id}/milestones`, `/milestones/{id}`, `/milestones/{id}/deliverable-docs`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-007
- **Entity ที่เกี่ยวข้อง:** `Milestone`, `DeliverableDoc`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List/Create | `GET /projects/{id}/milestones`, `POST /projects/{id}/milestones` | จัดการงวดงาน | PM | body: `name`, `due_date`, `payment_percentage`? | `Milestone` / list |
| Update | `PATCH /milestones/{id}` | แก้ไขงวดงาน | PM | body: field ที่แก้ | `Milestone` ที่อัปเดต |
| List/Create | `GET /milestones/{id}/deliverable-docs`, `POST /milestones/{id}/deliverable-docs` | เอกสารที่ต้องส่งในงวดนั้น | PM | body: `document_type` | `DeliverableDoc` / list |

#### AuditLogEntry — `/projects/{id}/audit-log`

- **สถานะ:** Confirmed (2026-08-27)
- **อ้างอิงหน้าจอ:** SCR-003 (Audit/History Chip ตาม DESIGN.md §3.2)
- **Entity ที่เกี่ยวข้อง:** `AuditLogEntry`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /projects/{id}/audit-log` | อ่านประวัติการเปลี่ยนแปลงของ entity ต่างๆ ในโครงการนี้ | ทุก role ที่มี `ProjectRoleAssignment` กับโครงการนี้ (read) | query: `entity_type`?, `entity_id`?, `field_name`?, `page`, `pageSize`, `sort` (default `changed_at` desc) | list ของ `AuditLogEntry` |

### M2 — วิเคราะห์และออกแบบ (SCR-008 ถึง SCR-011)

#### Screen (รวมงาน Design Analyzer) — `/projects/{id}/screens`, `/screens/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-008, SCR-009, SCR-010
- **Entity ที่เกี่ยวข้อง:** `Screen`, `ScreenRequirement`, `ScreenCapability`,
  `BusinessRule`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Start analysis (AI) | `POST /projects/{id}/screens/ai-propose` | เริ่มงาน AI Design Analyzer (async) | SA | body: `requirement_ids` ที่ `Confirmed` แล้ว | คืน `job_id` |
| Check job status | `GET /ai-jobs/{job_id}` | เช็คสถานะ/ผลลัพธ์งาน AI | SA | — | draft `Screen`/`ScreenCapability`/`BusinessRule` เมื่อ `Done` |
| List | `GET /projects/{id}/screens` | ทะเบียนหน้าจอ | ทุก role (read) | filter/sort/pagination มาตรฐาน | list ของ `Screen` |
| Get | `GET /screens/{id}` | รายละเอียดหน้าจอ | ทุก role (read) | — | `Screen` detail |
| Manual create/update | `POST /screens`, `PATCH /screens/{id}` | เพิ่ม/แก้ไขหน้าจอเอง | SA | body: field ของ `Screen` | `Screen` ที่สร้าง/อัปเดต |
| Confirm (Gate 2) | `POST /screens/{id}/confirm` | ยืนยันหน้าจอเป็นทางการ | SA | — | `status`→`Confirmed` |
| Link/unlink Requirement | `POST /screens/{id}/requirements/{req_id}`, `DELETE /screens/{id}/requirements/{req_id}` | จัดการ `ScreenRequirement` | SA | — | `ScreenRequirement` ที่สร้าง/ลบ |

#### ScreenCapability / BusinessRule — `/screens/{id}/capabilities`, `/screens/{id}/business-rules`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-008, SCR-010
- **Entity ที่เกี่ยวข้อง:** `ScreenCapability`, `BusinessRule`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List/Create | `GET /screens/{id}/capabilities`, `POST /screens/{id}/capabilities` | ความสามารถของหน้าจอ | SA | body: `capability_type`, `description`? | `ScreenCapability` / list |
| Update/Delete | `PATCH /capabilities/{id}`, `DELETE /capabilities/{id}` | แก้ไข/ลบ (soft) | SA | body: field ที่แก้ | `ScreenCapability` ที่อัปเดต |
| List/Create | `GET /screens/{id}/business-rules`, `POST /screens/{id}/business-rules` | เงื่อนไขการทำงาน | SA | body: `rule_text` | `BusinessRule` / list |
| Update/Delete | `PATCH /business-rules/{id}`, `DELETE /business-rules/{id}` | แก้ไข/ลบ (soft) | SA | body: field ที่แก้ | `BusinessRule` ที่อัปเดต |

#### ScreenFlow — `/projects/{id}/screen-flows`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-011
- **Entity ที่เกี่ยวข้อง:** `ScreenFlow`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /projects/{id}/screen-flows` | ผังการทำงานของโครงการ | ทุก role (read) | — | list ของ `ScreenFlow` |
| Create | `POST /projects/{id}/screen-flows` | เพิ่มเส้นเชื่อมหน้าจอ | SA | body: `from_screen_id`, `to_screen_id`, `description`? | `ScreenFlow` ที่สร้าง |
| Update | `PATCH /screen-flows/{id}` | แก้ไขเส้นเชื่อม | SA | body: field ที่แก้ | `ScreenFlow` ที่อัปเดต |

### M3 — วางแผนและมอบหมายงาน (SCR-012 ถึง SCR-014)

#### Assignment — `/screens/{id}/assignments`, `/assignments/batch`, `/assignments/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-012, SCR-013, SCR-014
- **Entity ที่เกี่ยวข้อง:** `Assignment`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /screens/{id}/assignments` | ผู้รับผิดชอบของหน้าจอ | ทุก role (read) | — | list ของ `Assignment` |
| Batch assign | `POST /assignments/batch` | มอบหมายผู้รับผิดชอบเป็นชุด (action-oriented) | PM | body: `[{screen_id, user_id, role}]` | list ของ `Assignment` ที่สร้าง |
| Unassign | `DELETE /assignments/{id}` | ถอนมอบหมาย (soft-delete) | PM | — | ตั้ง `is_deleted`=true |

### M4 — ติดตามการดำเนินงาน (SCR-015 ถึง SCR-018)

#### ScreenStatus / StatusHistory — `/screens/{id}/status`, `/screens/{id}/status-changes`, `/screens/{id}/status-history`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-015, SCR-016, SCR-017
- **Entity ที่เกี่ยวข้อง:** `ScreenStatus`, `StatusHistory`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Get current status | `GET /screens/{id}/status` | สถานะปัจจุบันของหน้าจอ | ทุก role (read) | — | `ScreenStatus` detail |
| Change status | `POST /screens/{id}/status-changes` | เปลี่ยนสถานะ/บันทึกความก้าวหน้า | ผู้ถูก assign หรือ role PM/SA | body: `new_status`, `new_assignee_id`?, `reason` (required เมื่อเลื่อนวัน/ถอยสถานะ), `attachment`?, `note`?, `progress_percentage` | เขียน `ScreenStatus`+`StatusHistory` ในธุรกรรมเดียว (synchronous); คืน `ScreenStatus` ที่อัปเดต + `StatusHistory` ที่สร้าง |
| List history | `GET /screens/{id}/status-history` | ประวัติการเปลี่ยนแปลงทั้งหมด | ทุก role (read) | filter/sort/pagination มาตรฐาน | list ของ `StatusHistory` |

#### Issue — `/projects/{id}/issues`, `/issues/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-018
- **Entity ที่เกี่ยวข้อง:** `Issue`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /projects/{id}/issues` | ทะเบียนปัญหา | Tester, Dev, PM (read) | filter/sort/pagination มาตรฐาน | list ของ `Issue` |
| Create | `POST /projects/{id}/issues` | บันทึกปัญหาใหม่ | Tester, Dev, PM | body: `title`, `description`, `impact`, `screen_id`? | `Issue` ที่สร้าง |
| Update | `PATCH /issues/{id}` | แก้ไข/ปิดปัญหา | Tester, Dev, PM | body: field ที่แก้ (`resolution`, `status`, `assigned_to`) | `Issue` ที่อัปเดต |

### M5 — จัดการการทดสอบ (SCR-019 ถึง SCR-020)

#### TestCase (รวมงาน AI Test Generator) — `/screens/{id}/test-cases`, `/test-cases/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-019
- **Entity ที่เกี่ยวข้อง:** `TestCase`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Generate (AI) | `POST /screens/{id}/test-cases/ai-propose` | เริ่มงาน AI Test Generator (async) — input `Screen`+`BusinessRule` | Tester | — | คืน `job_id` |
| Check job status | `GET /ai-jobs/{job_id}` | เช็คสถานะ/ผลลัพธ์งาน AI | Tester | — | draft `TestCase` เมื่อ `Done` |
| Manual create/update | `POST /test-cases`, `PATCH /test-cases/{id}` | เพิ่ม/แก้ไข test case เอง | Tester | body: `condition`, `steps`, `expected_result` | `TestCase` ที่สร้าง/อัปเดต |
| Confirm | `POST /test-cases/{id}/confirm` | ยืนยัน test case เป็นทางการ | Tester | — | `origin_label`→`HumanConfirmed` |

#### TestResult — `/test-cases/{id}/results`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-020
- **Entity ที่เกี่ยวข้อง:** `TestResult`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /test-cases/{id}/results` | ผลการทดสอบทุกรอบ | Tester (read) | — | list ของ `TestResult` |
| Create | `POST /test-cases/{id}/results` | บันทึกผลการทดสอบรอบใหม่ | Tester | body: `round_no`, `result`, `issue_id`? | `TestResult` ที่สร้าง |

### M6 — จัดการเอกสาร (SCR-021 ถึง SCR-024)

#### Attachment — `/attachments`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-021
- **Entity ที่เกี่ยวข้อง:** `Attachment`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Upload | `POST /attachments` | แนบไฟล์ (polymorphic) | ตามสิทธิ์ของ entity ที่ผูก | body: `entity_type`, `entity_id`, `file` | `Attachment` ที่สร้าง |
| List | `GET /attachments?entity_type=&entity_id=` | รายการไฟล์แนบตาม entity | ตามสิทธิ์ของ entity ที่ผูก | query: `entity_type`, `entity_id` | list ของ `Attachment` |

#### DocTemplate — `/doc-templates`, `/doc-templates/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-022
- **Entity ที่เกี่ยวข้อง:** `DocTemplate`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List/Upload | `GET /doc-templates`, `POST /doc-templates` | จัดการแม่แบบเอกสาร | Admin | body: `name`, `document_type`, `file`, `placeholder_mapping` | `DocTemplate` / list |
| Update | `PATCH /doc-templates/{id}` | แก้ไข placeholder mapping | Admin | body: field ที่แก้ | `DocTemplate` ที่อัปเดต |
| Test render | `POST /doc-templates/{id}/test-render` | ทดสอบ render template (action-oriented) | Admin | body: sample data (ถ้ามี) | ผลลัพธ์การ render ตัวอย่าง |

#### GeneratedDocument (รวมงาน AI Document Writer + export) — `/milestones/{id}/generated-documents`, `/generated-documents/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-023, SCR-024
- **Entity ที่เกี่ยวข้อง:** `GeneratedDocument`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| Start narrative draft (AI) | `POST /milestones/{id}/generated-documents/ai-propose` | เริ่มงาน AI Document Writer (async) — AI ร่างเฉพาะเนื้อความบรรยาย | PM, SA | body: `document_type` | คืน `job_id` |
| Check job status | `GET /ai-jobs/{job_id}` | เช็คสถานะ/ผลลัพธ์งาน AI | PM, SA | — | draft `GeneratedDocument` (`status`=`Draft`) รวมข้อมูลจริงจาก DB + เนื้อความ AI + `ai_narrative_confidence` เมื่อ `Done` |
| Preview/Edit draft | `PATCH /generated-documents/{id}` | แก้ไข preview ก่อน export | PM, SA | body: field ที่แก้ใน `content_snapshot` | `GeneratedDocument` ที่อัปเดต (แก้ไขทับได้ตราบใดที่ `status`=`Draft`) |
| Export (confirm) | `POST /generated-documents/{id}/export` | ยืนยันสร้างไฟล์จริง (action-oriented, เทียบเท่า confirm) | PM, SA | — | snapshot เป็น immutable, `version_no`++, `status`→`Exported`, สร้างไฟล์ `.docx` |
| List versions | `GET /milestones/{id}/generated-documents` | ประวัติทุกเวอร์ชันเอกสาร | ทุก role (read) | filter/sort/pagination มาตรฐาน | list ของ `GeneratedDocument` |

### M7 — ผู้ดูแลระบบ (SCR-025 ถึง SCR-026)

#### User / ProjectRoleAssignment — `/users`, `/users/{id}`, `/projects/{id}/role-assignments`, `/role-assignments/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-025
- **Entity ที่เกี่ยวข้อง:** `User`, `ProjectRoleAssignment`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List/Create | `GET /users`, `POST /users` | จัดการผู้ใช้งาน | Admin | body: `name`, `email`, `position`? | `User` / list |
| Update/Delete | `PATCH /users/{id}`, `DELETE /users/{id}` | แก้ไข/ปิดใช้งาน (soft-delete) | Admin | body: field ที่แก้ | `User` ที่อัปเดต |
| Assign role | `POST /projects/{id}/role-assignments` | กำหนด Role ให้ user ระดับโครงการ | Admin, PM (เฉพาะโครงการที่ตนมี role PM — ตามมติ SCR-003 BR-003-4) | body: `user_id`, `role` | `ProjectRoleAssignment` ที่สร้าง |
| Remove role | `DELETE /role-assignments/{id}` | ถอน Role (soft-delete) | Admin, PM (เฉพาะโครงการที่ตนมี role PM — ตามมติ SCR-003 BR-003-4) | — | ตั้ง `is_deleted`=true |

#### MasterDataItem — `/master-data`, `/master-data/{id}`

- **สถานะ:** Draft (suggested)
- **อ้างอิงหน้าจอ:** SCR-026
- **Entity ที่เกี่ยวข้อง:** `MasterDataItem`

| Operation | Method + Path (conceptual) | คำอธิบาย | สิทธิ์ (Role) | Request (conceptual) | Response (conceptual) |
|---|---|---|---|---|---|
| List | `GET /master-data?category=` | ข้อมูลตั้งต้นตาม category | Admin (read/write), อื่นๆ (read เพื่อใช้เป็น dropdown) | query: `category` | list ของ `MasterDataItem` |
| Create | `POST /master-data` | เพิ่มข้อมูลตั้งต้น | Admin | body: `category`, `code`, `label` | `MasterDataItem` ที่สร้าง |
| Update | `PATCH /master-data/{id}` | แก้ไข/ปิดใช้งาน | Admin | body: field ที่แก้ (`is_active`, `label`, ...) | `MasterDataItem` ที่อัปเดต |

## ประวัติการตัดสินใจ

- 2026-08-26: สร้างเอกสารครั้งแรก — จัดกลุ่ม resource ตามโมดูล M1–M7 (26
  หน้าจอ) และ entity ทั้ง 24 ตัวจาก [[database-schema|database-schema.md]]
  ทุก resource สถานะ `Draft (suggested)` ตามมติของ user บันทึก Global
  Convention 7 ข้อที่ยืนยันแล้ว แต่ตาราง resource/operation รายละเอียดยังไม่
  ครบเนื่องจากยังไม่ได้รับเนื้อหาฉบับเต็มจากผู้เรียก
- 2026-08-26 (รอบ 2): ผู้เรียกส่งเนื้อหาฉบับเต็มที่ user ยืนยันแล้วมาให้ —
  เติมตาราง resource/operation ครบทุก resource ของทั้ง 7 โมดูล (Method+Path
  เชิงแนวคิด, สิทธิ์ตาม Role, request/response เชิงแนวคิด) แทนที่ `TODO`
  ทั้งหมดเรียบร้อยแล้ว ทุก resource ยังคงสถานะ `Draft (suggested)` ตามเดิม
  (ยังไม่มี resource ใดเป็น `Confirmed`) คู่ `ai-propose`/`confirm` และ
  endpoint async (`ai-jobs/{job_id}`) ครบทุกจุดที่เกี่ยวข้องกับ AI Component
  (TOR Parser, Design Analyzer, Test Generator, Document Writer) ตามกติกา
  §7.2 ข้อ 5 และแยก endpoint "AI ร่างเนื้อความบรรยาย" กับ "export/render
  จริง" ของ `GeneratedDocument` ตาม §8 เรียบร้อย
- 2026-08-27: sync มติจาก [[detailed-design/scr-003-ข้อมูลโครงการ|SCR-003
  detailed design]] (Confirmed) — เพิ่ม resource ใหม่ `AuditLogEntry`
  (สถานะ `Confirmed`) พร้อม endpoint `GET /projects/{id}/audit-log`; แก้ไข
  สิทธิ์ของ resource `User / ProjectRoleAssignment` ที่มีอยู่แล้วให้ PM
  (เฉพาะโครงการที่ตนมี role PM ตามมติ SCR-003 BR-003-4) สามารถ Assign/Remove
  role ได้เพิ่มจากเดิมที่จำกัดเฉพาะ Admin — resource/endpoint อื่นทั้งหมดไม่
  ถูกแตะต้อง
