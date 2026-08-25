
# Prototype v1 — Meta

- **วันที่สร้าง/อัปเดตล่าสุด:** 2026-08-24
- **สถานะ:** Draft — รอ SA/PM/Design Lead ยืนยัน
- **สโคป:** SCR-003 (ข้อมูลโครงการ) — 1 หน้าจอ, โมดูล M1 — จัดการโครงการและ TOR
- **อ้างอิง Design System:** [[../DESIGN|DESIGN.md]] (โหมด: ใช้ของเดิม — ไม่มีการแก้ไข DESIGN.md ในรอบนี้)
- **อ้างอิงต้นทาง:** [[../../../01-requirements/backlog|backlog]] (#003), [[../../../01-requirements/feature-list|feature-list]] (SCR-003, Must), [[../user-journey|user-journey]], สเปกต้นทาง: [[../../../01-requirements/01-spec/20260824-003-scr-003-ข้อมูลโครงการ|SCR-003 spec]]
- **เปลี่ยนแปลงจากเวอร์ชันก่อนหน้า:** เวอร์ชันแรก — ไม่มีเวอร์ชันก่อนหน้า
- **อัปเดต 2026-08-24 (รอบ 2):** เติม Interactive JS ให้ตรงตามมาตรฐานใหม่ของ `prototype-builder` (ยังคง DESIGN.md เดิม ไม่แก้ไข) — สร้าง `v1/script.js` ใหม่ทั้งไฟล์ (audit popover, เพิ่ม/ลบแถวทีมงาน, สลับ tab, toggle loading, ai-confirm, toast), เพิ่มชุด CSS "Interaction states" ต่อท้าย `v1/style.css`, และแก้ `v1/scr-003.html` กลับไปใช้ `<link rel="stylesheet" href="style.css">` แทนการฝัง `<style>` inline พร้อมเติม interaction จริง: Audit/History popover ที่ทุกปุ่ม "ประวัติการแก้ไข" (6 จุด: ชื่อโครงการ, ลูกค้า, วันที่เริ่มต้น, วันที่สิ้นสุด, งบประมาณ, ทีมงาน), เพิ่ม/ลบแถวทีมงานได้จริง (`data-row-add`/`data-row-remove`), ปุ่ม "จำลองการโหลดข้อมูลเดิม" ที่ toggle skeleton loading state จริงแทนการ์ดตัวอย่างแยกต่างหาก (ลบการ์ดซ้ำซ้อนออก), และปุ่ม "บันทึก" แจ้ง toast "บันทึกข้อมูลโครงการสำเร็จ"
- **อัปเดต 2026-08-24 (รอบ 3):** ปรับ `v1/style.css` ให้ตรงกับ `DESIGN.md` เวอร์ชันใหม่ (mood board โทนสีเขียวเสจ-ส้มอิฐ "Sage & Terracotta" บนพื้นครีม-ขาว "Cream & White") เปลี่ยนตัวแปรสีใน `:root` ทั้งหมด, เพิ่มตัวแปร `--shadow-modal` แยกจาก `--shadow-float`, ปรับ `--radius-sm/md/lg` เป็น 8px/16px/20px, และเปลี่ยน `.card` จาก border-based เป็นการ์ดขาวลอย shadow (ตัด `border` ออก ใช้ `box-shadow: var(--shadow-float)` แทน) พร้อมย้าย dropdown/popover/toast ไปใช้ `--shadow-modal` — ไม่แตะ `v1/scr-003.html` และ `v1/script.js` เพราะเป็นการเปลี่ยน visual token ล้วนๆ ไม่มีการเปลี่ยนโครงสร้างหรือ interaction
