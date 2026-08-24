
# Projexa Design System

- **วันที่สร้าง:** 2026-08-24
- **สถานะ:** Draft — รอ Design Lead/PM ยืนยันก่อนนำไปใช้ตัดสินใจ implement จริง
- **ขอบเขต:** ใช้ควบคุมหน้าตาและพฤติกรรมของ **Web Application (Presentation Layer)** ของ Projexa เท่านั้น **ไม่ครอบคลุม** รูปแบบเอกสารส่งมอบ (.docx) ที่ต้องยึด Template `.dotx` ขององค์กรตามหลัก Template compliance ที่ระบุใน [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md) §7 — สองส่วนนี้เป็นระบบภาพที่แยกจากกันโดยตั้งใจ
- **อ้างอิง:** [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md), [[user-journey|user-journey]]

โทนที่ยึดตลอดทั้งระบบ: **Earth tone + Minimalist + Muji-inspired** — สีดินสอฟื้น (warm neutral), พื้นที่ว่างมาก, ไม่มีองค์ประกอบตกแต่งเกินจำเป็น, ทุกองค์ประกอบมีหน้าที่ชัดเจน ไม่ใช่ของสวยงามเปล่าๆ

---

## 1. Brand Identity & CI

### 1.1 แนวคิดแบรนด์

Projexa เปลี่ยนวิธีทำงานของทีมจาก "เอกสารเป็นศูนย์กลาง" เป็น "ข้อมูลเป็นศูนย์กลาง" — บุคลิกภาพของแบรนด์จึงควรสื่อถึง **ความน่าเชื่อถือ ความสงบ และความเป็นระบบ** ไม่ใช่ความตื่นเต้นหรือฉูดฉาด เพราะผู้ใช้หลักคือทีม PM/BA/SA/QA ที่ต้องใช้งานทุกวันเป็นเวลานาน การออกแบบต้อง "อยู่เบื้องหลัง" และให้ข้อมูลเป็นพระเอก

**คำ 3 คำที่ใช้ตัดสินการออกแบบทุกจุด:**

| คำ | ความหมายเชิงปฏิบัติ |
|---|---|
| **Calm** | ไม่มีสีสันจัด ไม่มี animation ที่ดึงความสนใจโดยไม่จำเป็น พื้นหลังโทนอุ่นสบายตา ใช้งานได้ทั้งวันไม่ล้าตา |
| **Honest** | UI ไม่ตกแต่งให้ข้อมูลดูดีกว่าความเป็นจริง (เช่น ห้ามใช้สีเขียวสดกับความก้าวหน้าที่จริงๆ ล่าช้า) สอดคล้องกับหลัก Human-in-the-loop และ Everything is logged |
| **Structured** | ทุกหน้าจอมีลำดับชั้นของข้อมูลชัดเจน สื่อถึง Traceability ที่เป็นแกนของระบบ |

### 1.2 โทนสีและวัสดุอ้างอิง (Mood)

อ้างอิงจากปรัชญา MUJI: "ไม่มีแบรนด์" (no-brand) เน้นวัสดุธรรมชาติ, ลดทอนสิ่งไม่จำเป็น, ใช้งานได้จริง

- สีอ้างอิงจากธรรมชาติ: กระดาษคราฟท์ ดินเผา ไม้อ่อน ใบไม้แห้ง หินปูน — **ไม่ใช้สีดำสนิทหรือสีขาวสนิท** เพื่อลดความแข็งกระด้าง
- พื้นผิวแบน (flat) เป็นหลัก หลีกเลี่ยง gradient, drop shadow หนัก, หรือ glassmorphism
- ความคมชัดของ UI มาจาก **การจัดวาง (layout) และ typography** ไม่ใช่จากสีหรือเอฟเฟกต์

### 1.3 Logo / Wordmark

โปรเจกต์มีโลโก้จริงแล้ว:

![Projexa Logo](assets/Logo-Projexa.png)

ประกอบด้วย 2 ส่วน:

- **Mark (สัญลักษณ์):** ตัวอักษร "P" ที่หลอมจาก 3 องค์ประกอบ — (1) ไอคอนเอกสาร/กระดาษ สื่อถึงเอกสารส่งมอบ, (2) เส้นจุดเชื่อมกัน (connected nodes) สื่อถึง Full Traceability/workflow, (3) วงกลมเครื่องหมายถูก สื่อถึงการยืนยัน/Human-in-the-loop เรนเดอร์เป็นไล่เฉดทอง-บรอนซ์ 3D มันวาว
- **Wordmark:** "Projexa" ตัวอักษรสีน้ำตาลเข้ม (dark umber/chocolate) ตัว "x" เน้นด้วยสีทองเดียวกับ mark
- **Tagline:** "สร้างเอกสาร • มอบหมายงาน • ติดตามความคืบหน้า" สีทอง ตัวเล็ก มีเส้นขีดคั่นซ้าย-ขวา

**ข้อสังเกตสำคัญ — ความขัดแย้งกับกติกาแบน (flat) ของระบบ:** โลโก้นี้ใช้ gradient, bevel และแสงมันวาวแบบ 3D ซึ่ง**ขัดกับหลัก Muji flat-surface ใน §1.2/§2.4 ของเอกสารนี้โดยตรง** แนวทางที่แนะนำคือปฏิบัติกับโลโก้เป็น **"hero mark" ข้อยกเว้นเดียวของทั้งระบบ** ไม่ใช่ต้นแบบให้ effect อื่นๆ ใน UI ทำตาม:

| บริบทการใช้งาน | ใช้เวอร์ชันไหน |
|---|---|
| หน้า Login / Splash / เอกสารการตลาด / นามบัตร | เวอร์ชันทอง-บรอนซ์ 3D เต็มรูปแบบ (ตามภาพต้นฉบับ) |
| Sidebar header, favicon, ไอคอนขนาดเล็กในแอป (≤ 32px) | ต้องทำ **เวอร์ชัน flat/monochrome** แยกต่างหาก (ตัด gradient/bevel ออก เหลือ silhouette สีเดียว) เพราะไล่เฉดและรายละเอียดในสัญลักษณ์จะแตกเมื่อย่อเล็ก และขัดกับพื้นผิวแบนของ UI ส่วนที่เหลือ |
| พื้นเข้ม (เช่น `stone-900`) | ใช้เวอร์ชัน flat สีทองเดียว (`clay-500`/`#B4693E` หรือทองอ่อนลง) ไม่ใช้เวอร์ชัน 3D เต็มเพราะเงา/ไฮไลต์จะกลืนกับพื้นเข้ม |
| เนื้อหาในแอปทั่วไป (ปุ่ม, การ์ด, ตาราง) | **ไม่ใช้โลโก้** — คงหลัก "อยู่เบื้องหลัง ให้ข้อมูลเป็นพระเอก" ตาม §1.1 |

**กติกาการใช้งาน:**

- Clear space รอบโลโก้ ≥ ความสูงของตัว "P" ใน mark ทุกด้าน ห้ามวางองค์ประกอบอื่นล้ำเข้ามา
- ห้ามยืด/บีบสัดส่วน, เปลี่ยนสี mark เป็นสีอื่นนอกจากทอง-บรอนซ์ตามต้นฉบับหรือเวอร์ชัน flat ที่กำหนด, หรือเพิ่ม effect ซ้อนทับ (เช่น shadow เพิ่มเติม, outline)
- ขนาดต่ำสุดที่ยังอ่าน wordmark ได้ชัด: ความสูง mark ≥ 24px — ต่ำกว่านี้ให้ใช้ mark อย่างเดียวโดยไม่มี wordmark
- แท็กไลน์เป็น optional element ใช้เฉพาะจุดที่เป็นการแนะนำผลิตภัณฑ์ครั้งแรก (splash/landing) ไม่ใช้ซ้ำในทุกหน้าจอ

> **หมายเหตุ:** ไฟล์ต้นฉบับที่เก็บไว้ (`assets/Logo-Projexa.png`) เป็น PNG ไล่เฉดความละเอียดสูงเท่านั้น — ยังไม่มีไฟล์ vector (.svg/.ai) และยังไม่มีเวอร์ชัน flat/monochrome ตามตารางข้างต้น ทีมออกแบบควรจัดทำทั้งสองส่วนนี้เพิ่มก่อนนำไปใช้จริงในแอป (โดยเฉพาะ favicon/sidebar ที่ต้องใช้เวอร์ชัน flat) และเก็บไฟล์ vector ต้นทางไว้ใน `assets/` เดียวกันนี้ด้วยเพื่อให้แก้ไข/ย่อขนาดได้โดยไม่เสียคุณภาพ

### 1.4 Voice & Tone (ข้อความในระบบ)

- ใช้ภาษาไทยเป็นหลัก กระชับ ตรงไปตรงมา ไม่ใช้คำฟุ่มเฟือยหรือ emoji ในข้อความระบบ (system copy)
- Error message ต้องบอก "เกิดอะไรขึ้น" + "ควรทำอะไรต่อ" เสมอ ห้ามขึ้นแค่ "เกิดข้อผิดพลาด"
- ข้อความที่มาจาก AI (คำแนะนำ, ข้อมูลที่สกัดอัตโนมัติ) ต้องระบุที่มาเสมอ เช่น "สกัดจาก TOR โดยอัตโนมัติ — กรุณาตรวจสอบ" ห้ามใช้น้ำเสียงที่ทำให้ดูเหมือนเป็นข้อเท็จจริงที่ยืนยันแล้ว

---

## 2. Design Tokens

### 2.1 Color Tokens

หลักการ: ใช้ **neutral (สีดิน/สีกระดาษ) เป็น 90% ของพื้นที่หน้าจอ** ส่วนสี accent (`clay`, `moss`) ใช้เฉพาะจุดที่ต้องดึงความสนใจจริงๆ (primary action, สถานะสำคัญ) ห้ามใช้ accent กับพื้นที่กว้าง

#### Neutral — "Stone & Paper"

| Token | Hex | การใช้งาน |
|---|---|---|
| `paper-050` | `#FBF9F5` | พื้นหลังหน้าจอหลัก (page background) |
| `paper-100` | `#F5F1E9` | พื้นหลัง surface / card / table row คู่ |
| `stone-200` | `#E8E1D3` | เส้นแบ่ง (divider), border ของ input/card |
| `stone-300` | `#D4CBB8` | border สถานะ disabled, skeleton loading |
| `stone-500` | `#A79C87` | placeholder text, icon รอง, ตัวอักษร disabled |
| `stone-700` | `#7A6F5D` | ข้อความรอง (secondary text), label |
| `stone-900` | `#3B352A` | ข้อความหลัก (primary text), heading — ใช้แทนสีดำทั้งระบบ |

#### Accent — "Clay & Moss"

| Token | Hex | การใช้งาน |
|---|---|---|
| `clay-100` | `#F1E0D3` | พื้นหลัง tint ของปุ่ม/แท็กที่ active หรือถูกเลือก |
| `clay-500` | `#B4693E` | Primary action (ปุ่มหลัก, ลิงก์, focus ring) — สีเอกลักษณ์ของแบรนด์ |
| `clay-600` | `#9C5730` | สถานะ hover/active ของ `clay-500` |
| `moss-100` | `#E4E8DA` | พื้นหลัง tint ของสถานะ "ยืนยันแล้ว/สำเร็จ" |
| `moss-500` | `#6E7B58` | Secondary accent, สถานะ Confirmed/Approved/Done |

#### Semantic (สถานะ)

| Token | Hex (text/icon) | Hex (bg tint) | ใช้กับ |
|---|---|---|---|
| `success` | `#6B7F5E` | `#E7ECE0` | บันทึกสำเร็จ, Test Result: Pass, สถานะ Confirmed |
| `warning` | `#B3852E` | `#F5E8CE` | ใกล้ครบกำหนด, ข้อมูลรอตรวจสอบ, ผลสกัด AI ที่ยังไม่ยืนยัน |
| `danger` | `#A85039` | `#F1DCD4` | เลยกำหนด, Test Result: Fail, ลบ/ยกเลิก |
| `info` | `#5D7A80` | `#DEE8E9` | ข้อความแนะนำ, สถานะ In Review |

**Status pill มาตรฐาน** (ใช้ตรงกันทุกหน้าจอที่มีวงจรสถานะ ตาม Projexa-System-Design-R1 §6):

| สถานะ | Token สี |
|---|---|
| Draft | `stone-500` บน `paper-100` |
| In Review | `info` |
| Confirmed / Approved | `moss-500` บน `moss-100` |
| In Progress | `clay-500` บน `clay-100` |
| Blocked / Issue | `danger` |
| Archived | `stone-300` ตัวอักษร + ขีดทับ (strikethrough) |

**กติกาเข้าถึงได้ (accessibility):** คู่สี text/background ทุกคู่ในตารางข้างต้นต้องผ่าน contrast ratio ≥ 4.5:1 (WCAG AA) — ห้ามใช้สีเป็นตัวบอกสถานะเพียงอย่างเดียว ต้องมี label ข้อความ/ไอคอนควบคู่เสมอ (สำคัญมากสำหรับ status pill เพราะผู้ใช้บางคนอาจแยกสีไม่ชัด)

### 2.2 Typography

| ระดับ | Font | ใช้กับข้อความ |
|---|---|---|
| ภาษาไทย | **IBM Plex Sans Thai** (fallback: Noto Sans Thai, system-ui) | ข้อความทั้งหมดในระบบ |
| ภาษาอังกฤษ/ตัวเลข | **Inter** (fallback: system-ui) | Label ภาษาอังกฤษ, ตัวเลข, วันที่ |
| Code/รหัสอ้างอิง | **IBM Plex Mono** | รหัสหน้าจอ (SCR-001), TOR Clause ID, รหัส test case |

หลัก Muji minimalism: ใช้ font-weight เพียง **3 ระดับ** ตลอดระบบ — `regular (400)`, `medium (500)`, `semibold (600)` ห้ามใช้ `bold (700)` หรือ italic เพื่อรักษาความรู้สึกสงบ

| Scale | Size / Line-height | Weight | ใช้กับ |
|---|---|---|---|
| `display` | 28px / 36px | semibold | ชื่อหน้า (page title) ระดับบนสุด |
| `h1` | 24px / 32px | semibold | หัวข้อ section หลัก |
| `h2` | 20px / 28px | semibold | หัวข้อ card / panel |
| `h3` | 16px / 24px | medium | หัวข้อย่อย, table header |
| `body` | 14px / 22px | regular | ข้อความเนื้อหาหลัก (base font size) |
| `body-sm` | 13px / 20px | regular | ข้อความรองในตาราง/ฟอร์ม |
| `caption` | 12px / 16px | regular | timestamp, helper text, metadata (สีเทา `stone-500`) |

### 2.3 Spacing (4px grid)

ยึดหน่วยฐาน 4px และเพิ่มพื้นที่ว่างมากกว่าระบบทั่วไป (Muji = generous whitespace):

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64` (px)

- ระยะห่างภายในองค์ประกอบเล็ก (padding ปุ่ม, input): `8–12px`
- ระยะห่างระหว่างองค์ประกอบในกลุ่มเดียวกัน (field ในฟอร์มเดียวกัน): `16px`
- ระยะห่างระหว่างกลุ่ม/section: `32px`
- ระยะขอบ page container: `48–64px` (desktop), `16px` (mobile)

### 2.4 Radius, Border, Shadow

- **Border-radius:** `4px` (input, button, tag) · `8px` (card, table) · `12px` (modal, dialog) — โค้งน้อย ไม่ปัดมุมจนดูเหมือน app มือถือทั่วไป
- **Border:** ใช้ `1px solid stone-200` เป็นหลักในการแบ่งพื้นที่ **แทนการใช้ shadow** — นี่คือกติกาสำคัญของแนว Muji
- **Shadow:** ใช้เท่าที่จำเป็นจริงๆ เพียง 1 ระดับ คือ `0 2px 8px rgba(59, 53, 42, 0.08)` สำหรับ element ที่ลอยเหนือ layer อื่น (dropdown, modal, toast) เท่านั้น ห้ามใช้ shadow กับ card ปกติที่วางอยู่บน page

### 2.5 Motion

- Transition มาตรฐาน: `150–200ms ease-out` สำหรับ hover/focus/expand
- ห้ามใช้ animation แบบ bounce, spring, หรือ effect ที่ดึงความสนใจโดยไม่มีเหตุผลเชิงหน้าที่
- ต้องรองรับ `prefers-reduced-motion` — ปิด transition ที่ไม่ใช่ functional (เช่น fade-in ของ toast) ให้ผู้ใช้ที่ตั้งค่านี้ไว้

---

## 3. UI Components & Patterns

หลักทั่วไป: component ทุกตัวสร้างจาก token ใน §2 เท่านั้น ห้าม hardcode สี/ระยะห่างใหม่ในระดับ component

### 3.1 Core Components

| Component | กติกาออกแบบ |
|---|---|
| **Button** | Primary = พื้น `clay-500` ตัวอักษร `paper-050`; Secondary = พื้นโปร่ง border `stone-200` ตัวอักษร `stone-900`; Destructive = พื้นโปร่ง ตัวอักษร `danger` border `danger` เฉพาะ hover ค่อยเติมพื้น มีปุ่มระดับเดียวต่อหน้าจอที่เป็น Primary เท่านั้น (ห้ามมี Primary หลายปุ่มแข่งกัน) |
| **Input / Textarea / Select** | พื้น `paper-050` border `1px stone-200` radius `4px` focus = border `clay-500` + ring บาง 2px สี `clay-100` label อยู่เหนือ field เสมอ (ไม่ใช้ placeholder แทน label) |
| **Card / Panel** | พื้น `paper-100` border `1px stone-200` ไม่มี shadow ใช้แบ่งกลุ่มข้อมูลที่เกี่ยวข้องกัน ไม่ใช่ตกแต่ง |
| **Table** | Header ใช้ `h3` scale บนพื้น `paper-100`, แถวสลับสี `paper-050`/`paper-100` แบบจางมาก (ไม่ใช่ zebra จัด), แถวที่ hover ใช้ `clay-100` บางๆ |
| **Tag / Badge** | ใช้กับ MoSCoW label, module code — พื้น bg-tint + ตัวอักษรสีเข้มของ token เดียวกัน (เช่น `moss-100`/`moss-500`) radius `4px` padding แน่น |
| **Status Pill** | ดู §2.1 ตารางสถานะ ต้องมีจุด (dot) นำหน้าข้อความเสมอ เพื่อแยกจาก Tag ทั่วไป |
| **Navigation (Sidebar)** | พื้น `paper-100`, item ที่ active = พื้น `clay-100` + ตัวอักษร `clay-600` ไม่ใช้ไอคอนสีสันจัด ไอคอนเป็น outline บาง สีเดียวกับข้อความ |
| **Tabs** | เส้นใต้ (underline) บาง 2px สี `clay-500` สำหรับ tab ที่เลือก ไม่ใช้พื้นหลังเต็ม tab |
| **Modal / Dialog** | radius `12px`, shadow ตาม §2.4, มี overlay สี `stone-900` ความโปร่งใส 40% เท่านั้น (ไม่ใช้ blur) |
| **Toast / Notification** | มุมขวาบน, ไอคอนสถานะ + ข้อความสั้น, auto-dismiss 4 วินาที ยกเว้น error ต้องกดปิดเอง |
| **Breadcrumb** | ใช้ตัวอักษร `body-sm` สี `stone-700`, ตัวคั่นเป็น `/` บาง สี `stone-300` |
| **Empty State** | ข้อความ + คำแนะนำขั้นถัดไปเสมอ (ห้ามแสดงแค่ "ไม่มีข้อมูล") ไม่ใช้ illustration สีสันจัด ถ้าจะใช้ภาพให้เป็น line-art เดียวสี `stone-300` |
| **Pagination** | ตัวเลขเรียบ ไม่มีพื้นหลังเต็มที่หน้าปัจจุบัน ใช้แค่ตัวอักษร `clay-600` + ขีดล่างบาง |

### 3.2 Project-specific Patterns

Component เฉพาะของ Projexa ที่ผูกกับหลักการออกแบบระบบใน [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md):

| Pattern | จุดประสงค์ | กติกาออกแบบ |
|---|---|---|
| **AI Suggestion Block** | แยกข้อมูลที่ AI สกัด/เสนอ ออกจากข้อมูลที่คนยืนยันแล้ว (Human-in-the-loop) | ใช้ border แบบ dashed สี `warning`, มีแท็กเล็ก "AI เสนอ" มุมซ้ายบน และปุ่ม "ยืนยัน" / "แก้ไข" ติดกับ block เสมอ — เมื่อคนกดยืนยันแล้ว border เปลี่ยนเป็น solid `stone-200` ปกติทันที |
| **Traceability Trail** | แสดงสายโยง `TorClause → Requirement → Screen → TestCase → TestResult` | แสดงเป็นแถวของ pill เชื่อมด้วยเส้นบาง สี `stone-300` แต่ละ pill กดเพื่อไปยังต้นทาง/ปลายทางได้ วางไว้ใต้หัวข้อหลักของหน้าจอที่มีความสัมพันธ์นี้ |
| **Audit / History Chip** | สื่อว่า "ใครแก้ ทำไม เมื่อไหร่" (Everything is logged) | ไอคอนนาฬิกาเล็กข้าง field ที่แก้ไขได้ กด/hover เพื่อเปิด popover ประวัติการเปลี่ยนแปลงแบบเรียงเวลา ไม่ต้องเปิดหน้าใหม่ |
| **Workflow Stepper** | แสดงขั้นตอน TOR → Requirement → Design → Test → Document ในภาพรวม | เส้นแนวนอน จุดที่ผ่านแล้ว = `moss-500`, จุดปัจจุบัน = `clay-500`, จุดที่ยังไม่ถึง = `stone-300` ห้ามใช้สีเดาสถานะที่ยังไม่เกิดขึ้นจริง |
| **TOR Upload Dropzone** | จุดเริ่มต้นของ workflow ทั้งระบบ | กรอบ dashed สี `stone-300` พื้น `paper-100` ไอคอน upload เรียบสีเดียว ไม่ใช้สีสันดึงดูดเกินจำเป็น เพราะเป็น action ที่ทำครั้งเดียวต่อโครงการ ไม่ต้องแข่งความสนใจกับ action อื่น |
| **Document Generation Trigger** | ปุ่มสั่งสร้างเอกสาร .docx จาก template | ต้องมี label ระบุ template ที่จะใช้ชัดเจน (เช่น "สร้าง REQ ตาม Template องค์กร") เพื่อย้ำว่าผลลัพธ์คุมรูปแบบด้วย `.dotx` ไม่ใช่ AI จัดหน้าเอง |

---

## 4. UX Guidelines & Rules

### 4.1 หลักที่ผูกกับสถาปัตยกรรมระบบ (บังคับ)

หลักการเหล่านี้มาจาก [Projexa-System-Design-R1.md](../../../Projexa-System-Design-R1.md) และ CLAUDE.md ของโปรเจกต์ — UI ต้องสื่อสารหลักการเหล่านี้ให้ผู้ใช้ "เห็น" ได้ ไม่ใช่แค่ทำงานถูกต้องเบื้องหลัง:

1. **Single Source of Truth** — ห้ามมีฟอร์มกรอกข้อมูลซ้ำที่มีอยู่แล้วในระบบ ทุก field ที่ดึงจากข้อมูลกลางต้องมีสถานะ read-only ชัดเจน (พื้น `paper-100` ตัวอักษร `stone-700`) และมีลิงก์ไปยังต้นทางเสมอ
2. **Full Traceability** — ทุกหน้าจอที่แสดง Requirement/Screen/TestCase ต้องมี Traceability Trail (§3.2) ห้ามซ่อนไว้ในเมนูลึก
3. **Human-in-the-loop** — ข้อมูลที่มาจาก AI ต้องผ่าน AI Suggestion Block (§3.2) เสมอ ห้ามให้ข้อมูล AI ไหลเข้าระบบเป็น "ข้อเท็จจริง" โดยไม่มีจุดยืนยันของคน แม้ในกรณี auto-fill ที่ดูน่าเชื่อถือมากก็ตาม
4. **Everything is logged** — field สำคัญ (สถานะ, ผู้รับผิดชอบ, วันที่) ต้องมี Audit/History Chip (§3.2) กดดูได้ทุกจุด
5. **Template compliance** — UI ของเว็บแอปออกแบบได้อย่างอิสระตาม design system นี้ แต่ **หน้าตาของเอกสารที่ export ออกมาต้องไม่ถูก UI นี้ครอบงำ** — ปุ่ม/หน้าจอสร้างเอกสารต้องสื่อชัดว่าผลลัพธ์จะยึด Template `.dotx` ไม่ใช่สไตล์ของเว็บแอป

### 4.2 Layout & Grid

- Desktop-first (ตาม MVP ที่เน้นทีมงานใช้ในสำนักงาน) แต่ต้อง responsive ได้ถึง tablet เป็นอย่างน้อย
- Grid หลัก: sidebar คงที่ 240px + content area ไหลตาม container โดยมี max-width เนื้อหา `1200px` เพื่อไม่ให้ตารางข้อมูลยาวเกินอ่านง่าย
- ทุกหน้าจอ list/table ต้องมีพื้นที่สำหรับ filter/search อยู่บนสุดแบบตำแหน่งเดียวกันทุกหน้า (ความสม่ำเสมอ = ความสงบ)

### 4.3 Accessibility

- Contrast ratio ข้อความ/พื้นหลัง ≥ 4.5:1 ทุกจุด (ดู §2.1)
- ทุก interactive element ต้องมี focus state ที่มองเห็นชัด (ring สี `clay-500`) รองรับการใช้ keyboard navigation ล้วน
- ห้ามสื่อความหมายด้วยสีอย่างเดียว (สถานะ, error, required field ต้องมี icon/label ควบคู่)
- ขนาดตัวอักษร base ต้อง ≥ 14px และรองรับการ zoom ของ browser โดยไม่พังเลย์เอาต์

### 4.4 States (Loading / Empty / Error)

- **Loading:** ใช้ skeleton (พื้น `stone-300` เรียบ, ไม่ animate แบบ shimmer สีสันจัด) ห้ามใช้ spinner หมุนตลอดหน้าจอเว้นแต่เป็น full-page transition จริงๆ
- **Empty:** ต้องมีคำแนะนำ action ถัดไปเสมอ (ดู §3.1 Empty State) เช่นหน้า "ทะเบียนโครงการ" ที่ยังไม่มีโครงการ ต้องมีปุ่ม "เริ่มต้นโดยนำเข้า TOR" ไม่ใช่แค่ "ไม่มีข้อมูล"
- **Error:** ตามหลัก Voice & Tone (§1.4) ต้องบอกสาเหตุ + ทางแก้ และใช้สี `danger` เฉพาะกับตัว error message/icon ไม่ทาสีพื้นหลังทั้ง block ด้วยสีแดงเข้ม

### 4.5 Content & Microcopy

- ใช้คำเดียวกันตลอดระบบสำหรับ concept เดียวกัน (เช่น เรียก "ยืนยัน" ทุกจุด ห้ามสลับกับ "อนุมัติ"/"รับรอง" ในบริบทเดียวกัน)
- วันที่แสดงผลรูปแบบ `DD/MM/YYYY` (พ.ศ. หรือ ค.ศ. ต้องเลือกใช้แบบเดียวตลอดระบบ — แนะนำ ค.ศ. เพื่อให้ตรงกับ field วันที่ในฐานข้อมูล ลด mapping error)
- ตัวเลข MoSCoW/สถานะที่เป็นการประเมินของ AI ต้องมีคำว่า "(แนะนำ)" ต่อท้ายใน UI เช่นเดียวกับ convention ที่ใช้ใน [[user-journey|user-journey]] และ `feature-list.md`

---

## หมายเหตุ

เอกสารนี้เป็น **Draft ฉบับแรก** สร้างขึ้นตามคำขอให้จัดทำ Design System โทน Earth tone + Minimalist + Muji-inspired ยังไม่ผ่านการยืนยันจาก Design Lead/PM/SA — เมื่อลงมือพัฒนา UI จริง ควรนำ token ใน §2 ไปแปลงเป็นไฟล์ config จริง (เช่น Tailwind theme / CSS variables) ในโค้ดเบส และปรับปรุงเอกสารนี้ให้ตรงกับของจริงที่ implement เมื่อ repo เริ่มมีซอร์สโค้ด
