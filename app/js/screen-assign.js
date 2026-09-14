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
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { canAssign, filterScreensForRole, denyAccessAndRedirect } from "./acl.js";

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
    const reasonAttr = a.ai_reason ? ' title="AI แนะนำ: ' + esc(a.ai_reason) + '"' : "";
    return '<div class="avatar-row"><span class="avatar">' + esc(avatarInitial(a.user_name)) +
      '</span><span class="assignee-name"' + reasonAttr + '>' + esc(a.user_name) + " (" + esc(a.role) + ")" +
      (a.ai_reason ? " ⓘ" : "") + "</span></div>";
  }).join("");
}

let openRouterConfig = null;

async function loadOpenRouterConfig() {
  try {
    const mod = await import("./openrouter-config.js");
    if (mod.OPENROUTER_CONFIG && mod.OPENROUTER_CONFIG.apiKey && mod.OPENROUTER_CONFIG.apiKey !== "YOUR_OPENROUTER_API_KEY") {
      openRouterConfig = mod.OPENROUTER_CONFIG;
    }
  } catch (e) {
    openRouterConfig = null;
  }
}

const VALID_ASSIGN_ROLES = ["SA", "BA", "Dev", "Tester"];

async function fetchScreenHistory(screenId, cache) {
  if (cache[screenId]) return cache[screenId];
  const snapshot = await getDocs(collection(db, "screens", screenId, "statusHistory"));
  const items = [];
  snapshot.forEach(function (d) { items.push(d.data()); });
  cache[screenId] = items;
  return items;
}

async function buildCandidateSummaries(screens, users) {
  const cache = {};
  const candidates = [];
  for (const u of users) {
    if (u.is_active === false) continue;
    const uid = u.id;
    const assigned = screens.filter(function (s) {
      return (s.assignees || []).some(function (a) { return a.user_id === uid; });
    });
    const openCount = assigned.filter(function (s) { return s.current_status !== "Design"; }).length;
    const assignmentLines = assigned.slice(0, 8).map(function (s) {
      const roleEntry = (s.assignees || []).find(function (a) { return a.user_id === uid; });
      return (s.code || s.id) + " (" + ((s.type && s.type.label) || "-") + ", " + (s.current_status || "NotStarted") + ", บทบาท " + ((roleEntry && roleEntry.role) || "-") + ")";
    });
    const noteLines = [];
    for (const s of assigned) {
      const hist = await fetchScreenHistory(s.id, cache);
      hist.filter(function (h) { return h.changed_by === uid; }).forEach(function (h) {
        noteLines.push((s.code || s.id) + ": " + (h.old_status || "?") + "→" + (h.new_status || "?") + (h.note ? " (" + h.note + ")" : ""));
      });
    }
    candidates.push({
      id: uid,
      name: u.name,
      openCount: openCount,
      assignedCount: assigned.length,
      assignmentLines: assignmentLines,
      noteLines: noteLines.slice(0, 8)
    });
  }
  return candidates;
}

function buildAssigneePrompt(targetScreen, candidates) {
  const systemPrompt =
    "คุณเป็นผู้ช่วยแนะนำผู้รับผิดชอบหน้าจอซอฟต์แวร์ ตอบกลับเป็น JSON เท่านั้น รูปแบบ " +
    '{"user_id": "...", "role": "SA|BA|Dev|Tester", "confidence": 0.0, "reason": "..."} โดย user_id ต้องเป็นค่าใดค่าหนึ่งจากรายชื่อที่ให้มาเท่านั้น ' +
    "role ต้องเป็นหนึ่งใน SA, BA, Dev, Tester เท่านั้น reason ให้เขียนสั้นๆ ไม่เกิน 2 ประโยคเป็นภาษาไทย อธิบายว่าทำไมเหมาะกับหน้าจอนี้ โดยอ้างอิงประสบการณ์/ภาระงานที่ให้มา ห้ามมีข้อความอื่นนอกเหนือจาก JSON";

  const lines = [];
  lines.push("หน้าจอที่ต้องมอบหมาย:");
  lines.push("ชื่อ: " + targetScreen.name);
  lines.push("คำอธิบาย: " + (targetScreen.description || "-"));
  lines.push("ประเภท: " + ((targetScreen.type && targetScreen.type.label) || "-"));
  lines.push("");
  lines.push("รายชื่อผู้ใช้ที่เลือกได้ (เลือกได้เฉพาะ user_id เหล่านี้เท่านั้น):");
  candidates.forEach(function (c) {
    lines.push("- user_id: " + c.id + ", ชื่อ: " + c.name + ", งานที่ยังไม่เสร็จตอนนี้: " + c.openCount + " หน้าจอ, เคยได้รับมอบหมายทั้งหมด: " + c.assignedCount + " หน้าจอ");
    if (c.assignmentLines.length) lines.push("  ประวัติหน้าจอที่เคยทำ: " + c.assignmentLines.join("; "));
    if (c.noteLines.length) lines.push("  บันทึกความก้าวหน้าที่เคยเขียน: " + c.noteLines.join("; "));
  });

  return { systemPrompt: systemPrompt, userPrompt: lines.join("\n") };
}

async function callOpenRouterChat(systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 15000);
  let res;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + openRouterConfig.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: openRouterConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error("OpenRouter request failed: " + res.status);
  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error("Empty AI response");
  return content;
}

function parseJSONLoose(content) {
  try {
    return JSON.parse(content.trim());
  } catch (e) {
    // non-greedy: จับ JSON object แรกที่ปิดสมบูรณ์เท่านั้น กัน AI พ่นข้อความ
    // ต่อท้าย JSON แล้ว regex แบบ greedy เผลอกิน { } ที่ไม่เกี่ยวข้องเข้ามาด้วย
    const match = content.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("AI response is not valid JSON");
    return JSON.parse(match[0]);
  }
}

async function fetchAssigneeSuggestion(prompt, candidates) {
  const raw = await callOpenRouterChat(prompt.systemPrompt, prompt.userPrompt);
  try {
    const parsed = parseJSONLoose(raw);

    const candidate = candidates.find(function (c) { return c.id === parsed.user_id; });
    if (!candidate) throw new Error("AI suggested an unknown user_id");
    if (VALID_ASSIGN_ROLES.indexOf(parsed.role) === -1) throw new Error("AI suggested an unknown role");
    let confidence = parseFloat(parsed.confidence);
    if (isNaN(confidence)) confidence = 0;
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      userId: candidate.id,
      userName: candidate.name,
      role: parsed.role,
      confidence: confidence,
      reason: String(parsed.reason || "").trim(),
      raw: raw,
      parsed: parsed
    };
  } catch (e) {
    e.raw = raw;
    throw e;
  }
}

async function logAICall(screenId, entry) {
  if (!screenId) return;
  try {
    await addDoc(collection(db, "screens", screenId, "aiLog"), entry);
  } catch (e) { /* ไม่ critical — ไม่บล็อก UX ถ้าบันทึก log ไม่สำเร็จ */ }
}

(async function () {
  const body = document.getElementById("assign-screen-body");
  const selectedCountEl = document.getElementById("assign-selected-count");
  const userSelect = document.getElementById("assign-user-select");

  await window.AUTH_READY;
  const role = window.CURRENT_USER.role;
  const userId = window.CURRENT_USER.id;

  if (!canAssign(role)) {
    denyAccessAndRedirect();
    return;
  }

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

  // ขอบเขตการมองเห็น/มอบหมายตาม role (DEV เห็น/เลือกได้เฉพาะหน้าจอที่ตนเอง
  // ถูกมอบหมายอยู่แล้ว — ACL.md หมายเหตุ 2)
  screens = filterScreensForRole(screens, role, userId);

  // เรียงหน้าจอที่บันทึกสร้างล่าสุดไว้เป็นรายการแรกเสมอ (หน้าจอเก่าที่ยังไม่มี
  // created_at จะถูกจัดไว้ท้ายรายการ) — เหมือนกับ SCR-009
  screens.sort(function (a, b) {
    const ad = a.created_at || "";
    const bd = b.created_at || "";
    if (ad === bd) return 0;
    return ad < bd ? 1 : -1;
  });

  const screenById = {};
  screens.forEach(function (s) { screenById[s.id] = s; });

  body.innerHTML = screens.map(function (s) {
    const checked = preselected.indexOf(s.id) !== -1 ? " checked" : "";
    return '<tr data-id="' + esc(s.id) + '">' +
      '<td><input type="checkbox" class="assign-row-check" value="' + esc(s.id) + '"' + checked + "></td>" +
      '<td style="font-family: var(--font-mono);">' + esc(s.code || s.id) + "</td>" +
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

  let usersList = [];
  try {
    const userSnapshot = await getDocs(collection(db, "users"));
    const options = [];
    userSnapshot.forEach(function (docSnap) {
      const u = docSnap.data();
      usersList.push(Object.assign({}, u, { id: docSnap.id }));
      if (u.is_active === false) return;
      options.push('<option data-initial="' + esc(avatarInitial(u.name)) + '" value="' + esc(docSnap.id) + '">' + esc(u.name) + "</option>");
    });
    userSelect.innerHTML = options.join("") || '<option value="">ไม่มีผู้ใช้ในระบบ</option>';
  } catch (err) {
    userSelect.innerHTML = '<option value="">โหลดรายชื่อผู้ใช้ไม่สำเร็จ</option>';
  }

  await loadOpenRouterConfig();

  const roleSelectEl = document.getElementById("assign-role-select");
  const aiSuggestBtn = document.getElementById("ai-suggest-assignee-btn");
  const aiWaiting = document.getElementById("ai-assignee-waiting");
  const aiBlock = document.getElementById("ai-assignee-block");
  const aiTimeoutMsg = document.getElementById("ai-assignee-timeout-msg");
  let appliedAISuggestion = null;
  let ignoreNextUserOrRoleChange = false;

  function clearAppliedSuggestion() {
    appliedAISuggestion = null;
    aiBlock.hidden = true;
    aiTimeoutMsg.hidden = true;
  }

  document.querySelectorAll(".assign-row-check").forEach(function (box) {
    box.addEventListener("change", clearAppliedSuggestion);
  });
  userSelect.addEventListener("change", function () {
    if (ignoreNextUserOrRoleChange) return;
    appliedAISuggestion = null;
  });
  roleSelectEl.addEventListener("change", function () {
    if (ignoreNextUserOrRoleChange) return;
    appliedAISuggestion = null;
  });

  aiSuggestBtn.addEventListener("click", async function () {
    if (!openRouterConfig) {
      window.showToast("ฟีเจอร์นี้ใช้ได้เฉพาะตอนรันบนเครื่อง (local dev) เท่านั้น", "danger");
      return;
    }
    const checkedBoxes = Array.from(document.querySelectorAll(".assign-row-check:checked"));
    if (checkedBoxes.length !== 1) {
      window.showToast("กรุณาเลือกหน้าจอทางซ้ายให้พอดี 1 หน้าจอก่อนให้ AI ช่วยแนะนำ", "danger");
      return;
    }
    const targetScreen = screenById[checkedBoxes[0].value];

    aiBlock.hidden = true;
    aiTimeoutMsg.hidden = true;
    aiWaiting.hidden = false;

    let candidates;
    try {
      candidates = await buildCandidateSummaries(screens, usersList);
    } catch (e) {
      aiWaiting.hidden = true;
      aiTimeoutMsg.hidden = false;
      return;
    }

    const prompt = buildAssigneePrompt(targetScreen, candidates);
    const logEntry = {
      source: "assignee",
      input: prompt,
      output: null,
      error: null,
      created_by: window.CURRENT_USER.id,
      created_by_name: window.CURRENT_USER.name,
      createdAt: new Date().toISOString()
    };

    try {
      const suggestion = await fetchAssigneeSuggestion(prompt, candidates);
      logEntry.output = { raw: suggestion.raw, parsed: suggestion.parsed };

      aiWaiting.hidden = true;
      aiBlock.hidden = false;
      document.getElementById("ai-assignee-suggested-name").textContent = suggestion.userName;
      document.getElementById("ai-assignee-suggested-role").textContent = suggestion.role;
      document.getElementById("ai-assignee-suggested-confidence").textContent = Math.round(suggestion.confidence * 100) + "%";
      document.getElementById("ai-assignee-suggested-reason").textContent = suggestion.reason || "-";
      appliedAISuggestion = { screenId: targetScreen.id, userId: suggestion.userId, role: suggestion.role, confidence: suggestion.confidence, reason: suggestion.reason, applied: false };

      const summary = "AI แนะนำผู้รับผิดชอบ: " + suggestion.userName + " เป็น " + suggestion.role +
        (suggestion.reason ? " — " + suggestion.reason : "");
      try {
        await updateDoc(doc(db, "screens", targetScreen.id), {
          aiSuggestion: {
            summary: summary,
            source: "assignee",
            confidence: suggestion.confidence,
            createdAt: logEntry.createdAt
          }
        });
      } catch (e) { /* ไม่ critical — ไม่บล็อก UX การแนะนำถ้าบันทึก aiSuggestion ไม่สำเร็จ */ }
    } catch (e) {
      logEntry.error = String((e && e.message) || e);
      if (e && e.raw) logEntry.output = { raw: e.raw, parsed: null };
      aiWaiting.hidden = true;
      aiTimeoutMsg.hidden = false;
    }

    await logAICall(targetScreen.id, logEntry);
  });

  document.getElementById("ai-assignee-dismiss-btn").addEventListener("click", clearAppliedSuggestion);

  document.getElementById("ai-assignee-apply-btn").addEventListener("click", function () {
    if (!appliedAISuggestion) return;
    ignoreNextUserOrRoleChange = true;
    userSelect.value = appliedAISuggestion.userId;
    roleSelectEl.value = appliedAISuggestion.role;
    ignoreNextUserOrRoleChange = false;
    appliedAISuggestion.applied = true;
  });

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
      const id = box.value;
      const codeLabel = (screenById[id] && screenById[id].code) || id;
      const ref = doc(db, "screens", id);
      const snap = await getDoc(ref);
      if (!snap.exists() || snap.data().is_deleted) {
        results.push({ code: codeLabel, ok: false, note: "หน้าจอนี้ถูกลบไปแล้วก่อนบันทึกเสร็จ — ข้ามรายการนี้" });
        continue;
      }
      const currentAssignees = snap.data().assignees || [];
      const idx = currentAssignees.findIndex(function (a) { return a.role === role; });
      const fromAI = appliedAISuggestion && appliedAISuggestion.applied &&
        appliedAISuggestion.screenId === id && appliedAISuggestion.userId === userId && appliedAISuggestion.role === role;
      const entry = {
        user_id: userId,
        user_name: userLabel,
        role: role,
        assigned_by: window.CURRENT_USER.id,
        assigned_at: now,
        origin_label: fromAI ? "AIGenerated" : "ManualEntry",
        ai_confidence: fromAI ? appliedAISuggestion.confidence : null,
        ai_reason: fromAI ? appliedAISuggestion.reason : null
      };
      if (idx !== -1) currentAssignees[idx] = entry;
      else currentAssignees.push(entry);
      await updateDoc(ref, { assignees: currentAssignees, updated_at: now });
      successCount++;
      results.push({ code: codeLabel, ok: true, note: "มอบหมาย " + userLabel + " เป็น " + role + " สำเร็จ" });

      const row = document.querySelector('tr[data-id="' + CSS.escape(id) + '"] .assignee-cell');
      if (row) row.innerHTML = renderAssigneesCell(currentAssignees);
    }

    resultList.innerHTML = results.map(function (r) {
      return '<li class="result-item ' + (r.ok ? "is-success" : "is-failed") + '"><span class="dot"></span><span>' +
        esc(r.code) + " — " + esc(r.note) + "</span></li>";
    }).join("");
    resultEmptyNote.hidden = results.length > 0;
    window.showToast("มอบหมายแล้ว " + successCount + " หน้าจอ (จากทั้งหมด " + checkedBoxes.length + " รายการที่เลือก)");
    clearAppliedSuggestion();
  });

  const unassignModalOverlay = document.getElementById("unassign-modal-overlay");
  const unassignModalMessage = document.getElementById("unassign-modal-message");

  function closeUnassignModal() {
    unassignModalOverlay.hidden = true;
  }
  document.getElementById("unassign-cancel-btn").addEventListener("click", closeUnassignModal);
  unassignModalOverlay.addEventListener("click", function (e) {
    if (e.target === unassignModalOverlay) closeUnassignModal();
  });

  document.getElementById("unassign-btn").addEventListener("click", function () {
    const checkedBoxes = Array.from(document.querySelectorAll(".assign-row-check:checked"));
    if (!checkedBoxes.length) {
      window.showToast("กรุณาเลือกอย่างน้อย 1 หน้าจอ", "danger");
      return;
    }
    const role = document.getElementById("assign-role-select").value;
    unassignModalMessage.textContent = "ต้องการยกเลิกมอบหมายบทบาท " + role + " ออกจาก " + checkedBoxes.length + " หน้าจอที่เลือกใช่หรือไม่?";
    unassignModalOverlay.hidden = false;
  });

  document.getElementById("unassign-confirm-btn").addEventListener("click", async function () {
    const checkedBoxes = Array.from(document.querySelectorAll(".assign-row-check:checked"));
    const role = document.getElementById("assign-role-select").value;
    const resultList = document.getElementById("assign-result-list");
    const resultEmptyNote = document.getElementById("assign-result-empty");
    const now = new Date().toISOString();

    closeUnassignModal();

    let successCount = 0;
    const results = [];
    for (const box of checkedBoxes) {
      const id = box.value;
      const codeLabel = (screenById[id] && screenById[id].code) || id;
      const ref = doc(db, "screens", id);
      const snap = await getDoc(ref);
      if (!snap.exists() || snap.data().is_deleted) {
        results.push({ status: "is-failed", code: codeLabel, note: "หน้าจอนี้ถูกลบไปแล้ว — ข้ามรายการนี้" });
        continue;
      }
      const currentAssignees = snap.data().assignees || [];
      const remaining = currentAssignees.filter(function (a) { return a.role !== role; });
      if (remaining.length === currentAssignees.length) {
        results.push({ status: "is-neutral", code: codeLabel, note: "ไม่มีผู้รับผิดชอบบทบาท " + role + " อยู่ก่อนแล้ว" });
        continue;
      }
      await updateDoc(ref, { assignees: remaining, updated_at: now });
      successCount++;
      results.push({ status: "is-success", code: codeLabel, note: "ยกเลิกมอบหมายบทบาท " + role + " สำเร็จ" });

      const row = document.querySelector('tr[data-id="' + CSS.escape(id) + '"] .assignee-cell');
      if (row) row.innerHTML = renderAssigneesCell(remaining);
    }

    resultList.innerHTML = results.map(function (r) {
      return '<li class="result-item ' + r.status + '"><span class="dot"></span><span>' +
        esc(r.code) + " — " + esc(r.note) + "</span></li>";
    }).join("");
    resultEmptyNote.hidden = results.length > 0;
    window.showToast("ยกเลิกมอบหมายสำเร็จ " + successCount + " หน้าจอ (จากทั้งหมด " + checkedBoxes.length + " รายการที่เลือก)");
  });
})();
