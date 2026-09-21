// ============================================================
// 「ライブレポ・みんなの声」: 感想の表示
// 感想のデータは data/voices.js にあります。公演ごとにまとめて表示します。
// ============================================================

"use strict";

// 公演の一覧(id は data/voices.js の show と同じにする)
const SHOWS = [
  { id: "0926-1230", label: "9月26日(土)12:30 新曲「好きish」コンサート" },
  { id: "0926-1830", label: "9月26日(土)18:30 全員「好きish」コンサート" },
  { id: "0927-1600", label: "9月27日(日)16:00 推しが「好きish」コンサート" }
];

const listBox = document.getElementById("voices-list");

// HTMLの部品(タグ)をつくる便利な関数(文章は textContent で入れるので、安全)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  listBox.replaceChildren();
  let total = 0;

  SHOWS.forEach(function (show) {
    const list = VOICES.filter(function (v) {
      return v.show === show.id;
    });
    if (list.length === 0) return;
    total += list.length;

    listBox.appendChild(el("h3", "", show.label));
    list.forEach(function (v) {
      const card = el("div", "voice");
      const who = (v.nickname && v.nickname.trim()) || "匿名";
      card.appendChild(el("p", "who", who + (v.date ? "(" + v.date + ")" : "")));
      if (v.spoiler) {
        const details = el("details");
        details.appendChild(el("summary", "", "ネタバレを含みます(押すと読めます)"));
        details.appendChild(el("p", "body", v.text));
        card.appendChild(details);
      } else {
        card.appendChild(el("p", "body", v.text));
      }
      listBox.appendChild(card);
    });
  });

  if (total === 0) {
    listBox.appendChild(
      el("p", "pending", "まだ感想はありません。公演のあとに、行った人の声を、ここに載せていきます。")
    );
  }
}

render();
