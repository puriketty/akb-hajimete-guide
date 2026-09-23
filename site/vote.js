// ============================================================
// 「お楽しみ投票:もう一度見たいのはどの公演?」
// 感想フォームとは別の、ワンタップ投票(Netlify Formsで受け付けるだけ。リアルタイム集計はしない)
//
// 受付期間(日本時間): 2026-09-27 21:00 〜 2026-10-04 23:59
//   受付前 → 投票欄を出さない
//   受付中 → 投票欄を出す(投票済みのブラウザには「投票ありがとうございました」)
//   受付後 → 「投票は終了しました。結果発表をお待ちください」
//
// URLの末尾に ?preview=vote を付けると、日付に関係なく投票欄を確認できる(公開前のプレビュー確認用)。
// ============================================================

"use strict";

const VOTE_START = new Date("2026-09-27T21:00:00+09:00");
const VOTE_END = new Date("2026-10-04T23:59:59+09:00");
const VOTE_STORAGE_KEY = "akb-hajimete-guide:voted-three-concepts-live";

const voteWidget = document.getElementById("vote-widget");
const voteForm = document.getElementById("vote-form");
const voteThanks = document.getElementById("vote-thanks");
const voteClosed = document.getElementById("vote-closed");

function isPreview() {
  try {
    return new URLSearchParams(location.search).get("preview") === "vote";
  } catch (e) {
    return false;
  }
}

// localStorageが使えない環境(プライベートモードなど)でも、投票自体はできるようにする
function hasVoted() {
  try {
    return localStorage.getItem(VOTE_STORAGE_KEY) === "yes";
  } catch (e) {
    return false;
  }
}

function markVoted() {
  try {
    localStorage.setItem(VOTE_STORAGE_KEY, "yes");
  } catch (e) {
    // 保存できなくても、送信そのものは止めない
  }
}

function showForm() {
  voteWidget.hidden = false;
  voteThanks.hidden = true;
  voteClosed.hidden = true;
}

function showThanks() {
  voteWidget.hidden = true;
  voteThanks.hidden = false;
  voteClosed.hidden = true;
}

function showClosed() {
  voteWidget.hidden = true;
  voteThanks.hidden = true;
  voteClosed.hidden = false;
}

function hideAll() {
  voteWidget.hidden = true;
  voteThanks.hidden = true;
  voteClosed.hidden = true;
}

// 投票欄の見た目を、いまの時刻(見た人の端末の時計)に合わせて出し分ける
function render() {
  if (isPreview()) {
    showForm();
    return;
  }
  const now = new Date();
  if (now < VOTE_START) {
    hideAll();
  } else if (now > VOTE_END) {
    showClosed();
  } else if (hasVoted()) {
    showThanks();
  } else {
    showForm();
  }
}

// 送信に成功したら(form-submit.jsがAJAXで送ったあと)、このブラウザで投票済みだと記録する
voteForm.addEventListener("ajaxform:success", function () {
  markVoted();
});

render();
