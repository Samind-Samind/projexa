# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repo currently contains **planning and design documentation only** — there is no source code, package manifest, build system, linter, or test suite yet. Do not search for or assume the existence of `package.json`, CI config, or a src tree; none exists. When implementation work begins, this file should be updated with real build/lint/test commands and code architecture notes.

## What this project is

**Projexa** — a TOR-driven (Terms of Reference) project and document management system. Its core idea, described in [Projexa-System-Design-R1.md](Projexa-System-Design-R1.md), is shifting the team's workflow from "document-centered" to "data-centered": data is entered once, and every deliverable document (REQ, SDD, TSC, User Manual) is a generated "view" of that single dataset, starting from an uploaded TOR file.

All planning documentation is written in **Thai**, matching the project's target users. Keep new documentation in this repo in Thai unless told otherwise.

### Design principles carried through the whole system
- **Single Source of Truth** — data is recorded once; documents pull from it, never retype it.
- **Full Traceability** — every screen / test case / document section must trace back to a TOR clause (`TorClause → Requirement → Screen → TestCase → TestResult`).
- **Human-in-the-loop** — AI proposes, humans confirm; nothing enters the system unconfirmed.
- **Everything is logged** — every status/owner change records who, when, why.
- **Template compliance** — document formatting is controlled by the org's `.dotx` templates, never freeformed by AI.

### Architecture sketch (from the system design doc)
```
Presentation Layer   — Web app (responsive)
Application Layer    — Project / Analysis / Tracking / Document-Generator services
AI Orchestration     — TOR Parser / Design Analyzer / Doc Writer / Test Gen (all return structured JSON only)
Data Layer           — Database / File Storage / Audit Log
```
Key design rule: the AI layer is strictly separated from the Document Generator. AI never produces `.docx` files directly — it returns JSON, and a separate Document Generator fills that JSON into `.dotx` templates.

Proposed stack (not yet implemented): React/Next.js + TypeScript frontend, NestJS or FastAPI backend, PostgreSQL (JSONB for AI extraction results), S3-compatible storage, `python-docx`/`docxtpl` for `.docx` generation (kept as a Python service even in a Node backend), Claude API for the AI layer, JWT + RBAC for auth.

See [Projexa-System-Design-R1.md](Projexa-System-Design-R1.md) for full detail: data model/entities (§4), the 26-screen module breakdown (§5), screen status lifecycle rules (§6), AI component contracts and guardrails (§7), the document-generation pipeline (§8), end-to-end workflow (§9), and the reduced 13-screen MVP scope for the RAISE project (§10).

## Docs folder structure

`docs/` is an Obsidian vault (see `.gitignore` — `.obsidian/` is excluded) organized as a linear workflow, with every `index.md` cross-linking to adjacent stages via `[[wikilink]]` syntax:

```
01-requirements/  → 01-spec (source of truth for requirements) → 02-plan (roadmap/milestones) → 03-task (actionable breakdown)
02-design/        → 01-prototypes (UI/UX mockups) → 02-technical (architecture, DB schema, API design)
03-testing/       → 01-test-plan (test cases) → 02-test-result (pass/fail, bugs)
04-retrospectives/ — lessons learned per phase/sprint/milestone
05-log/            — chronological changelog / decision log, written continuously alongside all other stages
00-archived/       — superseded or cancelled docs; move docs here instead of deleting them
```

The overall flow is `requirements → design → testing → retrospectives`, with `log` running in parallel throughout and `archived` as the destination for anything replaced or cancelled — never delete project docs outright, move them to `00-archived/` instead.

Note: this docs folder structure/convention was originally copied from a generic docs template (an earlier version referred to a placeholder project name); treat the structure/convention as the reusable part, independent of any specific project name.
