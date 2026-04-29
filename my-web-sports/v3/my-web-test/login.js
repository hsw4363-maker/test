const auth = firebase.auth();

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.textContent = "";

  if (!email || !password) {
    message.textContent = "이메일과 비밀번호를 입력해주세요.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("로그인 성공!");
      location.href = "page2.html";
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {
        message.textContent = "가입되지 않은 이메일입니다.";
      } else if (error.code === "auth/wrong-password") {
        message.textContent = "비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/invalid-email") {
        message.textContent = "이메일 형식이 올바르지 않습니다.";
      } else {
        message.textContent = "로그인 실패: " + error.message;
      }
    });
}