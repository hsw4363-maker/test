let currentCategory = "baseball";

function changeTab(el, category) {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  el.classList.add("active");
  currentCategory = category;
  loadSports(category);
}

async function loadSports(category = "baseball") {
  const box = document.getElementById("sportsBox");
  box.innerHTML = "불러오는 중...";

  try {
    const res = await fetch(`http://127.0.0.1:5000/sports/${category}`);

    if (!res.ok) {
      throw new Error("서버 응답 오류: " + res.status);
    }

    const data = await res.json();
    const games = data.events;

    box.innerHTML = "";

    if (!games || games.length === 0) {
      box.innerHTML = "<div class='empty'>오늘 경기 없음 😢</div>";
      return;
    }

    games.forEach(game => {
      const comp = game.competitions?.[0];
      if (!comp || !comp.competitors) return;

      const home = comp.competitors.find(t => t.homeAway === "home");
      const away = comp.competitors.find(t => t.homeAway === "away");

      if (!home || !away) return;

      const status = game.status?.type?.description || "정보 없음";
      const isLive = game.status?.type?.state === "in";

      const awayLogo = away.team?.logo || "";
      const homeLogo = home.team?.logo || "";

      const awayName = away.team?.displayName || "Away";
      const homeName = home.team?.displayName || "Home";

      const awayScore = away.score && away.score !== "0" ? away.score : "0";
      const homeScore = home.score && home.score !== "0" ? home.score : "0";

      const leagueName = data.leagues?.[0]?.name || "League";

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <div class="league">${leagueName}</div>

        <div class="teams">
          <div class="team">
            ${awayLogo ? `<img src="${awayLogo}">` : ""}
            <span>${awayName}</span>
          </div>

          <div class="team">
            <span>${homeName}</span>
            ${homeLogo ? `<img src="${homeLogo}">` : ""}
          </div>
        </div>

        <div class="score">
          ${awayScore} : ${homeScore}
          ${isLive ? '<span class="live">LIVE</span>' : ''}
        </div>

        <div class="status">${status}</div>
      `;

      box.appendChild(div);
    });

  } catch (err) {
    console.error("데이터 오류:", err);
    box.innerHTML = "<div class='empty'>데이터 불러오기 실패 😢</div>";
  }
}

// 최초 실행
window.onload = () => {
  loadSports("baseball");
};

// 자동 갱신
setInterval(() => {
  loadSports(currentCategory);
}, 30000);