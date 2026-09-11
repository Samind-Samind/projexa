// ─────────────────────────────────────────────────────────────
// js/common.js — utility ที่ใช้ร่วมกันทุกหน้าจอ (โหลดก่อน script ของแต่ละหน้า)
// เป็น ES module (type="module") เพราะต้องเรียก js/auth.js เพื่อตรวจสอบ
// ล็อกอินก่อนแสดงเนื้อหาของทุกหน้า ยกเว้น login.html/signup.html
// ─────────────────────────────────────────────────────────────

import { guardPage, logout } from "./auth.js";
import { canAccessPage } from "./acl.js";

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

// ซ่อนเนื้อหาหน้าไว้ก่อนจนกว่าจะตรวจสอบล็อกอินเสร็จ กันไม่ให้เห็นข้อมูลวาบขึ้นมา
// ก่อน redirect ไป login.html (กรณียังไม่ได้ล็อกอิน)
document.documentElement.style.visibility = "hidden";

// ซ่อนลิงก์เมนูด้านข้างที่ไปหน้าที่บทบาทของผู้ใช้ไม่มีสิทธิ์ใช้งานอะไรเลย
// (ไม่ใช่แค่ disable — เอาออกจากเมนูไปเลยตามที่ user ยืนยัน)
function applyNavAccess(role) {
  document.querySelectorAll(".sidebar-item[data-acl-page]").forEach(function (link) {
    var page = link.getAttribute("data-acl-page");
    if (!canAccessPage(role, page)) link.hidden = true;
  });
}

function renderUserBar(user) {
  var bar = document.getElementById("current-user-bar");
  if (!bar) return;
  bar.innerHTML =
    '<span class="sidebar-user-name">' + esc(user.name) + (user.role ? " (" + esc(user.role) + ")" : "") + "</span>" +
    '<button type="button" id="logout-btn" class="sidebar-user-logout">ออกจากระบบ</button>';
  document.getElementById("logout-btn").addEventListener("click", function () {
    logout();
  });
}

// window.AUTH_READY: ให้ script ของแต่ละหน้า (screen-registry.js ฯลฯ) await
// ก่อนเรียก Firestore ทุกครั้ง เพราะ firestore.rules ต้องการ request.auth != null
// — ถ้า query ก่อน onAuthStateChanged ยืนยันตัวตนเสร็จจะโดนปฏิเสธสิทธิ์
window.AUTH_READY = guardPage().then(function (user) {
  window.CURRENT_USER = user;
  document.documentElement.style.visibility = "";
  renderUserBar(user);
  applyNavAccess(user.role);
  return user;
});
