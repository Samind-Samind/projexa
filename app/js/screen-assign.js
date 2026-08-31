// ─────────────────────────────────────────────────────────────
// js/screen-assign.js — SCR-013 มอบหมายผู้รับผิดชอบ (batch)
// เขียนเข้า field "assignees[]" แบบ embedded ในเอกสาร screens/{id} โดยตรง
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const idsParam = params.get("ids");
const preselected = idsParam ? idsParam.split(",").map(function (s) { return s.trim(); }) : [];

function avatarInitial(name) {
  return (name || "").trim().slice(0, 2) || "?";
}

function renderAssigneesCell(assignees) {
  if (!assignees || !assignees.length) {
    return '<span class="avatar-empty">— ยังไม่มอบหมาย —</span>';
  }
  return assignees.map(function (a) {
    return '<div class="avatar-row"><span class="avatar">' + esc(avatarInitial(a.user_name)) +
      '</span><span class="assignee-name">' + esc(a.user_name) + " (" + esc(a.role) + ")</span></div>";
  }).join("");
}

(async function () {
  const body = document.getElementById("assign-screen-body");
  const selectedCountEl = document.getElementById("assign-selected-count");
  const userSelect = document.getElementById("assign-user-select");

  let screens = [];
  try {
    const snapshot = await getDocs(collection(db, "screens"));
    snapshot.forEach(function (docSnap) {
      const data = docSnap.data();
      if (data.is_deleted) return;
      screens.push(Object.assign({}, data, { id: docSnap.id }));
    });
  } catch (err) {
    body.innerHTML = '<tr><td colspan="4" class="loading-note">อ่านข้อมูลจาก Firestore ไม่สำเร็จ: ' + esc(err.message) + "</td></tr>";
    return;
  }

  body.innerHTML = screens.map(function (s) {
    const checked = preselected.indexOf(s.id) !== -1 ? " checked" : "";
    return '<tr data-code="' + esc(s.id) + '">' +
      '<td><input type="checkbox" class="assign-row-check" value="' + esc(s.id) + '"' + checked + "></td>" +
      '<td style="font-family: var(--font-mono);">' + esc(s.id) + "</td>" +
      "<td>" + esc(s.name) + "</td>" +
      '<td class="assignee-cell">' + renderAssigneesCell(s.assignees) + "</td>" +
      "</tr>";
  }).join("");

  function updateSelection() {
    selectedCountEl.textContent = document.querySelectorAll(".assign-row-check:checked").length;
  }
  document.querySelectorAll(".assign-row-check").forEach(function (box) {
    box.addEventListener("change", updateSelection);
  });
  updateSelection();

  try {
    const userSnapshot = await getDocs(collection(db, "users"));
    const options = [];
    userSnapshot.forEach(function (docSnap) {
      const u = docSnap.data();
      if (u.is_active === false) return;
      options.push('<option data-initial="' + esc(avatarInitial(u.name)) + '" value="' + esc(docSnap.id) + '">' + esc(u.name) + "</option>");
    });
    userSelect.innerHTML = options.join("") || '<option value="">ไม่มีผู้ใช้ในระบบ</option>';
  } catch (err) {
    userSelect.innerHTML = '<option value="">โหลดรายชื่อผู้ใช้ไม่สำเร็จ</option>';
  }

  document.getElementById("assign-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const checkedBoxes = Array.from(document.querySelectorAll(".assign-row-check:checked"));
    const roleSelect = document.getElementById("assign-role-select");
    const resultList = document.getElementById("assign-result-list");
    const resultEmptyNote = document.getElementById("assign-result-empty");

    if (!checkedBoxes.length || !userSelect.value) {
      window.showToast("กรุณาเลือกอย่างน้อย 1 หน้าจอ และเลือกผู้รับผิดชอบ", "danger");
      return;
    }
    const userId = userSelect.value;
    const userLabel = userSelect.options[userSelect.selectedIndex].text;
    const role = roleSelect.value;
    const now = new Date().toISOString();

    let successCount = 0;
    const results = [];
    for (const box of checkedBoxes) {
      const code = box.value;
      const ref = doc(db, "screens", code);
      const snap = await getDoc(ref);
      if (!snap.exists() || snap.data().is_deleted) {
        results.push({ code: code, ok: false, note: "หน้าจอนี้ถูกลบไปแล้วก่อนบันทึกเสร็จ — ข้ามรายการนี้" });
        continue;
      }
      const currentAssignees = snap.data().assignees || [];
      const idx = currentAssignees.findIndex(function (a) { return a.role === role; });
      const entry = { user_id: userId, user_name: userLabel, role: role, assigned_by: window.CURRENT_USER.id, assigned_at: now };
      if (idx !== -1) currentAssignees[idx] = entry;
      else currentAssignees.push(entry);
      await updateDoc(ref, { assignees: currentAssignees, updated_at: now });
      successCount++;
      results.push({ code: code, ok: true, note: "มอบหมาย " + userLabel + " เป็น " + role + " สำเร็จ" });

      const row = document.querySelector('tr[data-code="' + CSS.escape(code) + '"] .assignee-cell');
      if (row) row.innerHTML = renderAssigneesCell(currentAssignees);
    }

    resultList.innerHTML = results.map(function (r) {
      return '<li class="result-item ' + (r.ok ? "is-success" : "is-failed") + '"><span class="dot"></span><span>' +
        esc(r.code) + " — " + esc(r.note) + "</span></li>";
    }).join("");
    resultEmptyNote.hidden = results.length > 0;
    window.showToast("มอบหมายแล้ว " + successCount + " หน้าจอ (จากทั้งหมด " + checkedBoxes.length + " รายการที่เลือก)");
  });
})();
