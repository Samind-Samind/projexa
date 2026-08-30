# 02 - Technical

เก็บเอกสาร **การออกแบบเชิงเทคนิค (Technical Design)** เช่น

- System architecture / โครงสร้างระบบโดยรวม
- Database schema
- API design / data contract
- เทคโนโลยีและไลบรารีที่เลือกใช้ พร้อมเหตุผล

เอกสารในโฟลเดอร์นี้คือพิมพ์เขียวที่ทีมพัฒนาใช้อ้างอิงตอนลงมือเขียนโค้ด และเป็นฐานในการวางแผนทดสอบใน [[../../03-testing/01-test-plan/index|01-test-plan]]

## เอกสารในโฟลเดอร์นี้

- [[architecture|architecture]] — สถาปัตยกรรมระดับสูงเชิงแนวคิด (conceptual,
  ยังไม่ผูกกับเทคโนโลยี)
- [[database-schema|database-schema]] — โครงสร้างฐานข้อมูลระดับ Conceptual
  พร้อม ER Diagram
- [[api-spec|api-spec]] — รายการ API resource/endpoint ระดับ Conceptual
- [[detailed-design/index|detailed-design]] — Conceptual Design + Sequence
  Flow รายหน้าจอ/ฟีเจอร์
- [[screen-tracking-nosql-module|screen-tracking-nosql-module]] — ขอบเขต
  NoSQL Concrete Design ของโมดูล Screen Tracking (SCR-009/010/013/016)
  สำหรับงานส่งหลักสูตร NoSQL โดยเฉพาะ — ไม่ใช่ดีไซน์ระบบจริง (ดูหมายเหตุใน
  เอกสาร)
- [[screen-tracking-nosql-module-sequence|screen-tracking-nosql-module-sequence]]
  — Sequence diagram ครบ 4 flow ของโมดูล Screen Tracking ในสโคปที่ตัดลดแล้ว
  (คนละไฟล์กับ `detailed-design/scr-009..016` ที่เป็นระบบจริง)
- [[screen-tracking-nosql-module-tech|screen-tracking-nosql-module-tech]] —
  บันทึกตัดสินใจเทคโนโลยีสั้นเฉพาะโมดูลนี้ (Firebase Firestore + Node.js)
  สำหรับงานส่งหลักสูตร NoSQL โดยเฉพาะ — ไม่ใช่ tech-stack.md ของระบบจริง
