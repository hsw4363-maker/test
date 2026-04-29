const auth = firebase.auth();

auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("auth-guest").style.display = "none";
    document.getElementById("auth-user").style.display = "flex";
    document.getElementById("user-email").textContent = user.email;
  } else {
    document.getElementById("auth-guest").style.display = "flex";
    document.getElementById("auth-user").style.display = "none";
  }
});

function logout() {
  auth.signOut().then(() => {
    alert("로그아웃 되었습니다.");
    location.href = "index.html";
  });
}

function goPage2() {
  const user = firebase.auth().currentUser;

  if (user) {
    location.href = "page2.html";
  } else {
    alert("로그인이 필요합니다!");
    location.href = "login.html";
  }
}