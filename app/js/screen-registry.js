// ─────────────────────────────────────────────────────────────
// js/screen-registry.js — SCR-009 ทะเบียนหน้าจอ
// อ่านจริงจาก collection "screens" บน Firestore + filter ฝั่ง client
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const STATUS_LABEL = { NotStarted: "Not Started", Analysis: "Analysis", Design: "Design" };
const STATUS_CLASS = { NotStarted: "is-neutral", Analysis: "is-current", Design: "is-current" };

function avatarInitial(name) {
  return (name || "").trim().slice(0, 2) || "?";
}

function renderAssignees(assignees) {
  if (!assignees || !assignees.length) {
    return '<span class="avatar-row"><span class="avatar-empty">— ยังไม่มอบหมาย —</span></span>';
  }
  return assignees.map(function (a) {
    return '<span class="avatar-row"><span class="avatar">' + esc(avatarInitial(a.user_name)) +
      '</span><span>' + esc(a.user_name) + ' (' + esc(a.role) + ')</span></span>';
  }).join("<br>");
}

(async function () {
  const body = document.getElementById("screen-registry-body");
  const tableWrap = document.getElementById("registry-table-wrap");
  const noResultState = document.getElementById("no-result-state");
  const registryBodyWrap = document.getElementById("registry-body-wrap");
  const collectionEmptyState = document.getElementById("collection-empty-state");
  const typeFilter = document.getElementById("filter-type");
  const statusFilter = document.getElementById("filter-status");

  let screens = [];
  try {
    const snapshot = await getDocs(collection(db, "screens"));
    snapshot.forEach(function (docSnap) {
      const data = docSnap.data();
      if (data.is_deleted) return;
      screens.push(Object.assign({}, data, { id: docSnap.id }));
    });
  } catch (err) {
    body.innerHTML = '<tr><td colspan="7" class="loading-note">อ่านข้อมูลจาก Firestore ไม่สำเร็จ: ' + esc(err.message) + "</td></tr>";
    return;
  }

  if (screens.length === 0) {
    registryBodyWrap.hidden = true;
    collectionEmptyState.hidden = false;
    return;
  }

  function renderRows() {
    const typeVal = typeFilter.value;
    const statusVal = statusFilter.value;
    const filtered = screens.filter(function (s) {
      return (!typeVal || (s.type && s.type.type_id) === typeVal) && (!statusVal || s.current_status === statusVal);
    });

    if (filtered.length === 0) {
      tableWrap.hidden = true;
      noResultState.hidden = false;
      body.innerHTML = "";
      updateSelection();
      return;
    }
    tableWrap.hidden = false;
    noResultState.hidden = true;

    body.innerHTML = filtered.map(function (s) {
      const statusKey = s.current_status || "NotStarted";
      return '<tr data-type="' + esc((s.type && s.type.type_id) || "") + '" data-status="' + esc(statusKey) + '">' +
        '<td><input type="checkbox" class="screen-row-check" value="' + esc(s.id) + '"></td>' +
        '<td style="font-family: var(--font-mono);">' + esc(s.id) + "</td>" +
        "<td>" + esc(s.name) + "</td>" +
        '<td><span class="tag">' + esc((s.type && s.type.label) || "-") + "</span></td>" +
        '<td><span class="status-chip ' + STATUS_CLASS[statusKey] + '">' + esc(STATUS_LABEL[statusKey] || statusKey) + "</span></td>" +
        "<td>" + renderAssignees(s.assignees) + "</td>" +
        '<td><a class="btn-link" href="scr-010.html?screen=' + encodeURIComponent(s.id) + '">แก้ไข</a> · ' +
        '<a class="btn-link" href="scr-016.html?screen=' + encodeURIComponent(s.id) + '">บันทึกความก้าวหน้า</a></td>' +
        "</tr>";
    }).join("");

    document.querySelectorAll(".screen-row-check").forEach(function (box) {
      box.addEventListener("change", updateSelection);
    });
    updateSelection();
  }

  const selectAllBox = document.getElementById("select-all-screens");
  const selectedCountEl = document.getElementById("selected-count-value");
  const batchAssignLink = document.getElementById("batch-assign-link");

  function updateSelection() {
    const checked = Array.from(document.querySelectorAll(".screen-row-check")).filter(function (c) { return c.checked; });
    selectedCountEl.textContent = checked.length;
    if (checked.length === 0) {
      batchAssignLink.style.pointerEvents = "none";
      batchAssignLink.style.opacity = ".45";
    } else {
      const ids = checked.map(function (c) { return c.value; }).join(",");
      batchAssignLink.href = "scr-013.html?ids=" + encodeURIComponent(ids);
      batchAssignLink.style.pointerEvents = "";
      batchAssignLink.style.opacity = "";
    }
  }

  selectAllBox.addEventListener("change", function () {
    document.querySelectorAll(".screen-row-check").forEach(function (c) { c.checked = selectAllBox.checked; });
    updateSelection();
  });

  typeFilter.addEventListener("change", renderRows);
  statusFilter.addEventListener("change", renderRows);
  document.querySelectorAll(".clear-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      typeFilter.value = "";
      statusFilter.value = "";
      renderRows();
    });
  });

  renderRows();
})();
