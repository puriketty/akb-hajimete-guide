// ============================================================
// 「出身地から探す」の表示
// データは data/hometown.js にあります。
// 選んだ都道府県は、URLの ?pref= に残ります(例: hometown.html?pref=北海道)。
// そのURLを開くと、その都道府県が選ばれた状態で開きます。
// ============================================================

"use strict";

const prefectSelect = document.getElementById("pref-select");
const selectedBox = document.getElementById("pref-result");
const regionsBox = document.getElementById("regions-list");
const checkedAtLabel = document.getElementById("checked-at");

// 地方の並びから、47都道府県のフラットな一覧をつくる
const ALL_PREFECTURES = HOMETOWN.regions.reduce(function (list, region) {
  return list.concat(region.prefectures);
}, []);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function membersOf(pref) {
  return HOMETOWN.members.filter(function (m) {
    return m.pref === pref;
  });
}

function profileUrl(mid) {
  return "https://www.akb48.co.jp/about/members/detail?mid=" + mid;
}

function memberLink(m) {
  const a = el("a", "", m.name);
  a.href = profileUrl(m.mid);
  a.target = "_blank";
  a.rel = "noopener";
  const wrap = el("span", "hometown-member");
  wrap.appendChild(a);
  wrap.appendChild(document.createTextNode("(" + m.group + ")"));
  return wrap;
}

// URLの ?pref= から、いま選ぶべき都道府県を読む(知らない値なら選ばない)
function prefFromUrl() {
  try {
    const value = new URLSearchParams(location.search).get("pref");
    if (value && ALL_PREFECTURES.indexOf(value) >= 0) return value;
  } catch (e) {
    // URLSearchParamsが使えない環境でも、動作は止めない
  }
  return "";
}

function selectPref(pref) {
  prefectSelect.value = pref;
  try {
    const params = new URLSearchParams(location.search);
    if (pref) params.set("pref", pref);
    else params.delete("pref");
    const query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? "?" + query : ""));
  } catch (e) {
    // URLに残せなくても、表示の切り替え自体は行う
  }
  renderResult(pref);
}

function renderResult(pref) {
  selectedBox.replaceChildren();
  if (!pref) {
    selectedBox.hidden = true;
    return;
  }
  selectedBox.hidden = false;
  const members = membersOf(pref);
  selectedBox.appendChild(el("p", "hometown-title", pref + "のメンバー(" + members.length + "人)"));
  if (members.length === 0) {
    selectedBox.appendChild(el("p", "muted", "現メンバーには、" + pref + "出身の人はいません。"));
    return;
  }
  const list = el("p", "hometown-members");
  members.forEach(function (m, i) {
    if (i > 0) list.appendChild(document.createTextNode("、"));
    list.appendChild(memberLink(m));
  });
  selectedBox.appendChild(list);
}

function renderRegions() {
  regionsBox.replaceChildren();
  HOMETOWN.regions.forEach(function (region) {
    regionsBox.appendChild(el("h3", "", region.name));
    const list = el("ul", "hometown-region");
    region.prefectures.forEach(function (pref) {
      const members = membersOf(pref);
      const item = el("li", members.length === 0 ? "muted" : "");
      const head = el("span", "hometown-pref", pref + "(" + members.length + "人)");
      item.appendChild(head);
      if (members.length > 0) {
        item.appendChild(document.createTextNode(": "));
        members.forEach(function (m, i) {
          if (i > 0) item.appendChild(document.createTextNode("、"));
          item.appendChild(memberLink(m));
        });
      }
      list.appendChild(item);
    });
    regionsBox.appendChild(list);
  });
}

function buildSelect() {
  prefectSelect.appendChild(new Option("選ばない", ""));
  ALL_PREFECTURES.forEach(function (pref) {
    prefectSelect.appendChild(new Option(pref + "(" + membersOf(pref).length + "人)", pref));
  });
  prefectSelect.addEventListener("change", function () {
    selectPref(prefectSelect.value);
  });
}

checkedAtLabel.textContent = HOMETOWN.checkedAt;
buildSelect();
renderRegions();
selectPref(prefFromUrl());
