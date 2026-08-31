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
  setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
let currentCode = params.get("screen");

const typeSelect = document.getElementById("screen-type-select");
const nameInput = document.getElementById("screen-name-input");
const descInput = document.getElementById("screen-desc-input");
const detailHeading = document.getElementById("detail-mode-heading");
const linkAssign = document.getElementById("link-to-assign");
const linkProgress = document.getElementById("link-to-progress");
const concurrencyNote = document.getElementById("concurrency-note");

let typeLabels = {};
let originLabel = "ManualEntry";
let aiConfidence = null;
let isSuggested = false;
let loadedUpdatedAt = null;
let ignoreNextTypeChange = false;
let currentStatus = "NotStarted";

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
  const snap = await getDoc(doc(db, "screens", currentCode));
  if (!snap.exists()) {
    window.showToast("ไม่พบหน้าจอรหัส " + currentCode + " — อาจถูกลบไปแล้ว", "danger");
    detailHeading.textContent = "สร้างหน้าจอใหม่";
    return;
  }
  const data = snap.data();
  detailHeading.textContent = "แก้ไขหน้าจอ: " + currentCode;
  nameInput.value = data.name || "";
  descInput.value = data.description || "";
  typeSelect.value = (data.type && data.type.type_id) || "";
  originLabel = data.origin_label || "ManualEntry";
  aiConfidence = data.ai_confidence != null ? data.ai_confidence : null;
  isSuggested = !!data.is_suggested;
  currentStatus = data.current_status || "NotStarted";
  loadedUpdatedAt = data.updated_at || null;
  enableLink(linkAssign, "scr-013.html?ids=" + encodeURIComponent(currentCode));
  enableLink(linkProgress, "scr-016.html?screen=" + encodeURIComponent(currentCode));
}

async function reloadLatest() {
  const snap = await getDoc(doc(db, "screens", currentCode));
  if (!snap.exists()) {
    window.showToast("หน้าจอนี้ถูกลบไปแล้ว กำลังพากลับไปหน้าทะเบียนหน้าจอ...", "danger");
    setTimeout(function () { window.location.href = "scr-009.html"; }, 1500);
    return;
  }
  await loadExisting();
  concurrencyNote.hidden = true;
  window.showToast("โหลดข้อมูลล่าสุดแล้ว");
}

function nextScreenCode(existingCodes) {
  let max = 100;
  existingCodes.forEach(function (code) {
    const m = /^SCR-1(\d\d)$/.exec(code);
    if (m) max = Math.max(max, parseInt(m[1], 10) + 100);
  });
  return "SCR-" + (max + 1);
}

(async function init() {
  await loadScreenTypes();
  if (currentCode) {
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

  document.getElementById("save-screen-btn").addEventListener("click", async function () {
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

    const wasEditing = !!currentCode;
    let code = currentCode;
    let existingSnapshot = null;

    if (code) {
      existingSnapshot = await getDoc(doc(db, "screens", code));
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
      const snapshot = await getDocs(collection(db, "screens"));
      const codes = [];
      snapshot.forEach(function (d) { codes.push(d.id); });
      code = nextScreenCode(codes);
    }

    const docData = {
      code: code,
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

    await setDoc(doc(db, "screens", code), docData);
    currentCode = code;
    loadedUpdatedAt = docData.updated_at;
    concurrencyNote.hidden = true;
    enableLink(linkAssign, "scr-013.html?ids=" + encodeURIComponent(code));
    enableLink(linkProgress, "scr-016.html?screen=" + encodeURIComponent(code));
    if (!wasEditing) {
      window.history.replaceState(null, "", "scr-010.html?screen=" + encodeURIComponent(code));
      detailHeading.textContent = "แก้ไขหน้าจอ: " + code;
    }
    window.showToast("บันทึกข้อมูลหน้าจอสำเร็จ (" + code + ")");
  });
})();
