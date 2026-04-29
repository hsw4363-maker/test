const auth = firebase.auth();

// 로그인 체크
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("welcome-msg").textContent =
      user.email + "님 환영합니다!";
  } else {
    location.href = "login.html";
  }
});

function logout() {
  auth.signOut().then(() => {
    location.href = "login.html";
  });
}