// คัดลอกไฟล์นี้เป็น config.local.js แล้วใส่คีย์ OpenRouter จริงของคุณ
// config.local.js ถูก .gitignore ไว้แล้ว (pattern *.local.js) จะไม่ถูก commit/push
window.OPENROUTER_CONFIG = {
  apiKey: "YOUR_OPENROUTER_API_KEY",
  model: "google/gemini-2.5-flash-lite",
};
