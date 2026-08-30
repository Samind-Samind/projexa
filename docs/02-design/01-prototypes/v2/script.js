// Projexa Prototype — v2 — script.js (self-contained, vanilla JS)
// สโคป: SCR-009/010/013/016 (โมดูล Screen Tracking — งานส่งหลักสูตร NoSQL)
// จำลอง interaction ฝั่ง client เท่านั้น ไม่เรียก backend จริง ไม่ persist ข้ามการ reload หน้า
// (ยกเว้นการส่ง id ที่เลือกจาก SCR-009 -> SCR-013 ผ่าน query string ซึ่งเป็นการนำทาง ไม่ใช่การจำลอง backend)

document.addEventListener('DOMContentLoaded', function () {

  // ===================== มาตรฐานร่วมทุกหน้า (ห้ามเปลี่ยนชื่อ class/attribute) =====================

  // เปิด/ปิด Audit/History popover (DESIGN.md §3.2 — Everything is logged)
  document.addEventListener('click', function (e) {
    const chip = e.target.closest('[data-audit-chip]');
    if (chip) {
      const popover = chip.closest('.field-label-row, .card').querySelector('[data-audit-popover]');
      const wasOpen = popover && popover.classList.contains('is-open');
      document.querySelectorAll('[data-audit-popover].is-open').forEach(function (p) { p.classList.remove('is-open'); });
      if (popover && !wasOpen) popover.classList.add('is-open');
      return;
    }
    document.querySelectorAll('[data-audit-popover].is-open').forEach(function (p) {
      if (!p.contains(e.target)) p.classList.remove('is-open');
    });
  });

  // เพิ่มแถวตาราง — โคลนแถวสุดท้ายเป็นแม่แบบ
  document.querySelectorAll('[data-row-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tbody = document.querySelector(btn.getAttribute('data-row-add'));
      if (!tbody) return;
      const rows = tbody.querySelectorAll('tr');
      const template = rows[rows.length - 1];
      if (!template) return;
      const clone = template.cloneNode(true);
      clone.querySelectorAll('input, select, textarea').forEach(function (el) { el.value = ''; });
      tbody.appendChild(clone);
    });
  });

  // ลบแถวตาราง
  document.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('[data-row-remove]');
    if (removeBtn) removeBtn.closest('tr').remove();
  });

  // ปุ่ม "ยืนยัน" ใน AI Suggestion Block — border dashed -> solid ตาม Human-in-the-loop
  document.addEventListener('click', function (e) {
    const confirmBtn = e.target.closest('[data-ai-confirm]');
    if (confirmBtn) confirmBtn.closest('.ai-block').classList.add('is-confirmed');
  });

  // สลับ tab
  document.querySelectorAll('[data-tab-group]').forEach(function (group) {
    const panelWrap = document.querySelector(group.getAttribute('data-tab-group'));
    group.querySelectorAll('[data-tab]').forEach(function (tabBtn) {
      tabBtn.addEventListener('click', function () {
        group.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.remove('is-active'); });
        tabBtn.classList.add('is-active');
        if (!panelWrap) return;
        const targetId = tabBtn.getAttribute('data-tab');
        panelWrap.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-tab-panel') !== targetId;
        });
      });
    });
  });

  // จำลอง Loading -> Loaded
  document.querySelectorAll('[data-loading-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.querySelector(btn.getAttribute('data-loading-toggle'));
      if (target) target.classList.toggle('is-loading');
    });
  });

  // Toast แจ้งสถานะ
  window.showToast = function (message, type) {
    type = type || 'success';
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    if (type === 'danger') {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button'; closeBtn.className = 'toast-close'; closeBtn.setAttribute('aria-label', 'ปิด'); closeBtn.textContent = '×';
      closeBtn.addEventListener('click', function () { toast.remove(); });
      toast.appendChild(closeBtn);
    } else {
      setTimeout(function () {
        toast.classList.remove('is-visible');
        setTimeout(function () { toast.remove(); }, 200);
      }, 4000);
    }
  };
  document.querySelectorAll('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.showToast(btn.getAttribute('data-toast'), btn.getAttribute('data-toast-type'));
    });
  });

  // ===================== SCR-009 ทะเบียนหน้าจอ — filter + batch assign + empty states =====================
  const registryTable = document.getElementById('screen-registry-body');
  if (registryTable) {
    const typeFilter = document.getElementById('filter-type');
    const statusFilter = document.getElementById('filter-status');
    const noResultState = document.getElementById('no-result-state');
    const tableWrap = document.getElementById('registry-table-wrap');
    const collectionEmptyState = document.getElementById('collection-empty-state');
    const simulateEmptyBtn = document.getElementById('simulate-empty-collection');
    const resetEmptyBtn = document.getElementById('reset-empty-collection');

    function applyFilter() {
      const typeVal = typeFilter ? typeFilter.value : '';
      const statusVal = statusFilter ? statusFilter.value : '';
      let visibleCount = 0;
      registryTable.querySelectorAll('tr').forEach(function (row) {
        const matchType = !typeVal || row.getAttribute('data-type') === typeVal;
        const matchStatus = !statusVal || row.getAttribute('data-status') === statusVal;
        const show = matchType && matchStatus;
        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      if (noResultState) noResultState.hidden = visibleCount !== 0;
      if (tableWrap) tableWrap.hidden = visibleCount === 0;
    }
    if (typeFilter) typeFilter.addEventListener('change', applyFilter);
    if (statusFilter) statusFilter.addEventListener('change', applyFilter);
    document.querySelectorAll('.clear-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeFilter) typeFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        applyFilter();
      });
    });

    // AC-NOSQL-009-3: จำลอง collection screens ว่างเปล่าทั้งหมด
    if (simulateEmptyBtn) simulateEmptyBtn.addEventListener('click', function () {
      document.getElementById('registry-body-wrap').hidden = true;
      if (collectionEmptyState) collectionEmptyState.hidden = false;
    });
    if (resetEmptyBtn) resetEmptyBtn.addEventListener('click', function () {
      document.getElementById('registry-body-wrap').hidden = false;
      if (collectionEmptyState) collectionEmptyState.hidden = true;
    });

    // เลือกหลายแถว -> มอบหมายเป็นชุด (ส่ง code ผ่าน query string ไปหน้า SCR-013)
    const selectAllBox = document.getElementById('select-all-screens');
    const rowChecks = function () { return document.querySelectorAll('.screen-row-check'); };
    const selectedCountEl = document.getElementById('selected-count-value');
    const batchAssignLink = document.getElementById('batch-assign-link');

    function updateSelection() {
      const checked = Array.from(rowChecks()).filter(function (c) { return c.checked; });
      if (selectedCountEl) selectedCountEl.textContent = checked.length;
      if (batchAssignLink) {
        if (checked.length === 0) {
          batchAssignLink.setAttribute('aria-disabled', 'true');
          batchAssignLink.classList.add('btn-disabled-link');
          batchAssignLink.style.pointerEvents = 'none';
          batchAssignLink.style.opacity = '0.45';
        } else {
          const ids = checked.map(function (c) { return c.value; }).join(',');
          batchAssignLink.href = 'scr-013.html?ids=' + encodeURIComponent(ids);
          batchAssignLink.removeAttribute('aria-disabled');
          batchAssignLink.style.pointerEvents = '';
          batchAssignLink.style.opacity = '';
        }
      }
    }
    if (selectAllBox) selectAllBox.addEventListener('change', function () {
      rowChecks().forEach(function (c) { c.checked = selectAllBox.checked; });
      updateSelection();
    });
    document.addEventListener('change', function (e) {
      if (e.target.classList && e.target.classList.contains('screen-row-check')) updateSelection();
    });
    updateSelection();
    applyFilter();
  }

  // ===================== SCR-010 รายละเอียดหน้าจอ — AI แนะนำประเภท + concurrency =====================
  // ชุดข้อมูลตัวอย่างของ collection screens (ตรงกับแถวในตาราง SCR-009) ใช้ prefill ตอนเปิดโหมดแก้ไข
  const SCREEN_DEMO_DATA = {
    'SCR-101': { name: 'ค้นหาและแสดงรายการใบลา (ตัวอย่าง)', description: 'หน้าจอสำหรับพนักงานค้นหาและดูรายการใบลาของตนเอง', type: 'INQUIRY' },
    'SCR-102': { name: 'อนุมัติใบลา (ตัวอย่าง)', description: 'หน้าจอสำหรับหัวหน้างานอนุมัติ/ไม่อนุมัติใบลาที่พนักงานยื่น', type: 'PROCESS' },
    'SCR-103': { name: 'รายงานสรุปวันลาสะสม (ตัวอย่าง)', description: 'รายงานสรุปจำนวนวันลาคงเหลือของพนักงานแต่ละคน', type: 'REPORT' },
    'SCR-104': { name: 'บริการแจ้งเตือนวันลาใกล้หมดอายุ (ตัวอย่าง)', description: 'บริการเบื้องหลังที่ส่งการแจ้งเตือนอัตโนมัติเมื่อวันลาใกล้หมดอายุ', type: 'SERVICE' },
    'SCR-105': { name: 'แดชบอร์ดสรุปการลาระดับทีม (ตัวอย่าง)', description: 'หน้าจอสรุปภาพรวมการลาของทีมสำหรับหัวหน้างาน', type: 'REPORTUI' },
    'SCR-106': { name: 'นำเข้าข้อมูลพนักงานจากไฟล์ Excel (ตัวอย่าง)', description: 'กระบวนการนำเข้าข้อมูลพนักงานชุดใหญ่จากไฟล์ Excel เข้าสู่ระบบ', type: 'PROCESS' }
  };
  const detailHeading = document.getElementById('detail-mode-heading');
  if (detailHeading) {
    const detailParams = new URLSearchParams(window.location.search);
    const screenCode = detailParams.get('screen');
    const linkAssign = document.getElementById('link-to-assign');
    const linkProgress = document.getElementById('link-to-progress');
    if (screenCode && SCREEN_DEMO_DATA[screenCode]) {
      const data = SCREEN_DEMO_DATA[screenCode];
      detailHeading.textContent = 'แก้ไขหน้าจอ: ' + screenCode;
      const nameInput = document.getElementById('screen-name-input');
      const descInput = document.getElementById('screen-desc-input');
      const typeSelect = document.getElementById('screen-type-select');
      if (nameInput) nameInput.value = data.name;
      if (descInput) descInput.value = data.description;
      if (typeSelect) typeSelect.value = data.type;
      if (linkAssign) { linkAssign.href = 'scr-013.html?ids=' + encodeURIComponent(screenCode); linkAssign.removeAttribute('aria-disabled'); linkAssign.style.pointerEvents = ''; linkAssign.style.opacity = ''; }
      if (linkProgress) { linkProgress.href = 'scr-016.html?screen=' + encodeURIComponent(screenCode); linkProgress.removeAttribute('aria-disabled'); linkProgress.style.pointerEvents = ''; linkProgress.style.opacity = ''; }
    } else {
      detailHeading.textContent = 'สร้างหน้าจอใหม่';
    }
  }

  const aiSuggestBtn = document.getElementById('ai-suggest-btn');
  if (aiSuggestBtn) {
    const aiWaiting = document.getElementById('ai-waiting');
    const aiBlock = document.getElementById('ai-type-block');
    const aiTimeoutMsg = document.getElementById('ai-timeout-msg');
    const typeSelect = document.getElementById('screen-type-select');
    const aiTimeoutLink = document.getElementById('ai-simulate-timeout');
    let aiTimer = null;

    function runAISuggest(forceTimeout) {
      if (aiBlock) aiBlock.hidden = true;
      if (aiTimeoutMsg) aiTimeoutMsg.hidden = true;
      if (aiWaiting) aiWaiting.hidden = false;
      if (aiTimer) clearTimeout(aiTimer);
      aiTimer = setTimeout(function () {
        if (aiWaiting) aiWaiting.hidden = true;
        if (forceTimeout) {
          if (aiTimeoutMsg) aiTimeoutMsg.hidden = false;
        } else {
          if (aiBlock) {
            aiBlock.hidden = false;
            aiBlock.classList.remove('is-confirmed');
          }
        }
      }, 1200);
    }
    aiSuggestBtn.addEventListener('click', function () { runAISuggest(false); });
    if (aiTimeoutLink) aiTimeoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      runAISuggest(true);
    });
    const aiDismissBtn = document.getElementById('ai-dismiss-btn');
    if (aiDismissBtn) aiDismissBtn.addEventListener('click', function () {
      if (aiBlock) aiBlock.hidden = true;
    });
    // เมื่อกดยืนยันคำแนะนำ AI -> ตั้งค่า dropdown ประเภทจริงตามที่ AI เสนอ
    document.addEventListener('click', function (e) {
      const confirmBtn = e.target.closest('#ai-type-block [data-ai-confirm]');
      if (confirmBtn && typeSelect) {
        const suggestedValue = aiBlock.getAttribute('data-suggested-value');
        if (suggestedValue) typeSelect.value = suggestedValue;
      }
    });

    // บังคับกรอกชื่อก่อนบันทึก + จำลอง optimistic concurrency
    const saveBtn = document.getElementById('save-screen-btn');
    const nameField = document.getElementById('screen-name-input');
    const conflictBtn = document.getElementById('simulate-conflict-btn');
    const reloadBtn = document.getElementById('reload-latest-btn');
    let conflictSimulated = false;

    if (conflictBtn) conflictBtn.addEventListener('click', function () {
      conflictSimulated = true;
      window.showToast('จำลองแล้ว: ผู้ใช้อื่นบันทึกทับเอกสารนี้ไปก่อนหน้านี้', 'danger');
    });
    if (reloadBtn) reloadBtn.addEventListener('click', function () {
      conflictSimulated = false;
      window.showToast('โหลดข้อมูลล่าสุดแล้ว สามารถบันทึกต่อได้ตามปกติ');
    });
    if (saveBtn) saveBtn.addEventListener('click', function () {
      const nameFieldWrap = nameField ? nameField.closest('.field') : null;
      if (nameField && !nameField.value.trim()) {
        if (nameFieldWrap) nameFieldWrap.classList.add('has-error');
        nameField.focus();
        return;
      }
      if (nameFieldWrap) nameFieldWrap.classList.remove('has-error');
      if (conflictSimulated) {
        window.showToast('บันทึกไม่สำเร็จ: เอกสารนี้ถูกแก้ไขโดยผู้ใช้อื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนบันทึกซ้ำ', 'danger');
        return;
      }
      window.showToast('บันทึกข้อมูลหน้าจอสำเร็จ');
    });
  }

  // ===================== SCR-013 มอบหมายผู้รับผิดชอบ — batch assign แบบ embedded assignees[] =====================
  const assignForm = document.getElementById('assign-form');
  if (assignForm) {
    // อ่าน ids จาก query string (ถ้ามาจาก SCR-009) แล้วติ๊กแถวที่ตรงกันไว้ล่วงหน้า
    const params = new URLSearchParams(window.location.search);
    const idsParam = params.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',');
      ids.forEach(function (code) {
        const box = document.querySelector('.assign-row-check[value="' + code.trim() + '"]');
        if (box) box.checked = true;
      });
    }

    const selectedCountEl = document.getElementById('assign-selected-count');
    function updateAssignSelection() {
      const checked = document.querySelectorAll('.assign-row-check:checked');
      if (selectedCountEl) selectedCountEl.textContent = checked.length;
    }
    document.addEventListener('change', function (e) {
      if (e.target.classList && e.target.classList.contains('assign-row-check')) updateAssignSelection();
    });
    updateAssignSelection();

    assignForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const checkedRows = Array.from(document.querySelectorAll('.assign-row-check:checked')).map(function (box) {
        return box.closest('tr');
      });
      const userSelect = document.getElementById('assign-user-select');
      const roleSelect = document.getElementById('assign-role-select');
      const resultList = document.getElementById('assign-result-list');
      if (!checkedRows.length || !userSelect || !roleSelect) {
        window.showToast('กรุณาเลือกอย่างน้อย 1 หน้าจอ และเลือกผู้รับผิดชอบ + บทบาท', 'danger');
        return;
      }
      const userLabel = userSelect.options[userSelect.selectedIndex].text;
      const userInitial = userSelect.options[userSelect.selectedIndex].getAttribute('data-initial') || '?';
      const role = roleSelect.value;

      let successCount = 0;
      const results = [];
      checkedRows.forEach(function (row) {
        const code = row.getAttribute('data-code');
        const isDeletedSim = row.classList.contains('is-deleted-sim');
        if (isDeletedSim) {
          results.push({ code: code, ok: false, note: 'หน้าจอนี้ถูกลบไปแล้วก่อนบันทึกเสร็จ — ข้ามรายการนี้' });
          return;
        }
        const assigneeCell = row.querySelector('.assignee-cell');
        if (assigneeCell) {
          let chip = assigneeCell.querySelector('.avatar-row[data-role="' + role + '"]');
          if (chip) {
            // แทนที่ entry เดิมของ role นี้ ไม่สร้างซ้ำ (AC-NOSQL-013-3)
            chip.querySelector('.avatar').textContent = userInitial;
            chip.querySelector('.assignee-name').textContent = userLabel + ' (' + role + ')';
          } else {
            const wrap = document.createElement('div');
            wrap.className = 'avatar-row';
            wrap.setAttribute('data-role', role);
            wrap.innerHTML = '<span class="avatar">' + userInitial + '</span><span class="assignee-name">' + userLabel + ' (' + role + ')</span>';
            assigneeCell.appendChild(wrap);
          }
        }
        successCount++;
        results.push({ code: code, ok: true, note: 'มอบหมาย ' + userLabel + ' เป็น ' + role + ' สำเร็จ' });
      });

      const resultEmptyNote = document.getElementById('assign-result-empty');
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (r) {
          const li = document.createElement('li');
          li.className = 'result-item ' + (r.ok ? 'is-success' : 'is-failed');
          li.innerHTML = '<span class="dot"></span><span>' + r.code + ' — ' + r.note + '</span>';
          resultList.appendChild(li);
        });
      }
      if (resultEmptyNote) resultEmptyNote.hidden = results.length > 0;
      window.showToast('มอบหมายแล้ว ' + successCount + ' หน้าจอ (จากทั้งหมด ' + checkedRows.length + ' รายการที่เลือก)');
    });
  }

  // ===================== SCR-016 บันทึกความก้าวหน้า — 3 สถานะ + เหตุผลตอนถอยหลัง + timeline =====================
  const statusOrder = ['NotStarted', 'Analysis', 'Design'];
  const statusLabel = { NotStarted: 'Not Started', Analysis: 'Analysis', Design: 'Design' };
  const statusButtons = document.querySelectorAll('.status-select-btn');
  if (statusButtons.length) {
    const progressScreenLabel = document.getElementById('progress-screen-label');
    if (progressScreenLabel) {
      const progressParams = new URLSearchParams(window.location.search);
      const progressCode = progressParams.get('screen');
      if (progressCode && SCREEN_DEMO_DATA[progressCode]) {
        progressScreenLabel.textContent = progressCode + ' — ' + SCREEN_DEMO_DATA[progressCode].name;
      }
    }
    const currentStatusHolder = document.getElementById('current-status-value');
    const reasonField = document.getElementById('reason-field');
    const reasonInput = document.getElementById('reason-input');
    const saveBtn = document.getElementById('save-progress-btn');
    const historyList = document.getElementById('status-history-list');
    const stepperSteps = document.querySelectorAll('.stepper-step');
    const updatedAtEl = document.getElementById('last-updated-value');
    let pendingStatus = currentStatusHolder ? currentStatusHolder.getAttribute('data-status') : statusOrder[0];
    let screenDeletedSimulated = false;
    const simulateDeletedBtn = document.getElementById('simulate-deleted-btn');
    if (simulateDeletedBtn) simulateDeletedBtn.addEventListener('click', function () {
      screenDeletedSimulated = true;
      window.showToast('จำลองแล้ว: เอกสารหน้าจอนี้ถูกลบไปจาก collection screens แล้ว', 'danger');
    });

    function refreshStepper(statusKey) {
      const idx = statusOrder.indexOf(statusKey);
      stepperSteps.forEach(function (step) {
        const stepStatus = step.getAttribute('data-status');
        const stepIdx = statusOrder.indexOf(stepStatus);
        step.classList.remove('is-passed', 'is-current', 'is-upcoming');
        if (stepIdx < idx) step.classList.add('is-passed');
        else if (stepIdx === idx) step.classList.add('is-current');
        else step.classList.add('is-upcoming');
      });
    }

    function selectStatus(newStatus) {
      pendingStatus = newStatus;
      statusButtons.forEach(function (b) {
        b.classList.toggle('is-selected', b.getAttribute('data-status') === newStatus);
      });
      const currentIdx = statusOrder.indexOf(currentStatusHolder.getAttribute('data-status'));
      const newIdx = statusOrder.indexOf(newStatus);
      const isRegression = newIdx < currentIdx;
      if (reasonField) {
        reasonField.hidden = !isRegression;
        if (!isRegression && reasonInput) reasonInput.value = '';
        reasonField.classList.remove('has-error');
      }
    }
    statusButtons.forEach(function (btn) {
      btn.addEventListener('click', function () { selectStatus(btn.getAttribute('data-status')); });
    });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (screenDeletedSimulated) {
        window.showToast('บันทึกไม่สำเร็จ: ไม่พบหน้าจอนี้แล้ว (ถูกลบไปก่อนหน้านี้) กำลังพากลับไปหน้าทะเบียนหน้าจอ...', 'danger');
        setTimeout(function () { window.location.href = 'scr-009.html'; }, 1500);
        return;
      }
      const currentStatus = currentStatusHolder.getAttribute('data-status');
      const currentIdx = statusOrder.indexOf(currentStatus);
      const newIdx = statusOrder.indexOf(pendingStatus);
      const isRegression = newIdx < currentIdx;
      if (pendingStatus === currentStatus) {
        window.showToast('สถานะที่เลือกเหมือนกับสถานะปัจจุบันอยู่แล้ว', 'danger');
        return;
      }
      if (isRegression && reasonInput && !reasonInput.value.trim()) {
        if (reasonField) reasonField.classList.add('has-error');
        reasonInput.focus();
        return;
      }
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const timestamp = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;

      if (historyList) {
        const li = document.createElement('li');
        li.className = 'history-item';
        let reasonHtml = '';
        if (isRegression) {
          reasonHtml = '<div class="history-reason">เหตุผล: ' + reasonInput.value.trim() + '</div>';
        }
        li.innerHTML =
          '<div class="history-meta">' + timestamp + ' — ระบบบันทึกอัตโนมัติ (changed_by: ผู้ใช้ปัจจุบัน)</div>' +
          '<div class="history-change">' + statusLabel[currentStatus] + ' → ' + statusLabel[pendingStatus] + '</div>' +
          reasonHtml;
        historyList.insertBefore(li, historyList.firstChild);
      }
      currentStatusHolder.setAttribute('data-status', pendingStatus);
      currentStatusHolder.textContent = statusLabel[pendingStatus];
      if (updatedAtEl) updatedAtEl.textContent = timestamp;
      refreshStepper(pendingStatus);
      if (reasonInput) reasonInput.value = '';
      if (reasonField) { reasonField.hidden = true; reasonField.classList.remove('has-error'); }
      window.showToast('บันทึกความก้าวหน้าสำเร็จ: เปลี่ยนสถานะเป็น ' + statusLabel[pendingStatus]);
    });

    refreshStepper(pendingStatus);
  }

});
