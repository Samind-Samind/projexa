// ─────────────────────────────────────────────────────────────
// js/login.js — หน้าเข้าสู่ระบบ (login.html)
// ─────────────────────────────────────────────────────────────

import { login, mapAuthError } from "./auth.js";

if (new URLSearchParams(window.location.search).get("error") === "account-not-linked") {
  document.getElementById("account-not-linked-note").hidden = false;
}

const form = document.getElementById("login-form");
const emailField = document.getElementById("email-field");
const emailInput = document.getElementById("email-input");
const passwordField = document.getElementById("password-field");
const passwordInput = document.getElementById("password-input");
const submitBtn = document.getElementById("login-submit-btn");

function setFieldError(fieldEl, hasError) {
  fieldEl.classList.toggle("has-error", hasError);
}

function showFormError(message) {
  var existing = document.getElementById("login-form-error");
  if (existing) existing.remove();
  var p = document.createElement("p");
  p.id = "login-form-error";
  p.className = "field-error";
  p.style.display = "block";
  p.style.marginTop = "8px";
  p.textContent = message;
  form.appendChild(p);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  setFieldError(emailField, !email);
  setFieldError(passwordField, !password);
  if (!email || !password) return;

  submitBtn.disabled = true;
  try {
    await login(email, password);
    window.location.href = "scr-009.html";
  } catch (err) {
    showFormError(mapAuthError(err));
  } finally {
    submitBtn.disabled = false;
  }
});
