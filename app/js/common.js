// ─────────────────────────────────────────────────────────────
// js/common.js — utility ที่ใช้ร่วมกันทุกหน้าจอ (โหลดก่อน script ของแต่ละหน้า)
// ─────────────────────────────────────────────────────────────

// ยังไม่มีระบบล็อกอินในสโคปนี้ (ดู SCOPE.md) — ใช้ placeholder ผู้ใช้ปัจจุบันไป
// ก่อนสำหรับ changed_by/assigned_by จนกว่าจะเพิ่ม auth จริงในอนาคต
window.CURRENT_USER = { id: "u-current", name: "ผู้ใช้ปัจจุบัน" };

window.showToast = function (message, type) {
  type = type || "success";
  var toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(function () { toast.classList.add("is-visible"); });
  if (type === "danger") {
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "ปิด");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function () { toast.remove(); });
    toast.appendChild(closeBtn);
  } else {
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () { toast.remove(); }, 200);
    }, 4000);
  }
};

// แปลง Date/Firestore Timestamp เป็น "dd/mm/yyyy hh:mm" แบบเดียวกับตัวอย่าง LeaveEasy
window.formatDateTime = function (value) {
  if (!value) return "-";
  var d = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  var dd = String(d.getDate()).padStart(2, "0");
  var mm = String(d.getMonth() + 1).padStart(2, "0");
  var yyyy = d.getFullYear();
  var hh = String(d.getHours()).padStart(2, "0");
  var min = String(d.getMinutes()).padStart(2, "0");
  return dd + "/" + mm + "/" + yyyy + " " + hh + ":" + min;
};

window.esc = function (value) {
  var div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
};
