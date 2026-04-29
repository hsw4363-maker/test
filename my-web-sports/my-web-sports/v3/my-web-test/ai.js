let isLoading = false; // 🔥 중복 요청 방지

async function sendMessage() {
  if (isLoading) return;

  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const loadingEl = appendMessage("ai", "입력 중...");
  isLoading = true;

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    loadingEl.remove();

    // 🔥 서버 에러 처리
    if (data.error) {
      appendMessage("ai", "⚠️ " + data.error);
    } else if (data.reply) {
      appendMessage("ai", data.reply);
    } else {
      appendMessage("ai", "⚠️ 알 수 없는 오류");
    }

  } catch (error) {
    loadingEl.remove();
    appendMessage(
      "ai",
      "❌ 서버 연결 실패 (Flask 실행 확인)"
    );
  }

  isLoading = false;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(role, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");

  div.className = `message ${role}`;
  div.textContent = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}


// ✅ 엔터로 전송 가능하게
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});