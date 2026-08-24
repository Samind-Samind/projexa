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

## Agent Skill / Sub-agent ที่มีในโปรเจกต์

- [.claude/skills/requirement/SKILL.md](.claude/skills/requirement/SKILL.md) เก็บ requirement ดิบจาก user แบบ interactive (ถามด้วย `AskUserQuestion` เมื่อไม่ชัดเจน, ให้ user ยืนยันก่อนเขียนไฟล์เสมอ) แล้วมอบหมายให้ sub-agent [.claude/agents/requirement-writer.md](.claude/agents/requirement-writer.md) (one-shot, `Read/Write/Edit/Glob/Grep`) เขียน/แก้เอกสาร spec ใหม่ใน `01-spec/`, อัปเดต `backlog.md`, และบันทึก `05-log/` — ใช้ skill นี้เมื่อจะเพิ่ม/แก้ requirement ใหม่ในโปรเจกต์
- [.claude/skills/gen-feature-journey/SKILL.md](.claude/skills/gen-feature-journey/SKILL.md) เรียกใช้ sub-agent [.claude/agents/requirements-synthesizer.md](.claude/agents/requirements-synthesizer.md) (read-only) เพื่ออ่าน `Projexa-System-Design-R1.md` + spec 26 หน้าจอ + `backlog.md` แล้ว generate/อัปเดตไฟล์ `docs/01-requirements/feature-list.md` (มีการจัดระดับ MoSCoW) และ `docs/02-design/01-prototypes/user-journey.md` (มี mermaid flowchart)
- ไฟล์ผลลัพธ์ทั้งสองนี้เป็น**มุมมองสรุปที่ regenerate ได้เสมอ** ไม่ใช่ต้นทางของความจริง — ถ้าจะแก้ไข ให้แก้ที่ไฟล์ spec ใน `01-spec/` หรือ `backlog.md` แล้วรัน skill ใหม่ แทนการแก้ไฟล์ผลลัพธ์ตรงๆ และเมื่อ regenerate ให้เขียนทับได้เลย ไม่ต้องย้ายของเก่าไป `00-archived/` (ต่างจากเอกสารต้นทางอื่นที่ห้ามลบ/ทับตรงๆ) เพราะสร้างซ้ำจากต้นทางเดิมได้เสมอ ใช้ git history เป็นชั้นเวอร์ชันแทน
- รายการ MoSCoW ที่ไม่ใช่ `Must` จะติดป้าย `(suggested)` เสมอ (เป็นการประเมินของ AI ไม่ได้ดึงจากข้อเท็จจริงตรงๆ) และทั้งสองไฟล์มีสถานะ Draft ที่ต้องรอ BA/PM/SA ยืนยันก่อนใช้งานจริง ตามหลัก Human-in-the-loop
