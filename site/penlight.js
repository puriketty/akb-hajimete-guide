// ============================================================
// ペンライトカラー一覧: 表示・名前での検索・色での絞り込み
// データは data/penlight.js にあります。
// ============================================================

"use strict";

const listBox = document.getElementById("penlight-list");
const searchBox = document.getElementById("penlight-search");
const colorBox = document.getElementById("penlight-colors");
const countBox = document.getElementById("penlight-count");
const castCheck = document.getElementById("penlight-cast-only");
const castNote = document.getElementById("penlight-cast-note");

let selectedColor = null; // いま選ばれている色(なければ null)
const CAST = (PENLIGHT.eventCasts && PENLIGHT.eventCasts["three-concepts-live"]) || null;

if (CAST && castCheck) {
  castCheck.closest(".field").hidden = false;
  castNote.textContent =
    CAST.label + "(" + CAST.checkedAt + "確認)。22期研究生は、この公演から出演しますが、名前がまだ公式に発表されていないため、載っていません。";
  castCheck.addEventListener("change", render);
}

const SOURCE_LABEL = {
  official2022: "公式の一覧(2022年10月)",
  fan: "ファン有志の一覧を参考に確認"
};

// HTMLの部品(タグ)をつくる便利な関数(文章は textContent で入れるので、安全)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 背景色の明るさに合わせて、文字色を黒か白にする(読みやすくするため)
function textColorFor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#222" : "#fff";
}

function makeChip(colorName) {
  const hex = PENLIGHT.colorHex[colorName] || "#cccccc";
  const chip = el("span", "pl-chip", colorName);
  chip.style.backgroundColor = hex;
  chip.style.color = textColorFor(hex);
  return chip;
}

// 色の絞り込みボタン(その色を持つ人数つき)
function renderColorFilter() {
  colorBox.replaceChildren();
  Object.keys(PENLIGHT.colorHex).forEach(function (name) {
    const count = PENLIGHT.members.filter(function (m) {
      return m.colors.indexOf(name) !== -1;
    }).length;
    const button = el("button", "pl-filter", name + "(" + count + ")");
    button.type = "button";
    const hex = PENLIGHT.colorHex[name];
    button.style.backgroundColor = hex;
    button.style.color = textColorFor(hex);
    button.setAttribute("aria-pressed", String(selectedColor === name));
    button.addEventListener("click", function () {
      selectedColor = selectedColor === name ? null : name; // もう一度押すと解除
      render();
    });
    colorBox.appendChild(button);
  });
}

function render() {
  renderColorFilter();
  listBox.replaceChildren();

  const query = searchBox.value.trim();
  let shown = 0;

  PENLIGHT.groups.forEach(function (group) {
    const members = PENLIGHT.members.filter(function (m) {
      if (m.group !== group) return false;
      if (query && m.name.indexOf(query) === -1) return false;
      if (selectedColor && m.colors.indexOf(selectedColor) === -1) return false;
      if (CAST && castCheck && castCheck.checked && CAST.names.indexOf(m.name) === -1) return false;
      return true;
    });
    if (members.length === 0) return;
    shown += members.length;

    listBox.appendChild(el("h3", "", group));
    members.forEach(function (m) {
      const item = el("div", "pl-item");
      const left = el("div", "pl-left");
      left.appendChild(el("span", "pl-name", m.name));
      left.appendChild(el("span", "pl-src", SOURCE_LABEL[m.source] || ""));
      item.appendChild(left);

      const chips = el("div", "pl-chips");
      m.colors.forEach(function (c) {
        chips.appendChild(makeChip(c));
      });
      item.appendChild(chips);
      listBox.appendChild(item);
    });
  });

  countBox.textContent = PENLIGHT.members.length + "人中 " + shown + "人を表示しています";
  if (shown === 0) {
    listBox.appendChild(el("p", "pending", "条件に合うメンバーは、いません。"));
  }
}

searchBox.addEventListener("input", render);
render();
