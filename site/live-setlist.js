// ============================================================
// 「ライブのセットリスト」の表示(THREE CONCEPTS LIVE)。
//
// 曲データ・配信リンクの自動生成・ボトムシートの開閉は、setlist.js の仕組みをそのまま使う
// (songsById・appleMusicUrl/spotifyUrl/youtubeMusicUrl・openSheet/closeSheet・activeSetlist・el)。
// このファイルが新しく作っているのは、「公演を選ぶタブ」と、MC・映像なども行に含めた
// 詳しい表示(items)の組み立てだけ。
//
// URLの ?stage= で、公演を切り替える(例: live-setlist.html?stage=three-concepts-0926-yoru)。
// ============================================================

"use strict";

const LIVE_GROUP = "three-concepts-live";

const liveSetlists = SETLISTS.filter(function (s) {
  return s.category === "live" && s.group === LIVE_GROUP;
});

function findLiveSetlist(stageId) {
  return liveSetlists.filter(function (s) {
    return s.id === stageId;
  })[0];
}

function currentLiveStageId() {
  try {
    const value = new URLSearchParams(location.search).get("stage");
    if (value && findLiveSetlist(value)) return value;
  } catch (e) {
    // URLSearchParamsが使えない環境でも、動作は止めない
  }
  return liveSetlists[0] ? liveSetlists[0].id : null;
}

let currentLiveStage = currentLiveStageId();

function selectLiveStage(stageId) {
  currentLiveStage = stageId;
  try {
    const params = new URLSearchParams(location.search);
    params.set("stage", stageId);
    const query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : "") + location.hash);
  } catch (e) {
    // URLに残せなくても、表示の切り替え自体は行う
  }
  renderLive();
}

const tabsBox = document.getElementById("live-setlist-tabs");
const liveTitleBox = document.getElementById("live-setlist-title");
const bodyBox = document.getElementById("live-setlist-body");
const liveSourceBox = document.getElementById("live-setlist-source");

function renderTabs() {
  tabsBox.replaceChildren();
  liveSetlists.forEach(function (s) {
    const button = el("button", "", s.tabLabel);
    button.type = "button";
    button.setAttribute("aria-pressed", String(currentLiveStage === s.id));
    button.addEventListener("click", function () {
      selectLiveStage(s.id);
    });
    tabsBox.appendChild(button);
  });
}

function renderRow(item) {
  const li = el("li", "live-row" + (item.type === "note" ? " live-row-note" : ""));

  if (item.type === "song") {
    const song = songsById[item.songId];
    if (!song) return li;
    const button = el("button", "live-row-button");
    button.type = "button";
    button.appendChild(el("span", "live-row-track", item.track));
    const main = el("span", "live-row-main");
    let title = song.title;
    if (item.note) title += "(" + item.note + ")";
    main.appendChild(el("span", "live-row-title", title));
    if (item.detail) main.appendChild(el("span", "live-row-detail", item.detail));
    button.appendChild(main);
    button.addEventListener("click", function () {
      openSheet(song);
    });
    li.appendChild(button);
  } else {
    const wrap = el("div", "live-row-button");
    wrap.appendChild(el("span", "live-row-track", item.track));
    const main = el("span", "live-row-main");
    let name = item.name;
    if (item.note) name += "(" + item.note + ")";
    main.appendChild(el("span", "live-row-title", name));
    if (item.detail) main.appendChild(el("span", "live-row-detail", item.detail));
    wrap.appendChild(main);
    li.appendChild(wrap);
  }

  return li;
}

function renderLive() {
  renderTabs();

  const setlist = findLiveSetlist(currentLiveStage);
  if (!setlist) {
    liveTitleBox.textContent = "セットリストが見つかりませんでした";
    bodyBox.replaceChildren();
    liveSourceBox.replaceChildren();
    return;
  }
  activeSetlist = setlist;

  liveTitleBox.textContent = setlist.title;
  bodyBox.replaceChildren();

  if (setlist.pending) {
    bodyBox.appendChild(el("p", "pending", "準備中です。公演のあと、セットリストが確認でき次第、載せます。"));
    liveSourceBox.replaceChildren();
    return;
  }

  const list = el("ul", "live-setlist-list");
  setlist.items.forEach(function (item) {
    list.appendChild(renderRow(item));
  });
  bodyBox.appendChild(list);

  liveSourceBox.replaceChildren();
  if (setlist.officialUrl) {
    const link = el("a", "", "出典");
    link.href = setlist.officialUrl;
    link.target = "_blank";
    link.rel = "noopener";
    liveSourceBox.appendChild(link);
    liveSourceBox.appendChild(document.createTextNode("(" + setlist.checkedAt + " 確認)"));
  } else {
    liveSourceBox.appendChild(document.createTextNode("出典を確認中です。確認でき次第、ここに載せます。"));
  }
}

if (tabsBox && liveTitleBox && bodyBox && liveSourceBox) {
  renderLive();
}
