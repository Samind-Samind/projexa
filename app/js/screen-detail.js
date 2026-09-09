// ─────────────────────────────────────────────────────────────
// js/screen-detail.js — SCR-010 รายละเอียดหน้าจอ (สร้างใหม่/แก้ไข + AI แนะนำประเภท)
// อ่าน/เขียนจริงบน collection "screens" + อ่านรายการประเภทจาก "screenTypes"
// ─────────────────────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
let currentId = params.get("screen");

const typeSelect = document.getElementById("screen-type-select");
const codeInput = document.getElementById("screen-code-input");
const nameInput = document.getElementById("screen-name-input");
const descInput = document.getElementById("screen-desc-input");
const detailHeading = document.getElementById("detail-mode-heading");
const linkAssign = document.getElementById("link-to-assign");
const linkProgress = document.getElementById("link-to-progress");
const concurrencyNote = document.getElementById("concurrency-note");
const deleteBtn = document.getElementById("delete-screen-btn");
const deleteModalOverlay = document.getElementById("delete-modal-overlay");
const deleteModalMessage = document.getElementById("delete-modal-message");

let typeLabels = {};
let originLabel = "ManualEntry";
let aiConfidence = null;
let isSuggested = false;
let loadedUpdatedAt = null;
let ignoreNextTypeChange = false;
let currentStatus = "NotStarted";
let currentAssignees = [];

async function loadScreenTypes() {
  const snapshot = await getDocs(collection(db, "screenTypes"));
  const options = ['<option value="">- เลือกประเภท -</option>'];
  snapshot.forEach(function (docSnap) {
    const t = docSnap.data();
    if (t.is_active === false) return;
    typeLabels[docSnap.id] = t.label;
    options.push('<option value="' + esc(docSnap.id) + '">' + esc(t.label) + "</option>");
  });
  typeSelect.innerHTML = options.join("");
}

function enableLink(link, href) {
  link.href = href;
  link.style.pointerEvents = "";
  link.style.opacity = "";
}

async function loadExisting() {
  const snap = await getDoc(doc(db, "screens", currentId));
  if (!snap.exists()) {
    window.showToast("ไม่พบหน้าจอนี้ — อาจถูกลบไปแล้ว", "danger");
    detailHeading.textContent = "สร้างหน้าจอใหม่";
    currentId = null;
    return;
  }
  const data = snap.data();
  detailHeading.textContent = "แก้ไขหน้าจอ: " + (data.code || currentId);
  codeInput.value = data.code || "";
  nameInput.value = data.name || "";
  descInput.value = data.description || "";
  typeSelect.value = (data.type && data.type.type_id) || "";
  originLabel = data.origin_label || "ManualEntry";
  aiConfidence = data.ai_confidence != null ? data.ai_confidence : null;
  isSuggested = !!data.is_suggested;
  currentStatus = data.current_status || "NotStarted";
  currentAssignees = data.assignees || [];
  loadedUpdatedAt = data.updated_at || null;
  enableLink(linkAssign, "scr-013?ids=" + encodeURIComponent(currentId));
  enableLink(linkProgress, "scr-016?screen=" + encodeURIComponent(currentId));
  deleteBtn.hidden = false;
}

async function reloadLatest() {
  const snap = await getDoc(doc(db, "screens", currentId));
  if (!snap.exists()) {
    window.showToast("หน้าจอนี้ถูกลบไปแล้ว กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
    return;
  }
  await loadExisting();
  concurrencyNote.hidden = true;
  window.showToast("โหลดข้อมูลล่าสุดแล้ว");
}

async function isCodeTaken(codeValue, excludeId) {
  const snapshot = await getDocs(query(collection(db, "screens"), where("code", "==", codeValue)));
  let taken = false;
  snapshot.forEach(function (docSnap) {
    if (docSnap.id !== excludeId) taken = true;
  });
  return taken;
}

(async function init() {
  await loadScreenTypes();
  if (currentId) {
    await loadExisting();
  }

  const aiSuggestBtn = document.getElementById("ai-suggest-btn");
  const aiWaiting = document.getElementById("ai-waiting");
  const aiBlock = document.getElementById("ai-type-block");
  const aiTimeoutMsg = document.getElementById("ai-timeout-msg");
  const aiTimeoutLink = document.getElementById("ai-simulate-timeout");
  let aiTimer = null;

  function runAISuggest(forceTimeout) {
    aiBlock.hidden = true;
    aiTimeoutMsg.hidden = true;
    aiWaiting.hidden = false;
    if (aiTimer) clearTimeout(aiTimer);
    aiTimer = setTimeout(function () {
      aiWaiting.hidden = true;
      if (forceTimeout) {
        aiTimeoutMsg.hidden = false;
      } else {
        aiBlock.hidden = false;
        aiBlock.classList.remove("is-confirmed");
        const suggestedValue = aiBlock.getAttribute("data-suggested-value");
        document.getElementById("ai-suggested-label").textContent = typeLabels[suggestedValue] || suggestedValue;
      }
    }, 1200);
  }
  aiSuggestBtn.addEventListener("click", function () { runAISuggest(false); });
  aiTimeoutLink.addEventListener("click", function (e) { e.preventDefault(); runAISuggest(true); });
  document.getElementById("ai-dismiss-btn").addEventListener("click", function () { aiBlock.hidden = true; });
  document.getElementById("ai-confirm-btn").addEventListener("click", function () {
    const suggestedValue = aiBlock.getAttribute("data-suggested-value");
    const suggestedConfidence = parseFloat(aiBlock.getAttribute("data-suggested-confidence"));
    ignoreNextTypeChange = true;
    typeSelect.value = suggestedValue;
    originLabel = "AIGenerated";
    aiConfidence = suggestedConfidence;
    isSuggested = false;
    aiBlock.classList.add("is-confirmed");
  });

  typeSelect.addEventListener("change", function () {
    if (ignoreNextTypeChange) { ignoreNextTypeChange = false; return; }
    originLabel = "ManualEntry";
    aiConfidence = null;
    isSuggested = false;
  });

  document.getElementById("reload-latest-btn").addEventListener("click", reloadLatest);

  deleteBtn.addEventListener("click", function () {
    if (currentAssignees.length > 0) {
      window.showToast("ไม่สามารถลบหน้าจอนี้ได้ เนื่องจากมีผู้รับผิดชอบมอบหมายอยู่แล้ว (" + currentAssignees.length + " คน) กรุณายกเลิกการมอบหมายก่อน", "danger");
      return;
    }
    deleteModalMessage.textContent = "ต้องการลบหน้าจอ " + (codeInput.value.trim() || currentId) + " — " + nameInput.value.trim() + " ใช่หรือไม่? การลบนี้จะซ่อนหน้าจอนี้ออกจากทะเบียน";
    deleteModalOverlay.hidden = false;
  });

  function closeDeleteModal() {
    deleteModalOverlay.hidden = true;
  }
  document.getElementById("delete-cancel-btn").addEventListener("click", closeDeleteModal);
  deleteModalOverlay.addEventListener("click", function (e) {
    if (e.target === deleteModalOverlay) closeDeleteModal();
  });

  document.getElementById("delete-confirm-btn").addEventListener("click", async function () {
    const docRef = doc(db, "screens", currentId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      closeDeleteModal();
      window.showToast("หน้าจอนี้ถูกลบไปแล้ว กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
      setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
      return;
    }
    const latestAssignees = snap.data().assignees || [];
    if (latestAssignees.length > 0) {
      currentAssignees = latestAssignees;
      closeDeleteModal();
      window.showToast("ลบไม่สำเร็จ: หน้าจอนี้ถูกมอบหมายผู้รับผิดชอบไปแล้ว (" + latestAssignees.length + " คน) กรุณายกเลิกการมอบหมายก่อน", "danger");
      return;
    }
    await updateDoc(docRef, { is_deleted: true, updated_at: new Date().toISOString() });
    closeDeleteModal();
    window.showToast("ลบหน้าจอสำเร็จ");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1200);
  });

  document.getElementById("save-screen-btn").addEventListener("click", async function () {
    const codeFieldWrap = document.getElementById("code-field");
    const enteredCode = codeInput.value.trim();
    if (!enteredCode) {
      codeFieldWrap.classList.add("has-error");
      codeInput.focus();
      return;
    }
    codeFieldWrap.classList.remove("has-error");

    const nameFieldWrap = document.getElementById("name-field");
    if (!nameInput.value.trim()) {
      nameFieldWrap.classList.add("has-error");
      nameInput.focus();
      return;
    }
    nameFieldWrap.classList.remove("has-error");
    if (!typeSelect.value) {
      window.showToast("กรุณาเลือกประเภทหน้าจอก่อนบันทึก", "danger");
      return;
    }

    const wasEditing = !!currentId;
    let existingSnapshot = null;
    let docRef;

    if (wasEditing) {
      docRef = doc(db, "screens", currentId);
      existingSnapshot = await getDoc(docRef);
      if (!existingSnapshot.exists()) {
        window.showToast("บันทึกไม่สำเร็จ: หน้าจอนี้ถูกลบไปแล้ว กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
        setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
        return;
      }
      const latestUpdatedAt = existingSnapshot.data().updated_at || null;
      if (loadedUpdatedAt && latestUpdatedAt !== loadedUpdatedAt) {
        concurrencyNote.hidden = false;
        window.showToast("บันทึกไม่สำเร็จ: เอกสารนี้ถูกแก้ไขโดยผู้ใช้อื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนบันทึกซ้ำ", "danger");
        return;
      }
    } else {
      docRef = doc(collection(db, "screens"));
    }

    if (await isCodeTaken(enteredCode, wasEditing ? currentId : null)) {
      codeFieldWrap.classList.add("has-error");
      window.showToast("บันทึกไม่สำเร็จ: มีรหัสหน้าจอ " + enteredCode + " อยู่ในระบบแล้ว กรุณาใช้รหัสอื่น", "danger");
      codeInput.focus();
      return;
    }

    const docData = {
      screens_id: docRef.id,
      code: enteredCode,
      name: nameInput.value.trim(),
      description: descInput.value.trim(),
      type: { type_id: typeSelect.value, label: typeLabels[typeSelect.value] || "" },
      origin_label: originLabel,
      ai_confidence: aiConfidence,
      is_suggested: isSuggested,
      current_status: currentStatus,
      is_deleted: false,
      updated_at: new Date().toISOString()
    };
    docData.assignees = wasEditing ? (existingSnapshot.data().assignees || []) : [];

    await setDoc(docRef, docData);
    currentId = docRef.id;
    loadedUpdatedAt = docData.updated_at;
    concurrencyNote.hidden = true;
    enableLink(linkAssign, "scr-013?ids=" + encodeURIComponent(currentId));
    enableLink(linkProgress, "scr-016?screen=" + encodeURIComponent(currentId));
    if (!wasEditing) {
      window.history.replaceState(null, "", "scr-010?screen=" + encodeURIComponent(currentId));
    }
    detailHeading.textContent = "แก้ไขหน้าจอ: " + enteredCode;
    window.showToast("บันทึกข้อมูลหน้าจอสำเร็จ (" + enteredCode + ")");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1200);
  });
})();
