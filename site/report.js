// ============================================================
// 「ライブレポ・みんなの声」: 感想の表示
// 感想のデータは data/voices.js にあります。公演ごとにまとめて表示します。
// AKB歴のラベルと、AKB歴での絞り込みもできます。
// ============================================================

"use strict";

// 公演の一覧(id は data/voices.js の show と同じにする)
const SHOWS = [
  { id: "0926-1230", label: "9月26日(土)12:30 新曲「好きish」コンサート" },
  { id: "0926-1830", label: "9月26日(土)18:30 全員「好きish」コンサート" },
  { id: "0927-1600", label: "9月27日(日)16:00 推しが「好きish」コンサート" }
];

// AKB歴の選択肢(フォームと同じ文字列にする)
const HISTORIES = ["今回が初めて", "1年未満", "1〜3年", "3〜10年", "10年以上"];

const listBox = document.getElementById("voices-list");
const filterBox = document.getElementById("voices-filter");

// いま選ばれている絞り込み: "all" / AKB歴の文字列 / "returned"(出戻り)
let currentFilter = "all";

// HTMLの部品(タグ)をつくる便利な関数(文章は textContent で入れるので、安全)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 絞り込みの条件に合うか
function matches(voice, filter) {
  if (filter === "all") return true;
  if (filter === "returned") return voice.returned === true;
  return voice.history === filter;
}

// 絞り込みのボタン(人数つき)
function renderFilter() {
  filterBox.replaceChildren();
  if (VOICES.length === 0) return;

  const options = [{ id: "all", label: "すべて" }]
    .concat(
      HISTORIES.map(function (h) {
        return { id: h, label: "AKB歴 " + h };
      })
    )
    .concat([{ id: "returned", label: "出戻り" }]);

  options.forEach(function (opt) {
    const count = VOICES.filter(function (v) {
      return matches(v, opt.id);
    }).length;
    if (opt.id !== "all" && count === 0) return; // 0人の項目は出さない
    const button = el("button", "", opt.label + "(" + count + ")");
    button.type = "button";
    button.setAttribute("aria-pressed", String(currentFilter === opt.id));
    button.addEventListener("click", function () {
      currentFilter = opt.id;
      render();
    });
    filterBox.appendChild(button);
  });
}

function render() {
  renderFilter();
  listBox.replaceChildren();
  let total = 0;

  SHOWS.forEach(function (show) {
    const list = VOICES.filter(function (v) {
      return v.show === show.id && matches(v, currentFilter);
    });
    if (list.length === 0) return;
    total += list.length;

    listBox.appendChild(el("h3", "", show.label));
    list.forEach(function (v) {
      const card = el("div", "voice");
      const who = (v.nickname && v.nickname.trim()) || "匿名";
      card.appendChild(el("p", "who", who + (v.date ? "(" + v.date + ")" : "")));

      // AKB歴のラベル
      const badges = el("div", "badges");
      if (v.history) badges.appendChild(el("span", "badge", "AKB歴 " + v.history));
      if (v.returned === true) badges.appendChild(el("span", "badge return", "出戻り"));
      if (badges.children.length > 0) card.appendChild(badges);

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
    const message =
      VOICES.length === 0
        ? "まだ感想はありません。公演のあとに、行った人の声を、ここに載せていきます。"
        : "この条件に合う感想は、まだありません。";
    listBox.appendChild(el("p", "pending", message));
  }
}

render();
