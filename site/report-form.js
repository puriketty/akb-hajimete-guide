// ============================================================
// 「ライブレポ・みんなの声」の感想フォーム: 入力のお手伝い
//  1. 「現地」を選んだ人にだけ、「現地ライブの初参加ですか?」を聞く。
//     「配信」を選んだら、その質問を隠して、答えを消す(送信データにも残らない)。
//  2. 感想の文字数を、「いまの文字数/600」で表示する。
// (このファイルが動かなくても、フォームは送れます)
// ============================================================

"use strict";

const form = document.getElementById("voice-form");
const firstLiveField = document.getElementById("first-live-field");
const firstLiveInputs = firstLiveField.querySelectorAll("input[name=first_live]");
const styleInputs = form.querySelectorAll("input[name=style]");
const message = document.getElementById("message");
const lengthLabel = document.getElementById("message-length");
const countLabel = document.getElementById("message-count");

// 「現地」が選ばれているか
function isOnsite() {
  const chosen = form.querySelector("input[name=style]:checked");
  return chosen !== null && chosen.value === "現地";
}

// 現地のときだけ、初参加の質問を出す(必須)。それ以外は、隠して、答えを消して、送らない
function syncFirstLive() {
  const onsite = isOnsite();
  firstLiveField.hidden = !onsite;
  firstLiveInputs.forEach(function (input) {
    input.disabled = !onsite; // 無効にした項目は、送信されない
    input.required = onsite;
    if (!onsite) input.checked = false;
  });
}

// 文字数の表示(600に近づいたら、色を変える)
function syncCount() {
  const length = message.value.length;
  lengthLabel.textContent = String(length);
  countLabel.classList.toggle("near-limit", length >= 540);
}

styleInputs.forEach(function (input) {
  input.addEventListener("change", syncFirstLive);
});
message.addEventListener("input", syncCount);
form.addEventListener("submit", syncFirstLive); // 送る直前にも、もう一度そろえる
form.addEventListener("reset", function () {
  setTimeout(function () {
    syncFirstLive();
    syncCount();
  }, 0);
});
// 「戻る」で戻ってきたときに、ブラウザが選択を復元するので、そろえ直す
window.addEventListener("pageshow", function () {
  syncFirstLive();
  syncCount();
});

syncFirstLive();
syncCount();
