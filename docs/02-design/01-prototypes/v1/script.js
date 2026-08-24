// Projexa Prototype — v1 — script.js (self-contained, vanilla JS)
// จำลอง interaction ฝั่ง client เท่านั้น ไม่เรียก backend จริง

document.addEventListener('DOMContentLoaded', function () {

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

  // เพิ่มแถวตาราง (เช่น เพิ่มสมาชิกทีมงาน) — โคลนแถวสุดท้ายเป็นแม่แบบ
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

  // จำลอง Loading -> Loaded (เช่น ปุ่ม "จำลองโหลดข้อมูลเดิม" ใน DESIGN.md §4.4)
  document.querySelectorAll('[data-loading-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.querySelector(btn.getAttribute('data-loading-toggle'));
      if (target) target.classList.toggle('is-loading');
    });
  });

  // Toast แจ้งสถานะ (เช่น ปุ่ม "บันทึก")
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

});
