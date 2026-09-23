// ============================================================
// 「ライブレポ・みんなの声」の感想フォーム: 入力のお手伝い
//  1. 感想の文字数を、「いまの文字数/600」で表示する。
//  2. 「ファン歴」は、年数(1年未満 など)か、「出戻り」チェックの、どちらか一方が選ばれていればよい
//     (両方の入力を必須にはしない、という運用方針)。
// (このファイルが動かなくても、フォームは送れます)
// ============================================================

"use strict";

const message = document.getElementById("message");
const lengthLabel = document.getElementById("message-length");
const countLabel = document.getElementById("message-count");

// 文字数の表示(600に近づいたら、色を変える)
function syncCount() {
  const length = message.value.length;
  lengthLabel.textContent = String(length);
  countLabel.classList.toggle("near-limit", length >= 540);
}

message.addEventListener("input", syncCount);
window.addEventListener("pageshow", syncCount);

syncCount();

// 「ファン歴(年数)」か「出戻り」の、どちらか一方を必須にする
const voiceForm = document.getElementById("voice-form");
const fanYearsInputs = document.querySelectorAll('input[name="fan_years"]');
const returnedInput = document.querySelector('input[name="returned"]');

function syncFanYearsValidity() {
  const hasYears = Array.from(fanYearsInputs).some(function (input) {
    return input.checked;
  });
  const hasReturned = returnedInput.checked;
  const validityMessage = hasYears || hasReturned ? "" : "ファン歴(年数)か、「出戻り」のどちらかを選んでください。";
  fanYearsInputs.forEach(function (input) {
    input.setCustomValidity(validityMessage);
  });
}

fanYearsInputs.forEach(function (input) {
  input.addEventListener("change", syncFanYearsValidity);
});
returnedInput.addEventListener("change", syncFanYearsValidity);
voiceForm.addEventListener("reset", function () {
  setTimeout(syncFanYearsValidity, 0);
});
window.addEventListener("pageshow", syncFanYearsValidity);

syncFanYearsValidity();
