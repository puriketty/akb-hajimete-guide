// ============================================================
// 持ち物チェックリスト: チェックの状態を、この端末(ブラウザ)に記録します。
// 記録は、この端末の中だけで、サイトの運営者には送られません。
// (記録できない設定のブラウザでも、チェックは普通に使えます)
// ============================================================

"use strict";

const STORAGE_KEY = "akb-live-checklist";
const boxes = document.querySelectorAll("#checklist input[type=checkbox]");

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // 記録できないときは、何もしない(チェック自体は、そのまま使える)
  }
}

const state = load();
boxes.forEach(function (box) {
  box.checked = state[box.dataset.key] === true;
  box.addEventListener("change", function () {
    state[box.dataset.key] = box.checked;
    save(state);
  });
});

document.getElementById("checklist-reset").addEventListener("click", function () {
  boxes.forEach(function (box) {
    box.checked = false;
    state[box.dataset.key] = false;
  });
  save(state);
});
