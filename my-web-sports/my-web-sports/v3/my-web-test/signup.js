const auth = firebase.auth();

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const passwordCheck = document.getElementById("passwordCheck").value.trim();
  const message = document.getElementById("message");

  message.textContent = "";

  if (!email || !password || !passwordCheck) {
    message.textContent = "모든 항목을 입력해주세요.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "비밀번호는 6자리 이상이어야 합니다.";
    return;
  }

  if (password !== passwordCheck) {
    message.textContent = "비밀번호가 서로 다릅니다.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("회원가입이 완료되었습니다!");
      location.href = "page2.html";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        message.textContent = "이미 사용 중인 이메일입니다.";
      } else if (error.code === "auth/invalid-email") {
        message.textContent = "이메일 형식이 올바르지 않습니다.";
      } else if (error.code === "auth/weak-password") {
        message.textContent = "비밀번호가 너무 약합니다.";
      } else {
        message.textContent = "회원가입 실패: " + error.message;
      }
    });
}