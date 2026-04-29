function loadFeed() {
  const box = document.getElementById("feedBox");

  const posts = [
    {
      title: "🏀 슛 자세 분석",
      img: "https://cdn.mania.kr/nbamania/g2/data/file/nbatalk/view_thumbnail/1432266583_tQmZyLbM_stephen-curry-040214.jpg",
      analysis: "팔꿈치 각도가 안정적이며 릴리스 타이밍이 빠릅니다.",
      tag: "농구",
      youtube: "https://www.youtube.com/watch?v=zz6LkiQ_pcc"
    },
    {
      title: "⚾ 타격 자세 분석",
      img: "https://pds.joongang.co.kr/news/component/joongang_sunday/202409/21/27e2f322-b54e-4bb3-bead-2d1002f70774.jpg",
      analysis: "스윙 궤적이 일정하고 체중 이동이 자연스럽습니다.",
      tag: "야구",
      youtube: "https://www.youtube.com/watch?v=WPmWiQHekWU"
    }
  ];

  box.innerHTML = "";

  posts.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="content">
        <div class="title">${p.title}</div>
        <div class="analysis">${p.analysis}</div>

        <button class="btn" onclick="goYoutube('${p.youtube}')">
          ${p.tag} 영상 보기 ▶
        </button>
      </div>
    `;

    box.appendChild(div);
  });
}

function goYoutube(url) {
  window.open(url, "_blank");
}

window.onload = loadFeed;