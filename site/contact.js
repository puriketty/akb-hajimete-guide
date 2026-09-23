// ============================================================
// お問い合わせフォームの入力のお手伝い
//  1. URLの ?reason=delete がついていたら、「投稿の削除をお願いしたい」を選んでおく
//     (report.htmlの「投稿の削除をお願いしたい方はこちら」リンク用)
//  2. 「該当ページのURL」に、直前のページのURLを分かる場合だけ入れておく
//  3. 「投稿の削除をお願いしたい」を選んだときだけ、内容欄の上に補足を出す
// (このファイルが動かなくても、フォームは送れます)
// ============================================================

"use strict";

const form = document.getElementById("contact-form");
const reasonInputs = form.querySelectorAll('input[name="reason"]');
const deleteHint = document.getElementById("delete-hint");
const pageUrlField = document.getElementById("page-url");

function syncDeleteHint() {
  const chosen = form.querySelector('input[name="reason"]:checked');
  deleteHint.hidden = !(chosen && chosen.value === "投稿の削除をお願いしたい");
}

reasonInputs.forEach(function (input) {
  input.addEventListener("change", syncDeleteHint);
});

try {
  const params = new URLSearchParams(location.search);
  if (params.get("reason") === "delete") {
    document.getElementById("reason-delete").checked = true;
  }
} catch (e) {
  // URLSearchParamsが使えない環境でも、フォームの入力自体はできる
}

try {
  if (document.referrer && document.referrer.indexOf(location.origin) === 0) {
    pageUrlField.value = document.referrer;
  }
} catch (e) {
  // 取得できなくても、フォームの入力自体はできる
}

syncDeleteHint();
