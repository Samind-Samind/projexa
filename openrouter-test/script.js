const button = document.getElementById("send-btn");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
  const { apiKey, model } = window.OPENROUTER_CONFIG || {};

  if (!apiKey || apiKey === "YOUR_OPENROUTER_API_KEY") {
    output.textContent = "ยังไม่ได้ตั้งค่าคีย์ — คัดลอก config.example.js เป็น config.local.js แล้วใส่คีย์จริงก่อน";
    return;
  }

  button.disabled = true;
  output.textContent = "กำลังส่งข้อความ...";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "สวัสดี" }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      output.textContent = `เกิดข้อผิดพลาด (${res.status}): ${data.error?.message || JSON.stringify(data)}`;
      return;
    }

    output.textContent = data.choices?.[0]?.message?.content ?? JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = `เกิดข้อผิดพลาด: ${err.message}`;
  } finally {
    button.disabled = false;
  }
});
