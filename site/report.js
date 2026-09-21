// ============================================================
// 「ライブレポ・みんなの声」: 感想の表示
// 感想のデータは data/voices.js にあります。公演ごとにまとめて、現地と配信の両方を表示します。
// 「現地・配信」と、「現地ライブ初参加・ファン歴・出戻り」で、絞り込みもできます。
// ============================================================

"use strict";

// 公演の一覧(id は data/voices.js の show と同じにする)
const SHOWS = [
  { id: "0926-1230", label: "9月26日(土)12:30 新曲「好きish」コンサート" },
  { id: "0926-1830", label: "9月26日(土)18:30 全員「好きish」コンサート" },
  { id: "0927-1600", label: "9月27日(日)16:00 推しが「好きish」コンサート" }
];

// 見た方法(フォームと同じ文字列にする)
const STYLES = ["現地", "配信"];

// 現地ライブへの参加経験(フォームと同じ文字列にする。現地で見た人だけが答える)
const FIRST_LIVE_FIRST = "今回が初めて";
const FIRST_LIVE_REPEAT = "参加経験あり";

// 誰と行ったか(フォームと同じ文字列にする。任意)
const COMPANIONS = ["ひとり", "友達と", "家族と"];

// ファン歴の選択肢(フォームと同じ文字列にする)
const FAN_YEARS = ["1年未満", "1年以上3年未満", "3年以上10年未満", "10年以上"];

const listBox = document.getElementById("voices-list");
const styleFilterBox = document.getElementById("voices-filter-style");
const whoFilterBox = document.getElementById("voices-filter");

// いま選ばれている絞り込み
// 見た方法: "all" / "現地" / "配信"
// どんな人: "all" / "first"(現地ライブ初参加) / "solo"(ひとり参加・視聴) / "repeat"(現地参加経験あり) / "years:ファン歴" / "returned"(出戻り)
let styleFilter = "all";
let whoFilter = "all";

// HTMLの部品(タグ)をつくる便利な関数(文章は textContent で入れるので、安全)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 感想のデータを、表示用にそろえる。
// 意味が確認できない項目は「未回答」として扱う(本文は、そのまま残す)。
// 古い形式の history(「AKB歴」。「今回が初めて」は、ファン歴なのか現地初参加なのか区別できない)は、読まない。
function normalize(v) {
  const style = STYLES.indexOf(v.style) >= 0 ? v.style : "";
  return {
    show: v.show,
    style: style,
    // 配信の感想には、現地ライブの参加経験は、ない(あっても表示しない)
    firstLive:
      style === "現地" && (v.firstLive === FIRST_LIVE_FIRST || v.firstLive === FIRST_LIVE_REPEAT)
        ? v.firstLive
        : "",
    companion: COMPANIONS.indexOf(v.companion) >= 0 ? v.companion : "",
    fanYears: FAN_YEARS.indexOf(v.fanYears) >= 0 ? v.fanYears : "",
    returned: v.returned === true,
    nickname: v.nickname,
    text: v.text,
    spoiler: v.spoiler === true,
    date: v.date
  };
}

const ALL_VOICES = VOICES.map(normalize);

function matchesStyle(v, filter) {
  return filter === "all" || v.style === filter;
}

function matchesWho(v, filter) {
  if (filter === "all") return true;
  if (filter === "first") return v.firstLive === FIRST_LIVE_FIRST;
  if (filter === "solo") return v.companion === "ひとり";
  if (filter === "repeat") return v.firstLive === FIRST_LIVE_REPEAT;
  if (filter === "returned") return v.returned;
  if (filter.indexOf("years:") === 0) return v.fanYears === filter.slice(6);
  return false;
}

function countOf(styleF, whoF) {
  return ALL_VOICES.filter(function (v) {
    return matchesStyle(v, styleF) && matchesWho(v, whoF);
  }).length;
}

// 絞り込みのボタンを1行分つくる(人数つき。0人の項目は、選ばれていなければ出さない)
function renderChips(box, options, current, countFor, onPick, keepZero) {
  box.replaceChildren();
  options.forEach(function (opt) {
    const count = countFor(opt.id);
    if (!keepZero && opt.id !== "all" && count === 0 && current !== opt.id) return;
    const button = el("button", opt.primary ? "primary" : "", opt.label + "(" + count + ")");
    button.type = "button";
    button.setAttribute("aria-pressed", String(current === opt.id));
    button.addEventListener("click", function () {
      onPick(opt.id);
    });
    box.appendChild(button);
  });
}

const STYLE_OPTIONS = [{ id: "all", label: "すべて" }].concat(
  STYLES.map(function (s) {
    return { id: s, label: s };
  })
);

const WHO_OPTIONS = [
  { id: "all", label: "すべて" },
  { id: "first", label: "現地ライブ初参加", primary: true },
  { id: "solo", label: "ひとり参加・視聴", primary: true },
  { id: "repeat", label: "現地参加経験あり" }
]
  .concat(
    FAN_YEARS.map(function (y) {
      return { id: "years:" + y, label: "ファン歴 " + y };
    })
  )
  .concat([{ id: "returned", label: "出戻り" }]);

function renderFilters() {
  const hasAny = ALL_VOICES.length > 0;
  styleFilterBox.parentNode.hidden = !hasAny;
  whoFilterBox.parentNode.hidden = !hasAny;
  if (!hasAny) return;

  renderChips(
    styleFilterBox,
    STYLE_OPTIONS,
    styleFilter,
    function (id) {
      return countOf(id, whoFilter);
    },
    function (id) {
      styleFilter = id;
      // 配信の感想には、現地ライブの参加経験がないので、その絞り込みは外す
      if (id === "配信" && (whoFilter === "first" || whoFilter === "repeat")) whoFilter = "all";
      render();
    },
    true // 「現地」「配信」のボタンは、0件でも消さない(切り替えられるように)
  );
  renderChips(
    whoFilterBox,
    WHO_OPTIONS,
    whoFilter,
    function (id) {
      return countOf(styleFilter, id);
    },
    function (id) {
      whoFilter = id;
      render();
    }
  );
}

// 感想のカード1件
function renderCard(v) {
  const card = el("div", "voice");
  const who = (v.nickname && v.nickname.trim()) || "匿名";
  card.appendChild(el("p", "who", who + (v.date ? "(" + v.date + ")" : "")));

  // ラベル(現地・配信 / 現地ライブ初参加 / ファン歴 / 出戻り)
  const badges = el("div", "badges");
  if (v.style === "現地") badges.appendChild(el("span", "badge onsite", "現地"));
  if (v.style === "配信") badges.appendChild(el("span", "badge stream", "配信"));
  if (v.firstLive === FIRST_LIVE_FIRST) badges.appendChild(el("span", "badge first", "現地ライブ初参加"));
  if (v.firstLive === FIRST_LIVE_REPEAT) badges.appendChild(el("span", "badge", "現地参加経験あり"));
  if (v.companion) {
    // 現地は「参加」、配信は「視聴」と表示する
    const verb = v.style === "配信" ? "視聴" : "参加";
    const text = v.companion === "ひとり" ? "ひとり" + verb : v.companion + verb;
    badges.appendChild(el("span", "badge", text));
  }
  if (v.fanYears) badges.appendChild(el("span", "badge", "ファン歴 " + v.fanYears));
  if (v.returned) badges.appendChild(el("span", "badge return", "出戻り"));
  if (badges.children.length > 0) card.appendChild(badges);

  if (v.spoiler) {
    const details = el("details");
    details.appendChild(el("summary", "", "ネタバレを含みます(押すと読めます)"));
    details.appendChild(el("p", "body", v.text));
    card.appendChild(details);
  } else {
    card.appendChild(el("p", "body", v.text));
  }
  return card;
}

// 公演ごとの中の、見た方法ごとの区切り
const STYLE_GROUPS = [
  { style: "現地", label: "現地で見た人の感想" },
  { style: "配信", label: "配信で見た人の感想" },
  { style: "", label: "見た方法の回答がない感想" }
];

function render() {
  renderFilters();
  listBox.replaceChildren();
  let total = 0;

  SHOWS.forEach(function (show) {
    const inShow = ALL_VOICES.filter(function (v) {
      return v.show === show.id && matchesStyle(v, styleFilter) && matchesWho(v, whoFilter);
    });
    if (inShow.length === 0) return;
    total += inShow.length;

    listBox.appendChild(el("h3", "", show.label));
    STYLE_GROUPS.forEach(function (group) {
      const list = inShow.filter(function (v) {
        return v.style === group.style;
      });
      if (list.length === 0) return;
      listBox.appendChild(el("h4", "", group.label + "(" + list.length + ")"));
      list.forEach(function (v) {
        listBox.appendChild(renderCard(v));
      });
    });
  });

  if (total === 0) {
    const message =
      ALL_VOICES.length === 0
        ? "まだ感想はありません。公演のあとに、行った人の声を、ここに載せていきます。"
        : "この条件に合う感想は、まだありません。";
    listBox.appendChild(el("p", "pending", message));
  }
}

render();
