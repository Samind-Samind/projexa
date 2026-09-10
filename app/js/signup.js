// ─────────────────────────────────────────────────────────────
// js/signup.js — หน้าสมัครสมาชิก (signup.html)
// สร้างบัญชี Firebase Auth + เอกสาร users ผูกกันด้วย email ทันที (js/auth.js)
// ─────────────────────────────────────────────────────────────

import { signup, mapAuthError } from "./auth.js";

const form = document.getElementById("signup-form");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("name-input");
const emailField = document.getElementById("email-field");
const emailInput = document.getElementById("email-input");
const passwordField = document.getElementById("password-field");
const passwordInput = document.getElementById("password-input");
const confirmField = document.getElementById("confirm-password-field");
const confirmInput = document.getElementById("confirm-password-input");
const submitBtn = document.getElementById("signup-submit-btn");

function setFieldError(fieldEl, hasError) {
  fieldEl.classList.toggle("has-error", hasError);
}

function showFormError(message) {
  var existing = document.getElementById("signup-form-error");
  if (existing) existing.remove();
  var p = document.createElement("p");
  p.id = "signup-form-error";
  p.className = "field-error";
  p.style.display = "block";
  p.style.marginTop = "8px";
  p.textContent = message;
  form.appendChild(p);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  setFieldError(nameField, !name);
  setFieldError(emailField, !email);
  setFieldError(passwordField, password.length < 6);
  setFieldError(confirmField, password !== confirm);
  if (!name || !email || password.length < 6 || password !== confirm) return;

  submitBtn.disabled = true;
  try {
    await signup(name, email, password);
    window.location.href = "index.html";
  } catch (err) {
    showFormError(mapAuthError(err));
  } finally {
    submitBtn.disabled = false;
  }
});
