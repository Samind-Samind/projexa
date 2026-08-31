// ─────────────────────────────────────────────────────────────
// js/screen-progress.js — SCR-016 บันทึกความก้าวหน้า
// อ่าน/เขียนจริงบน screens/{id} + subcollection screens/{id}/statusHistory
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const statusOrder = ["NotStarted", "Analysis", "Design"];
const statusLabel = { NotStarted: "Not Started", Analysis: "Analysis", Design: "Design" };
const statusClass = { NotStarted: "is-neutral", Analysis: "is-current", Design: "is-current" };

const params = new URLSearchParams(window.location.search);
const code = params.get("screen");

const progressScreenLabel = document.getElementById("progress-screen-label");
const currentStatusHolder = document.getElementById("current-status-value");
const updatedAtEl = document.getElementById("last-updated-value");
const historyList = document.getElementById("status-history-list");
const statusButtons = document.querySelectorAll(".status-select-btn");
const stepperSteps = document.querySelectorAll(".stepper-step");
const reasonField = document.getElementById("reason-field");
const reasonInput = document.getElementById("reason-input");
const saveBtn = document.getElementById("save-progress-btn");

let pendingStatus = null;

function toMillis(value) {
  if (!value) return 0;
  return typeof value.toDate === "function" ? value.toDate().getTime() : new Date(value).getTime();
}

function refreshStepper(statusKey) {
  const idx = statusOrder.indexOf(statusKey);
  stepperSteps.forEach(function (step) {
    const stepIdx = statusOrder.indexOf(step.getAttribute("data-status"));
    step.classList.remove("is-passed", "is-current", "is-upcoming");
    if (stepIdx < idx) step.classList.add("is-passed");
    else if (stepIdx === idx) step.classList.add("is-current");
    else step.classList.add("is-upcoming");
  });
}

function selectStatus(newStatus) {
  pendingStatus = newStatus;
  statusButtons.forEach(function (b) {
    b.classList.toggle("is-selected", b.getAttribute("data-status") === newStatus);
  });
  const currentIdx = statusOrder.indexOf(currentStatusHolder.getAttribute("data-status"));
  const newIdx = statusOrder.indexOf(newStatus);
  const isRegression = newIdx < currentIdx;
  reasonField.hidden = !isRegression;
  if (!isRegression) reasonInput.value = "";
  reasonField.classList.remove("has-error");
}

async function loadHistory() {
  const snapshot = await getDocs(collection(db, "screens", code, "statusHistory"));
  const items = [];
  snapshot.forEach(function (docSnap) { items.push(docSnap.data()); });
  items.sort(function (a, b) { return toMillis(b.changed_at) - toMillis(a.changed_at); });
  if (!items.length) {
    historyList.innerHTML = '<li class="history-item">ยังไม่มีประวัติการเปลี่ยนสถานะ</li>';
    return;
  }
  historyList.innerHTML = items.map(function (h) {
    const reasonHtml = h.reason ? '<div class="history-reason">เหตุผล: ' + esc(h.reason) + "</div>" : "";
    return '<li class="history-item"><div class="history-meta">' + esc(window.formatDateTime(h.changed_at)) +
      " — ระบบบันทึกอัตโนมัติ (changed_by: " + esc(h.changed_by_name) + ')</div><div class="history-change">' +
      esc(statusLabel[h.old_status] || h.old_status) + " → " + esc(statusLabel[h.new_status] || h.new_status) +
      "</div>" + reasonHtml + "</li>";
  }).join("");
}

async function loadScreen() {
  const snap = await getDoc(doc(db, "screens", code));
  if (!snap.exists() || snap.data().is_deleted) {
    window.showToast("ไม่พบหน้าจอนี้ — อาจถูกลบไปแล้ว กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
    return;
  }
  const data = snap.data();
  progressScreenLabel.textContent = code + " — " + data.name;
  currentStatusHolder.setAttribute("data-status", data.current_status || "NotStarted");
  currentStatusHolder.textContent = statusLabel[data.current_status] || data.current_status;
  currentStatusHolder.className = "status-chip " + (statusClass[data.current_status] || "is-neutral");
  updatedAtEl.textContent = window.formatDateTime(data.updated_at);
  refreshStepper(data.current_status || "NotStarted");
  await loadHistory();
}

(async function init() {
  if (!code) {
    window.showToast("ไม่พบรหัสหน้าจอที่จะบันทึกความก้าวหน้า", "danger");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1200);
    return;
  }
  await loadScreen();

  statusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { selectStatus(btn.getAttribute("data-status")); });
  });

  saveBtn.addEventListener("click", async function () {
    if (pendingStatus === null) {
      window.showToast("กรุณาเลือกสถานะที่จะเปลี่ยนก่อน", "danger");
      return;
    }
    const ref = doc(db, "screens", code);
    const snap = await getDoc(ref);
    if (!snap.exists() || snap.data().is_deleted) {
      window.showToast("บันทึกไม่สำเร็จ: ไม่พบหน้าจอนี้แล้ว (ถูกลบไปก่อนหน้านี้) กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
      setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
      return;
    }
    const data = snap.data();
    const currentStatus = data.current_status || "NotStarted";
    if (pendingStatus === currentStatus) {
      window.showToast("สถานะที่เลือกเหมือนกับสถานะปัจจุบันอยู่แล้ว", "danger");
      return;
    }
    const isRegression = statusOrder.indexOf(pendingStatus) < statusOrder.indexOf(currentStatus);
    if (isRegression && !reasonInput.value.trim()) {
      reasonField.classList.add("has-error");
      reasonInput.focus();
      return;
    }

    const now = new Date().toISOString();
    await addDoc(collection(db, "screens", code, "statusHistory"), {
      changed_by: window.CURRENT_USER.id,
      changed_by_name: window.CURRENT_USER.name,
      changed_at: now,
      old_status: currentStatus,
      new_status: pendingStatus,
      reason: isRegression ? reasonInput.value.trim() : null,
      note: null
    });
    await updateDoc(ref, { current_status: pendingStatus, updated_at: now });

    window.showToast("บันทึกความก้าวหน้าสำเร็จ: เปลี่ยนสถานะเป็น " + statusLabel[pendingStatus]);
    reasonInput.value = "";
    reasonField.hidden = true;
    reasonField.classList.remove("has-error");
    pendingStatus = null;
    statusButtons.forEach(function (b) { b.classList.remove("is-selected"); });
    await loadScreen();
  });
})();
