// ============================================================
// 「ライブレポ・みんなの声」: 感想の表示
// 感想のデータは data/voices.js にあります。公演ごとのタブ(すべて/9月26日昼/9月26日夜/9月27日)で切り替えます。
// 選んだタブは、URLの ?show= に残ります(例: report.html?show=926n)。そのURLを開くと、そのタブが選ばれた状態で開きます。
// 表示名は、全員「匿名」です。「現地・配信」の絞り込みは、今回は作っていません(ラベルとしては表示します)。
// ============================================================

"use strict";

// 公演の一覧(id は data/voices.js の show と同じにする。tab は URL の ?show= と、タブのボタンに使う)
const SHOWS = [
  { id: "0926-1230", tab: "926n", tabLabel: "9月26日 昼", label: "9月26日(土)12:30 新曲「好きish」コンサート" },
  { id: "0926-1830", tab: "926y", tabLabel: "9月26日 夜", label: "9月26日(土)18:30 全員「好きish」コンサート" },
  { id: "0927-1600", tab: "927", tabLabel: "9月27日", label: "9月27日(日)16:00 推しが「好きish」コンサート" }
];

// 見た方法(フォームと同じ文字列にする。ラベル表示だけに使い、絞り込みには使わない)
const STYLES = ["現地", "配信"];

// ファン歴の選択肢(フォームと同じ文字列にする)
const FAN_YEARS = ["1年未満", "1年以上3年未満", "3年以上10年未満", "10年以上"];

const listBox = document.getElementById("voices-list");
const tabsBox = document.getElementById("voices-tabs");

// HTMLの部品(タグ)をつくる便利な関数(文章は textContent で入れるので、安全)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 感想のデータを、表示用にそろえる。
// 意味が確認できない項目は「未回答」として扱う(本文は、そのまま残す)。
function normalize(v) {
  const style = STYLES.indexOf(v.style) >= 0 ? v.style : "";
  return {
    show: v.show,
    style: style,
    fanYears: FAN_YEARS.indexOf(v.fanYears) >= 0 ? v.fanYears : "",
    returned: v.returned === true,
    text: v.text,
    advice: typeof v.advice === "string" && v.advice.trim() ? v.advice.trim() : "",
    spoiler: v.spoiler === true,
    date: v.date
  };
}

const ALL_VOICES = VOICES.map(normalize);

function voicesForShow(showId) {
  return ALL_VOICES.filter(function (v) {
    return v.show === showId;
  });
}

// URLの ?show= から、いま選ぶべきタブを読む(知らない値・なければ "all")
function tabFromUrl() {
  try {
    const value = new URLSearchParams(location.search).get("show");
    if (value && SHOWS.some(function (s) { return s.tab === value; })) return value;
  } catch (e) {
    // URLSearchParamsが使えない環境でも、動作は止めない(常に「すべて」になるだけ)
  }
  return "all";
}

let currentTab = tabFromUrl();

// タブを選んだら、URLにも残す(ページの再読み込みはしない)
function selectTab(tab) {
  currentTab = tab;
  try {
    const params = new URLSearchParams(location.search);
    if (tab === "all") params.delete("show");
    else params.set("show", tab);
    const query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : "") + location.hash);
  } catch (e) {
    // URLに残せなくても、表示の切り替え自体は行う
  }
  render();
}

function renderTabs() {
  tabsBox.replaceChildren();
  const options = [{ tab: "all", label: "すべて" }].concat(
    SHOWS.map(function (s) {
      return { tab: s.tab, label: s.tabLabel };
    })
  );
  options.forEach(function (opt) {
    const count =
      opt.tab === "all"
        ? ALL_VOICES.length
        : voicesForShow(SHOWS.filter(function (s) { return s.tab === opt.tab; })[0].id).length;
    const button = el("button", "", opt.label + "(" + count + ")");
    button.type = "button";
    button.setAttribute("aria-pressed", String(currentTab === opt.tab));
    button.addEventListener("click", function () {
      selectTab(opt.tab);
    });
    tabsBox.appendChild(button);
  });
}

// 感想のカード1件(表示名は、全員「匿名」)
function renderCard(v) {
  const card = el("div", "voice");
  card.appendChild(el("p", "who", "匿名" + (v.date ? "(" + v.date + ")" : "")));

  // ラベル(現地・配信 / ファン歴 / 出戻り)
  const badges = el("div", "badges");
  if (v.style === "現地") badges.appendChild(el("span", "badge onsite", "現地"));
  if (v.style === "配信") badges.appendChild(el("span", "badge stream", "配信"));
  if (v.fanYears) badges.appendChild(el("span", "badge", "ファン歴 " + v.fanYears));
  if (v.returned) badges.appendChild(el("span", "badge return", "出戻り"));
  if (badges.children.length > 0) card.appendChild(badges);

  if (v.advice) {
    const advice = el("p", "advice");
    advice.appendChild(el("strong", "", "次に初めて行く人へ: "));
    advice.appendChild(document.createTextNode(v.advice));
    card.appendChild(advice);
  }

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

// 0件のときに出す、「最初の1人になりませんか?」の案内
function renderEmpty() {
  listBox.appendChild(el("p", "pending", "まだ感想がありません。最初の1人になりませんか?"));
  const link = el("a", "submit-button", "感想を送る");
  link.href = "#post";
  listBox.appendChild(link);
}

function render() {
  renderTabs();
  listBox.replaceChildren();

  const shows = currentTab === "all" ? SHOWS : SHOWS.filter(function (s) { return s.tab === currentTab; });
  let total = 0;

  shows.forEach(function (show) {
    const inShow = voicesForShow(show.id);
    if (inShow.length === 0) return;
    total += inShow.length;

    if (currentTab === "all") listBox.appendChild(el("h3", "", show.label));
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

  if (total === 0) renderEmpty();
}

render();
