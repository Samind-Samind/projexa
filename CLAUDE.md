# CLAUDE.md

ไฟล์นี้ให้คำแนะนำแก่ Claude Code (claude.ai/code) เมื่อทำงานกับโค้ดใน repository นี้

## สถานะของ Repository

ตอนนี้ repo นี้มีเฉพาะ **เอกสารวางแผนและออกแบบระบบเท่านั้น** — ยังไม่มีซอร์สโค้ด, package manifest, build system, linter หรือ test suite ใดๆ อย่าค้นหาหรือสมมติว่ามี `package.json`, ไฟล์ตั้งค่า CI หรือโฟลเดอร์ src อยู่ เพราะยังไม่มี เมื่อเริ่มลงมือพัฒนาโค้ดจริง ควรอัปเดตไฟล์นี้ให้มีคำสั่ง build/lint/test จริง และหมายเหตุเกี่ยวกับสถาปัตยกรรมของโค้ด

## โปรเจกต์นี้คืออะไร

**Projexa** — ระบบบริหารโครงการและเอกสารที่ขับเคลื่อนด้วย TOR (Terms of Reference) แนวคิดหลักซึ่งอธิบายไว้ใน [Projexa-System-Design-R1.md](Projexa-System-Design-R1.md) คือการเปลี่ยนแกนการทำงานของทีมจาก "เอกสารเป็นศูนย์กลาง" เป็น "ข้อมูลเป็นศูนย์กลาง": ข้อมูลถูกกรอกเพียงครั้งเดียว และเอกสารส่งมอบทุกฉบับ (REQ, SDD, TSC, User Manual) คือ "มุมมอง" ที่ถูก generate ออกมาจากชุดข้อมูลเดียวกัน โดยเริ่มต้นจากการอัปโหลดไฟล์ TOR

เอกสารวางแผนทั้งหมดเขียนเป็น **ภาษาไทย** ให้ตรงกับกลุ่มผู้ใช้เป้าหมายของโปรเจกต์ ให้เขียนเอกสารใหม่ใน repo นี้เป็นภาษาไทยต่อไป เว้นแต่จะมีการแจ้งเป็นอย่างอื่น

### หลักการออกแบบที่ยึดตลอดทั้งระบบ
- **Single Source of Truth** — ข้อมูลถูกบันทึกที่เดียว เอกสารดึงไปใช้ ไม่ต้องพิมพ์ซ้ำ
- **Full Traceability** — ทุกหน้าจอ / test case / หัวข้อในเอกสาร ต้องสาวกลับไปยังข้อใน TOR ได้ (`TorClause → Requirement → Screen → TestCase → TestResult`)
- **Human-in-the-loop** — AI เป็นผู้เสนอ คนเป็นผู้ยืนยัน ไม่มีข้อมูลใดเข้าระบบโดยไม่ผ่านการยืนยัน
- **Everything is logged** — ทุกการเปลี่ยนสถานะ/ผู้รับผิดชอบ ต้องบันทึกว่าใคร เมื่อไหร่ ทำไม
- **Template compliance** — รูปแบบเอกสารถูกควบคุมด้วย Template `.dotx` ขององค์กร ห้ามให้ AI จัดรูปแบบเอง

> **ขอบเขตของหลักการ 5 ข้อนี้:** เป็นข้อกำหนดสำหรับ**พฤติกรรมของตัวระบบ Projexa เอง** เมื่อพัฒนาเสร็จแล้ว (เช่น AI Orchestration layer ของ Projexa ต้องคืนค่าเป็น JSON รอผู้ใช้ยืนยันก่อนบันทึกจริง) — ใช้เป็นข้อมูลอ้างอิงตอนออกแบบ UI/behavior ของตัวแอป (เช่นใน `DESIGN.md` §4.1) **ไม่ใช่**กติกาที่ควบคุมว่า Claude ต้องทำงานสร้างเอกสาร/prototype ใน repo นี้อย่างไร ถ้า skill ไหนต้องอธิบายเหตุผลของสถานะ Draft หรือการขอยืนยันจาก user ก่อนเขียนไฟล์ ให้อธิบายเป็นธรรมเนียมการทำงานเอกสารทั่วไป ไม่ต้องอ้างอิงหลักการชุดนี้

### โครงร่างสถาปัตยกรรม (จากเอกสารออกแบบระบบ)
```
Presentation Layer   — Web app (responsive)
Application Layer    — Project / Analysis / Tracking / Document-Generator services
AI Orchestration     — TOR Parser / Design Analyzer / Doc Writer / Test Gen (คืนค่าเป็น structured JSON เท่านั้น)
Data Layer           — Database / File Storage / Audit Log
```
กติกาการออกแบบสำคัญ: AI Layer ต้องแยกออกจาก Document Generator อย่างชัดเจน AI ไม่เคยสร้างไฟล์ `.docx` เอง — AI คืนค่าเป็น JSON แล้วให้ Document Generator ซึ่งเป็นคนละส่วนนำ JSON นั้นไปเติมลง Template `.dotx`

Stack ที่เสนอไว้ (ยังไม่ได้ลงมือทำจริง): Frontend เป็น React/Next.js + TypeScript, Backend เป็น NestJS หรือ FastAPI, Database เป็น PostgreSQL (ใช้ JSONB เก็บผลสกัดจาก AI), File Storage แบบ S3-compatible, ใช้ `python-docx`/`docxtpl` สำหรับสร้างไฟล์ `.docx` (แยกเป็น Python service แม้ backend หลักจะเป็น Node), ใช้ Claude API เป็น AI layer, และ Auth แบบ JWT + RBAC

ดูรายละเอียดเต็มได้ที่ [Projexa-System-Design-R1.md](Projexa-System-Design-R1.md): โครงสร้างข้อมูล/entities (§4), รายการ 26 หน้าจอแบ่งตามโมดูล (§5), กฎวงจรสถานะของหน้าจอ (§6), ข้อกำหนดและกติกาของ AI component (§7), ขั้นตอนการสร้างเอกสาร (§8), workflow แบบ end-to-end (§9), และขอบเขต MVP 13 หน้าจอสำหรับโครงการ RAISE (§10)

## โครงสร้างโฟลเดอร์ Docs

`docs/` เป็น Obsidian vault (ดู `.gitignore` — มีการ exclude `.obsidian/` ไว้) จัดเรียงตามลำดับ workflow เป็นเส้นตรง โดยทุกไฟล์ `index.md` จะลิงก์ไขว้ไปยังขั้นตอนถัดไป/ก่อนหน้าด้วยรูปแบบ `[[wikilink]]`:

```
01-requirements/  → 01-spec (ต้นทางของความต้องการ) → 02-plan (roadmap/milestone) → 03-task (งานย่อยที่ลงมือทำได้จริง)
02-design/        → 01-prototypes (ต้นแบบ UI/UX) → 02-technical (สถาปัตยกรรม, DB schema, การออกแบบ API)
03-testing/       → 01-test-plan (test case) → 02-test-result (ผล pass/fail, บั๊ก)
04-retrospectives/ — บทเรียนที่ได้หลังจบแต่ละ phase/sprint/milestone
05-log/            — changelog/decision log แบบเรียงตามลำดับเวลา บันทึกคู่ขนานไปตลอดทุกขั้นตอน
00-archived/       — เอกสารที่เลิกใช้แล้วหรือถูกยกเลิก ให้ย้ายมาเก็บที่นี่แทนการลบ
```

ภาพรวมของ workflow คือ `requirements → design → testing → retrospectives` โดย `log` จะถูกบันทึกคู่ขนานไปตลอดทั้งโปรเจกต์ และ `archived` เป็นปลายทางของทุกอย่างที่ถูกแทนที่หรือยกเลิก — ห้ามลบเอกสารของโปรเจกต์ทิ้งตรงๆ ให้ย้ายไปไว้ที่ `00-archived/` แทน

หมายเหตุ: โครงสร้าง/รูปแบบโฟลเดอร์ docs นี้คัดลอกมาจาก docs template ทั่วไป (เวอร์ชันก่อนหน้ามีชื่อโปรเจกต์ placeholder ปนอยู่) ให้ยึดโครงสร้าง/รูปแบบนี้เป็นส่วนที่นำมาใช้ซ้ำได้ โดยไม่ผูกกับชื่อโปรเจกต์ใดโปรเจกต์หนึ่ง

ไฟล์แนบ/brand asset (โลโก้ ฯลฯ) ให้เก็บไว้ที่ `docs/02-design/01-prototypes/assets/` เท่านั้น (ที่เดียว) ห้ามวางไฟล์แนบไว้ที่ root ของ repo หรือสร้างสำเนาซ้ำไว้หลายที่

## Agent Skill / Sub-agent ที่มีในโปรเจกต์

- [.claude/skills/requirement/SKILL.md](.claude/skills/requirement/SKILL.md) เก็บ requirement ดิบจาก user แบบ interactive (ถามด้วย `AskUserQuestion` เมื่อไม่ชัดเจน, ให้ user ยืนยันก่อนเขียนไฟล์เสมอ) แล้วมอบหมายให้ sub-agent [.claude/agents/requirement-writer.md](.claude/agents/requirement-writer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียน/แก้เอกสาร spec ใหม่ใน `01-spec/`, อัปเดต `backlog.md`, และบันทึก `05-log/` — ใช้ skill นี้เมื่อจะเพิ่ม/แก้ requirement ใหม่ในโปรเจกต์
- [.claude/skills/gen-feature-journey/SKILL.md](.claude/skills/gen-feature-journey/SKILL.md) เรียกใช้ sub-agent [.claude/agents/requirements-synthesizer.md](.claude/agents/requirements-synthesizer.md) (read-only) เพื่ออ่าน `Projexa-System-Design-R1.md` + spec 26 หน้าจอ + `backlog.md` แล้ว generate/อัปเดตไฟล์ `docs/01-requirements/feature-list.md` (มีการจัดระดับ MoSCoW) และ `docs/02-design/01-prototypes/user-journey.md` (มี mermaid flowchart)
- ไฟล์ผลลัพธ์ทั้งสองนี้เป็น**มุมมองสรุปที่ regenerate ได้เสมอ** ไม่ใช่ต้นทางของความจริง — ถ้าจะแก้ไข ให้แก้ที่ไฟล์ spec ใน `01-spec/` หรือ `backlog.md` แล้วรัน skill ใหม่ แทนการแก้ไฟล์ผลลัพธ์ตรงๆ และเมื่อ regenerate ให้เขียนทับได้เลย ไม่ต้องย้ายของเก่าไป `00-archived/` (ต่างจากเอกสารต้นทางอื่นที่ห้ามลบ/ทับตรงๆ) เพราะสร้างซ้ำจากต้นทางเดิมได้เสมอ ใช้ git history เป็นชั้นเวอร์ชันแทน
- รายการ MoSCoW ที่ไม่ใช่ `Must` จะติดป้าย `(suggested)` เสมอ (เป็นการประเมินของ AI ไม่ได้ดึงจากข้อเท็จจริงตรงๆ) และทั้งสองไฟล์มีสถานะ Draft ที่ต้องรอ BA/PM/SA ยืนยันก่อนใช้งานจริง
- [.claude/skills/build-prototype/SKILL.md](.claude/skills/build-prototype/SKILL.md) สร้าง/อัปเดต **Prototype UI/UX แบบ Interactive HTML/CSS/JS ต่อหน้าจอ** (ใช้ vanilla JS ฝั่ง client จำลอง interaction จริง เช่น เพิ่ม/ลบแถว, เปิด/ปิด popover ประวัติ, สลับ tab, toast แจ้งสถานะ — ไม่พึ่ง framework/บริการภายนอก) ใน `docs/02-design/01-prototypes/vN/` โดยสังเคราะห์จาก spec (`01-spec/`), `backlog.md`, `feature-list.md`, และ `user-journey.md` ทำงานแบบ interactive ใน main loop เสมอ (ถามสโคปที่จะสร้างด้วย `AskUserQuestion` ถ้าไม่ระบุมา, ถามทุกครั้งที่มีเวอร์ชันอยู่แล้วว่าจะสร้างเวอร์ชันใหม่หรือแก้เวอร์ชันล่าสุดพร้อมคำแนะนำ, ถามให้สร้าง `DESIGN.md` ถ้ายังไม่มี) แล้วมอบหมายให้ sub-agent [.claude/agents/prototype-builder.md](.claude/agents/prototype-builder.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียนไฟล์จริง — ใช้ skill นี้เมื่อ user ขอสร้าง/อัปเดต prototype, mockup, หรือ wireframe ของหน้าจอระบบ
- แต่ละโฟลเดอร์เวอร์ชัน `vN/` เป็น **self-contained snapshot** (มี `style.css` ที่ก๊อปปี้ค่า token จาก `DESIGN.md` ณ ขณะสร้าง และ `script.js` ที่รวม interaction utilities มาตรฐาน ทั้งสองไฟล์ไม่ได้ share ข้ามเวอร์ชัน) เพื่อไม่ให้เวอร์ชันเก่าที่เคยถูกรีวิว/ยืนยันไปแล้วเปลี่ยนหน้าตาหรือพฤติกรรมย้อนหลังถ้า `DESIGN.md`/แนวทาง interaction ถูกแก้ทีหลัง — ห้ามลบ/เขียนทับโฟลเดอร์เวอร์ชันเก่า ถ้าล้าสมัยจริงให้ย้ายไป `00-archived/` แทน
- [.claude/skills/test-design/SKILL.md](.claude/skills/test-design/SKILL.md) สร้าง/อัปเดตเอกสารการทดสอบ 3 ประเภทใน `docs/03-testing/01-test-plan/`: `acceptance-criteria.md` (Given-When-Then ต่อ backlog item), `test-plan.md` (กลยุทธ์ทดสอบ 1 ไฟล์ต่อโปรเจกต์), และ `test-cases/{feature-slug}.md` (test case แบบ step-by-step ต่อฟีเจอร์) โดยสังเคราะห์จาก `backlog.md`, `feature-list.md`, `user-journey.md`, spec รายหน้าจอ, และ prototype ถ้ามี ทำงานแบบ interactive ใน main loop เสมอ (ถามว่าจะสร้างเอกสารประเภทใดและสโคปใดด้วย `AskUserQuestion` ถ้าไม่ระบุมา, บังคับให้มี Acceptance Criteria ก่อนสร้าง Test Case ของ SCR เดียวกันเสมอ) แล้วมอบหมายให้ sub-agent [.claude/agents/test-designer.md](.claude/agents/test-designer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียนไฟล์จริง — ใช้ skill นี้เมื่อ user ขอสร้าง/อัปเดต test case, test plan, หรือ acceptance criteria
- `TC-xxx` เป็นเลขรันนิ่ง**ทั้งโปรเจกต์**ไม่ผูกกับ SCR (ตามตัวอย่าง traceability ใน §4.2) ส่วน `acceptance-criteria.md`/`test-plan.md`/`test-cases/*.md` ไม่ใช่มุมมองสรุปแบบ feature-list/user-journey — ห้ามเขียนทับหรือลบเนื้อหาเดิมโดยไม่ยืนยันกับ user ก่อน ถ้าล้าสมัยจริงให้ย้ายไป `00-archived/` แทน
- [.claude/skills/architecture/SKILL.md](.claude/skills/architecture/SKILL.md) ช่วยออกแบบและจัดทำเอกสาร High-Level Architecture แบบ **conceptual (ยังไม่ผูกกับเทคโนโลยี/framework ใดๆ)** ที่ `docs/02-design/02-technical/architecture.md` ครอบคลุม system boundary/context diagram, component/layer breakdown, data flow ตาม `user-journey.md`, ขอบเขต AI Orchestration, และ cross-cutting concerns (audit/traceability/security เชิงแนวคิด) โดยสัมภาษณ์ user แบบเข้มข้นด้วย `AskUserQuestion` เมื่อไม่ชัดเจน (ต้องมีตัวเลือกอย่างน้อย 3 แนวทางพร้อมข้อดี-ข้อเสียเสมอ, ห้ามเดาแทนถ้าเอกสารโปรเจกต์ไม่มีข้อมูล) แสดงผลให้ user รีวิวก่อนเขียนไฟล์เสมอ แล้วมอบหมายให้ sub-agent [.claude/agents/architecture-writer.md](.claude/agents/architecture-writer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียนไฟล์จริง — ใช้ skill นี้เมื่อ user ขอสร้าง/ปรับปรุงเอกสาร high-level architecture, conceptual architecture, สถาปัตยกรรมระบบระดับสูง หรือ data flow ของระบบ (ก่อนตัดสินใจเทคโนโลยีจริงด้วย skill `tech-stack`)
- แต่ละหัวข้อ (section) ใน `architecture.md` มีสถานะ `Draft (suggested)` หรือ `Confirmed` แยกกัน ห้ามเขียนทับ section ที่ `Confirmed` แล้วโดยไม่ถาม user ก่อน ถ้าผลออกแบบต่างจากโครงร่างเดิมใน §3 ของ `Projexa-System-Design-R1.md` ต้องถาม user ว่าจะ sync §3 ให้ตรงหรือไม่ (ห้าม sub-agent แก้ §3 เองโดยไม่มีมติชัดเจนจาก user) เอกสารนี้ต้องไม่มีชื่อเทคโนโลยี/framework/ผลิตภัณฑ์เฉพาะเจาะจงปนอยู่เด็ดขาด
- [.claude/skills/tech-stack/SKILL.md](.claude/skills/tech-stack/SKILL.md) ช่วยเลือกและจัดทำเอกสารตัดสินใจเทคโนโลยี (Frontend/Backend/Database/File Storage/Auth/AI Integration/Hosting) ที่ `docs/02-design/02-technical/tech-stack.md` โดยสัมภาษณ์ user แบบเข้มข้นด้วย `AskUserQuestion` (ทุกคำถามที่ไม่ชัดเจนต้องมีตัวเลือกอย่างน้อย 3 แนวทางพร้อมข้อดี-ข้อเสีย, ห้ามเดาแทนถ้าเอกสารโปรเจกต์ไม่มีข้อมูล) แล้ววิเคราะห์เปรียบเทียบด้วย Weighted Scoring Model อย่างน้อย 5 ตัวเลือกต่อ layer แสดงผลให้ user รีวิวก่อนเขียนไฟล์เสมอ แล้วมอบหมายให้ sub-agent [.claude/agents/tech-stack-writer.md](.claude/agents/tech-stack-writer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียนไฟล์จริง — ใช้ skill นี้เมื่อ user ขอเลือก/เปรียบเทียบ/แนะนำ tech stack หรือขอสร้าง/อัปเดตเอกสาร technical design ด้าน technology choice
- แต่ละหัวข้อ (layer) ใน `tech-stack.md` มีสถานะ `Draft (suggested)` หรือ `Confirmed` แยกกัน ห้ามเขียนทับ section ที่ `Confirmed` แล้วโดยไม่ถาม user ก่อน ถ้าผลวิเคราะห์ต่างจากข้อเสนอเดิมใน §11 ของ `Projexa-System-Design-R1.md` ต้องถาม user ว่าจะ sync ตาราง §11 ให้ตรงหรือไม่ (ห้าม sub-agent แก้ §11 เองโดยไม่มีมติชัดเจนจาก user)
- [.claude/skills/data-api-design/SKILL.md](.claude/skills/data-api-design/SKILL.md) ช่วยออกแบบและจัดทำเอกสาร **Database Schema** และ **API Spec** ระดับ Conceptual/Logical เท่านั้น (ชนิดข้อมูล/endpoint เป็นคำ/สัญกรณ์เชิงแนวคิด ไม่ผูกกับ DBMS/ORM/API framework ใดๆ แม้ `tech-stack.md` จะเลือกเทคโนโลยีไว้แล้วก็ตาม) ที่ `docs/02-design/02-technical/database-schema.md` (ต้องมี ER Diagram แบบ mermaid เป็นอย่างน้อย) และ `docs/02-design/02-technical/api-spec.md` โดยสังเคราะห์จาก `Projexa-System-Design-R1.md` (§2 บทบาท, §4 Data Model, §5 หน้าจอ, §7 กติกา AI component, §8 การสร้างเอกสาร), spec รายหน้าจอ, และ `backlog.md` สัมภาษณ์ user แบบเข้มข้นด้วย `AskUserQuestion` ทุกครั้งที่การตัดสินใจเชิงแนวคิด (เช่น key strategy, ขอบเขต audit log, รูปแบบเก็บผลลัพธ์ AI, sync/async ของ AI job) ไม่มีข้อมูลชัดเจนในเอกสาร (ตัวเลือกอย่างน้อย 3 แนวทางพร้อมข้อดี-ข้อเสียเสมอ, ห้ามเดาแทน) แสดงผลให้ user รีวิวก่อนเขียนไฟล์เสมอ แล้วมอบหมายให้ sub-agent [.claude/agents/data-api-writer.md](.claude/agents/data-api-writer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียนไฟล์จริง — ใช้ skill นี้เมื่อ user ขอสร้าง/ปรับปรุงเอกสาร database schema, database spec, data model เชิงเทคนิค, หรือ API spec/API design ของระบบ
- แต่ละตาราง/resource ใน `database-schema.md`/`api-spec.md` มีสถานะ `Draft (suggested)` หรือ `Confirmed` แยกกัน ห้ามเขียนทับ section ที่ `Confirmed` แล้วโดยไม่ถาม user ก่อน ทุก endpoint ที่เกี่ยวกับผลลัพธ์ AI (§7.1) ต้องแยกขั้นตอน "เสนอผล"/"ยืนยันบันทึกจริง" เสมอตามกติกา §7.2 ข้อ 5 ถ้าผลออกแบบต่างจาก §4.1/§7.1 เดิมของ `Projexa-System-Design-R1.md` ต้องถาม user ว่าจะแก้เอกสารหลักให้ตรงหรือไม่ (ห้าม sub-agent แก้ §4.1/§7.1 เองโดยไม่มีมติชัดเจนจาก user)
