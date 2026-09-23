// ============================================================
// 「ライブレポ・みんなの声」の感想フォーム: 入力のお手伝い
//  感想の文字数を、「いまの文字数/600」で表示する。
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
