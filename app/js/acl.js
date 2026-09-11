// ─────────────────────────────────────────────────────────────
// js/acl.js — สิทธิ์การเข้าถึงตามบทบาทผู้ใช้ (client-side UI gating เท่านั้น)
// mirror ตาราง/หมายเหตุใน ACL.md (root ของ repo) 1:1 — ถ้ากฎใน ACL.md
// เปลี่ยน ให้แก้ที่ไฟล์นี้ที่เดียว ไม่ใช่ security enforcement จริง
// (firestore.rules ยังคงแค่ request.auth != null ตาม SCOPE.md)
// ─────────────────────────────────────────────────────────────

export const PAGE = {
  REGISTRY: "registry",
  DETAIL_CREATE: "detailCreate",
  ASSIGN: "assign",
  PROGRESS: "progress"
};

const ROLE_PAGE_ACCESS = {
  PM: { registry: true, detailCreate: false, assign: false, progress: false },
  BA: { registry: true, detailCreate: true, assign: true, progress: true },
  SA: { registry: true, detailCreate: true, assign: true, progress: true },
  DEV: { registry: true, detailCreate: false, assign: true, progress: true },
  IMP: { registry: true, detailCreate: false, assign: false, progress: true }
};

export function canAccessPage(role, page) {
  const entry = ROLE_PAGE_ACCESS[role];
  return !!(entry && entry[page]);
}

// เพิ่ม/แก้ไข/ลบหน้าจอ — BA/SA เท่านั้น
export function canManageRegistry(role) {
  return canAccessPage(role, PAGE.DETAIL_CREATE);
}

// มอบหมาย/ยกเลิกมอบหมายผู้รับผิดชอบ — BA/SA/DEV
export function canAssign(role) {
  return canAccessPage(role, PAGE.ASSIGN);
}

// สิทธิ์ระดับบทบาทในการบันทึกความก้าวหน้า (ยังไม่เช็คว่าเป็น assignee ของ
// หน้าจอนั้นจริงหรือไม่ — ดู canRecordProgressFor)
export function canRecordProgressRole(role) {
  return canAccessPage(role, PAGE.PROGRESS);
}

// DEV/IMP ต้องเห็น/ทำงานเฉพาะหน้าจอที่ตนถูกมอบหมายเท่านั้น (ACL.md หมายเหตุ 1)
export function isRegistryScoped(role) {
  return role === "DEV" || role === "IMP";
}

export function isAssignee(screenData, userId) {
  const assignees = (screenData && screenData.assignees) || [];
  return assignees.some(function (a) { return a.user_id === userId; });
}

// บันทึกความก้าวหน้าได้เฉพาะผู้ถูกมอบหมายจริง ไม่ว่าจะมีบทบาทใด (ACL.md หมายเหตุ 3)
export function canRecordProgressFor(role, screenData, userId) {
  return canRecordProgressRole(role) && isAssignee(screenData, userId);
}

// กรองรายการหน้าจอตามขอบเขตการมองเห็นของ role (ACL.md หมายเหตุ 1/2) —
// PM/BA/SA เห็นทั้งหมด, DEV/IMP เห็นเฉพาะที่ตนถูกมอบหมาย
export function filterScreensForRole(screens, role, userId) {
  if (!isRegistryScoped(role)) return screens;
  return screens.filter(function (s) { return isAssignee(s, userId); });
}

export function denyAccessAndRedirect() {
  window.showToast("ขออภัยคุณไม่มีสิทธิ์เข้าถึงหน้าจอนี้ เรากำลังนำท่านไปยังหน้าจอที่ท่านมีสิทธิ์เข้าถึง", "danger");
  setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
}
