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
