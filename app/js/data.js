// ─────────────────────────────────────────────────────────────
// js/data.js — ข้อมูลตัวอย่างสำหรับ seed ขึ้น Firestore ครั้งเดียว (js/seed.js)
//
// โครงสร้าง/ชื่อ field ตรงกับ
// docs/02-design/02-technical/screen-tracking-nosql-module.md เป๊ะ:
//   collection screens (โฟลเดอร์หลัก) — โฟลเดอร์ประกอบ screenTypes/users —
//   subcollection screens/{id}/statusHistory — embedded array assignees[]
// ─────────────────────────────────────────────────────────────

window.SEED_DATA = {

  // 📁 users — โฟลเดอร์ประกอบ (มีอยู่แล้วในระบบจริง — ที่นี่ seed ชุดตัวอย่าง)
  users: [
    { id: "u001", name: "สมชาย ใจดี", email: "somchai@example.com", is_active: true },
    { id: "u002", name: "สมหญิง วิเคราะห์", email: "somying@example.com", is_active: true },
    { id: "u003", name: "วีระ ตรวจสอบ", email: "weera@example.com", is_active: true },
    { id: "u004", name: "ปรีชา มั่นคง", email: "preecha@example.com", is_active: true },
    { id: "u005", name: "พิมพ์ใจ ดีงาม", email: "pimjai@example.com", is_active: true }
  ],

  // 📁 screenTypes — โฟลเดอร์ประกอบ
  screenTypes: [
    { id: "PROCESS", code: "PROCESS", label: "Process", is_active: true },
    { id: "INQUIRY", code: "INQUIRY", label: "Inquiry", is_active: true },
    { id: "REPORTUI", code: "REPORTUI", label: "Report UI", is_active: true },
    { id: "SERVICE", code: "SERVICE", label: "Service", is_active: true },
    { id: "REPORT", code: "REPORT", label: "Report", is_active: true }
  ],

  // 📁 screens — โฟลเดอร์หลัก (id เอกสาร = code)
  // แต่ละแถวมี statusHistory ของตัวเอง (จะถูกเขียนเป็น subcollection screens/{id}/statusHistory ตอน seed)
  screens: [
    {
      code: "SCR-101",
      name: "ค้นหาและแสดงรายการใบลา (ตัวอย่าง)",
      description: "หน้าจอสำหรับพนักงานค้นหาและดูรายการใบลาของตนเอง",
      type: { type_id: "INQUIRY", label: "Inquiry" },
      assignees: [
        { user_id: "u001", user_name: "สมชาย ใจดี", role: "Dev", assigned_by: "u004", assigned_at: "2026-08-20T09:00:00" }
      ],
      origin_label: "ManualEntry",
      ai_confidence: null,
      is_suggested: false,
      current_status: "Analysis",
      is_deleted: false,
      statusHistory: [
        { changed_by: "u001", changed_by_name: "สมชาย ใจดี", changed_at: "2026-08-21T09:00:00", old_status: "NotStarted", new_status: "Analysis", reason: null, note: null }
      ]
    },
    {
      code: "SCR-102",
      name: "อนุมัติใบลา (ตัวอย่าง)",
      description: "หน้าจอสำหรับหัวหน้างานอนุมัติ/ไม่อนุมัติใบลาที่พนักงานยื่น",
      type: { type_id: "PROCESS", label: "Process" },
      assignees: [
        { user_id: "u002", user_name: "สมหญิง วิเคราะห์", role: "Dev", assigned_by: "u004", assigned_at: "2026-08-18T10:00:00" },
        { user_id: "u003", user_name: "วีระ ตรวจสอบ", role: "Tester", assigned_by: "u004", assigned_at: "2026-08-18T10:00:00" }
      ],
      origin_label: "HumanConfirmed",
      ai_confidence: 0.91,
      is_suggested: false,
      current_status: "Design",
      is_deleted: false,
      statusHistory: [
        { changed_by: "u002", changed_by_name: "สมหญิง วิเคราะห์", changed_at: "2026-08-19T09:00:00", old_status: "NotStarted", new_status: "Analysis", reason: null, note: null },
        { changed_by: "u002", changed_by_name: "สมหญิง วิเคราะห์", changed_at: "2026-08-24T09:00:00", old_status: "Analysis", new_status: "Design", reason: null, note: null }
      ]
    },
    {
      code: "SCR-103",
      name: "รายงานสรุปวันลาสะสม (ตัวอย่าง)",
      description: "รายงานสรุปจำนวนวันลาคงเหลือของพนักงานแต่ละคน",
      type: { type_id: "REPORT", label: "Report" },
      assignees: [],
      origin_label: "ManualEntry",
      ai_confidence: null,
      is_suggested: false,
      current_status: "NotStarted",
      is_deleted: false,
      statusHistory: []
    },
    {
      code: "SCR-104",
      name: "บริการแจ้งเตือนวันลาใกล้หมดอายุ (ตัวอย่าง)",
      description: "บริการเบื้องหลังที่ส่งการแจ้งเตือนอัตโนมัติเมื่อวันลาใกล้หมดอายุ",
      type: { type_id: "SERVICE", label: "Service" },
      assignees: [
        { user_id: "u001", user_name: "สมชาย ใจดี", role: "Dev", assigned_by: "u004", assigned_at: "2026-08-22T09:00:00" }
      ],
      origin_label: "AIGenerated",
      ai_confidence: 0.78,
      is_suggested: true,
      current_status: "Analysis",
      is_deleted: false,
      statusHistory: [
        { changed_by: "u001", changed_by_name: "สมชาย ใจดี", changed_at: "2026-08-23T09:00:00", old_status: "NotStarted", new_status: "Analysis", reason: null, note: null }
      ]
    },
    {
      code: "SCR-105",
      name: "แดชบอร์ดสรุปการลาระดับทีม (ตัวอย่าง)",
      description: "หน้าจอสรุปภาพรวมการลาของทีมสำหรับหัวหน้างาน",
      type: { type_id: "REPORTUI", label: "Report UI" },
      assignees: [
        { user_id: "u004", user_name: "ปรีชา มั่นคง", role: "Dev", assigned_by: "u004", assigned_at: "2026-08-15T09:00:00" },
        { user_id: "u005", user_name: "พิมพ์ใจ ดีงาม", role: "Tester", assigned_by: "u004", assigned_at: "2026-08-15T09:00:00" }
      ],
      origin_label: "HumanConfirmed",
      ai_confidence: 0.85,
      is_suggested: false,
      current_status: "Design",
      is_deleted: false,
      statusHistory: [
        { changed_by: "u004", changed_by_name: "ปรีชา มั่นคง", changed_at: "2026-08-16T09:00:00", old_status: "NotStarted", new_status: "Analysis", reason: null, note: null },
        { changed_by: "u004", changed_by_name: "ปรีชา มั่นคง", changed_at: "2026-08-20T09:00:00", old_status: "Analysis", new_status: "Design", reason: null, note: null }
      ]
    },
    {
      code: "SCR-106",
      name: "นำเข้าข้อมูลพนักงานจากไฟล์ Excel (ตัวอย่าง)",
      description: "กระบวนการนำเข้าข้อมูลพนักงานชุดใหญ่จากไฟล์ Excel เข้าสู่ระบบ",
      type: { type_id: "PROCESS", label: "Process" },
      assignees: [],
      origin_label: "ManualEntry",
      ai_confidence: null,
      is_suggested: false,
      current_status: "NotStarted",
      is_deleted: false,
      statusHistory: []
    }
  ]
};
